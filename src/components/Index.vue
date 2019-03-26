<template lang="pug">
div.content
    div.bar(v-drag)
        header
            div.avatar(v-on:click="profile(selfInfo)")
                img(:src="selfInfo.avatar? selfInfo.avatar: aPic.src") 
            h2 {{ selfInfo.nick }}
            i.icon-logout(v-on:click="logout")
        div.body
            div(class="search")
                div
                    input(type="search" placeholder="search" ref="ser" v-on:keyup.enter="search($event)")
                    span(v-on:click="hideSearch") 取消
                label(v-on:click="showSearch" v-if="!isSearch")
                    i.icon-search
                    span search
            div.search-panel(v-if="isSearch")
                ul.searchs
                    li(v-for="item in searchs" :key="item.id")
                        div.avatar(v-on:click="profile(item)")
                            img(:src="item.avatar? item.avatar: aPic.src") 
                        p(v-on:click="searchTo(item)") {{item.name}}
            div.main-panel(v-if="!isSearch")        
                nav
                    div(v-on:click="showTab(0)" :class="{active:tabIndex==0}") 好友
                    div(v-on:click="showTab(1)" :class="{active:tabIndex==1}") 分组
                    div(v-on:click="showTab(2)" :class="{active:tabIndex==2}") 消息
                        span(v-if="dealCount") {{dealCount}}    
                ul.friends(v-if="tabIndex == 0")
                    li(v-for="item in friends" :key="item.id" :class="{online:item.status == 1}" v-on:contextmenu.prevent="menu($event,item)")
                        div.avatar(v-on:click="profile(item)")
                            img(:src="item.avatar? item.avatar: aPic.src") 
                        p(v-on:click="chatWin(item)") {{item.nick}}
                        span(v-if="item.reads && item.reads > 0") ({{item.reads}})
                ul.groups(v-if="tabIndex == 1")
                    li(v-for="item in groups" :key="item.id")
                        div.avatar(v-on:click="profile(item)")
                            img(:src="gPic.src") 
                        p(v-on:click="chatWin(item)") {{item.name}}
                ul.msgs(v-if="tabIndex == 2")
                    li(v-for="(item,i) in msgs" :key="i")
                        time {{item.date}} 
                        p 
                            a(href="javascript:;" v-on:click="msgTo(item)") {{item.nick}} 
                            span 申请成为好友
                        p.msg "{{item.apply_message}}"
                        div.btns
                            template(v-if="item.status == 0")
                                a(href="javascript:;" v-on:click="accept(item)") 同意
                                a(href="javascript:;" v-on:click="reject(item)") 拒绝
                            template(v-if="item.status == 1")
                                span 已同意
                            template(v-if="item.status == 2")
                                span 已拒绝

    div.menu(v-if="menus.visible" :style="{top:menus.top+'px',left:menus.left+'px'}" v-on:mouseleave="closeMenu")
        p(v-on:click="profile(menus.info)") 详 情
        p(v-on:click="chatWin(menus.info)") 聊 天
        p(v-on:click="removeFriend(menus.info)") 删 除

    component(:is="item.component"  v-for="(item,i) in wins" :key="item.id" 
        :info="item.info"
        :sty="item.sty"
        :msgs="item.msgs"
        :socket = "item.socket"
        v-on:close="closeWin(i)"
        v-on:setZ="setZ(i)")
</template>

<script>
import { mapState, mapGetters } from "vuex";
import io from "socket.io-client";
import MsgWin from "./MsgWin.vue";
import Profile from "./Profile.vue";
import { formatTime } from "../common/util";
import { get, post } from "../common/request";

