import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		has_team:false
	},
	mutations: {
		setHasTeam(state,data){
			state.has_team = data
		}
	},
	actions: {
		// lazy loading openid
		
	}
})

export default store
