<template>
	<view class="a-code">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的激活码</block>
		</cu-custom>
		<view class="code-main">
			<view class="text-lg text-grey text-center padding" style="width: 100%;" v-if="ishead">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/p-compute.png" mode="aspectFit" style="width: 100%"></image>
				已激活
			</view>
			<template v-else>
				<input placeholder="请输入激活码" class="text-center code-input" v-model="code"></input>
				<button class="cu-btn round bg-gradual-blue lg block" @tap="activation" style="width: 80%;margin:50rpx auto 20rpx;">激活</button>
			</template>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				code:""
			};
		},
		computed:{
			...mapGetters(['id','user_role']),
			ishead(){
				return this.user_role == 'head'
			}
		},
		methods:{
			activation(){
				if(this.code == ''){
					uni.showToast({
					    title: '激活码不能为空',
					    duration: 2000,
						icon:'none',
					});
				}
				this.$http.post('personwx.activecode/1.0/',{
					pid:this.id,
					code:this.code
				}).then(res =>{
					console.log(res)
					if(this.$utils._get(res,'data.data.code','') == '1'){
						uni.showToast({
						    title: this.$utils._get(res,'data.data.msg',''),
						    duration: 2000,
							icon:'none',
						});
						return 
					}else if(this.$utils._get(res,'data.data.code','') == '0'){
						let ishead = this.$utils._get(res,'data.data.data.head','')
						this.$store.commit('setIsHead',ishead)
						this.$store.commit('set_isHead_res',ishead)
						uni.$emit('refreshJwt')
						uni.showToast({
						    title: '激活成功',
						    duration: 2000,
							icon:'success',
							success() {
								uni.navigateBack({
								    delta: 1
								});
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.a-code{
	}
	.code-main{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
	}
	.code-input{
		height: 100rpx;
		line-height: 100rpx;
		width: 80%;
		display: block;
		border-radius: 50rpx;
		margin: 200rpx 0 50rpx;
		box-shadow: 0 0 60upx 0 rgba(43, 86, 112, 0.1);
	}
</style>
