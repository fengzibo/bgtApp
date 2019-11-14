import Vue from 'vue'
import Request from '../utils/luch-request/request'
import Store from "../store";
import AppConfig from './config'
const http = new Request();

http.setConfig((config) => { /* 设置全局配置 */
    config.baseUrl = AppConfig.api_url; /* 根域名不同 */
    config.header = {
		"Content-Type": "application/x-www-form-urlencoded",
	}
    return config
})

http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
    config.header = {
        Authorization:'Bearer '+Store.getters.jwt,
        ...config.header,
    }
    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
        cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config;
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
    // console.log("--- http response " + response.config.url + " ---", response.data);

    switch(response.statusCode){
        case 200:
			if(response.data.code == '21'){
				console.log(Store.state.refresh_jwt)
				if(Store.state.refresh_jwt){
					return
				}
				uni.navigateTo({
					url: '/pages/logBack/logBack',
					success:() =>{
						Store.commit('setRefreshJwt',true)
					}
				});
				// uni.showModal({
				//     title: '提示',
				//     content: '登录已过期，请重新登录',
				// 	showCancel:false,
				// 	confirmText:'重新登录',
				// 	confirmColor:'#007AFF',
				//     success: function (res) {
				//         if (res.confirm) {
				//             console.log('用户点击确定');
				// 			// http.get('personwx.refreshJWT/1.0/',{
				// 			// 	openId:Store.getters.openId
				// 			// }).then(res =>{
				// 			// 	console.log(res)
				// 			// })
				// 			uni.showLoading({
				// 			    title: '登录中'
				// 			});
				// 			uni.request({
				// 			    url: AppConfig.api_url+'personwx.refreshJWT/1.0/', //仅为示例，并非真实接口地址。
				// 			    data: {
				// 			        openId:Store.getters.openId
				// 			    },
				// 				method:'GET',
				// 			    header: {
				// 			        "Content-Type": "application/x-www-form-urlencoded", //自定义请求头信息
				// 			    },
				// 			    success: (res) => {
				// 			        console.log(res.data);
				// 					let uinfo = Store.state.user_info
				// 					uinfo.id = res.data.data.id
				// 					uinfo.jwt = res.data.data.jwt
				// 					uinfo.openid = res.data.data.openId
				// 					uinfo.loginName = res.data.data.loginName
				// 					Store.commit('setUserInfo',uinfo)
				// 					uni.hideLoading();
				// 					uni.showToast({
				// 					    title: '登录成功',
				// 					    duration: 2000,
				// 						icon:'none'
				// 					}); 
				// 					uni.navigateBack({
				// 					    delta: 1
				// 					});
				// 			    }
				// 			});
				//         }
				//     }
				// });
				// return
			}
            break;

        case 400:
            uni.showToast({
                title: '请先登录~',
                icon: 'none',
            })

            // Store.commit('loginSuccess', {})
            setTimeout (() => {
                // uni.navigateTo({
                //     url:'/pages/auth/login?scene=back',
                // })

                // uni.navigateTo({
                //     url: '/pages/index/index?page=user'
                // });
            }, 1500)

            break;

        case 410:
            break;

        case 412:
            uni.showToast({
                title: response.data.errmsg,
                icon: 'none',
            })
            break;


        case 404:
        case 500:
            uni.showToast({
                title: '服务器开小差了~',
                icon: 'none',
            })
            break;
        default:
            uni.showToast({
                title: '服务器开小差了~',
                icon: 'none',
            })
            break;
    }

    return response;
})

export default http


