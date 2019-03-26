<template lang="pug">
div.tip
    div {{name}}
    p {{txt}}
</template>
<script>
export default {
    name: "tip",
    props: {
        name: String,
        txt: String
    }
};
</script>
<style lang="scss" scoped>
$blue: hsl(200, 100%, 50%);
@mixin nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.tip {
    position: absolute;
    top: -40px;
    left: 50%;
    display: flex;
    flex: row nowrap;
    justify-content: center;
    width: 240px;
    line-height: 2.5;
    margin-left: -120px;
    background-color: $blue;
    color: #fff;
    border-radius: 4px;
    opacity: .5;
    z-index: 3;
    transition: all 0.3s ease-in-out;
    &.active {
        top: 10px;
        opacity: 1;
    }
    div {
        max-width: 180px;
        @include nowrap;
    }
    p {
        margin: 0;
        padding: 0 4px;
        width: 50px;
    }
}
</style>

