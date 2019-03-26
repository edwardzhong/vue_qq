import { get, post } from "../../common/request";

export default {
    state: {
        friends: []
    },
    getters: {
        friends: state => state.friends
    },
    actions: {
        removeFriend: ({ commit }, form) => {
            return post('/delfriend', { friend_id: form.id }).then(res => {
                if (res.code == 0) {
                    commit('removeFriend', form);
                } else if (res.code == 1) {
                    commit('logout');
                } else {
                    alert(res.message);
                }
            })
        }
    },
    mutations: {
        setFriends: (state, payload) => {
            state.friends = payload;
        },
        addFriend: (state, payload) => {
            if (state.friends.find(i => i.id == payload.id)) return;
            state.friends.push(payload);
        },
        removeFriend: (state, payload) => {
            state.friends = state.friends.filter(i => i.id !== payload.id);
        },
        friendStatus: (state, payload) => {
            state.friends.forEach((item, i) => {
                if (payload.hasOwnProperty(item.id)) {
                    item.status = 1;
                } else {
                    item.status = 0;
                }
            });
        },
        addNoReads: (state, payload) => {
            let i = state.friends.find(i => i.id == payload.id);
            if (i) {
                i.reads = i.reads || 0;
                i.reads++;
            }
            state.friends = [...state.friends];
        }
    }
}