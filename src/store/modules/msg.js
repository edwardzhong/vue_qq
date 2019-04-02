
import { get, post } from "../../common/request";

export default {
    state: {
        msgs: []
    },
    getters: {
        msgs: state => state.msgs,
        dealCount: state => state.msgs.filter(i => i.status == 0).length
    },
    actions: {
        accept({ commit }, form) {
            return post("/accept", { id: form.id, friend_id: form.from_id }).then(res => {
                if (res.code == 0) {
                    commit("setMsgState", { id: form.id, status: 1 });
                    commit("addFriend", Object.assign({}, form, { id: form.from_id }));
                } else {
                    commit('showDialog',{txt:res.message})
                }
            }).catch(err=>{
                commit('showDialog',{txt:err.message})
            });
        },
        acceptGroup({ commit }, form) {
            return post("/acceptgroup", { id: form.id, group_id: form.group_id, user_id: form.from_id }).then(res => {
                if (res.code == 0) {
                    commit("setMsgState", { id: form.id, status: 1 });
                } else {
                    commit('showDialog',{txt:res.message})
                }
            }).catch(err=>{
                commit('showDialog',{txt:err.message})
            });
        },
        reject({ commit }, form) {
            post("/reject", { id: form.id }).then(res => {
                if (res.code == 0) {
                    form.status = 2;
                    commit("setMsgState", form);
                } else {
                    commit('showDialog',{txt:res.message})
                }
            }).catch(err=>{
                commit('showDialog',{txt:err.message})
            });
        }
    },
    mutations: {
        setMsgs(state, payload) {
            state.msgs = payload;
        },
        setMsgState(state, payload) {
            state.msgs.forEach(i => {
                if (i.id == payload.id) {
                    i.status = payload.status;
                }
            })
        },
        addMsg(state, payload) {
            state.msgs.unshift(payload);
        }
    }
}