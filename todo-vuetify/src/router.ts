import * as VueRouter from 'vue-router';
import Login from './routes/Login.vue';
import Home from './routes/Home.vue';

const routes: VueRouter.RouteRecordRaw[] = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});

export default router;