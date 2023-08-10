<template>
    <v-app>
        <v-main id="main">

            <!-- Login -->
            <template v-if="ui.loggingIn">
                <h2>Welcome, please log in to use to-dos</h2>
                <v-form class="credentials-form">
                    <v-text-field v-model="ui.loggingIn.email" label="Email" variant="outlined"></v-text-field>
                    <v-text-field v-model="ui.loggingIn.password" label="Password" variant="outlined"
                        type="password"></v-text-field>
                    <v-btn @click="loginButtonClicked" :loading="ui.loggingIn.processing" color="indigo" block
                        size="x-large">
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
            <template v-if="ui.registering">
                <h2>Let's create an account</h2>
                <v-form class="credentials-form">
                    <v-text-field v-model="ui.registering.name" label="Your name" variant="outlined"></v-text-field>
                    <v-text-field v-model="ui.registering.email" label="Email" variant="outlined"></v-text-field>
                    <v-text-field v-model="ui.registering.password" label="Password" variant="outlined"
                        type="password"></v-text-field>
                    <v-btn @click="registerButtonClicked" :loading="ui.registering.processing" color="success" block
                        size="x-large">
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
import router from '@/router';
import { AuthService } from '@/service/auth.service';
import { onMounted } from 'vue';
import { Ref, ref } from 'vue';

const authService = new AuthService();

const ui: Ref<{
    registering?: { name?: string; email?: string; password?: string; processing?: boolean; };
    loggingIn?: { email?: string; password?: string; processing?: boolean; };
}> = ref({});

onMounted(() => {
    authService.loadCsrfToken();
    ui.value.loggingIn = {};
})

function loginButtonClicked() {
    logIn();
}
function logIn() {
    const data = ui.value.loggingIn;
    if (!data || !data.email || !data.password || data.processing) return;

    data.processing = true;
    authService.logIn({ email: data.email, password: data.password }).then(() => {
        // Go to home
        router.push('/');
    }).finally(() => data.processing = false);
}
function registerClickedFromLoginHint() {
    ui.value.registering = {};
}

function registerButtonClicked() {
    register();
}

function register() {
    const data = ui.value.registering;
    if (!data || data.processing || !data.name || !data.email || !data.password) return;

    data.processing = true;
    authService.register({ name: data.name, email: data.email, password: data.password }).then(() => {
        // Go to home
        router.push('/');
    }).finally(() => data.processing = false);
}
function loginClickedFromRegisterHint() {
    ui.value.registering = undefined;
    ui.value.loggingIn = {};
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