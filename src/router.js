import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/Index.vue'
import Sign from './components/Sign.vue'
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

Vue.use(Router)

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
}, { path: '*', redirect: '/' }]

export default new Router({
    mode: "history",
    routes
})