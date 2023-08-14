<template>
    <v-app>
        <header id="header">
            <div v-if="ui.user" id="welcome">Welcome {{ ui.user.name }}</div>
            <v-btn @click="logOut" variant="text" id="logout">Log Out</v-btn>
        </header>
        <v-main>
            <div id="container">
                <div id="main">
                    <v-text-field id="new-todo-input" v-model="ui.newTodoString" :readonly="ui.savingCreation"
                        :label="!ui.savingCreation ? 'New to-do' : 'Saving to-do...'" variant="outlined"
                        :append-inner-icon="!ui.savingCreation ? 'mdi-plus' : ''" @click:append-inner="createIconClicked"
                        @keyup.enter="newTodoEnterKeyUp" loading>
                        <template v-slot:loader>
                            <v-progress-linear :active="ui.savingCreation" color="indigo" absolute height="5"
                                indeterminate></v-progress-linear>
                        </template>
                    </v-text-field>
                    <v-card id="todo-list" variant="outlined">
                        <template v-if="ui.list">
                            <v-list v-if="ui.list.length" lines="one">
                                <v-list-item v-for="todo in ui.list" :key="todo.id">
                                    <div class="list-item-body">

                                        <!-- Mark as done (is active) -->
                                        <v-btn v-if="todo.status === 'active'" :loading="todo.updatingState"
                                            @click="markAsDoneClicked(todo)" variant="outlined" class="ma-2" color="green"
                                            icon="mdi-check-bold"></v-btn>

                                        <!-- Mark as active (is done) -->
                                        <v-btn v-else :loading="todo.updatingState" @click="markAsActiveClicked(todo)"
                                            class="ma-2" color="green" icon="mdi-check-bold"></v-btn>

                                        <!-- Readonly view -->
                                        <template v-if="!todo.beingEdited">

                                            <!-- Active name -->
                                            <div v-if="todo.status === 'active'" class="list-item-name">{{ todo.name }}
                                            </div>

                                            <!-- Done name -->
                                            <div v-else="todo.status === 'active'" class="list-item-name done-item-name">{{
                                                todo.name }}</div>

                                            <div class="list-item-actions">
                                                <v-btn @click="editTodoClicked(todo)" size="small" class="ma-2"
                                                    color="indigo" icon="mdi-pencil"></v-btn>
                                                <v-btn @click="deleteTodo(todo)" :loading="todo.deleting" size="small"
                                                    class="ma-2" color="red-darken-4" icon="mdi-trash-can"></v-btn>
                                            </div>
                                        </template>

                                        <!-- Editing view -->
                                        <template v-else>
                                            <v-text-field id="new-todo-input" v-model="todo.editString" variant="underlined"
                                                @keyup.enter="editTodoEnterKeyUp(todo)"
                                                @keyup.escape="editTodoEscapeKeyUp(todo)"></v-text-field>
                                            <div class="list-item-actions">
                                                <v-btn @click="saveEditIconClicked(todo)" :loading="todo.savingEdit"
                                                    size="small" class="ma-2" color="green" icon="mdi-content-save"></v-btn>
                                                <v-btn @click="cancelEditIconClicked(todo)" size="small" class="ma-2"
                                                    color="red" icon="mdi-close"></v-btn>
                                            </div>
                                        </template>
                                    </div>
                                </v-list-item>
                            </v-list>

                            <!-- Empty List -->
                            <template v-else>
                                <div id="empty-state">You don't have any To-dos yet, you can create one by writting the name
                                    and then
                                    clicking the + icon
                                    or
                                    pressing the Enter key.</div>
                            </template>
                        </template>

                        <!-- Loading list -->
                        <template v-else>
                            <v-container style="height: 400px;">
                                <v-row class="fill-height" align-content="center" justify="center">
                                    <v-col class="text-subtitle-1 text-center" cols="12">
                                        Loading To-dos
                                    </v-col>
                                    <v-col cols="6">
                                        <v-progress-linear color="indigo" indeterminate rounded
                                            height="6"></v-progress-linear>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </template>
                    </v-card>
                </div>
            </div>
        </v-main>
    </v-app>
