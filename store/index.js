import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../utils/utils.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		has_team: false,
		has_task: true,
		user_info: uni.getStorageSync('user_info') || {},
		artisan_work_state: 'noTask',
		isHead: uni.getStorageSync('isHead') || '0',
		current_task: uni.getStorageSync('current_task') || {},
		refresh_jwt:false,
		refresh_num:0,
	},
	mutations: {
		setHasTeam(state, data) {
			state.has_team = data
		},
		setHasTask(state, data) {
			state.has_task = data
		},
		setUserInfo(state, data) {
			state.user_info = data
			uni.setStorageSync('user_info', data);
			// uni.setStorage({
			//     key: 'user_info',
			//     data: JSON.stringify(data),
			//     success:() => {

			// 		console.log('userInfo',state.user_info)


			//     }
			// });
		},
		setUserInfoId(state, data) {
			state.user_info.id = data
			uni.setStorageSync('user_info', data);
			// uni.setStorage({
			//     key: 'user_info',
			//     data: JSON.stringify(state.user_info),
			//     success:() => {

			// 		console.log('userInfo',state.user_info)


			//     }
			// });
		},
		setArtisanWorkState(state, data) {
			state.artisan_work_state = data
		},
		setIsHead(state, data) {
			state.isHead = data
			uni.setStorageSync('isHead', data);
		},
		setCurrentTask(state, data) {
			state.current_task = data
			uni.setStorageSync('current_task', data);
		},
		setRefreshJwt(state,data){
			state.refresh_jwt = data
		},
		setRefreshNum(state,data){
			state.refresh_num = data
		}
	},
	actions: {
		// lazy loading openid

	},
	getters: {
		test_user(state) {
			return state.user_info
		},
		jwt(state) {
			return utils._get(state.user_info, 'jwt', '')
		},
		openId(state) {
			return utils._get(state.user_info, 'openid', '')
		},
		id(state) {
			console.log(state.user_info)
			return utils._get(state.user_info, 'id', '')
		},
		user_role(state) {
			console.log(state.isHead)
			console.log(state.user_info)
			if (state.isHead === '1') {
				return 'head'
			} else {
				return 'artisan'
			}
		}
	}
})

export default store
