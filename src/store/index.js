import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import list from './modules/list'

Vue.use(Vuex)

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	modules: {
		list
	}
})