</template>
  
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { TodoService, ITodo } from '../service/todo.service';
import { onMounted } from 'vue';
import { AuthService } from '@/service/auth.service';
import router from '@/router';

const ui: Ref<{ user?: { name: string; }; newTodoString: string; list: ITodoUI[] | null; savingCreation?: boolean; }> = ref(
    { newTodoString: "", list: null, savingCreation: false }
);
const todoService = new TodoService();

onMounted(() => {
    todoService.getAllTodos().then(todos => {
        ui.value.list = todos;
    });
    ui.value.user = AuthService.getUserData();
})

function createIconClicked() {
    createTodo(ui.value.newTodoString);
}
function newTodoEnterKeyUp() {
    createTodo(ui.value.newTodoString);
}
function createTodo(todoString: string) {
    if (ui.value.savingCreation) return;
    if (!validate(todoString)) return;

    ui.value.savingCreation = true;
    todoService.createTodo({ name: todoString }).then(todo => {
        const list = ui.value.list ?? [];
        ui.value.list = [todo, ...list];
        ui.value.newTodoString = "";
    }).finally(() => ui.value.savingCreation = false);
}
function validate(name: string) {
    if (!name) return false;
    return true;
}
function editTodoClicked(todo: ITodoUI) {
    todo.editString = todo.name;
    todo.beingEdited = true;
}

function saveEditIconClicked(todo: ITodoUI) {
    saveEditedTodo(todo);
}
function editTodoEnterKeyUp(todo: ITodoUI) {
    saveEditedTodo(todo);
}
function saveEditedTodo(todo: ITodoUI) {
    if (todo.savingEdit || todo.deleting) return;

    const name = todo.editString ?? "";
    if (!validate(name)) return;

    todo.savingEdit = true;
    todoService.updateTodo({ id: todo.id, name })
        .then(() => {
            todo.name = name;
            endTodoEdition(todo);
        })
        .finally(() => todo.savingEdit = false);
}

function cancelEditIconClicked(todo: ITodoUI) {
    endTodoEdition(todo);
}
function editTodoEscapeKeyUp(todo: ITodoUI) {
    endTodoEdition(todo);
}
function endTodoEdition(todo: ITodoUI) {
    todo.beingEdited = false;
}

function markAsDoneClicked(todo: ITodoUI) {
    if (todo.updatingState || todo.deleting) return;

    todo.updatingState = true;
    todoService.updateTodo({ id: todo.id, status: 'done' }).then(() => {
        todo.status = 'done';
    }).finally(() => todo.updatingState = false);
}
function markAsActiveClicked(todo: ITodoUI) {
    if (todo.updatingState || todo.deleting) return;

    todo.updatingState = true;
    todoService.updateTodo({ id: todo.id, status: 'active' }).then(() => {
        todo.status = 'active';
    }).finally(() => todo.updatingState = false);
}

function deleteTodo(todo: ITodoUI) {
    if (todo.updatingState || todo.savingEdit || todo.deleting) return;

    todo.deleting = true;
    todoService.deleteTodo(todo.id).then(() => {
        ui.value.list = ui.value.list!.filter(t => t.id !== todo.id);
    }).finally(() => todo.deleting = false);
}

function logOut() {
    AuthService.logOut().then(() => router.push('/'));
}

interface ITodoUI extends ITodo {
    updatingState?: boolean;
    beingEdited?: boolean;
    editString?: string;
    savingEdit?: boolean;
    deleting?: boolean;
}
</script>
  
<style>
#header {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 24px;
    margin: 16px;
}

#logout {
    color: brown;
    text-decoration: underline;
}

#container {
    max-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 100px;
}

#main {
    width: 768px;
    display: flex;
    flex-direction: column;
}

#todo-list {
    overflow-y: auto;
}

.list-item-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

.list-item-name {
    flex-grow: 1;
}

#empty-state {
    margin: 16px;
    font-size: 20px;
}

.done-item-name {
    text-decoration: line-through;
}
</style>
  