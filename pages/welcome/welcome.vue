<template>
	<view>
		<view class="welcom">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-team.png" mode="aspectFit"></image>
			<view class="padding flex flex-wrap justify-around text-xl" style="width: 80%;">
				<text class="text-red padding">快捷招工</text>
				<text class="text-orange padding">精益生产</text>
				<text class="text-yellow padding">过程管控</text>
				<text class="text-green padding">一键结案</text>
			</view>
			<view class="flex align-center margin-top">
				<button class="cu-btn block bg-orange lg margin-right-lg " @tap="go_back">稍后登录</button>
				<button class="cu-btn block bg-blue lg" open-type="getUserInfo" @getuserinfo="getUserInfoCb">一键开工</button>
			</view>
			
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		...mapMutations(['setUserInfo', 'setIsHead', 'setRefreshJwt','setIsSubscribe','set_isHead_res','set_is_login']),
		getUserInfoCb(res) {
			console.log(res);
			if (res.detail.errMsg === 'getUserInfo:ok') {
				uni.showLoading({
					title: '授权中'
				});
				let r_detail = res.detail;
				let userInfo = r_detail.userInfo;
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						console.log(loginRes);
						if (loginRes.errMsg === 'login:ok') {
							this.$http
								.post('personwx.login/1.0/', {
									code: loginRes.code,
									appid: 'wx6d2818e2adb8d93a',
									avatarUrl: userInfo.avatarUrl,
									city: userInfo.city,
									country: userInfo.country,
									gender: userInfo.gender,
									language: userInfo.language,
									nickName: userInfo.nickName,
									province: userInfo.province,
									loginName: userInfo.nickName
								})
								.then(res => {
									console.log('res', res);
									userInfo.openid = this.$utils._get(res, 'data.data.openId', '');
									userInfo.jwt = this.$utils._get(res, 'data.data.jwt', '');
									userInfo.loginName = this.$utils._get(res, 'data.data.loginName', userInfo.nickName);
									userInfo.status = this.$utils._get(res, 'data.data.status', 0);
									userInfo.id = this.$utils._get(res, 'data.data.id', '');
									let isHead_res = this.$utils._get(res, 'data.data.isHead', '0');
									let isSubscribe = this.$utils._get(res,'data.data.isSubscribe',false);
									let s_isHead = uni.getStorageSync('isHead')
									let ishead =  s_isHead === ""?isHead_res:s_isHead
									this.set_isHead_res(isHead_res)
									this.setIsHead(ishead);
									this.setUserInfo(userInfo);
									this.setIsSubscribe(isSubscribe === '1'?true:false)
									this.set_is_login(true)
									uni.setStorageSync('version', '2.1.1');
									this.setRefreshJwt(false);
									uni.$emit('refreshJwt')
									uni.switchTab({
										url: '../tabbar/task/task'
									});
									uni.hideLoading();
								});
						}
					}
				});
			} else {
				// uni.showToast({
				// 	title: '请先授权登录',
				// 	duration: 2000
				// });
			}
		},
		go_back(){
			uni.navigateBack({
			    delta: 1
			});
		}
	}
};
</script>

<style lang="less" scoped>
.welcom {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: calc(100vh - var(--window-bottom));
	image {
		width: 100%;
	}
}
</style>
