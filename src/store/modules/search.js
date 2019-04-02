import { get, post } from "../../common/request";

export default {
    state: {
        searchs: {
            users:[],
            groups:[]
        }
    },
    getters: { 
        searchs: state => state.searchs
    },
    actions: {
        search({commit},val){
            get("/search", { kw: val }).then(res => {
                if (res.code == 0) {
                    commit("setSearchs", res.data);
                } else if(res.code == 1){
                    commit('logout');
                } else {
                    commit('showDialog',{txt:res.message})
                }
            }).catch(err => {
                commit('showDialog',{txt:err.message})
            });
        }
    },
    mutations: {
        setSearchs(state, payload) {
            state.searchs = payload;
        },
        clearSearchs (state) {
            state.searchs = [];
        }
    }
}