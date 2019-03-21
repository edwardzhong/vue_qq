<template lang="pug">
    form(action='/register' method='post' class='form form-aligned' name="regForm" v-on:submit.prevent="submit")
        fieldset
            legend sign up
            div.control-group
                input(type='email' name='email' placeholder='email' v-model="email")
            div.control-group
                input(type='password' name='password' placeholder='password' maxlength='12' v-model="password")
            div.control-group
                input#pass2(type='password' placeholder='confirm password'  maxlength='12' v-model="pass2")
            button(type='submit' class='button button-primary') register
        div.links
            router-link(to="/") &#8592 home
            router-link(to="/sign/log") to login &#8594
</template>
<script>
import { post } from "../common/request.js";

export default {
    name: "register",
    data() {
        return {
            email: "",
            password: "",
            pass2: ""
        };
    },
    methods: {
        submit() {
            const that= this;
            if (!this.email) {
                alert("email不能为空");
                return;
            }
            if (!/^[\w\d]+@[\d\d]+\.com$/.test(this.email)) {
                alert("email格式不正确");
                return;
            }
            if (!this.password) {
                alert("密码不能为空");
                return;
            }
            if (this.password != this.pass2) {
                alert("确认密码与原密码不一致");
                return;
            }
            post("/register", { email: this.email, password: this.password })
                .then(res => {
                    console.log(res);
                    if (res.code == 0) {
                        that.$router.replace("/");
                    } else {
                        alert(res.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                });
        }
    }
};
</script>


