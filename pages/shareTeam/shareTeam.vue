<template>
	<view class="share-content bg-gradual-blue">
		<cu-custom :isBack="true" class="text-white">
			<block slot="backText" class="text-white">返回</block>
			<block slot="content" class="text-white">分享团队</block>
		</cu-custom>
		<view class="share-main">
			<view class="ewm-box shadow-blur bg-white">
				<view class="qrimg"><tki-qrcode ref="qrcode" :val="val" :size="360" :loadMake="true" @result="qrR" /></view>
				<view class="margin-tb">
					微信扫码添加
				</view>
			</view>
			<view class="bottom-tool">
				<view class="button-box">
					<button class="round bg-white cu-btn" open-type="share">
						<text class="cuIcon-weixin lg icon"></text>
					</button>
					<view class="text-sm text-white margin-top-sm">
						微信好友
					</view>
				</view>
				<view class="button-box">
					<button class="round bg-white cu-btn">
						<text class="cuIcon-down lg icon"></text>
					</button>
					<view class="text-sm text-white margin-top-sm">
						保存本地
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
export default {
	data() {
		return {
			team: {},
			val:""
		};
	},
	components: {
		tkiQrcode
	},
	onLoad(option) {
		console.log(option);
		this.team = JSON.parse(decodeURIComponent(option.team));
		this.val = this.$domain + this.team.id
	},
	onShareAppMessage(res) {
		console.log(res)
	    if (res.from === 'button') {// 来自页面内分享按钮
	      console.log(res.target)
	    }
	    return {
	      title: '快来加入我们',
	      path: '/pages/tabbar/team/team',
		  // imageUrl:'../../static/love.png'
	    }
	},
	methods: {
		qrR(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="less" scoped>
	.share-content{
		width: 100%;
		height: 100%;
		// background: url(https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/shareBg.png) no-repeat center center;
		// background-size: cover;
		display: flex;
		flex-direction: column;
		
		.share-main{
			flex: 1;
			padding: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
		.ewm-box{
			width: 100%;
			height: 80%;
			background-color: #FFFFFF;
			padding: 60rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			border-radius: 20rpx;
		}
		.bottom-tool{
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 60rpx;
			width: 100%;
			.button-box{
				text-align: center;
				button{
					width: 96rpx;
					height: 96rpx;
					// &:after{
					// 	border: none;
					// }
					.icon{
						font-size: 36rpx;
					}
				}
			}
		}
	}
</style>
