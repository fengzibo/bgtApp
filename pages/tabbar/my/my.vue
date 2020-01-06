<template>
	<view class="layout-scroll">
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">个人中心</block>
		</cu-custom>
		<view>
			<view class="UCenter-bg bg-gradual-blue padding">
				<!-- <image src="../../../static/login.png" class="png" mode="widthFix"></image> -->
				<template v-if="is_login">
					<view class="cu-avatar xl round" :style="{ backgroundImage: avatarUrl }"></view>
					<view class="margin-left">
						<view class="text-xl">
							{{ my_info.name || user_info.loginName }}
						</view>
						<view class="margin-top-sm">
							综合评分：
							<text>{{my_info.rating || 8}}</text>分
						</view>
					</view>
				</template>
				<template v-else>
					<view class="text-center" style="width: 100%;">
						<button class="cu-btn round line-white" @tap="go_login">点击登录</button>
					</view>
					
				</template>
				<!-- <view class="margin-top-sm margin-bottom-sm">
					<text class="cuIcon-locationfill margin-right-xs"></text>
					<text>深圳市龙华区</text>
				</view> -->
				<!-- <sunui-star iconName="cuIcon-favorfill" :disabledStar="true"></sunui-star> -->
			</view>
			<view class="padding flex text-center text-grey bg-white shadow-warp">
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-orange">{{ my_info.proNum || 0  }}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-repairfill margin-right-xs"></text>
						参与任务
					</view>
				</view>
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-blue">{{ my_info.allHours || 0  }}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-timefill margin-right-xs"></text>
						累计工时
					</view>
				</view>
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-green">{{ my_info.allIncome || 0  }}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-rechargefill margin-right-xs"></text>
						累计收益
					</view>
				</view>
				<view class="flex flex-sub flex-direction">
					<view class="text-xxl text-brown">{{ my_info.teamNum || 0}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-group_fill margin-right-xs"></text>
						加入团队
					</view>
				</view>
			</view>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius" v-if="is_login">
				<navigator class="cu-item arrow" :url="my_info_nav">
					<view class="content">
						<text class="cuIcon-myfill text-purple"></text>
						<text class="text-grey">{{ id ? '我的基本信息' : '完善信息' }}</text>
					</view>
				</navigator>

				<navigator class="cu-item arrow" v-if="id" url="/pages/tabbar/my/resume/resume">
					<view class="content">
						<text class="cuIcon-formfill text-pink"></text>
						<text class="text-grey">我的工作履历</text>
					</view>
				</navigator>
				<!-- <navigator class="cu-item arrow" url="/pages/tabbar/my/myMsg/myMsg">
					<view class="content">
						<text class="cuIcon-commentfill text-blue"></text>
						<text class="text-grey">我的消息</text>
					</view>
				</navigator> -->
				<!-- <navigator class="cu-item arrow" url="/pages/tabbar/my/bindPhone/bindPhone">
					<view class="content">
						<text class="cuIcon-mobilefill text-green"></text>
						<text class="text-grey">绑定手机</text>
					</view>
				</navigator> -->
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
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius" v-if="is_login">
				<navigator class="cu-item arrow" url="/pages/tabbar/my/subscribe/subscribe" >
					<view class="content">
						<text class="cuIcon-subscription text-black"></text>
						<text class="text-grey">订阅</text>
					</view>
				</navigator>
				<view class="cu-item" v-if="can_change_role">
					<view class="content">
						<text class="cuIcon-profile text-black"></text>
						<text class="text-grey">切换角色</text>
					</view>
					<view class="action">
						<switch class='switch-role' @change="change_role" :class="role?'checked':''" :checked="role?true:false"></switch>
					</view>
				</view>
				<view class="cu-item arrow" @tap="login_out">
					<view class="content">
						<text class="cuIcon-exit text-black"></text>
						<text class="text-grey">退出登录</text>
					</view>
				</view>
			</view>
			<!-- <view class="cu-tabbar-height"></view> -->
		</view>
	</view>
</template>

<script>
import sunuiStar from '../../../components/sunui-star/sunui-star.vue';
let i = 0;
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			taskCount: '',
			tiemCount: '',
			starCount: '',
			my_info: {},
			role:true,
		};
	},
	onLoad() {
		this.init();
		// this.numDH();
		console.log(this.user_info);
	},
	onShow() {
		console.log('show');
	},
	watch: {
		refresh_num(val) {
			console.log('my_refresh_num', val);
		}
	},
	components: {
		sunuiStar
	},
	computed: {
		...mapState(['user_info', 'refresh_num','isHead_res','isHead','is_login']),
		...mapGetters(['id']),
		avatarUrl() {
			return `url(${this.user_info.avatarUrl})`;
		},
		my_info_nav() {
			if (this.id) {
				return '/pages/tabbar/my/myInfo/myInfo';
			} else {
				return '/pages/tabbar/my/myInfo/createInfo';
			}
		},
		can_change_role(){
			return this.isHead_res == '1'
		}
	},
	methods: {
		init() {
			this.role = this.isHead == '0'?false:true
			if(this.is_login){
				this.get_user_info();
			}
			
		},
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
		},
		login_out() {
			uni.clearStorage();
			this.init()
			this.$store.commit('set_is_login',false)
			uni.navigateTo({
				url: '/pages/welcome/welcome'
			});
		},
		get_user_info() {
			this.$http
				.get('personwx.myinfodetail/1.0/', {
					id: this.id
				})
				.then(res => {
					console.log(res);
					this.my_info = this.$_.get(res,'data.data.personinfo',{})
				});
		},
		go_login(){
			uni.navigateTo({
				url: '/pages/welcome/welcome'
			});
		},
		change_role(e){
			this.role = e.detail.value
			this.$store.commit('setIsHead',this.role?'1':'0')
			uni.$emit('refreshJwt')
			this.init()
		}
	}
};
</script>

<style scoped lang="less">
.UCenter-bg {
	// background-image: url(https://image.weilanwl.com/color2.0/index.jpg);
	// background-size: cover;
	// height: 400upx;
	display: flex;
	overflow: hidden;
	position: relative;
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

.layout-scroll {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.scrollPage {
	flex: 1 1 auto;
	height: 100%;
	overflow: hidden;
}
.switch-role::after {
	content: "包";
}

.switch-role::before {
	content: "技";
}
</style>
