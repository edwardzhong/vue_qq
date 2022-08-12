<template lang="pug">
.content
    .bar
        header(v-drag)
            .avatar(v-on:click="profile(selfInfo)")
                img(:src="selfInfo.avatar? selfInfo.avatar: aPic.src") 
            .name {{ selfInfo.nick }}
                p {{ selfInfo.signature}}
            i.icon-logout(v-on:click="logout")
        .body
            .search
                div
                    input(type="search" placeholder="search" ref="ser" maxlength="20" v-on:keyup.enter="search($event)")
                    span(v-on:click="hideSearch") 取消
                label(v-on:click="showSearch" v-if="!isSearch")
                    i.icon-search
                    span search
            .search-panel(v-if="isSearch")
                .searchs
                    ul
                        li(v-for="item in searchs.users" :key="item.id")
                            .avatar(v-on:click="profile(item)")
                                img(:src="item.avatar? item.avatar: aPic.src") 
                            p(v-on:click="userTo(item)") {{item.name}}
                    ul
                        li(v-for="item in searchs.groups" :key="item.id")
                            .avatar(v-on:click="groupProfile(item)")
                                img(:src="item.avatar? item.avatar: aPic.src") 
                            p(v-on:click="groupWin(item)") {{item.name}}
            .main-panel(v-if="!isSearch")        
                nav
                    div(v-on:click="showTab(0)" :class="{active:tabIndex==0}") Friend
                    div(v-on:click="showTab(1)" :class="{active:tabIndex==1}") Group
                    div(v-on:click="showTab(2)" :class="{active:tabIndex==2}") Info
                        span(v-if="dealCount") {{dealCount}}    
                ul.friends(v-if="tabIndex == 0")
                    li(v-for="item in friends" :key="item.id" :class="{online:item.status == 1}" v-on:contextmenu.prevent="menu($event,item)")
                        .avatar(v-on:click="profile(item)")
                            img(:src="item.avatar? item.avatar: aPic.src") 
                        p(v-on:click="chatWin(item)") {{item.nick}}
                        span(v-if="item.reads && item.reads > 0") ({{item.reads}})
                .groups(v-if="tabIndex == 1")
                    i.icon-plus(v-on:click="inputGroup")
                    input(type="text" v-if="inputvisble" maxlength="20" v-on:keyup.enter="appendGroup" v-on:mouseleave="closeInputGroup")
                    ul
                        li(v-for="item in groups" :key="item.id")
                            .avatar(v-on:click="groupProfile(item)")
                                img(:src="item.avatar? item.avatar:gPic.src") 
                            .name
                                p(v-on:click="groupWin(item)") {{item.name}}
                                span(v-if="item.reads && item.reads > 0") ({{item.reads}})
                            i.icon-minus(v-if="item.create_id == selfInfo.id" v-on:click="deleteGroup(item)")
                ul.msgs(v-if="tabIndex == 2")
                    li(v-for="(item,i) in msgs" :key="item.id")
                        time {{item.date}} 
                        p 
                            a(href="javascript:;" v-on:click="msgTo(item)") {{item.nick}} 
                            span(v-if="item.type == 0") 申请成为好友
                            span(v-if="item.type == 1") 申请加入群组
                                a( v-if="item.group_name" href="javascript:;" v-on:click="msgToGroup(item)") {{item.group_name}}
                                span(v-else) &nbsp;xxxx
                        p.msg "{{item.apply_message}}"
                        .btns
                            template(v-if="item.status == 0")
                                a(href="javascript:;" v-if="item.type == 0" v-on:click="accept(item)") 同意
                                a(href="javascript:;" v-if="item.type == 1" v-on:click="acceptGroup(item)") 同意
                                a(href="javascript:;" v-on:click="reject(item)") 拒绝
                            template(v-if="item.status == 1")
                                span 已同意
                            template(v-if="item.status == 2")
                                span 已拒绝

    .menu(v-if="menus.visible" :style="{top:menus.top+'px',left:menus.left+'px'}" v-on:mouseleave="closeMenu")
        p(v-on:click="profile(menus.info)") 详 情
        p(v-on:click="chatWin(menus.info)") 聊 天
        p(v-on:click="removeFriend(menus.info)") 删 除

    component(:is="item.component"  v-for="(item,i) in wins" :key="item.id" 
        :info="item.info"
        :sty="item.sty"
        :msgs="item.msgs"
        :socket = "item.socket"
        v-on:close="closeWin(i)"
        v-on:chat="chatWin"
        v-on:pro="profile"
        v-on:gPro="groupProfile"
        v-on:setZ="setZ(i)")
