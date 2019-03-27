import { get, post } from "../common/request";

export const getInfo = ({ commit }) => {
    return  get("/getinfo").then(res => {
        if (res.code == 0) {
            commit("setSelfInfo", res.data.user);
            commit("setFriends", res.data.friends);
            commit("setGroup", res.data.groups);
            commit("setMsgs", res.data.msgs);
        } else if (res.code == 1) {
            commit("logout");
        }
    }).catch(err => {
    });
}

export const updateSelf=({commit},form)=>{
    post("/updateinfo", form).then(res => {
        if (res.code == 0) {
            commit("updateSelfInfo", form);
        } else if (res.code == 1) {
            commit("logout");
        } else {
            alert(res.message);
        }
    }).catch(err => {
        alert(err.message);
    });
}