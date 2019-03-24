export default {
    state: {
        list: []
    },
    getters: {
        list: state => state.list
    },
    actions: {

    },
    mutations: {
        init(state, list) {
            state.list = list;
        },
        add(state, item) {
            state.list.unshift(item);
        },
        remove(state, id) {
            for (var i = 0; i < state.list.length; i++) {
                if (state.list[i].id == id) {
                    state.list.splice(i--, 1);
                }
            }
        },
        update(state, item) {
            let sel = state.list.filter(i => i.id == item.id)[0];
            if (sel) {
                Object.assign(sel, item);
            }
        }
    }
};