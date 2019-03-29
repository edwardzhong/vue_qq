let token = localStorage.getItem("token");
let selfInfo = {};
const info = localStorage.getItem('selfInfo');
if (!info || info === 'undefined') {
    localStorage.clear();
} else {
    selfInfo = JSON.parse(info) || {};
}

export const state = {
    modal: { visible: false },
    loginInfo: { token },
    selfInfo: selfInfo,
    tip: { name: 'nick', txt: 'content', show: false },
    dialog: { txt: 'content', cancal: false, callback: () => { }, show: false }
}

export const mutations = {
    showModal() {
        state.modal.visible = true;
    },
    closeModal() {
        state.modal.visible = false;
    },
    showTip(state, payload) {
        state.tip = { ...payload, show: true };
    },
    closeTip(state) {
        state.tip.show = false;
    },
    showDialog(state, payload) {
        state.modal.visible = true;
        state.dialog = Object.assign({}, state.dialog, payload);
        state.dialog.show = true;
    },
    closeDialog(state) {
        state.modal.visible = false;
        state.dialog.show = false;
    },
    setLoginInfo(state) {
        state.loginInfo = { token: localStorage.getItem("token") };
    },
    setSelfInfo(state, payload) {
        state.selfInfo = payload;
        localStorage.setItem("selfInfo", JSON.stringify(payload));
    },
    updateSelfInfo(state, payload) {
        state.selfInfo = Object.assign(state.selfInfo, payload);
    },
    logout() {
        state.loginInfo = {};
        state.selfInfo = {};
        localStorage.clear();
    }
}