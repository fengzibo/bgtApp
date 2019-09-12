<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header"><image src="../../static/login.png"></image></view>
			<!-- 主体表单 -->
			<view class="main">
				<lInput v-model="phoneData" type="text" maxlength="11" placeholder="请输入用户名/电话"></lInput>
				<lInput v-model="passData" type="password" maxlength="11" placeholder="请输入密码" isShowPass></lInput>
			</view>
			<lButton text="登 录" :rotate="isRotate" @click.native="startLogin()"></lButton>

			<!-- 其他登录 -->
			<view class="other_login cuIcon">
				<view class="login_icon"><view class="cuIcon-weixin" @tap="login_weixin"></view></view>
			</view>

			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import lInput from '../../components/login-comp/login-input.vue'; //input
import lButton from '../../components/login-comp/login-button.vue'; //button
export default {
	data() {
		return {
			phoneData: '', //用户/电话
			passData: '', //密码
			isRotate: false, //是否加载旋转
			logoImage: ''
		};
	},
	components: {
		lInput,
		lButton
	},
	methods: {
		startLogin() {
			//登录
			if (this.isRotate) {
				//判断是否加载中，避免重复点击请求
				return false;
			}
			if (this.phoneData.length == '') {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '用户名不能为空'
				});
				return;
			}
			if (this.passData.length == '') {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '密码不能为空'
				});
				return;
			} else if (this.passData.length < 6) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '密码最少为6位'
				});
				return;
			}

			console.log('登录成功');

			this.isRotate = true;
			setTimeout(() => {
				uni.showToast({
					title:'登录成功',
					icon: 'success',
					position: 'bottom',
					success: () => {
						uni.switchTab({
							url:'../tabbar/task/task',
							complete: () => {
								this.isRotate = false;
							}
						})
					}
				});
				
			}, 3000);
		},
		login_weixin() {
			//微信登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '微信登录'
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('./css/main.css');
</style>
