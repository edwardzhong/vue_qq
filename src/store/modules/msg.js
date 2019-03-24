
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
        accept:({commit},form)=>{
            post("/accept", { friend_id: form.from_id }).then(res => {
                if (res.code == 0) {
                    form.id = form.from_id;
                    form.status = 1;
                    commit("setMsgState", form);
                    commit("addFriend", form);
                } else {
                    alert(res.message);
                }
            }).catch(err => {
                alert(err.message);
            });
        },
        reject:({commit},form)=>{
            post("/reject", { friend_id: form.from_id }).then(res => {
                if (res.code == 0) {
                    form.status = 2;
                    commit("setMsgState", form);
                } else {
                    alert(res.message);
                }
            }).catch(err => {
                alert(err.message);
            });
        }
    },
    mutations: {
        setMsgs: (state, payload) => {
            state.msgs = payload;
        },
        setMsgState: (state, payload) => {
            state.msgs.forEach(i => {
                if (i.id == payload.id) {
                    i.status = payload.status;
                }
            })
        }
    }
}