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
                    li(v-for="item in friends" :key="item.id" v-on:contextmenu.prevent="menu")
                        div.avatar(v-on:click="profile(item)")
                            img(:src="item.avatar? item.avatar: aPic.src") 
                        p(v-on:click="chatWin(item)") {{item.nick}}
                ul.groups(v-if="tabIndex == 1")
                    li(v-for="item in groups" :key="item.id")
                        div.avatar(v-on:click="profile(item)")
                            img(:src="gPic.src") 
                        p(v-on:click="chatWin(item)") {{item.name}}
                ul.msgs(v-if="tabIndex == 2")
                    li(v-for="item in msgs" :key="item.id")
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

    component(:is="item.component"  v-for="(item,i) in wins" :key="item.id" 
        :info="item.info"
        :sty="item.sty"
        v-on:close="closeWin(i)"
        v-on:setZ="setZ(i)")
</template>

<script>
import { mapState, mapGetters } from "vuex";
import io from 'socket.io-client';
import MsgWin from "./MsgWin.vue";
import Profile from "./Profile.vue";

export default {
    name: "index",
    data() {
        return {
            isSearch: false,
            tabIndex: 0,
            wins: [],
            aPic: {
                src: require("../assets/avatar.jpg")
            },
            gPic: {
                src: require("../assets/group.jpg")
            }
        };
    },
    created(){
        // const socket = io('http://localhost:3001');
        // socket.on('open', function () {
        //     showTip('socket io is open !');
        //     init();
        // });
        // //监听用户离开
        // socket.on('userout',removeUser);

        // //监听message事件，打印消息信息
        // socket.on('message', function (data) {
        //     console.log(data);
        //     appendMsg(data);
        // });
        // socket.send({ type: 'sign', data: user });
    },
    computed: {
        ...mapState(["selfInfo"]),
        ...mapGetters(["isLogin","dealCount","searchs","friends","groups","msgs"])
    },
    watch: {
        isLogin: {
            //监听登录状态
            handler: function(val, old) {
                const that = this;
                if (val === false) {
                    that.$router.push("/sign/log");
                } else {
                    that.$store.dispatch('getInfo');
                }
            },
            immediate: true //进入组件立即执行一次
        }
    },
    methods: {
        menu(){
            console.log(11);
        },
        accept(item) {
            this.$store.dispatch('accept',item);
        },
        reject(item) {
            this.$store.dispatch('reject',item);
        },
        addWin(info, com) {
            if ( this.wins.filter( w => w.component == com && w.info.id == info.id )[0] ) return;
            let l = this.wins.length;
            this.wins.push({
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
            this.addWin(info, MsgWin);
        },
        profile(info) {
            this.addWin(info, Profile);
        },
        searchTo(info) {
            if (this.friends.findIndex(i => i.id == info.id) > -1) {
                this.chatWin(info);
            } else {
                this.profile(info);
            }
        },
        msgTo(info) {
            this.profile(Object.assign({},info,{id:info.from_id}));
        },
        setZ(i) {
            this.wins.forEach((item, index) => {
                if (index == i) item.z = 1;
                else item.z = 0;
            });
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
            this.$store.dispatch('search',val);
        }
    }
};
</script>

<style lang="scss" scoped>
$blue: hsl(200, 100%, 45%);
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
        .groups,
        .searchs {
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
                cursor: pointer;
                .avatar {
                    width: 30px;
                    height: 30px;
                    border: 1px solid #fff;
                    border-radius: 50%;
                    overflow: hidden;
                    &:hover {
                        border-color: hsl(200, 100%, 40%);
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                &.online {
                    color: $blue;
                    .avatar {
                        border: 1px solid $blue;
                    }
                }
                p {
                    width: 160px;
                    margin: 0;
                    padding-left: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    &:hover {
                        color: hsl(200, 100%, 40%);
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
</style>
