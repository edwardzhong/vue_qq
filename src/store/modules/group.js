import { get, post } from "../../common/request";

export default {
    state: {
        groups: []
    },
    getters: {
        groups: state => state.groups
    },
    actions: {
        addGroup({ commit }, form) {
            return post('/addgroup', form).then(res => {
                if (res.code == 0) {
                    commit('addGroup', { id: res.data, ...form });
                } else if (res.code == 1) {
                    commit('logout');
                } else {
                    alert(res.message);
                }
            });
        },
        delGroup({ commit }, form) {
            return post('/delgroup', form).then(res => {
                if (res.code == 0) {
                    commit('delGroup', form);
                } else if (res.code == 1) {
                    commit('logout');
                } else {
                    alert(res.message);
                }
            });
        },
        updateGroup({ commit }, form) {
            return post('/updategroup', form).then(res => {
                if (res.code == 0) {
                    commit('updateGroup', form);
                } else if (res.code == 1) {
                    commit('logout');
                } else {
                    alert(res.message);
                }
            });
        }
    },
    mutations: {
        setGroup(state, payload) {
            state.groups = payload;
        },
        addGroup(state, payload) {
            state.groups.unshift(payload);
        },
        delGroup(state, payload) {
            state.groups = state.groups.filter(g => g.id != payload.id)
        },
        updateGroup(state, payload) {
            state.groups = state.groups.map(g => {
                if (g.id == payload.id) {
                    g = Object.assign({}, g, payload);
                }
                return g;
            });
        },
        addGroupNoReads(state, payload) {
            let i = state.groups.find(i => i.id == payload.gid);
            if (i) {
                i.reads = i.reads || 0;
                i.reads++;
            }
            state.groups = [...state.groups];
        }
    }
}