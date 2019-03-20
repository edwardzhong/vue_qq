<template lang="pug">
    div.popup(:class="{active:show}")
        slot content
</template>
<script>
export default {
    name: "popup",
    props: {
        show: Boolean
    }
};
</script>
<style lang="scss" scoped>
.popup {
    z-index: 100;
    visibility: hidden;
    opacity: 0;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 150px;
    margin-left: -180px;
    width: 360px;
    box-shadow: 0 6px 20px 0 hsla(0, 0%, 0%, 0.19),
        0 8px 17px 0 hsla(0, 0%, 0%, 0.2);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    transform: rotateY(-70deg);
    transition: .4s ease-in-out;
    &.active {
        opacity:1;
        visibility: visible;
        transform: rotateY(0deg);
    }
}
</style>
