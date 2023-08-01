<template>
  <v-app>
    <v-main>
      <div id="container">
        <div id="main">
          <v-text-field id="new-todo-input" v-model="ui.newTodoString" label="New TODO" variant="outlined"
            append-inner-icon="mdi-plus" @click:append-inner="createIconClicked"
            @keyup.enter="newTodoEnterKeyUp"></v-text-field>
          <v-card id="todo-list" variant="outlined">
            <v-list lines="one">
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
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const ui: Ref<{ newTodoString: string; list: ITodoUI[] }> = ref({ newTodoString: "", list: [] });

interface ITodoUI {
  id: string;
  name: string;
  beingEdited?: boolean;
  editString?: string;
}

function createIconClicked() {
  addNewTodo(ui.value.newTodoString);
}
function newTodoEnterKeyUp() {
  addNewTodo(ui.value.newTodoString);
}
function addNewTodo(todoString: string) {
  ui.value.list = [{ id: Date.now().toString(), name: todoString }, ...ui.value.list];
  ui.value.newTodoString = "";
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
  todo.name = todo.editString ?? "";
  endTodoEdition(todo);
}
function endTodoEdition(todo: ITodoUI) {
  todo.beingEdited = false;
}
function editTodoEscapeKeyUp(todo: ITodoUI) {
  endTodoEdition(todo);
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
</style>
