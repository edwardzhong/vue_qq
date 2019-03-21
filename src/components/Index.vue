<template lang="pug">
div.content
    div.bar(v-drag)
        header
            div.avatar(v-on:click="profile")
                img(src="../assets/avatar.jpg")
            h2 jeff
            i.icon-logout(v-on:click="logout")
        div.body
            div(class="search")
                div
                    input(type="search" placeholder="search" ref="ser")
                    span(v-on:click="hideSearch") 取消
                label(v-on:click="showSearch" v-if="!isSearch")
                    i.icon-search
                    span search
            div.search-panel(v-if="isSearch")
                ul
                    li avatar
                    li bbbb
            div.main-panel(v-if="!isSearch")        
                nav
                    div(v-on:click="showTab(0)" :class="{active:tabIndex==0}") 好友
                    div(v-on:click="showTab(1)" :class="{active:tabIndex==1}") 分组
                    div(v-on:click="showTab(2)" :class="{active:tabIndex==2}") 消息    
                ul.friends(v-if="tabIndex == 0")
                    li(v-for="item in friends" :key="item.id" v-on:click="add(item)")
                        div.avatar
                            img(src="../assets/avatar.jpg") 
                        p {{item.name}}
                ul.groups(v-if="tabIndex == 1")
                    li(v-for="item in groups" :key="item.id" v-on:click="add(item)")
                        div.avatar
                            img(src="../assets/group.jpg") 
                        p {{item.name}}
                ul.msgs(v-if="tabIndex == 2")
                    li avatar
                    li bbbb
    component(:is="item.component"  v-for="(item,i) in wins" :key="item.id" 
        :text="item.name" 
        :left="item.left" 
        :top="item.top"
        :z="item.z" 
        v-on:close="close(i)"
        v-on:setZ="setZ(i)")
</template>

<script>
import MsgWin from "./MsgWin.vue"
import Profile from "./Profile.vue"

export default {
    name: "index",
    data() {
        return {
            isSearch: false,
            tabIndex:0,
            friends: [
                { id: "1", name: "alex" },
                { id: "2", name: "bob" },
                { id: "3", name: "cath" },
                { id: "4", name: "david" }
            ],
            groups:[
                {id:'10',name:'haskell学习'},
                {id:'11',name:'vue项目'},
                {id:'12',name:'react学习'}
            ],
            wins: []
        };
    },
    methods: {
        add(item, win = MsgWin) {
            if (this.wins.filter(w => w.id == item.id)[0]) return;
            let l = this.wins.length;
            this.wins.push({
                ...item,
                component: win,
                left: l * 30 + 270 + "",
                top: l * 30 + 30 + "",
                z: "0"
            });
            this.setZ(l);
        },
        setZ(i) {
            this.wins.forEach((item, index) => {
                if (index == i) item.z = "1";
                else item.z = "0";
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
            this.$refs.ser.value = "";
        },
        profile() {
            this.add(
                {
                    id: "profile",
                    name: "profile"
                },
                Profile
            );
        },
        logout(){
            this.$router.push('/sign/log');
        },
        showTab(i){
            this.tabIndex=i;
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
            flex: 1;
            margin: 0;
            font-weight: normal;
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
        .friends,.groups,.msgs {
            margin: 0;
            padding: 0 25px;
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
                &.online{
                    color: $blue;
                    .avatar{
                        border:1px solid $blue;
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
