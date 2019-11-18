<template>
	<view class="step-one bg-white">
		<template v-if="!has_id_card && !id">
			<view class="text-xl text-black text-center padding-top text-bold">请拍摄或上传身份证正面照</view>
			<view class="upload-main">
				<view class="upload-box bg-black">
					<block v-if="imageSrc"><image :src="imageSrc" class="image" mode="widthFix"></image></block>
					<view class="upload-button text-sl" @tap="chooseImage">
						<text class="text-gray cuIcon-camera"></text>
						<text class="text-df" style="display: block;">{{imageSrc?'重新上传':'身份证正面'}}</text>
					</view>
				</view>
			</view>
			<view class="text-center identify-btn"><button class="cu-btn block bg-blue lg" @tap="identifyCard">开始识别身份证</button></view>
		</template>
		<view v-else class="form-bg">
			<form @submit="formSubmit" >
				<!-- <view class="top-tips bg-gradual-orange text-white">
					请确认信息，并填写正确的手机号码
				</view> -->
				<view class="cu-form-group">
					<view class="title">姓名</view>
					<input disabled class="text-right" placeholder="请输入姓名"  name="name" v-model="form_data.name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">性别</view>
					<picker @change="PickerChange" :value="sex_index" :range="picker"  name="sex" disabled>
						<view class="picker">
							{{form_data.sex}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">出生年月日</view>
					<picker mode="date" v-model="form_data.date_birth"  @change="validDateChange" disabled>
						<view class="picker">{{ form_data.date_birth }}</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">身份证号码</view>
					<input class="text-right" placeholder="请输入身份证号码" name="id_card" v-model="form_data.id_card" disabled></input>
				</view>
				<view class="cu-form-group">
					<view class="title">居住地址</view>
					<textarea class="text-right" maxlength="-1"  name="addr" placeholder="请输入居住地址" auto-height  v-model="form_data.addr" disabled></textarea>
				</view>
				<view class="cu-form-group margin-top">
					<view class="title">手机号码</view>
					<input placeholder="请输入手机号码" class="text-right" name="phone" v-model="form_data.phone" :disabled="has_res"></input>
				</view>
				<!-- <button class="cu-btn round bg-gradual-blue lg block" @tap="next" style="width: 80%;margin:50rpx auto 20rpx;" v-if="has_res">保存</button> -->
				<view class="footer-tool bg-white" v-if="!has_res">
					<button class="cu-btn round bg-blue">取消</button>
					<button class="cu-btn round bg-blue" @tap="next">下一步</button>
				</view>
			</form>
		</view>
		<view class="cu-modal" :class="progress_model?'show':''">
			<view class="cu-dialog" style="background-color: transparent;">
				<view class="cu-progress round striped active">
					<view class="bg-green" :style="[{ width:progress+'%'}]">{{progress}}%</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let u_data = null
import { mapState,mapGetters } from 'vuex';
export default {
	props: {
		res: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			imageSrc: '',
			has_id_card:false,
			form_data:{
				name:'',
				sex:'',
				date_birth:'',
				id_card:'',
				addr:'',
				phone:''
			},
			picker: ['男', '女'],
			sex_index:0,
			progress_model:false,
			progress:0
		};
	},
	computed: {
		...mapState(['user_info']),
		...mapGetters(['id']),
		has_res(){
			return JSON.stringify(this.res) !== "{}" 
		}
	},
	mounted() {
		if(this.has_res){
			console.log(this.res)
			this.form_data.name = this.res.name
			this.form_data.sex = this.res.sex
			this.form_data.id_card = this.res.idNumber
			this.form_data.addr = this.res.address
			this.form_data.phone = this.res.phone
			this.form_data.date_birth = this.$utils.format_date(this.res.birthday)
		}
	},
	methods: {
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				// sourceType: ['album'],
				success: res => {
					console.log('chooseImage success, temp path is', res);
					var imageSrc = res.tempFilePaths[0];
					
					this.imageSrc = imageSrc;
					
				},
				fail: err => {
					console.log('chooseImage fail', err);
				}
			});
		},
		identifyCard(){
			if(this.imageSrc == ''){
				uni.showToast({
				    title: '请拍摄或上传身份证',
				    duration: 2000,
					icon:'none',
				});
				return
			}
			this.progress_model = true
			// return
			// console.log(u_data)
			const uploadTask = uni.uploadFile({
				url: this.$api_url+'personwx.idcardocr/1.0/',
				filePath: this.imageSrc,
				// fileType: 'image',
				name: 'idcard',
				header:{
					"Content-Type": "application/x-www-form-urlencoded",
				},
				success: res => {
					console.log('uploadImage success, res is:', res);
					let json_res = JSON.parse(res.data)
					if(json_res.code == '1'){
						this.progress_model = false
						uni.showToast({
							title: json_res.msg,
							icon: 'none',
							duration: 3000
						});
						return 
					}
					u_data = json_res.data
					console.log(u_data)
					this.form_data.name = u_data.name
					this.form_data.sex = u_data.sex
					this.form_data.date_birth = this.$utils.format_date(u_data.birthday)
					this.form_data.id_card = u_data.idNumber
					this.form_data.addr = u_data.address
					this.has_id_card = true
					this.progress_model = false
					uni.showToast({
						title: '识别成功',
						icon: 'success',
						duration: 1000
					});
					this.$emit('showTips','请确认信息，并填写正确的手机号码')
				},
				fail: err => {
					console.log('uploadImage fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
					this.progress_model = false
				}
			});
			uploadTask.onProgressUpdate((res) => {
				console.log('上传进度' + res.progress);
				console.log('已经上传的数据长度' + res.totalBytesSent);
				console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				let progress = res.progress
				if(progress == 100){
					progress = 99
				}
				this.progress = progress
				// 测试条件，取消上传任务。
				// if (res.progress > 50) {
				// 	uploadTask.abort();
				// }
			});
		},
		PickerChange(e){
			this.sex_index = e.detail.value
			this.form_data.sex = this.picker[this.sex_index]
		},
		validDateChange(e) {
			this.form_data.date_birth = e.detail.value;
		},
		next(){
			console.log(this.form_data)
			uni.showLoading({
			    title: '提交中'
			});
			let url = 'personwx.basicinfo/1.0/',
				data = {
					pname:this.form_data.name,
					sex:this.form_data.sex,
					birthday:this.form_data.date_birth,
					nation:this.has_res?this.res.nation:u_data.nation,
					address:this.form_data.addr,
					idNumber:this.form_data.id_card,
					phone:this.form_data.phone
				}
			if(this.has_res){
				url = 'personwx.basicwork/1.0/'
				data.id = this.id
			}
			this.$http.post(url,data).then(res =>{
				console.log(res)
				// if(this.has_res){
				// 	return 
				// }
				if(res.data.code == '0'){
					let uinfo = JSON.parse(JSON.stringify(this.user_info))
					uinfo.id = this.$utils._get(res,'data.data.data.data.pid','')
					uinfo.loginName = this.$utils._get(this.form_data,'name',uinfo.nickName)
					this.$store.commit('setUserInfo',uinfo)
					uni.hideLoading()
					if(this.has_res){
						uni.navigateBack({
						    delta: 1
						});
					}
					this.$emit('next')
					this.$emit('showTips','更完整的工作信息将会给您带来更多的工作机会')
				}
			})
			
		}
	}
};
</script>

<style lang="less" scoped>
.step-one {
	width: 100%;
	height: 100%;
}
.form-bg{
	width: 100%;
	height: 100%;
	padding-bottom: 120rpx;
	background-color: #F1F1F1;
}
.upload-main {
	padding: 30rpx 80rpx;
}
.upload-box {
	width: 100%;
	height: 384rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
	background: url(https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/id-card-bg.png) no-repeat center center;
	background-size: cover;
	.image {
		width: 100%;
	}
	.upload-button {
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
}
.identify-btn {
	padding: 30rpx 80rpx;
}
.top-tips{
	width: 100%;
	height: 56rpx;
	line-height: 56rpx;
	text-align: center;
	
}

.footer-tool {
	position: fixed;
	bottom: 0;
	left: 0;
	height: 120rpx;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
</style>
