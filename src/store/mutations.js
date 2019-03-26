const token = localStorage.getItem("token");
const selfInfo = JSON.parse(localStorage.getItem('selfInfo') || '{}');

export const state = {
    modal: { visible: false },
    loginInfo: { token },
    selfInfo: selfInfo
}

export const mutations = {
    showModal: () => {
        state.modal.visible = true;
    },
    closeModal: () => {
        state.modal.visible = false;
    },
    setLoginInfo: (state) => {
        state.loginInfo = { token: localStorage.getItem("token") };
    },
    setSelfInfo: (state, payload) => {
        state.selfInfo = payload;
        localStorage.setItem("selfInfo", JSON.stringify(payload));
    },
    updateSelfInfo: (state, payload) => {
        state.selfInfo = Object.assign(state.selfInfo, payload);
    },
    logout: () => {
        state.loginInfo = {};
        state.selfInfo = {};
        localStorage.removeItem("token");
    }
}