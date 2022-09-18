import { createStore } from 'vuex'
import { state, mutations } from './mutations'
import * as getters from './getters'
import * as actions from './actions'
import friend from './modules/friend'
import search from './modules/search'
import msg from './modules/msg'
import group from './modules/group'

export default createStore({
	actions,
	getters,
	state,
	mutations,
	modules: {
		search,
		friend,
		group,
		msg
	}
})