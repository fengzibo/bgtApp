<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">添加团队</block>
		</cu-custom>
		<scroll-view scroll-y class="scrollPage">
			<form @submit="formSubmit">
				<view class="cu-form-group padding-xl flex justify-center">
					<!-- <avatar selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="form_data.url" avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;">
						<text class="cuIcon-add" style="font-size: 80upx;"></text>
						团队头像
					</avatar> -->
					<view class="flex justify-center align-center flex-direction solid" hover-class="globalHover" style="width: 200upx; height: 200upx; border-radius: 100%;" @tap="selectAvatar">
						<image :src="form_data.url" mode="aspectFill" v-if="form_data.url" style="border-radius: 100%;"></image>
						<template v-else>
							<text class="cuIcon-add" style="font-size: 80upx;"></text>
							团队头像
						</template>
					</view>
					
				</view>
		
				<view class="cu-form-group margin-top">
					<view class="title">团队名称</view>
					<input class="text-right" placeholder="请输入团队名称" name="name" v-model="form_data.name"></input>
					<!-- <text class='cuIcon-right text-gray'></text> -->
				</view>
				<view class="cu-form-group">
					<view class="title">团队性质</view>
					<view class="action">
						<radio-group @change="radioChange" >
							<label class="radio margin-right"><radio value="0" :checked="form_data.type == '0'" /><text style="margin-left:10rpx">个人</text></label>
							<label class="radio"><radio value="1" :checked="form_data.type == '1'"/><text style="margin-left:10rpx">公司</text></label>
						</radio-group>
					</view>
				</view>
				<view class="cu-form-group" v-if="form_data.type == '1'">
					<view class="title">公司名称</view>
					<input class="text-right" placeholder="请输入公司名称" name="name" v-model="company_name"></input>
				</view>
				<view class="cu-form-group" v-if="form_data.type == '1'">
					<view class="title">是否可分享</view>
					<switch @change="shareChange" :class="form_data.is_share =='1'?'checked':''" :checked="form_data.is_share == '1'"></switch>
				</view>
				
				<view class="cu-form-group">
					<view class="title">团队简介</view>
					<textarea class="text-right" maxlength="-1"  name="intro" placeholder="请输入团队简介" auto-height v-model="form_data.intro" ></textarea>
				</view>
				<view class="cu-form-group">
					<view class="title">团队位置</view>
					<!-- <textarea maxlength="-1"  name="addr" placeholder="请输入团队地址" auto-height v-model="form_data.addr"></textarea> -->
					<picker mode="region" @change="addrChange" :value="addr_region">
						<view class="picker">
							{{addr_region[0]}}，{{addr_region[1]}}，{{addr_region[2]}}
						</view>
					</picker>
				</view>
				
				<view class="padding-lg">
					<button class="cu-btn block  bg-gradual-blue margin-tb-sm lg" :loading="save_loading" formType="submit">保存</button>
				</view>
			</form>
		</scroll-view>
		<avatar ref="avatar" @upload="avatarUpload"></avatar>
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
					type:'0',
					is_share:'1'
				},
				save_loading:false,
				team:{},
				is_upload:false,
				addr_region:['浙江省','杭州市','西湖区'],
				company_name:'',
			};
		},
		components: {
			avatar
		},
		onLoad(option) {
			console.log(option)
			try{
				this.team = JSON.parse(decodeURIComponent(option.team));
				if(JSON.stringify(this.team) !== '{}'){
					this.init()
				}
			}catch(e){
				//TODO handle the exception
			}
			
		},
		methods:{
			init(){
				
				this.form_data.url= this.team.logo
				this.form_data.name = this.team.tname
				this.form_data.intro = this.team.profile
				this.form_data.addr = this.team.location
				this.form_data.is_share = this.team.isShare
				this.form_data.type = this.team.type
				this.company_name = this.$utils._get(this.team,'companyName','')
				try{
					let addr = JSON.parse(this.form_data.addr)
					this.addr_region = addr
				}catch(e){
					//TODO handle the exception
					this.addr_region = ['请选择省','市','区']
				}
				console.log('form_data')
			},
			avatarUpload(rsp) {
				console.log(rsp)
				this.form_data.url = rsp.path;
				this.is_upload = true
			},
			formSubmit(e) {
				console.log(e)
				if(this.save_loading){
					return
				}
				if(this.form_data.url == ''){
					uni.showToast({
					    title: '请上传头像',
					    duration: 2000
					})
					return 
				}else if(this.form_data.name == ''){
					uni.showToast({
					    title: '请输入团队名称',
					    duration: 2000
					})
					return 
				}else if(this.form_data.intro == ''){
					uni.showToast({
					    title: '请输入团队简介',
					    duration: 2000
					})
					return
				}else if(this.form_data.addr == ''){
					uni.showToast({
					    title: '请输入团队位置',
					    duration: 2000
					})
					return
				}else if(this.form_data.type == '1'){
					if(this.company_name == ''){
						uni.showToast({
						    title: '请输入公司名称',
						    duration: 2000
						})
						return
					}
					
				}
				this.save_loading = true
				if(this.is_upload){
					uni.uploadFile({
						url: this.$api_url+'personwx.uploadteamfile/1.0/',
						filePath: this.form_data.url,
						// fileType: 'image',
						name: 'tlogo',
						header:{
							"Content-Type": "application/x-www-form-urlencoded",
							"Authorization":'Bearer '+this.$store.getters.jwt,
						},
						formData:{
							loginName:this.$utils._get(this.$store,'state.user_info.loginName',''),
							loginUserId:this.$utils._get(this.$store,'state.user_info.id',''),
						},
						success: res => {
							
							let data = JSON.parse(res.data)
							console.log('uploadImage success, res is:', data);
							this.form_data.url =this.$domain + this.$utils._get(data,'logo','')
							this.save()
						},
						fail: err => {
							console.log('uploadImage fail', err);
							uni.showModal({
								content: err.errMsg,
								showCancel: false
							});
						},
						complete:() =>{
							// uni.hideLoading();
							this.save_loading = false
						}
					});
				}else{
					this.save()
				}
			},
			save(){
				let pamars={
					profile:this.form_data.intro,
					location:this.form_data.addr,
					id:this.$utils._get(this.team,'id',''),
					type:this.form_data.type,
					logo:this.form_data.url,
					tname:this.form_data.name
				}
				if(this.form_data.type == '1'){
					pamars.isShare = this.form_data.is_share,
					pamars.companyName = this.company_name
				}
				this.$http.post('personwx.saveorupdateteam/1.0/',pamars).then(res =>{
					uni.showToast({
						title:'保存成功',
						icon: 'success',
						position: 'bottom',
						success: () => {
							this.$store.commit('setHasTeam',true)
							// uni.hideToast();
							uni.$emit('refteam')
							uni.navigateBack();
						}
					});
				}).finally(() =>{
					this.save_loading = false
				})
			},
			selectAvatar(){
				this.$refs.avatar.fChooseImg(0,{
				    selWidth: "300upx", selHeight: "300upx",
				    expWidth: '260upx', expHeight: '260upx'
				});
				
			},
			addrChange(e){
				this.addr_region = e.detail.value
				this.form_data.addr = JSON.stringify(e.detail.value)
			},
			radioChange(e){
				this.form_data.type = e.target.value
			},
			shareChange(e){
				console.log(e)
				this.form_data.is_share = e.target.value?'1':'0'
			}
		}
	}
</script>

<style lang="less">

</style>
