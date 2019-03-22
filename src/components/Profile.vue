<template lang="pug">
    div.profile(:style="{left:sty.left+'px',top:sty.top+'px',zIndex:sty.z}" 
        v-on:click.stop="$emit('setZ')" 
        v-drag)
        header
            h2 用户信息
            div(v-on:click.stop="$emit('close')") ×
        div.body
            div.avatar
                img(:src="info.avatar? info.avatar: aPic.src" ref="img")
                input(type="file" v-on:change="uploadFile($event)" v-if="infoType == 0")
            div(class="form form-aligned")
                div.control-group
                    label number
                    p {{info.num}}
                div.control-group
                    label email
                    p {{info.email}}
                div.control-group
                    label nickname
                    input(type="text" :value ="info.nick" v-if="infoType == 0" ref="nick")
                    p(v-if="infoType!=0") {{info.nick}}
                div.control-group
                    label signature
                    textarea(v-if="infoType == 0" ref="signature") {{info.signature}}
                    p(v-if="infoType!=0") {{info.signature}}
            button(class="button" v-if="infoType == 0" v-on:click="save") save
            button(class="button" v-if="infoType == 2" v-on:click="reply") 加为好友
</template>
<script>
import { mapState } from "vuex";
import { post } from "../common/request";

export default {
    name: "profile",
    props: {
        info: Object,
        sty: Object
    },
    created() {
        if (this.selfInfo.id == this.info.id) {
            this.infoType = 0;
        } else if (this.friends.findIndex(i => id.id == this.info.id) > -1) {
            this.infoType = 1;
        }
    },
    data() {
        return {
            aPic: {
                src: require("../assets/avatar.jpg")
            },
            infoType: 2, //0 自己 1 好友 2 陌生人
            showDailog: false
        };
    },
    computed: {
        ...mapState(["selfInfo", "friends", "groups"])
    },
    methods: {
        apply() {},
        save() {
            const that = this;
            let selfInfo = {
                avatar: that.$refs.img.dataset.src || "",
                nick: that.$refs.nick.value.trim(),
                signature: that.$refs.signature.value.trim()
            };
            if (!selfInfo.avatar) {
                delete selfInfo.avatar;
            }
            post("/updateInfo", selfInfo)
                .then(res => {
                    if (res.code == 0) {
                        that.$store.commit("updateSelfInfo", selfInfo);
                        that.$emit("close");
                    } else {
                        alert(res.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                });
        },
        uploadFile(e) {
            const that = this;
            const file = e.target.files[0];
            if (!file) return false;
            if (file.type.indexOf("image") === -1) {
                alert("请上传图片！");
                return false;
            }

            //拖拉图片到浏览器，可以实现预览功能
            // const url = window.URL.createObjectURL(file);
            const fileName = file.name;
            const name = fileName.substr(0, fileName.lastIndexOf("."));
            const fileSize = Math.floor(file.size / 1024);
            if (fileSize > 500) {
                alert("上传大小不能超过500K.");
                return false;
            }
            if (!window.FileReader) {
                alert("浏览器不支持上传");
                return false;
            }

            const fr = new FileReader();
            fr.onloadend = function(e) {
                post("/upload", { data: e.target.result, name: fileName })
                    .then(res => {
                        console.log(res);
                        if (res.code == 0) {
                            that.$refs.img.src = res.data;
                            that.$refs.img.dataset.src = res.data;
                        } else {
                            alert(res.message);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert(err.message);
                    });
            };
            fr.readAsDataURL(file);
        }
    }
};
</script>
<style lang="scss" scoped>
$blue: hsl(200, 100%, 45%);
.profile {
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
        padding: 10px;
        background-color: #fff;
        text-align: center;
        .avatar {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 10px;
            overflow: hidden;
            cursor: pointer;
            img {
                width: 100%;
                height: 100%;
            }
            input {
                position: absolute;
                left: 0;
                top: 0;
                width: 60px;
                height: 60px;
                opacity: 0;
            }
        }
        button {
            background-color: $blue;
            color: #fff;
        }
    }
    .form {
        input {
            width: 240px;
        }
        p {
            display: inline-block;
            width: 240px;
            margin: 0;
            text-align: left;
        }
        textarea {
            resize: none;
            height: 100px;
            width: 240px;
        }
    }
    .form-aligned .control-group {
        margin-bottom: 0;
        padding-bottom: 0.5em;
        label {
            width: 100px;
        }
    }
}
</style>

