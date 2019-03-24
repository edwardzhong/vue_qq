import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import list from './modules/list'
import friend from './modules/friend'
import search from './modules/search'
import msg from './modules/msg'
import group from './modules/group'

Vue.use(Vuex)

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	modules: {
		search,
		friend,
		group,
		msg,
		list
	}
})