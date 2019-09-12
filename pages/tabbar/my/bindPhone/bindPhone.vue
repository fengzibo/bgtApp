<template>
	<scroll-view scroll-y class="scrollPage">
		<form @submit="formSubmit">
				<view class="cu-form-group">
					<view class="title">手机号码</view>
					<input placeholder="请输入手机号" name="phone" :value="form_data.phone"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input placeholder="请输入验证码" name="code" :value="form_data.code"></input>
					<button class='cu-btn bg-green shadow' @tap="get_code">获取验证码</button>
				</view>
				<view class="padding-lg">
					<button class="cu-btn block  bg-gradual-blue margin-tb-sm lg" :loading="save_loading" formType="submit">提交</button>
				</view>
			</form>
		</scroll-view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				form_data:{
					phone:'',
					code:'',
					save_loading:false,
				}
			}
		},
		methods: {
			get_code(){
				
			}
		}
	}
</script>

<style lang="less" scoped>

</style>
