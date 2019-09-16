<template>
	<view class="layout-scroll">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个人中心</block>
		</cu-custom>
		<view class="UCenter-bg bg-gradual-blue">
			<!-- <image src="../../../static/login.png" class="png" mode="widthFix"></image> -->
			<view class="cu-avatar xl round" style="background-image:url(../../../static/login.png);"></view>
			<view class="text-xl margin-top-sm">
				王xx
				<!-- <text class="text-df">v2.0</text> -->
			</view>
			<view class="margin-top-sm">
				<text class="cuIcon-locationfill margin-right-xs"></text>
				<text>深圳市龙华区</text>
			</view>
			<view class="margin-top-sm"></view>
			<!-- <image src="https://image.weilanwl.com/gif/wave.gif" mode="scaleToFill" class="gif-wave"></image> -->
		</view>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-orange">{{ taskCount }}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-repairfill margin-right-xs"></text>
					参与任务数
				</view>
			</view>
			<view class="flex flex-sub flex-direction solid-right">
				<view class="text-xxl text-blue">{{ tiemCount }}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-timefill margin-right-xs"></text>
					累计工时
				</view>
			</view>
			<view class="flex flex-sub flex-direction">
				<view class="text-xxl text-green">{{ starCount }}</view>
				<view class="margin-top-sm">
					<text class="cuIcon-favorfill margin-right-xs"></text>
					累计五星次数
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="scrollPage">
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/tabbar/my/myInfo/myInfo" hover-class="none">
						<text class="cuIcon-myfill text-purple"></text>
						<text class="text-grey">我的基本信息</text>
					</navigator>
				</view>
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/tabbar/my/myMsg/myMsg" hover-class="none">
						<text class="cuIcon-commentfill text-blue"></text>
						<text class="text-grey">我的消息</text>
					</navigator>
				</view>
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/tabbar/my/bindPhone/bindPhone" hover-class="none">
						<text class="cuIcon-mobilefill text-green"></text>
						<text class="text-grey">绑定手机</text>
					</navigator>
				</view>
				<view class="cu-item arrow">
					<view class="content" bindtap="showQrcode">
						<text class="cuIcon-questionfill text-red"></text>
						<text class="text-grey">问题反馈</text>
					</view>
				</view>
				<view class="cu-item arrow">
					<navigator class="content" url="/pages/login/login" hover-class="none">
						<text class="cuIcon-exit text-pink"></text>
						<text class="text-grey">退出</text>
					</navigator>
				</view>
			</view>
			<!-- <view class="cu-tabbar-height"></view> -->
		</scroll-view>
	</view>
</template>

<script>
let i = 0;
export default {
	data() {
		return {
			taskCount: '',
			tiemCount: '',
			starCount: ''
		};
	},
	onLoad() {
		this.numDH();
	},
	methods: {
		numDH() {
			if (i < 20) {
				setTimeout(() => {
					this.taskCount = i;
					this.tiemCount = i;
					this.starCount = i;
					i++;
					this.numDH();
				}, 20);
			} else {
				this.taskCount = this.coutNum(1000);
				this.tiemCount = this.coutNum(2000);
				this.starCount = this.coutNum(300);
			}
		},
		coutNum(e) {
			if (e > 1000 && e < 10000) {
				e = (e / 1000).toFixed(1) + 'k';
			}
			if (e > 10000) {
				e = (e / 10000).toFixed(1) + 'W';
			}
			return e;
		}
	}
};
</script>

<style scoped lang="less">
.UCenter-bg {
	// background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
	// background-size: cover;
	height: 400upx;
	display: flex;
	justify-content: center;
	overflow: hidden;
	position: relative;
	flex-direction: column;
	align-items: center;
	color: #fff;
	font-weight: 300;
	text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	flex: 0 0 auto;
}

.UCenter-bg text {
	// opacity: 0.8;
}

.UCenter-bg image {
	width: 200upx;
	height: 200upx;
}
.layout-scroll{
	display:flex;
	flex-direction:column;
	height:100%;
	.scrollPage{
		height: 100%;
		flex: 1 1 auto;
	}
}

</style>
