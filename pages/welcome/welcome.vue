<template>
	<view>
		<view class="welcom">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-team.png" mode="aspectFit"></image>
			<button class="cu-btn block bg-blue lg margin-top-lg" open-type="getUserInfo" @getuserinfo="getUserInfoCb">
				微信授权登录
			</button>
		</view>
	</view>
</template>

<script>
	import {
	    mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
			};
		},
		onLoad() {
		},
		methods:{
			...mapMutations(['setUserInfo','setIsHead','setRefreshJwt']),
			getUserInfoCb(res){
				console.log(res)
				if(res.detail.errMsg === 'getUserInfo:ok'){
					uni.showLoading({
					    title: '授权中'
					});
					let r_detail = res.detail
					let userInfo = r_detail.userInfo
					uni.login({
						provider: 'weixin',
						success: (loginRes) => {
							console.log(loginRes)
							if(loginRes.errMsg === "login:ok"){
								this.$http.post('personwx.login/1.0/',{
									code:loginRes.code,
									appid:'wx6d2818e2adb8d93a',
									avatarUrl:userInfo.avatarUrl,
									city:userInfo.city,
									country:userInfo.country,
									gender:userInfo.gender,
									language:userInfo.language,
									nickName:userInfo.nickName,
									province:userInfo.province,
									loginName :userInfo.nickName,
								}).then(res =>{
									console.log('res',res)
									userInfo.openid = this.$utils._get(res,'data.data.openId','')
									userInfo.jwt = this.$utils._get(res,'data.data.jwt','')
									userInfo.loginName = this.$utils._get(res,'data.data.loginName',userInfo.nickName) 
									userInfo.status = this.$utils._get(res,'data.data.status',0)
									userInfo.id = this.$utils._get(res,'data.data.id','')
									let ishead = this.$utils._get(res,'data.data.isHead','')
									this.setIsHead(ishead)
									this.setUserInfo(userInfo)
									uni.setStorageSync('version', '1.1.1');
									this.setRefreshJwt(false)
									uni.switchTab({
										url:'../tabbar/task/task',
									})
									uni.hideLoading();
								})
							}
						}
					})	
				}else{
					uni.showToast({
					    title: '请先授权登录',
					    duration: 2000
					});
				}
				
			}
		}
	}
</script>

<style lang="less" scoped>
.welcom{
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
