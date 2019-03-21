<template lang="pug">
	div#app
		Modal
		router-view
</template>

<script>
import Modal from "./components/common/Modal.vue"

export default {
    name: "app",
    components: { Modal }
};
</script>

<style type="text/css">
#app {
	height: 100%;
	background-color: #81D4FA;
}
</style>
