<template lang="pug">
  .modal(v-if="visible")
</template>
<script>
export default {
    name: "modal",
    computed: {
        visible: function() {
            return this.$store.getters.visible;
        }
    }
};
</script>
<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 100%, 0%, 0.5);
    z-index: 99;
}
</style>

