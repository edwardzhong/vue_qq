const token = localStorage.getItem("token");
const selfInfo = JSON.parse(localStorage.getItem('selfInfo') || '{}');

export const state = {
    modal: { visible: false },
    loginInfo: { token },
    selfInfo: selfInfo,
    tip: { name: 'nick', txt: 'content', show: false }
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