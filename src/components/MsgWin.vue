<template lang="pug">
div.msg-win(:style="{left:sty.left+'px',top:sty.top+'px',zIndex:sty.z}" 
    v-on:click.stop="$emit('setZ')" 
    v-drag)
    header
        div.avatar
            img(:src="info.avatar? info.avatar: aPic.src") 
        h2 {{info.nick}} 会话
        div.close(v-on:click.stop="$emit('close')") ×
    div.body
    textarea
    footer
        button(class="button button-primary")  send
</template>
<script>
export default {
    name: "msgWin",
    props: {
        info: Object,
        sty: Object
    },
    data() {
        return {
            aPic: {
                src: require("../assets/avatar.jpg")
            }
        };
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
        .avatar {
            width: 30px;
            height: 30px;
            border: 1px solid $blue;
            border-radius: 50%;
            margin-left: 10px;
            overflow: hidden;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
        }
        h2 {
            box-sizing: border-box;
            margin: 0;
            padding: 0 15px;
            width: 320px;
            font-weight: normal;
            font-size: 16px;
            line-height: 2.6;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
        }
        .close {
            font-size: 24px;
            text-align: center;
            padding-right: 15px;
            color: #fff;
            opacity: 1;
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


