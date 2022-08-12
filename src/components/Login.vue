<template lang="pug">
    form(action='/login' method='post' class='form form-aligned' name="logForm" v-on:submit.prevent="submit")
        fieldset
            legend sign in 
            .control-group
                input(type='email' name='email' placeholder='email' v-model="email")
            .control-group
                input(type='password' name='password' placeholder='password' maxlength='12' v-model="password")
            button(type='submit' class='button button-primary') login
        .links
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

            post("/login", { email: this.email, password: this.password })
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


