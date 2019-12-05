<script>
import Vue from 'vue';
import pageAnimation from './components/page-animation';
import store from './store';
import Config from './http/config'
import utils from './utils/utils.js'
export default {
	mixins: [pageAnimation],
	onLaunch: function() {
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif
				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				console.log(Vue.prototype.Custom)
				// #endif
				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
				Vue.prototype.pixelRatio = e.pixelRatio;
				Vue.prototype.windowHeight = e.windowHeight;
				console.log(e);
			}
		});
		// let userI = store.state.user_info
		// uni.request({
		//     url: Config.api_url+'personwx.refreshJWT/1.0/', 
		//     data: {
		//         openId:store.getters.openId,
		// 		loginName:userI.loginName,
		// 		city:userI.city,
		// 		country:userI.country,
		// 		gender:userI.gender,
		// 		language:userI.language,
		// 		nickName:userI.nickName,
		// 		province:userI.province,
		// 		avatarUrl:userI.avatarUrl,
		//     },
		// 	method:'GET',
		//     header: {
		//         "Content-Type": "application/x-www-form-urlencoded", //自定义请求头信息
		//     },
		//     success: (res) => {
		//         console.log(res.data);
		// 		let uinfo = store.state.user_info
		// 		uinfo.id = utils._get(res,'data.data.id','')
		// 		uinfo.jwt = utils._get(res,'data.data.jwt','')
		// 		uinfo.openid = utils._get(res,'data.data.openId','')
		// 		uinfo.loginName = utils._get(res,'data.data.loginName','')
		// 		store.commit('setUserInfo',uinfo)
		// 		store.commit('setRefreshJwt',false)
		//     }
		// });
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
@import 'colorui/main.css';
@import 'colorui/icon.css';
.globalHover{
	background: #f1f1f1;
}
/* .scrollPage{
	height: calc(100% - var(--window-bottom) - var(--window-top)  );
} */
/* uni-page-body{
	height: 100%;
} */
</style>
