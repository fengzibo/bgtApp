<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="content">登录过期</block>
		</cu-custom>
		<view class="log-back">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/logBack.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-orange text-xl">登录已过期，请重新登录</text><br>
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="logBack">重新登录</button>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				from_url:''
			};
		},
		onLoad(options){
			let router = getCurrentPages()
			console.log(router)
			let from_route = router[router.length - 2]
			this.from_url = '/'+from_route.route
			let op = from_route.options
			if(JSON.stringify(op) !== '{}'){
				let param = ''
				for (let key in op) {
					param += (key+'='+op[key])
				}
				this.from_url = this.from_url+'?'+param
			}
			
		},
		computed:{
			...mapState(['user_info']),
		},
		methods: {
			logBack(){
				uni.showLoading({
				    title: '登录中'
				});
				let userI = this.user_info
				uni.request({
				    url: this.$api_url+'personwx.refreshJWT/1.0/', 
				    data: {
				        openId:this.$store.getters.openId,
						loginName:userI.loginName,
						city:userI.city,
						country:userI.country,
						gender:userI.gender,
						language:userI.language,
						nickName:userI.nickName,
						province:userI.province,
						avatarUrl:userI.avatarUrl,
				    },
					method:'GET',
				    header: {
				        "Content-Type": "application/x-www-form-urlencoded", //自定义请求头信息
				    },
				    success: (res) => {
				        console.log(res.data);
						let uinfo = this.$store.state.user_info
						uinfo.id = this.$utils._get(res,'data.data.id','')
						uinfo.jwt = this.$utils._get(res,'data.data.jwt','')
						uinfo.openid = this.$utils._get(res,'data.data.openId','')
						uinfo.loginName = this.$utils._get(res,'data.data.loginName',uinfo.nickName)
						uinfo.status = this.$utils._get(res,'data.data.status','0')
						this.$store.commit('setUserInfo',uinfo)
						this.$store.commit('setRefreshJwt',false)
						let ishead = this.$utils._get(res, 'data.data.isHead', '0')
						let isSubscribe = this.$utils._get(res,'data.data.isSubscribe',false)
						this.$store.commit('setIsHead',ishead)
						this.$store.commit('setIsSubscribe',isSubscribe === '1'?true:false)
						uni.hideLoading();
						uni.showToast({
						    title: '登录成功',
						    duration: 2000,
							icon:'none',
							success: () => {
								uni.navigateBack({
								    delta: 1
								});
								uni.$emit('refreshJwt')
							}
						});
						
						// uni.navigateTo({
						// 	url: this.from_url
						// })
				    }
				});
				
			}
		}
	};
</script>

<style lang="less" scoped>
	.log-back{
		width: 100%;
		padding: 30rpx;
		text-align: center;
	}
</style>
