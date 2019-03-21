<template lang="pug">
    form(action='/login' method='post' class='form form-aligned' name="logForm" v-on:submit.prevent="submit")
        fieldset
            legend sign in 
            div.control-group
                input(type='email' name='email' placeholder='email' v-model="email")
            div.control-group
                input(type='password' name='password' placeholder='password' maxlength='12' v-model="password")
            button(type='submit' class='button button-primary') login
        div.links
            router-link(to="/") &#8592 home
            router-link(to="/sign/reg") to register &#8594
</template>
<script>
import { post } from "../common/request.js";

export default {
    name: "login",
    data() {
        return {
            email: "",
            password: ""
        };
    },
    methods: {
        submit() {
            let that = this;
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

            post("/login", { email:this.email, password:this.password })
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


