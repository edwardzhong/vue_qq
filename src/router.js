import Index from './components/Index.vue'
import Sign from './components/Sign.vue'
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import { createRouter, createWebHistory } from 'vue-router';

//路由
const routes = [{
    path: '/',
    name: 'home',
    component: Index
},{
    path: '/sign',
    name: 'sign',
    component: Sign,
    children: [ //嵌套路由
        {
            path: "log",
            name: "login",
            component: Login
        },
        {
            path: "reg",
            name: "register",
            component: Register
        },
        { path: '*', redirect: 'log' }
    ]
}]

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: "font-bold text-blue-500 hover:text-white",
    routes,
});


export default router;