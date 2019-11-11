<template>
	<view class="setp-four">
		<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/success.png" mode="aspectFit" style="width: 100%"></image>
		<text class="text-orange text-xl">任务创建完成</text><br>
		<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">转到工作界面</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		computed:{
		},
		methods: {
			goto_work(){
				uni.switchTab({
					url:'../../workbench/workbench',
					
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.setp-four{
		width: 100%;
		padding: 30rpx;
		text-align: center;
	}
</style>