export default {
    name: "index",
    data() {
        return {
            isSearch: false,
            tabIndex: 0,
            menus: {
                info: {},
                visible: false,
                top: 0,
                left: 0
            },
            wins: [],
            aPic: {
                src: require("../assets/avatar.jpg")
            },
            gPic: {
                src: require("../assets/group.jpg")
            },
            socket: {}
        };
    },
    async created() {
        const token = localStorage.getItem("token") || "";
        if(!token){
            return this.$router.push("/sign/log");
        }
        await this.$store.dispatch("getInfo");

        this.socket = io("http://localhost:3001?token=" + token);

        // main
        // this.socket.on('open', res => { });

        //注册用户信息
        this.socket.emit("sign", this.selfInfo, res => {
            // console.log(res);
            this.$store.commit("friendStatus", res.data);
            this.socket.on("userin", map => {
                this.$store.commit("friendStatus", map);
            });
            this.socket.on("userout", map => {
                this.$store.commit("friendStatus", map);
            });
            this.socket.on('auth',data => {
                alert(data.message);
                this.$store.commit('logout');
            });

            //接收好友申请
            this.socket.on("apply", data => {
                this.$store.commit('addMsg',data);
            });
            //接收聊天信息
            this.socket.on("reply", (user, data) => {
                // data.date = formatTime(data.date);
                this.sendMsg(user, data);
            });
        });

        // 打开chat
        // this.chatSocket = io('http://localhost:3001/chat?token='+token,{ forceNew: true });
        // this.chatSocket.on('open', res => {
        //     console.log(res);
        // });
    },
    beforeDestroy() {
        this.socket.close();
    },
    computed: {
        ...mapState(["selfInfo"]),
        ...mapGetters([
            "isLogin",
            "dealCount",
            "searchs",
            "friends",
            "groups",
            "msgs"
        ])
    },
    watch: {
        isLogin: {
            //监听登录状态
            handler: function(val, old) {
                const that = this;
                if (val === false) {
                    that.$router.push("/sign/log");
                } else {
                    that.$store.dispatch("getInfo");
                }
            }
            // ,immediate: true //进入组件立即执行一次
        }
    },
    methods: {
        menu(e, info) {
            const cx = e.clientX,
                cy = e.clientY,
                ol = e.target.offsetLeft + e.target.offsetWidth / 3,
                ot = e.target.offsetTop + e.target.offsetHeight;

            this.menus = {
                info: info,
                visible: true,
                top: ot,
                left: ol
            };
        },
        closeMenu() {
            this.menus.visible = false;
        },
        removeFriend(info) {
            this.$store.dispatch("removeFriend", info, this.closeMenu);
        },
        accept(item) {
            this.$store.dispatch("accept", item);
        },
        reject(item) {
            this.$store.dispatch("reject", item);
        },
        addWin(info, com) {
            if (this.wins.find( w => w.component == com && w.info.id == info.id )){
                return;
            }
            let l = this.wins.length;
            this.wins.push({
                msgs: info.msgs||[],
                socket: this.socket,
                info,
                sty: {
                    left: l * 30 + 270,
                    top: l * 30 + 30,
                    z: 0
                },
                component: com
            });
            this.setZ(l);
        },
        chatWin(info) {
            this.friends.find(i=>i.id == info.id).reads = 0;
            get('/getmsg',{id:info.id}).then(res=>{
                this.addWin({...info,msgs:res.data}, MsgWin);
            }).catch(err=>{
                alert(err.message);
            });
        },
        profile(info) {
            this.addWin(info, Profile);
        },
        searchTo(info) {
            if (this.friends.find(i => i.id == info.id)) {
                this.chatWin(info);
            } else {
                this.profile(info);
            }
        },
        msgTo(info) {
            this.profile(Object.assign({}, info, { id: info.from_id }));
        },
        setZ(i) {
            this.wins.forEach((item, index) => {
                if (index == i) item.sty.z = 1;
                else item.sty.z = 0;
            });
        },
        sendMsg(user, data) {
            let selWin = this.wins.find(w => w.component == MsgWin && w.info.id == user.id);
            if (selWin) {
                selWin.msgs.push({ ...data, ...user });
            } else {
                this.$store.commit('addNoReads',user)
            }
        },
        closeWin(i) {
            this.wins.splice(i, 1);
        },
        showSearch() {
            this.isSearch = true;
            this.$refs.ser.focus();
        },
        hideSearch() {
            this.isSearch = false;
            this.$store.commit("clearSearchs");
            this.$refs.ser.value = "";
        },
        logout() {
            this.$store.commit("logout");
        },
        showTab(i) {
            this.tabIndex = i;
        },
        search(e) {
            const val = e.target.value.trim();
            if (!val) return;
            this.$store.dispatch("search", val);
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
.content {
    height: 100%;
    width: 1000px;
    margin: 0 auto;
    position: relative;
}
.main-panel {
    width: 100%;
}
.search-panel {
    width: 100%;
    min-height: 313px;
    max-height: 513px;
    li {
        line-height: 2;
    }
}
.bar {
    position: absolute;
    top: 30px;
    width: 250px;
    background-color: #fff;
    user-select: none;
    box-shadow: 0 6px 20px 0 hsla(0, 0%, 0%, 0.19),
        0 8px 17px 0 hsla(0, 0%, 0%, 0.2);
    header {
        display: flex;
        align-items: flex-start;
        align-items: center;
        background-color: $blue;
        color: #fff;
        line-height: 3;
        .avatar {
            width: 30px;
            height: 30px;
            margin: 10px;
            border: 1px solid $blue;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            &:hover {
                border-color: #fff;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        h2 {
            width: 170px;
            font-weight: normal;
            font-size: 16px;
        }
        i {
            padding-right: 15px;
            cursor: pointer;
            &:hover {
                color: #ccc;
            }
        }
    }
    .body {
        .search {
            position: relative;
            padding: 4px;
            background-color: #ececec;
            input {
                width: calc(100% - 30px);
                padding: 0.4em;
                display: inline-block;
                border: 1px solid #ececec;
                border-radius: 4px;
                vertical-align: middle;
                box-sizing: border-box;
                outline: none;
            }
            div span {
                font-size: 12px;
                padding-left: 4px;
                color: $blue;
                cursor: pointer;
            }
            label {
                position: absolute;
                top: 5px;
                left: 5px;
                width: calc(100% - 10px);
                height: calc(100% - 10px);
                text-align: center;
                line-height: 2;
                border-radius: 4px;
                color: #bbb;
                background-color: #fff;
                cursor: pointer;
            }
        }
        nav {
            position: relative;
            display: flex;
            top: 0;
            background-color: #fafafa;
            &:before {
                content: " ";
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                border-top: 1px solid #ccc;
                transform-origin: 0 100%;
                transform: scaleY(0.5);
            }
            &:after {
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                border-bottom: 1px solid #ccc;
                transform-origin: 0 100%;
                transform: scaleY(0.5);
            }

            div {
                position: relative;
                display: block;
                flex: 1;
                line-height: 2.4;
                text-align: center;
                cursor: pointer;
                &:after {
                    content: " ";
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    border-right: 1px solid #ccc;
                    transform-origin: 100% 0;
                    transform: scaleX(0.5);
                }
                &:hover {
                    color: hsl(200, 100%, 40%);
                }
                &.active {
                    color: hsl(200, 100%, 50%);
                    background-color: #ececec;
                }
                span {
                    padding: 4px;
                    color: $blue;
                    font-size: 10px;
                }
            }
        }
        .friends,
        .groups {
            box-sizing: border-box;
            margin: 0;
            padding-left: 16px;
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            li {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-top: 20px;
                color: #aaa;
                opacity: 0.5;
                cursor: pointer;
                .avatar {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #fff;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                p {
                    max-width: 150px;
                    margin: 0;
                    padding-left: 10px;
                    @include nowrap;
                }
                span{
                    font-size: 13px;
                    padding-left: 4px;
                    color: #d00;
                }
                &:hover,
                &.online {
                    opacity: 1;
                    color: $blue;
                }
            }
        }
        .searchs{
            @extend .friends;
            li{
                opacity: 1;
            }
        }
        .msgs {
            box-sizing: border-box;
            min-height: 300px;
            max-height: 500px;
            padding: 0 10px;
            overflow-y: auto;
            li {
                padding: 5px 10px;
                border-bottom: 1px dashed #ddd;
                time {
                    color: #999;
                    font-size: 12px;
                }
                p {
                    margin: 0;
                    // padding-left: 10px;
                    line-height: 1.6;
                }
                .btns {
                    text-align: right;
                    font-size: 13px;
                    color: #aaa;
                    a {
                        padding-left: 14px;
                    }
                }
            }
        }
    }
}
.menu {
    box-sizing: border-box;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-bottom: none;
    border-radius: 4px;
    overflow: hidden;
    p {
        box-sizing: border-box;
        margin: 0;
        width: 60px;
        line-height: 2;
        border-bottom: 1px solid #ccc;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        &:hover {
            color: $blue;
        }
    }
}
</style>
