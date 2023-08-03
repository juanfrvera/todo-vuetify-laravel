<template>
    <v-app>
        <v-main id="main">

            <!-- Login -->
            <template v-if="!ui.registering">
                <h2>Welcome, please log in to use to-dos</h2>
                <v-form class="credentials-form">
                    <v-text-field label="Email" variant="outlined"></v-text-field>
                    <v-text-field label="Password" variant="outlined" type="password"></v-text-field>
                    <v-btn color="indigo" block @click="loginButtonClicked" size="x-large">
                        Log In
                    </v-btn>
                    <div class="alternative-hint">
                        <div class="hint">Don't have an account?</div>
                        <v-btn color="success" @click="registerClickedFromLoginHint" size="large">
                            Register
                        </v-btn>
                    </div>
                </v-form>
            </template>

            <!-- Register -->
            <template v-else>
                <h2>Let's create an account</h2>
                <v-form class="credentials-form">
                    <v-text-field label="Your name" variant="outlined"></v-text-field>
                    <v-text-field label="Email" variant="outlined"></v-text-field>
                    <v-text-field label="Password" variant="outlined" type="password"></v-text-field>
                    <v-btn color="success" block @click="registerButtonClicked" size="x-large">
                        Register
                    </v-btn>
                    <div class="alternative-hint">
                        <div class="hint">Want to log in instead?</div>
                        <v-btn color="indigo" @click="loginClickedFromRegisterHint" size="large">
                            Log In
                        </v-btn>
                    </div>
                </v-form>
            </template>
        </v-main>
    </v-app>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';

const ui: Ref<{ registering?: boolean; }> = ref({ registering: true });

function loginButtonClicked() {

}
function registerClickedFromLoginHint() {
    ui.value.registering = true;
}

function registerButtonClicked() {

}
function loginClickedFromRegisterHint() {
    ui.value.registering = false;
}
</script>

<style>
#main {
    padding: 100px;
    text-align: center;
    width: 512px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.alternative-hint {
    margin-top: 64px;
}
</style>