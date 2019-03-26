<template lang="pug">
div.msg-win(:style="{left:sty.left+'px',top:sty.top+'px',zIndex:sty.z}" 
    v-on:click.stop="$emit('setZ')" )
    header(v-drag)
        div.avatar
            img(:src="info.avatar? info.avatar: aPic.src") 
        h2 {{info.nick}}
        div.close(v-on:click.stop="$emit('close')") ×
    div.body(ref="body")
        template(v-for="(item,i) in msgs")
            time {{item.date}}
            div.talk(:key="i" v-if="item.self" class="right")
                div
                    p.nick {{selfInfo.nick}}
                    p.word(:style="{textAlign:align(item.msg)}") {{item.msg}}
                span.avatar
                    img(:src="selfInfo.avatar? selfInfo.avatar: aPic.src")
            div.talk(:key="i" v-else)
                span.avatar
                    img(:src="info.avatar? info.avatar: aPic.src")
                div
                    p.nick {{info.nick}}
                    p.word {{item.msg}}
    textarea(v-model="text")
    footer
        button(class="button button-primary" v-on:click="send")  send
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
    name: "msgWin",
    props: {
        msgs: Array,
        socket: Object,
        info: Object,
        sty: Object
    },
    data() {
        return {
            text: "",
            aPic: {
                src: require("../assets/avatar.jpg")
            }
        };
    },
    computed: {
        ...mapState(["selfInfo"])
    },
    mounted(){
        this.$refs.body.scrollTop = this.$refs.body.scrollHeight;
    },
    methods: {
        send() {
            const txt = this.text.trim();
            if (!txt) return;
            this.socket.emit("send", this.info.id, txt);
            setTimeout(() => {
                this.$refs.body.scrollTop = this.$refs.body.scrollHeight;
            }, 300);

            this.text = "";
        },
        align(txt) {
            const len = txt.replace(/[^\x00-\xff]/g, "aa").length;
            return len > 36 ? "left" : "right";
        }
    }
};
</script>
<style lang="scss" scoped>
$blue: hsl(200, 100%, 45%);
@mixin nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
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
            @include nowrap;
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
        box-sizing: border-box;
        height: 240px;
        padding: 10px;
        overflow-y: scroll;
        background-color: #fff;
        time {
            display: block;
            text-align: center;
            color: #ccc;
            font-size: 12px;
            margin: 10px 0;
        }
        .talk {
            display: flex;
            flex: row wrap;
            align-items: top;
            .avatar {
                display: inline-block;
                width: 30px;
                height: 30px;
                margin: 0 10px;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            div {
                flex: 1;
                padding-left: 0;
                padding-right: 60px;
            }
            p {
                margin: 0;
                &.nick {
                    line-height: 1.2;
                    font-size: 12px;
                    width: 120px;
                    @include nowrap;
                    color: #aaa;
                }
                &.word {
                    font-size: 13px;
                    line-height: 1.6;
                    word-break: break-all;
                }
            }
            &.right {
                text-align: right;
                div {
                    padding-left: 60px;
                    padding-right: 0;
                }
                .nick {
                    margin-left: auto;
                }
            }
        }
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


