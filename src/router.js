import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import List from './components/List.vue'
import Sign from './components/Sign.vue'
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

Vue.use(Router)

//路由
const routes = [{
    path: '/',
    name: 'home',
    component: Index
}, {
    path: '/list',
    name: 'list',
    component: List
}, {
    path: '/sign',
    name: 'sign',
    component: Sign,
    children: [ //嵌套路由
        {
            path: "/sign/log",
            name: "login",
            component: Login
        },
        {
            path: "/sign/reg",
            name: "register",
            component: Register
        },
        { path: '/sign', redirect: '/sign/log' }
    ]
}, { path: '*', redirect: '/' }]

export default new Router({
    mode: "history",
    routes
})