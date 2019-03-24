export default {
    state: {
        friends: []
    },
    getters: {
        friends: state => state.friends
    },
    actions: {},
    mutations: {
        setFriends: (state, payload) => {
            state.friends = payload;
        },
        addFriend: (state, payload) => {
            if (state.friends.findIndex(i => i.id == payload.id) > -1) return;
            state.friends.push(payload);
        }
    }
}