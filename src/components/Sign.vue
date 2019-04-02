<template lang="pug">
div.sign-wrap
    router-view
</template>

<script>
export default {
    name: "sign"
};
</script>
<style lang="scss">
.sign-wrap {
    position: relative;
    height: 100%;
    .form {
        position: absolute;
        box-sizing: border-box;
        left: 50%;
        top: 100px;
        margin-left: -180px;
        width: 360px;
        background: #fff;
        text-align: center;
        box-shadow: 0 6px 20px 0 hsla(0, 0%, 0%, 0.19),
            0 8px 17px 0 hsla(0, 0%, 0%, 0.2);

        legend {
            background: hsl(200, 97%, 45%);
            color: #fff;
            font-size: 16px;
            line-height: 3.5;
            border-bottom: none;
        }
        .control-group {
            padding: 10px 20px 0;
        }
        input {
            width: 100%;
            padding: 12px 10px !important;
        }
        button {
            margin-top: 10px;
            width: 120px;
            background: hsl(200, 97%, 45%);
            line-height: 1.6;
        }
    }
    .links{
        display: flex;
        flex:row nowrap;
        justify-content: space-between;
        a {
            padding: 0 20px 10px;
            &::first-letter {
                text-transform: uppercase;
            }
        }
    }
}
</style>

