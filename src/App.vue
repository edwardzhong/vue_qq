<template lang="pug">
div#app
	Modal
	Tip(:class="{ active:tip.show}" :name="tip.name" :txt="tip.txt")
	Dialog
	router-view
</template>
<script>
import { mapState, mapGetters } from "vuex"
import Modal from "./components/common/Modal.vue"
import Dialog from "./components/common/Dialog.vue"
import Tip from "./components/common/Tip.vue"

export default {
    name: "app",
	components: { Modal, Dialog, Tip},
	computed: {
        ...mapState(["tip"])
    }
};
</script>

<style>
#app {
	height: 100%;
	background-color: #81D4FA;
	overflow: hidden;
}
</style>
