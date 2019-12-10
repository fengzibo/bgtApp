<template>
	<view class="subscribe">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订阅</block>
		</cu-custom>
		<view class="code-main">
			<view class="text-lg text-grey text-center padding" style="width: 100%;" >
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-xh.png" mode="aspectFit" style="width: 100%"></image>
			</view>
			<view class="text-orange text-center text-lg" style="padding: 0 30rpx;">
				<text v-if="is_subscribe">已开启订阅，您的工作消息将第一时间抵达</text>
				<text v-if="!is_subscribe">开启订阅将更利于接收任务，不错过每一个任务</text>
			</view>
			<view class="padding" v-if="!is_subscribe">
				<button class="cu-btn block bg-gradual-blue lg" @tap="showRsm">订阅</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				tmplIds: ['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps', '9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'],
			}
		},
		computed:{
			...mapState(['user_info', 'is_subscribe']),
			...mapGetters(['openId']),
		},
		methods: {
			showRsm() {
				wx.requestSubscribeMessage({
					tmplIds: this.tmplIds,
					success: res => {
						console.log(res);
						if (res['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps'] === 'accept' || res['9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'] === 'accept') {
							this.$http.post('personwx.openSubscribe/1.0/',{
								openId:this.openId,
								isSubscribe:'1',
							}).then(res =>{
								console.log(res)
								if(this.$utils._get(res,'data.code','') == '0'){
									this.$store.commit('setIsSubscribe', true);
								}
							})
							
						} else {
							this.$http.post('personwx.openSubscribe/1.0/',{
								openId:this.openId,
								isSubscribe:'0',
							}).then(res =>{
								if(this.$utils._get(res,'data.code','') == '0'){
									this.$store.commit('setIsSubscribe', false);
								}
							})
						}
					},
					fail(err) {
						console.log(err);
					}
				});
			},
		}
	}
</script>

<style>

</style>
