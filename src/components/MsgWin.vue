<template lang="pug">
div.msg-win(:style="{left:left+'px',top:top+'px',zIndex:z}" 
    v-on:click.stop="$emit('setZ')" 
    v-drag)
    header
        h2 {{text}} 会话
        div(v-on:click.stop="$emit('close')") ×
    div.body
    textarea
    footer
        button(class="button button-primary")  send
</template>
<script>
export default {
    name: "msgWin",
    props: {
        text: String,
        left: Number,
        top: Number,
        z: Number
    }
};
</script>
<style lang="scss" scoped>
$blue:hsl(200, 100%, 45%);
.msg-win {
    position: absolute;
    width: 400px;
    box-shadow: 0 6px 20px 0 hsla(0, 0%, 0%, 0.19),
        0 8px 17px 0 hsla(0, 0%, 0%, 0.2);
    header {
        display: flex;
        flex: row wrap;
        align-items: center;
        justify-content: space-between;
        background-color: $blue;
        user-select: none;
        h2 {
            margin: 0;
            padding: 0 15px;
            font-weight: normal;
            font-size: 16px;
            line-height: 2.6;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
        }
        div {
            font-size: 24px;
            text-align: center;
            padding-right: 15px;
            color: #fff;
            cursor: pointer;
        }
    }
    .body {
        height: 240px;
        background-color: #fff;
    }
    textarea {
        box-sizing: border-box;
        padding: 10px;
        margin-bottom: -4px;
        height: 120px;
        width: 100%;
        line-height: 1.6;
        background-color: #fff;
        border: none;
        border-top: 1px solid #ccc;
        resize: none;
        outline: none;
    }
    footer {
        padding: 0 20px 10px;
        background-color: #fff;
        text-align: right;
        button {
            padding: 5px 20px;
            background-color: $blue;
        }
    }
}
</style>


