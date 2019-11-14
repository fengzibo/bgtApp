<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">我的团队</block>
		</cu-custom>
		<view class="work-hours">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/WechatIMG79.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">建设中</text><br>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less" scoped>
.work-hours{
	width: 100%;
	padding: 30rpx;
	text-align: center;
}
</style>
