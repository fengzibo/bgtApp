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
	// uni.showLoading({
	//     title: '加载中'
	// });
    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
        cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config;
})

http.interceptor.response((response) => { /* 请求之后拦截器 */
    // console.log("--- http response " + response.config.url + " ---", response.data);
	// uni.hideLoading();
    switch(response.statusCode){
        case 200:
			if(response.data.code == '21' || response.data.code == '90' || response.data.code == '-9'){
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
				throw new Error('jwt已过期');
			}else if(response.data.code == '-9'){
				uni.showToast({
				    title: '系统繁忙,刷新重试',
				    icon: 'none',
				})
				throw '系统繁忙,刷新重试'
			}else if(response.data.code == '2'){
				uni.showToast({
				    title: '服务请求参数非法',
				    icon: 'none',
				})
				throw '服务请求参数非法'
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


