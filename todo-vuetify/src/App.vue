<template>
  <v-app>
    <v-main>
      <div id="container">
        <div id="main">
          <v-text-field id="new-todo-input" v-model="ui.newTodoString" :readonly="ui.savingCreation"
            :label="!ui.savingCreation ? 'New TODO' : 'Saving TODO...'" variant="outlined"
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
                    <v-btn variant="outlined" class="ma-2" color="green" icon="mdi-check-bold"></v-btn>
                    <!-- Readonly view -->
                    <template v-if="!todo.beingEdited">
                      <div class="list-item-name">{{ todo.name }}</div>
                      <div class="list-item-actions">
                        <v-btn @click="editTodoClicked(todo)" size="small" class="ma-2" color="indigo"
                          icon="mdi-pencil"></v-btn>
                        <v-btn size="small" class="ma-2" color="red-darken-4" icon="mdi-trash-can"></v-btn>
                      </div>
                    </template>
                    <!-- Editing view -->
                    <template v-else>
                      <v-text-field id="new-todo-input" v-model="todo.editString" variant="underlined"
                        @keyup.enter="editTodoEnterKeyUp(todo)" @keyup.escape="editTodoEscapeKeyUp(todo)"></v-text-field>
                      <div class="list-item-actions">
                        <v-btn @click="saveEditIconClicked(todo)" size="small" class="ma-2" color="green"
                          icon="mdi-content-save"></v-btn>
                        <v-btn @click="cancelEditIconClicked(todo)" size="small" class="ma-2" color="red"
                          icon="mdi-close"></v-btn>
                      </div>
                    </template>
                  </div>
                </v-list-item>
              </v-list>

              <!-- Empty List -->
              <template v-else>
                <div id="empty-state">You don't have any To-dos yet, you can create one by writting the name and then
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
                    <v-progress-linear color="indigo" indeterminate rounded height="6"></v-progress-linear>
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
import { ApiService, ITodo } from './service/api.service';
import { onMounted } from 'vue';

const ui: Ref<{ newTodoString: string; list: ITodoUI[] | null; savingCreation?: boolean; }> = ref(
  { newTodoString: "Buy Olive Oil", list: null, savingCreation: false }
);
const api = new ApiService();

onMounted(() => {
  api.getAllTodos().then(todos => {
    ui.value.list = todos;
  });
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
  api.createTodo({ name: todoString }).then(todo => {
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
function cancelEditIconClicked(todo: ITodoUI) {
  endTodoEdition(todo);
}
function editTodoEnterKeyUp(todo: ITodoUI) {
  saveEditedTodo(todo);
}
function saveEditedTodo(todo: ITodoUI) {
  const name = todo.editString ?? "";
  if (!validate(name)) return;
  todo.name = name;
  endTodoEdition(todo);
}
function endTodoEdition(todo: ITodoUI) {
  todo.beingEdited = false;
}
function editTodoEscapeKeyUp(todo: ITodoUI) {
  endTodoEdition(todo);
}

interface ITodoUI extends ITodo {
  beingEdited?: boolean;
  editString?: string;
}
</script>

<style>
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
</style>
