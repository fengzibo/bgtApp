<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">添加团队</block>
		</cu-custom>
		<scroll-view scroll-y class="scrollPage">
			<form @submit="formSubmit">
				<view class="cu-form-group padding-xl flex justify-center">
					<avatar selWidth="400upx" selHeight="400upx" @upload="myUpload" :avatarSrc="form_data.url" avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;">
						<text class="cuIcon-add" style="font-size: 80upx;"></text>
						团队头像
					</avatar>
				</view>
		
				<view class="cu-form-group margin-top">
					<view class="title">团队名称</view>
					<input placeholder="请输入团队名称" name="name" :value="form_data.name"></input>
					<!-- <text class='cuIcon-right text-gray'></text> -->
				</view>
				<view class="cu-form-group">
					<view class="title">团队简介</view>
					<textarea maxlength="-1"  name="addr" placeholder="请输入团队简介" auto-height :value="form_data.intro"></textarea>
				</view>
				<view class="cu-form-group">
					<view class="title">团队位置</view>
					<textarea maxlength="-1"  name="addr" placeholder="请输入居住地址" auto-height :value="form_data.addr"></textarea>
				</view>
				<view class="padding-lg">
					<button class="cu-btn block  bg-gradual-blue margin-tb-sm lg" :loading="save_loading" formType="submit">保存</button>
				</view>
			</form>
		</scroll-view>
	</view>
</template>

<script>
	import avatar from '../../../../components/yq-avatar/yq-avatar.vue';
	export default {
		data() {
			return {
				form_data:{
					url:'',
					name:'',
					intro:'',
					addr:'',
				},
				save_loading:false,
			};
		},
		components: {
			avatar
		},
		methods:{
			myUpload(rsp) {
				console.log(rsp)
				this.form_data.url = rsp.path; //更新头像方式一
				//rsp.avatar.imgSrc = rsp.path; //更新头像方式二
			},
			formSubmit(e) {
				console.log(e)
				if(this.save_loading){
					return
				}
				this.save_loading = true
				setTimeout(() =>{
					
					uni.showToast({
						title:'保存成功',
						icon: 'success',
						position: 'bottom',
						success: () => {
							this.save_loading = false
							this.$store.commit('setHasTeam',true)
							// uni.hideToast();
							uni.navigateBack();
						}
					});
				},500)
			},
		}
	}
</script>

<style lang="less">

</style>