</template>

<script>
import { mapState, mapGetters } from "vuex";
import io from "socket.io-client";
import ChatMsg from "./ChatMsg.vue";
import Profile from "./Profile.vue";
import GroupProfile from "./GroupProfile.vue";
import GroupMsg from "./GroupMsg.vue";
import { get, post } from "../common/request";

export default {
    name: "index",
    data() {
        return {
            isSearch: false,
            tabIndex: 0,
            inputvisble: false,
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
            socket: { close: () => {} }
        };
    },
    async created() {
        const token = localStorage.getItem("token") || "";
        if (!token) {
            return this.$router.push("/sign/log");
        }
        await this.$store.dispatch("getInfo");

        this.socket = io("http://localhost:3001?token=" + token);

        // main
        // this.socket.on('open', res => { });
        const rooms = this.groups.map(g => "" + g.id);

        //注册用户信息
        this.socket.emit("sign", { user: this.selfInfo, rooms }, res => {
            // console.log(res);
            this.$store.commit("friendStatus", res.data);
            this.socket.on("userin", (map, user) => {
                this.$store.commit("friendStatus", map);
                showTip(user, "上线了");
            });
            this.socket.on("userout", (map, user) => {
                this.$store.commit("friendStatus", map);
                showTip(user, "下线了");
            });
            this.socket.on("checkStatus", map => {
                this.$store.commit("friendStatus", map);
            });
            this.socket.on("auth", data => {
                this.$store.commit('showDialog',{txt:data.message})
                this.$store.commit("logout");
            });
            this.socket.on("refresh", async map => {
                await this.$store.dispatch("getInfo");
                this.$store.commit("friendStatus", map);
            });

            //接收申请好友和组群
            this.socket.on("apply", data => {
                this.$store.commit("addMsg", data);
            });

            //接收聊天信息
            this.socket.on("reply", (user, data) => {
                this.sendMsg(user, data);
            });

            //接收群组聊天信息
            this.socket.on("groupReply", (info, data) => {
                this.sendGroupMsg(info, data);
            });
        });

        const showTip = (user, txt) => {
            const friend = this.friends.find(i => i.id == user.id);
            if (friend) {
                this.$store.commit("showTip", { name: friend.nick, txt });
                setTimeout(() => {
                    this.$store.commit("closeTip");
                }, 2500);
            }
        };
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
                    that.$store.dispatch("getinfo");
                }
            }
            // ,immediate: true //进入组件立即执行一次
        }
    },
    methods: {
        inputGroup() {
            this.inputvisble = true;
        },
        closeInputGroup() {
            this.inputvisble = false;
        },
        appendGroup(e) {
            this.inputvisble = false;
            const that = this;
            const val = e.target.value.trim();
            if (!val) return;
            if ( this.groups.filter(g => g.create_id == this.selfInfo.id).length >= 3) {
                this.$store.commit('showDialog',{txt:'最多只能建3个组'});
                return;
            }
            this.$store.dispatch("addGroup", {
                name: val,
                create_id: that.selfInfo.id,
                create_name: that.selfInfo.nick
            });
        },
        deleteGroup(item) {
            this.$store.dispatch("delGroup", { id: item.id });
        },
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
        async removeFriend(info) {
            await this.$store.dispatch("removeFriend", info);
            this.closeMenu();
        },
        async accept(item) {
            await this.$store.dispatch("accept", item);
            this.socket.emit("acceptFriend", item.from_id);
        },
        reject(item) {
            this.$store.dispatch("reject", item);
        },
        async acceptGroup(item) {
            await this.$store.dispatch("acceptGroup", item);
            this.socket.emit("acceptFriend", item.from_id);
        },
        addWin(info, com) {
            if (
                this.wins.find(w => w.component == com && w.info.id == info.id)
            ) {
                return;
            }
            let l = this.wins.length;
            this.wins.push({
                msgs: info.msgs || [],
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
        groupWin(info) {
            const selGroup = this.groups.find(g => g.id == info.id);
            if (!selGroup){
                this.groupProfile(info);
                return;
            }

            get("/getgroupinfo", { id: info.id })
                .then(res => {
                    if (res.code == 0) {
                        if(!res.data.users.length){
                            this.$store.commit('delGroup',info);
                            this.$store.commit('showDialog',{txt:`群组 ${selGroup.name} 不存在`});
                        } else {
                            selGroup.reads = 0;
                            this.addWin({ ...info, users: res.data.users, msgs: res.data.msgs }, GroupMsg );
                        }
                    } else if (res.code == 1) {
                        this.$store.commit("logout");
                    }
                })
                .catch(err => {
                    this.$store.commit('showDialog',{txt:err.message})
                });
        },
        chatWin(info) {
            const selfriend = this.friends.find(i => i.id == info.id);
            get("/getmsg", { id: info.id, reads: selfriend.reads })
                .then(res => {
                    if (res.code == 0) {
                        selfriend.reads = 0;
                        this.addWin({ ...info, msgs: res.data }, ChatMsg);
                    } else if (res.code == 1) {
                        this.$store.commit("logout");
                    }
                })
                .catch(err => {
                    this.$store.commit('showDialog',{txt:err.message})
                });
        },
        profile(info) {
            this.addWin(info, Profile);
        },
        groupProfile(info) {
            this.addWin(info, GroupProfile);
        },
        userTo(info) {
            if (this.friends.find(i => i.id == info.id)) {
                this.chatWin(info);
            } else {
                this.profile(info);
            }
        },
        groupTo(info) {
            if (this.groups.find(i => i.id == info.id)) {
                // this.chatWin(info);
            } else {
                this.groupProfile(info);
            }
        },
        msgToGroup(info) {
            const gInfo = this.groups.find(g => g.id == info.group_id);
            if (gInfo) {
                this.groupProfile(gInfo);
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
            let selWin = this.wins.find(
                w => w.component == ChatMsg && w.info.id == user.id
            );
            if (selWin) {
                selWin.msgs.push({ ...data, ...user });
            } else {
                this.$store.commit("addNoReads", user);
            }
        },
        sendGroupMsg(info, data) {
            let selWin = this.wins.find(
                w => w.component == GroupMsg && w.info.id == info.gid
            );
            if (selWin) {
                selWin.msgs.push({ ...data, ...info });
            } else {
                this.$store.commit("addGroupNoReads", info);
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
        .name {
            width: 170px;
            font-size: 18px;
            padding: 10px 0;
            @include nowrap;
            p {
                margin: 0;
                padding: 5px 0;
                font-size: 12px;
                @include nowrap;
            }
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
        .friends {
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
                span {
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
        .groups {
            .icon-plus {
                display: inline-block;
                padding: 10px 10px 10px 20px;
                cursor: pointer;
                &:hover {
                    color: $blue;
                }
            }
            .icon-minus {
                display: none;
                cursor: pointer;
            }
            input {
                border: 1px solid #ccc;
                border-radius: 2px;
                padding: 3px;
                width: 150px;
                outline: none;
            }
            ul {
                @extend .friends;
                min-height: 261px;
                max-height: 461px;
                li {
                    margin-top: 10px;
                    opacity: 1;
                    &:hover .icon-minus {
                        display: block;
                    }
                }
                .name{
                    display: flex;
                    width: 150px;
                }
            }
        }
        .searchs {
            min-height: 334px;
            max-height: 500px;
            overflow-y: auto;
            ul {
                box-sizing: border-box;
                margin: 0;
                li {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top: 15px;
                    padding: 0 20px;
                    color: #aaa;
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
                }
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
