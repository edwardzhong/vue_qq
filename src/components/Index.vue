<template lang="pug">
div.content
    div.bar(v-drag)
        header
            div.avatar(v-on:click="profile")
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
                ul.users
                    li(v-for="item in users" :key="item.id" v-on:click="searchAdd(item)")
                        div.avatar
                            img(:src="item.avatar? item.avatar: aPic.src") 
                        p {{item.name}}
            div.main-panel(v-if="!isSearch")        
                nav
                    div(v-on:click="showTab(0)" :class="{active:tabIndex==0}") 好友
                    div(v-on:click="showTab(1)" :class="{active:tabIndex==1}") 分组
                    div(v-on:click="showTab(2)" :class="{active:tabIndex==2}") 消息    
                ul.friends(v-if="tabIndex == 0")
                    li(v-for="item in friends" :key="item.id" v-on:click="add(item)")
                        div.avatar
                            img(:src="aPic.src") 
                        p {{item.name}}
                ul.groups(v-if="tabIndex == 1")
                    li(v-for="item in groups" :key="item.id" v-on:click="add(item)")
                        div.avatar
                            img(:src="gPic.src") 
                        p {{item.name}}
                ul.msgs(v-if="tabIndex == 2")
                    li(v-for="item in msgs" :key="item.id")
    component(:is="item.component"  v-for="(item,i) in wins" :key="item.id" 
        :info="item.info"
        :sty="item.sty"
        v-on:close="close(i)"
        v-on:setZ="setZ(i)")
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MsgWin from "./MsgWin.vue";
import Profile from "./Profile.vue";
import { get, post } from "../common/request";

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
    computed: {
        ...mapState(["selfInfo", "friends", "groups", "users", "msgs"]),
        ...mapGetters(["isLogin"])
    },
    watch: {
        isLogin: {
            //监听登录状态
            handler: function(val, old) {
                const that = this;
                if (val === false) {
                    that.$router.push("/sign/log");
                } else {
                    get("/getInfo")
                        .then(res => {
                            console.log(res);
                            if (res.code == 0) {
                                that.$store.commit(
                                    "setSelfInfo",
                                    res.data.user
                                );
                                that.$store.commit(
                                    "setFriends",
                                    res.data.friends
                                );
                                that.$store.commit("setMsgs", res.data.applys);
                            } else if(res.code==1){
                                this.$store.commit("logout");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            alert(err.message);
                        });
                }
            },
            immediate: true //进入组件立即执行一次
        }
    },
    methods: {
        add(info, win = MsgWin) {
            if (this.wins.filter(w => w.info.id == info.id)[0]) return;
            let l = this.wins.length;
            this.wins.push({
                info,
                sty: {
                    left: l * 30 + 270,
                    top: l * 30 + 30,
                    z: 0
                },
                component: win
            });
            this.setZ(l);
        },
        setZ(i) {
            this.wins.forEach((item, index) => {
                if (index == i) item.z = 1;
                else item.z = 0;
            });
        },
        close(i) {
            this.wins.splice(i, 1);
        },
        showSearch() {
            this.isSearch = true;
            this.$refs.ser.focus();
        },
        hideSearch() {
            this.isSearch = false;
            this.$store.commit("clearUsers");
            this.$refs.ser.value = "";
        },
        profile() {
            this.add(this.selfInfo, Profile);
        },
        searchAdd(info){
            this.add(info,Profile);
        },
        logout() {
            this.$store.commit("logout");
        },
        showTab(i) {
            this.tabIndex = i;
        },
        search(e) {
            const that = this;
            const val = e.target.value.trim();
            if (!val) return;
            get("/search", { kw: val })
                .then(res => {
                    if (res.code == 0) {
                        that.$store.commit("setUsers", res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert(err.message);
                });
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
.search-panel,
.user-panel {
    width: 100%;
    min-height: 313px;
    max-height: 513px;
    padding: 10px 20px;
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
            }
        }
        .friends,
        .groups,
        .users,
        .msgs {
            box-sizing: border-box;
            margin: 0;
            padding: 0 20px;
            min-height: 300px;
            max-height: 500px;
            overflow-y: auto;
            li {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-top: 20px;
                cursor: pointer;
                &:hover {
                    color: hsl(200, 100%, 40%);
                }
                .avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    overflow: hidden;
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
                }
            }
        }
    }
}
</style>
