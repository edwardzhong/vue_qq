<template lang="pug">
    div.profile(:style="{left:sty.left+'px',top:sty.top+'px',zIndex:sty.z}" 
        v-on:click.stop="$emit('setZ')")
        header(v-drag)
            h2 {{infoType == 0 ? '用户信息':info.nick}}
            div(v-on:click.stop="$emit('close')") ×
        div.body
            div.avatar
                img(:src="info.avatar? info.avatar: aPic.src" ref="img")
                input(type="file" v-on:change="uploadFile($event)" v-if="infoType == 0")
            div(class="form form-aligned")
                div.control-group
                    label 类型
                    p 个人
                div.control-group
                    label 号码
                    p {{info.num}}
                div.control-group
                    label email
                    p {{info.email}}
                div.control-group
                    label 昵称
                    input(type="text" maxlength="20" :value ="info.nick" v-if="infoType == 0" ref="nick")
                    p(v-if="infoType!=0") {{info.nick}}
                div.control-group
                    label 个人签名
                    textarea(v-if="infoType == 0" maxlength="50" ref="signature") {{info.signature}}
                    p(v-if="infoType!=0") {{info.signature}}
                div.control-group(v-if="infoType == 2")
                    label 验证信息
                    input(type="text" maxlength="20" ref="verify")
            button(class="button" v-if="infoType == 0" v-on:click="save") save
            button(class="button" v-if="infoType == 2" v-on:click="apply(info)") 加为好友
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { post } from "../common/request";
import { compressPicture } from "../common/util";

export default {
    name: "profile",
    props: {
        socket: Object,
        info: Object,
        sty: Object
    },
    created() {
        if (this.selfInfo.id == this.info.id) {
            this.infoType = 0;
        } else if (this.friends.find(i => i.id == this.info.id)) {
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
        ...mapState(["selfInfo"]),
        ...mapGetters(["friends"])
    },
    methods: {
        apply(info) {
            const that = this;
            const val = this.$refs.verify.value.trim();
            let form = { to_id: info.id };
            if (val) form.apply_message = val;
            post("/apply", form)
                .then(res => {
                    if (res.code == 0) {
                        that.socket.emit("sendApply", info.id, {
                            ...that.selfInfo,
                            ...form,
                            type:0,
                            id:res.data,
                            from_id: that.selfInfo.id
                        });
                        that.$emit("close");
                    } else {
                        this.$store.commit('showDialog',{txt:res.message})
                    }
                })
                .catch(err => {
                    this.$store.commit('showDialog',{txt:err.message})
                });
        },
        async save() {
            let form = {
                    nick: this.$refs.nick.value.trim(),
                    signature: this.$refs.signature.value.trim()
                },
                imgsrc = this.$refs.img.dataset.src || "";
            if (imgsrc) {
                form.avatar = imgsrc;
            }
            await this.$store.dispatch("updateSelf", form);
            this.$emit("close");
        },
        uploadFile(e) {
            const that = this;
            const file = e.target.files[0];
            if (!file) return false;
            if (file.type.indexOf("image") === -1) {
                this.$store.commit('showDialog',{txt:'请上传图片！'})
                return false;
            }

            //拖拉图片到浏览器，可以实现预览功能
            // const url = window.URL.createObjectURL(file);
            const fileName = file.name;
            const name = fileName.substr(0, fileName.lastIndexOf("."));
            const fileSize = Math.floor(file.size / 1024);
            if (fileSize > 2048) {
                this.$store.commit('showDialog',{txt:'上传大小不能超过2M'})
                return false;
            }
            if (!window.FileReader) {
                this.$store.commit('showDialog',{txt:'浏览器不支持上传'})
                return false;
            }

            const fr = new FileReader();
            fr.onloadend = function(e) {
                let img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const base64 = compressPicture(img, 128);
                    post("/upload", { data: base64, name: fileName })
                        .then(res => {
                            if (res.code == 0) {
                                that.$refs.img.src = res.data;
                                that.$refs.img.dataset.src = res.data;
                            } else {
                                this.$store.commit('showDialog',{txt:res.message})
                            }
                        })
                        .catch(err => {
                            this.$store.commit('showDialog',{txt:err.message})
                        });
                };
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
            width: 200px;
        }
        p {
            display: inline-block;
            width: 200px;
            margin: 0;
            text-align: left;
        }
        textarea {
            resize: none;
            height: 100px;
            width: 200px;
        }
    }
    .form-aligned .control-group {
        display: flex;
        align-items: center;
        margin-bottom: 0;
        padding-bottom: 0.5em;
        label {
            width: 100px;
            color: #aaa;
        }
    }
}
</style>

