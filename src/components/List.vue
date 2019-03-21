<template lang="pug">
div.content
    Dialog(:visible="showDailog" v-on="{confirm:confirmDialog,close:closeDialog}") 
        p delete data ?
    Popup(:show="showPop")
        div.head 
            p edit data
        div.form
            div.control-group
                input(type='text' placeholder='name' v-model="editItem.name")
            div.control-group
                input(type='text' placeholder='amount' maxlength='12' v-model="editItem.num")
            div.foot
                button(class='button' @click="closePop") cancal
                button(class='button button-primary' @click="update(editItem)") confirm
    h1
        router-link(to="/") Go to home
    table(class="table table-striped table-justified")
        thead 
            tr 
                th name
                th amount
                th operate
        tbody
            tr(v-for="i in list") 
                td {{i.name}}
                td {{i.num}}
                td
                    button(class="button button-primary" @click="openPop(i)") edit 
                    button(class="button button-success" @click="openDialog(i.id)") delete
</template>
<script>
import Dialog from "./common/dialog.vue";
import Popup from "./common/popup.vue";

export default {
    name: "list",
    computed: {
        list: function() {
            return this.$store.getters.list;
        }
    },
    components: {
        Dialog,
        Popup
    },
    created() {
        if (this.list.length) return;
        this.$store.commit("init", [
            { id: 1, name: "Chuck Norris", num: 10000 },
            { id: 2, name: "Bruce Lee", num: 9000 },
            { id: 3, name: "Jackie Chan", num: 7000 },
            { id: 4, name: "Jet Li", num: 8000 }
        ]);
    },
    data() {
        return {
            showDailog: false,
            showPop: false,
            delID: 0,
            editItem: {}
        };
    },
    methods: {
        openDialog(id) {
            this.$store.commit("showModal");
            this.showDailog = true;
            this.delID = id;
        },
        confirmDialog() {
            this.$store.commit("remove", this.delID);
            this.closeDialog();
        },
        closeDialog() {
            this.$store.commit("closeModal");
            this.showDailog = false;
        },
        openPop(item) {
            this.$store.commit("showModal");
            this.showPop = true;
            this.editItem = Object.assign({}, item); //将数据复制一份，而不是引用原数据
        },
        update(item) {
            this.$store.commit("update", item);
            this.closePop();
        },
        closePop() {
            this.showPop = false;
            setTimeout(() => {
                this.$store.commit("closeModal");
            }, 300);
        }
    }
};
</script>
<style lang="scss" scoped>
.content {
    width: 600px;
    margin: 0 auto;
}
button:not(:last-child) {
    margin-right: 10px;
}
.head {
    background: #0077e6;
    p {
        line-height: 3;
        color: #fff;
        font-size: 18px;
    }
}
.form {
    background: #fff;
    text-align: center;
    .control-group {
        padding: 10px 20px 0;
    }
    input {
        width: 100%;
    }
    .foot {
        padding: 14px 20px;
        text-align: right;
    }
    button {
        font-size: 12px;
        padding: 8px 20px;
    }
}
</style>

