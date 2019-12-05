<template>
	<view class="layout-scroll">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">个人中心</block>
		</cu-custom>
		<view>
			<view class="UCenter-bg bg-gradual-blue">
				<!-- <image src="../../../static/login.png" class="png" mode="widthFix"></image> -->
				<view class="cu-avatar xl round" :style="{backgroundImage:avatarUrl}"></view>
				<view class="text-xl margin-top-sm">
					{{user_info.nickName}}
					<!-- <text class="text-df">v2.0</text> -->
				</view>
				<view class="margin-top-sm margin-bottom-sm">
					<text class="cuIcon-locationfill margin-right-xs"></text>
					<text>深圳市龙华区</text>
				</view>
				<sunui-star iconName="cuIcon-favorfill" :disabledStar="true"></sunui-star>
				
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
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<navigator class="cu-item arrow" :url="my_info_nav">
					<view class="content">
						<text class="cuIcon-myfill text-purple"></text>
						<text class="text-grey">{{id?'我的基本信息':'完善信息'}}</text>
					</view>
				</navigator>
				
				<navigator class="cu-item arrow" v-if="id"  url="/pages/tabbar/my/resume/resume">
					<view class="content">
						<text class="cuIcon-formfill text-pink"></text>
						<text class="text-grey">我的工作履历</text>
					</view>
				</navigator>
				<navigator class="cu-item arrow" url="/pages/tabbar/my/myMsg/myMsg">
					<view class="content">
						<text class="cuIcon-commentfill text-blue"></text>
						<text class="text-grey">我的消息</text>
					</view>
				</navigator>
				<navigator class="cu-item arrow" url="/pages/tabbar/my/bindPhone/bindPhone">
					<view class="content">
						<text class="cuIcon-mobilefill text-green"></text>
						<text class="text-grey">绑定手机</text>
					</view>
				</navigator>
				<navigator class="cu-item arrow" url="/pages/tabbar/my/aCode/aCode">
					<view class="content">
						<text class="cuIcon-qr_code text-black"></text>
						<text class="text-grey">我的激活码</text>
					</view>
				</navigator>
				
				<!-- <navigator class="cu-item arrow">
					<view class="content" bindtap="showQrcode">
						<text class="cuIcon-questionfill text-red"></text>
						<text class="text-grey">问题反馈</text>
					</view>
				</navigator> -->
				<!-- <navigator class="cu-item arrow" url="/pages/login/login">
					<view class="content">
						<text class="cuIcon-exit text-pink"></text>
						<text class="text-grey">退出</text>
					</view>
				</navigator> -->
			</view>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<navigator class="cu-item arrow" url="/pages/welcome/welcome">
					<view class="content">
						<text class="cuIcon-exit text-black"></text>
						<text class="text-grey">退出登录</text>
					</view>
				</navigator>
			</view>
			<!-- <view class="cu-tabbar-height"></view> -->
		</view>
	</view>
</template>

<script>
import sunuiStar from '../../../components/sunui-star/sunui-star.vue'
let i = 0;
import { mapState,mapGetters } from 'vuex';
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
		console.log(this.user_info)
	},
	onShow(){
		console.log('show')
	},
	watch:{
		refresh_num(val){
			console.log('my_refresh_num',val)
		}
	},
	components:{
		sunuiStar
	},
	computed:{
		...mapState(['user_info','refresh_num']),
		...mapGetters(['id']),
		avatarUrl(){
			return `url(${this.user_info.avatarUrl})`
		},
		my_info_nav(){
			if(this.id){
				return '/pages/tabbar/my/myInfo/myInfo'
			}else{
				return '/pages/tabbar/my/myInfo/createInfo'
			}
		}
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
	display: flex;
	flex-direction: column;
	height: 100%;
}
.scrollPage{
	flex:1 1 auto;
	height: 100%;
	overflow: hidden;
}
</style>
