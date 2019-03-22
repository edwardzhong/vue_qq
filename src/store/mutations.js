const token = localStorage.getItem("token");

export const state = {
    modal: { visible: false },
    loginInfo: { token },
    selfInfo: {},
    friends: [],
    groups: [],
    users: [],
    msgs: []
}

export const mutations = {
    showModal: () => {
        state.modal.visible = true;
    },
    closeModal: () => {
        state.modal.visible = false;
    },
    setLoginInfo: (state, payload) => {
        state.loginInfo = payload;
        state.selfInfo = payload;
    },
    setSelfInfo: (state, payload) => {
        state.selfInfo = payload;
    },
    updateSelfInfo: (state, payload) => {
        state.selfInfo = Object.assign(state.selfInfo, payload);
    },
    setFriends: (state, payload) => {
        state.friends = payload;
    },
    setUsers: (state, payload) => {
        state.users = payload;
    },
    clearUsers: (state, payload) => {
        state.users = [];
    },
    setMsgs: (state, payload) => {
        state.msgs = payload;
    },
    logout: () => {
        state.loginInfo = {};
        state.selfInfo = {};
        localStorage.removeItem("token");
    }
}