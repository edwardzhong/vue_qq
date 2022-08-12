<template lang="pug">
    form(action='/register' method='post' class='form form-aligned' name="regForm" v-on:submit.prevent="submit")
        fieldset
            legend sign up
            .control-group
                input(type='email' name='email' placeholder='email' v-model="email")
            .control-group
                input(type='password' name='password' placeholder='password' maxlength='12' v-model="password")
            .control-group
                input#pass2(type='password' placeholder='confirm password'  maxlength='12' v-model="pass2")
            button(type='submit' class='button button-primary') register
        .links
            router-link(to="/") &#8592 home
            router-link(to="/sign/log") to login &#8594
</template>
<script>
import { post } from "../common/request";

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
                this.$store.commit('showDialog',{txt:'email不能为空'})
                return;
            }
            /*
            if (!/^[\w\d]+@[\d\d]+\.com$/.test(this.email)) {
                this.$store.commit('showDialog',{txt:'email格式不正确'})
                return;
            }
            */
            if (!this.password) {
                this.$store.commit('showDialog',{txt:'密码不能为空'})
                return;
            }
            if (this.password != this.pass2) {
                this.$store.commit('showDialog',{txt:'确认密码与原密码不一致'})
                return;
            }
            post("/register", { email: this.email, password: this.password })
                .then(res => {
                    if (res.code == 0) {
                        that.$store.commit("setLoginInfo");
                        that.$store.commit("setSelfInfo", res.data);
                        that.$router.replace("/");
                    } else {
                        this.$store.commit('showDialog',{txt:res.message})
                    }
                })
                .catch(err => {
                    this.$store.commit('showDialog',{txt:err.message})
                });
        }
    }
};
</script>


