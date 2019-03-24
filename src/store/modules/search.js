import { get, post } from "../../common/request";

export default {
    state: {
        searchs: []
    },
    getters: { 
        searchs: state => state.searchs
    },
    actions: {
        search:({commit},val)=>{
            get("/search", { kw: val }).then(res => {
                if (res.code == 0) {
                    commit("setSearchs", res.data);
                } else if(res.code == 1){
                    commit('logout');
                } else {
                    alert(res.message);
                }
            }).catch(err => {
                alert(err.message);
            });
        }
    },
    mutations: {
        setSearchs: (state, payload) => {
            state.searchs = payload;
        },
        clearSearchs: (state, payload) => {
            state.searchs = [];
        }
    }
}