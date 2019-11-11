<template>
	<view class="step-three bg-white">
		<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/t-success.png" mode="aspectFit" style="width: 100%"></image>
		<text class="text-black text-xl text-bold">资料填写完成</text><br>
		<text class="text-gray text-sm padding block">如有需要修改的资料，可以到【我的】页面下对应的菜单下修改！</text><br>
		<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">开始找活干</button>
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
					url:'../../task/task',
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.step-three{
		width: 100%;
		height: 100%;
		text-align: center;
	}
</style>
