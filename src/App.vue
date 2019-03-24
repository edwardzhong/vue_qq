<template lang="pug">
	div#app
		Modal
		router-view
</template>
<script>
import Modal from "./components/common/Modal.vue"
import Dialog from "./components/common/Dialog.vue"

export default {
    name: "app",
    components: { Modal, Dialog}
};
</script>

<style type="text/css">
#app {
	height: 100%;
	background-color: #81D4FA;
	overflow: hidden;
}
</style>
