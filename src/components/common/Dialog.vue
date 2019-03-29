<template lang="pug">
div.dialog(:class="{active:dialog.show}")
    div.body
        p {{dialog.txt}}
    div.foot
        a(href="javascript:;" v-if="dialog.cancel" v-on:click="close") 取消
        a(href="javascript:;" v-on:click="confirm") 确定
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
    name:'dialog',
    computed: {
        ...mapState(["dialog"])
    },
    methods:{
        close(){
            this.$store.commit('closeDialog');
        },
        confirm(){
            this.dialog.callback();
            this.$store.commit('closeDialog');
        }
    }
};
</script>
<style lang="scss" scoped>
.dialog {
    position: absolute;
    left: 50%;
    top: -30%;
    opacity: .2;
    transform: translate(-50%, -50%);
    width: 300px;
    z-index: 100;
    box-shadow: 0 0 2px 2px hsla(0, 100%, 0%, 0.1);
    background-color: #fff;
    transition: all .3s ease-in-out;
    &.active{
        top: 30%;
        opacity: 1;
    }
    .body {
        text-align: center;
        font-size: 16px;
        line-height: 4;
        border-bottom: 1px solid #eee;
    }
    .foot {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        a {
            color: hsla(200, 100%, 50%, 1);
            line-height: 4;
            &:hover {
                color: hsla(200, 50%, 50%, 1);
            }
        }
    }
}
</style>

