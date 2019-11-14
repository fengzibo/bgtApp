<template>
	<view class="step-two">
		<!-- <view class="top-tips bg-gradual-orange text-white">
			更完整的工作信息将会给您带来更多的工作机会
		</view> -->
		<view class="load-progress" :class="loading?'show':'hide'" :style="[{top:CustomBar+'px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
		<view class="main" v-if="!loading">
			<view class="block-title text-lg">
				基本信息
			</view>
			<view class="bg-white skills-card">
				<view class="cu-form-group">
					<view class="title">学历</view>
					<input placeholder="请输入学历" name="education" v-model="form_data.education"></input>
				</view>
				
				<view class="cu-form-group">
					<view class="title">工作年限</view>
					<input placeholder="请输入工作年限" name="limit" v-model="form_data.limit"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">技工类型</view>
					<picker mode="multiSelector" @change="typeChange" @columnchange="MultitypeChange" :value="type_index" :range="type_picker" range-key="typeName">
						<view class="picker">
							{{type_picker[0][type_index[0]].typeName}}，{{type_picker[1][type_index[1]].typeName}}
						</view>
					</picker>
					<!-- <view class="picker-box">
						<picker @change="typeChange" :value="type_index" :range="type_picker" range-key="typeName"  name="type">
							<view class="picker">
								{{form_data.type}}
							</view>
						</picker>
					</view>
					<view class="picker-box">
						<picker @change="typeLevelChange" :value="type_level" :range="type_level_pick"  name="typeLevel">
							<view class="picker">
								{{form_data.typeLevel}}
							</view>
						</picker>
					</view> -->
				</view>
				<view class="cu-form-group">
					<view class="title">期望工作地</view>
					<input placeholder="请输入期望工作地" name="addr" v-model="form_data.addr"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">现居地址</view>
					<input placeholder="请输入现居地址" name="homeAddress" v-model="form_data.homeAddress"></input>
				</view>
			</view>
			<view class="block-title text-lg">
				证件信息
			</view>
			<view class="bg-white skills-card grid col-3">
				<view class="radius padding-sm text-center certificate" v-for="item in card_list" :key="item.id">
					<image :src="'https://zzy-wx.mynatapp.cc'+item.filePath" mode="aspectFill" style="width: 100%; height: 140rpx;background-color: #eeeeee;"></image>
					<text class="text-grey text-df margin-top-sm">{{item.fileName}}</text>
					<view class="remove bg-red text-lg" @tap="removeCard(item)">
						<text class="text-white cuIcon-close"></text>
					</view>
				</view>
				<view class="radius padding-sm text-center certificate">
					<view class="add-box text-sl" @tap="certificate_model=!certificate_model">
						<text class="text-blue cuIcon-roundadd"></text>
					</view>
					
				</view>
			</view>
			<view class="block-title text-lg">
				最近工作信息
			</view>
			<view class="bg-white skills-card experience-box">
				<view class="experience-item" v-for="item in work_list" :key="item.id">
					<view class="flex justify-between align-center">
						<text class="text-blue text-df text-bold">{{item.scompany}}</text>
						<view class="text-lg"  @tap="edit_work(item)">
							<text class="text-blue lg cuIcon-write"></text>
						</view>
					</view>
					<view class="flex justify-between align-center margin-tb">
						<text class="text-black">{{item.deviceName}}</text>
						<text class="text-black">{{get_typeLevel_text(item)}}<text class="text-red margin-left">{{item.wages}}</text></text>
					</view>
					<view class="flex justify-between align-center text-sm text-gray">
						<text class="text-black"><text class="text-grey cuIcon-locationfill margin-right-xs"></text>深圳市龙华区大浪</text>
						<text class="text-black">{{get_work_time(item)}}</text>
					</view>
				</view>
				<view class="add-experience text-blue text-lg" @tap="addExper">
					<text class="cuIcon-add margin-right xl"></text>
					添加工作经历
				</view>
			</view>
		</view>
		<view class="footer-tool bg-white margin-top" v-if="!loading">
			<template v-if="has_res">
				<button class="cu-btn lg  round bg-gradual-blue block" @tap="next('save')">保存</button>
			</template>
			<template v-else>
				<button class="cu-btn round bg-blue" @tap="prev">稍后完善</button>
				<button class="cu-btn round bg-blue" @tap="next">下一步</button>
			</template>
		</view>
		<view class="cu-modal" :class="certificate_model?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">上传证件</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="text-left bg-white">
					<view class="cu-form-group">
						<view class="title">证件名称</view>
						<input placeholder="请输入证件名称" name="name" v-model="certificate_data.name"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">证件有限期</view>
						<!-- <input placeholder="请输入证件有限期" name="deadline" v-model="certificate_data.deadline"></input> -->
						<picker mode="date" v-model="certificate_data.deadline"  @change="deadlineChange">
							<view class="picker">{{ certificate_data.deadline }}</view>
						</picker>
					</view>
					<view class="cu-form-group align-start">
						<view class="title">证件</view>
						<view class="img-form-box">
							<image :src="certificate_upload_src" class="cer-img" mode="aspectFill" v-if="certificate_upload_src"></image>
							<view class="upload-box text-sl bg-gray" @tap="chooseImage" :class="certificate_upload_src?'has-img':''">
								<text class="cuIcon-add text-blue"></text>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-grey solid-left" @tap="hideModal">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="submit_cert">确定</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="exper_model?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">添加工作经验</view>
					<view class="action" @tap="hideExperModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="text-left bg-white">
					<view class="cu-form-group">
						<view class="title">服务公司</view>
						<input placeholder="请输入服务公司" name="company" v-model="exper_data.company"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">设备类型</view>
						<input placeholder="请输入设备类型" name="equipment" v-model="exper_data.equipment"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">技工类型</view>
						<picker mode="multiSelector" @change="experTypeChange" @columnchange="experMultitypeChange" :value="exper_data.type_index" :range="type_picker_copy" range-key="typeName">
							<view class="picker">
								{{type_picker_copy[0][exper_data.type_index[0]].typeName}}，{{type_picker_copy[1][exper_data.type_index[1]].typeName}}
							</view>
						</picker>
						<!-- <picker @change="experTypeChange" :value="exper_data.type_index" :range="type_picker"  name="type">
							<view class="picker">
								{{exper_data.type}}
							</view>
						</picker> -->
					</view>
					<view class="cu-form-group">
						<view class="title">工价</view>
						<input placeholder="请输入工价" name="equipment" v-model="exper_data.price"></input>
					</view>
					<view class="cu-form-group picker-no-icon">
						<view class="title">服务时间</view>
						<view class="flex-sub">
							<picker mode="date" v-model="exper_data.start_time"  @change="experStartChange">
								<view class="picker">{{ exper_data.start_time }}</view>
							</picker>
						</view>
						<view class="">
							—
						</view>
						<view class="flex-sub">
							<picker mode="date" v-model="exper_data.end_time"  @change="experEndChange">
								<view class="picker">{{ exper_data.end_time }}</view>
							</picker>
						</view>
					</view>
					<view class="cu-form-group" v-if="exper_model">
						<view class="title">服务备注</view>
						<textarea maxlength="-1"  name="remark" placeholder="请输入服务备注" auto-height v-model="exper_data.remark" ></textarea>
					</view>
					<view class="cu-form-group">
						<view class="title">公司地址</view>
						<input placeholder="请输入公司地址" name="addr" v-model="exper_data.addr"></input>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-grey solid-left" @tap="hideExperModal">取消</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="submit_exper">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
			form_data:{
				education:'',
				limit:'',
				addr:'',
				homeAddress:''
			},
			type_index:[0,0],
			type_picker: [],
			type_picker_copy:[],
			type_level:0,
			// type_level_pick:['普工','中工','大工'],
			type_level_data:[],
			certificate_model:false,
			certificate_data:{
				name:'',
				deadline:'YYYY-MM-DD'
			},
			certificate_upload_src:'',
			certificate_upload_file:null,
			exper_model:false,
			exper_data:{
				company:'',
				equipment:'',
				type_index:[0,0],
				type:'钳工',
				price:'',
				start_time:'YYYY-MM-DD',
				end_time:'YYYY-MM-DD',
				remark:'',
				addr:'',
			},
			work_list:[],
			card_list:[],
			loading:true,
			CustomBar: this.CustomBar,
			loadProgress:0,
			exper_edit:false,
			current_exper_id:'',
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
		this.init()
	},
	methods: {
		init(){
			this.get_type_list()
		},
		LoadProgress(e) {
			this.loadProgress = this.loadProgress + 3;
			if (this.loadProgress < 100 && this.loading) {
				setTimeout(() => {
					this.LoadProgress();
				}, 100)
			}
		},
		get_work_list(){
			console.log('getid',this.id)
			this.$http.post('personwx.worklist/1.0/',{
				pid:this.id
			}).then(res =>{
				console.log('work_list',res)
				this.work_list = res.data.data.data
			})
		},
		get_card_list(){
			this.$http.post('personwx.cardfilelist/1.0/',{
				pid:this.id
			}).then(res =>{
				console.log('card_list',res)
				this.card_list = res.data.data.data
			})
		},
		get_type_list(){
			this.type_picker = []
			this.type_level_data = []
			this.loading = true
			this.LoadProgress()
			this.$http.post('personwx.tylelist/1.0/').then(res =>{
				console.log(res)
				let type_picker_arr = []
				res.data.data.data.forEach((item,index) =>{
					if(item.pid == '0'){
						type_picker_arr.push(item)
					}
				})
				this.type_picker.push(type_picker_arr)
				type_picker_arr.forEach(obj =>{
					let arr = []
					res.data.data.data.forEach((item,index) =>{
						if(obj.id == item.pid){
							arr.push(item)
						}
					})
					this.type_level_data.push(arr)
				})
				this.type_picker.push(this.type_level_data[0])
				this.type_picker_copy = JSON.parse(JSON.stringify(this.type_picker)) 
				console.log(this.type_level_data)
				console.log(this)
				this.get_card_list()
				this.get_work_list()
				if(this.has_res){
					this.init_info()
				}
				
				this.loadProgress = 100
				setTimeout(() => {
					this.loading = false
				}, 100)
				
			})
			
			
		},
		init_info(){
			console.log(this.res)
			this.form_data.education = this.res.education
			this.form_data.limit = this.res.workYear
			this.form_data.addr = this.res.expectedPlace
			this.form_data.homeAddress = this.res.homeAddress
			this.type_index = this.$utils._get(this.get_typeLevel_obj(this.res),'type_index',[0,0])
			console.log(this.$utils._get(this.get_typeLevel_obj(this.res),'type_index',[0,0]))
			this.type_picker[1] = this.type_level_data[this.type_index[0]]
		},
		typeChange(e){
			this.type_index = e.detail.value
			// this.form_data.type = this.type_picker[this.type_index]
		},
		MultitypeChange(e){
			let data = {
				type_picker: this.type_picker,
				type_index: this.type_index
			};
			data.type_index[e.detail.column] = e.detail.value;
			switch (e.detail.column) {
				case 0:
					console.log(e.detail.column)
					data.type_picker[1] = this.type_level_data[data.type_index[0]];
					data.type_index.splice(1,1,0);
					break;
			}
			this.type_picker = data.type_picker;
			this.type_index = data.type_index;
		},
		typeLevelChange(e){
			this.type_level = e.detail.value
			this.form_data.typeLevel = this.type_level_pick[this.type_level]
		},
		hideModal(){
			this.certificate_model = false
		},
		chooseImage(){
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				// sourceType: ['album'],
				success: res => {
					console.log('chooseImage success, temp path is', res);
					var imageSrc = res.tempFilePaths[0];
					this.certificate_upload_src = imageSrc
					this.certificate_upload_file = res.tempFiles[0]
				},
				fail: err => {
					console.log('chooseImage fail', err);
				}
			});
		},
		deadlineChange(e){
			this.certificate_data.deadline = e.detail.value;
		},
		submit_cert(){
			uni.showLoading({
			    title: '提交保存中'
			});
			const uploadTask = uni.uploadFile({
				url: this.$api_url+'personwx.cardfile/1.0/',
				filePath: this.certificate_upload_src,
				// fileType: 'image',
				name: 'cardFile',
				header:{
					"Content-Type": "application/x-www-form-urlencoded",
				},
				formData:{
					fileName:this.certificate_data.name,
					validityPeriod:this.certificate_data.deadline,
					// cardFile:this.certificate_upload_file,
					pid:this.id
				},
				success: res => {
					console.log('uploadImage success, res is:', res);
					this.get_card_list()
				},
				fail: err => {
					console.log('uploadImage fail', err);
					uni.showModal({
						content: err.errMsg,
						showCancel: false
					});
				},
				complete:() =>{
					this.hideModal()
					uni.hideLoading();
				}
			});
			// this.$http.post('personwx.cardfile/1.0/',{
			// 	fileName:this.certificate_data.name,
			// 	validityPeriod:this.certificate_data.deadline,
			// 	cardFile:this.certificate_upload_file,
			// 	pid:this.id
			// }).then(res =>{
			// 	console.log(res)
			// 	this.hideModal()
			// 	uni.hideLoading();
				
			// })
		},
		prev(){
			uni.navigateBack({
			    delta: 1
			});
		},
		next(type){
			uni.showLoading({
			    title: '加载中'
			});
			this.$http.post('personwx.basicwork/1.0/',{
				education:this.form_data.education,
				workYear:this.form_data.limit,
				expectedPlace:this.form_data.addr,
				homeAddress:this.form_data.homeAddress,
				typeLevel:this.type_picker[1][this.type_index[1]].id,
				id:this.id
			}).then(res =>{
				console.log(res)
				if(type == 'save'){
					uni.showToast({
					    title: '保存成功',
					    duration: 2000,
						icon:'success',
						success() {
							uni.navigateBack({
							    delta: 1
							});
						}
					});
					
				}
				uni.hideLoading();
				this.$emit('next')
			})
		},
		addExper(){
			this.exper_data = {
				company:'',
				equipment:'',
				type_index:[0,0],
				type:'钳工',
				price:'',
				start_time:'YYYY-MM-DD',
				end_time:'YYYY-MM-DD',
				remark:'',
				addr:'',
			},
			this.exper_model = true
		},
		hideExperModal(){
			this.exper_model = false
		},
		submit_exper(){
			uni.showLoading({
			    title: '保存中'
			});
			let url='personwx.addwork/1.0/',
				data={
					scompany:this.exper_data.company,
					deviceName:this.exper_data.equipment,
					typeLevel:this.type_picker_copy[1][this.exper_data.type_index[1]].id,
					pid:this.id,
					wages:this.exper_data.price,
					sstartTime:this.exper_data.start_time,
					sendTime:this.exper_data.end_time,
					scontext:this.exper_data.remark,
					isPlatform:'1',
				}
			if(this.exper_edit){
				url = 'personwx.updatework/1.0/'
				data.id = this.current_exper_id
			}
			this.$http.post(url,data).then(res =>{
				console.log(res)
				this.get_work_list()
				this.hideExperModal()
				uni.hideLoading();
				this.exper_edit = false
			})
		},
		experTypeChange(e){
			this.exper_data.type_index = e.detail.value
			// this.exper_data.type = this.type_picker[this.exper_data.type_index]
		},
		experMultitypeChange(e){
			let data = {
				type_picker: this.type_picker_copy,
				type_index: this.exper_data.type_index
			};
			data.type_index[e.detail.column] = e.detail.value;
			switch (e.detail.column) {
				case 0:
					console.log(e.detail.column)
					data.type_picker[1] = this.type_level_data[data.type_index[0]];
					data.type_index.splice(1,1,0);
					break;
			}
			this.type_picker_copy = data.type_picker;
			this.exper_data.type_index = data.type_index;
		},
		experStartChange(e){
			this.exper_data.start_time = e.detail.value;
		},
		experEndChange(e){
			this.exper_data.end_time = e.detail.value;
		},
		get_typeLevel_obj(level){
			let obj = null,
				type_index = []
			for (let i = 0; i < this.type_level_data.length; i++) {
				for (let j = 0; j < this.type_level_data[i].length; j++) {
					if(level.typeLevel == this.type_level_data[i][j].id){
						obj = this.type_level_data[i][j]
						type_index.push(i)
						type_index.push(j)
						break
					}
				}
				if(obj){
					break
				}
			}
			if(type_index.length == 0){
				type_index = [0,0]
			}
			return {
				obj:obj,
				type_index:type_index
			}
		},
		get_typeLevel_text(level){
			let obj = this.$utils._get(this.get_typeLevel_obj(level),'obj','')
			console.log(obj)
			return this.$utils._get(obj,'pname','')+'-'+ this.$utils._get(obj,'typeName','')
		},
		get_work_time(item){
			return this.$utils.format_date(item.sstartTime,'/') +'-'+this.$utils.format_date(item.sendTime,'/')
		},
		edit_work(item){
			this.current_exper_id = item.id
			this.exper_data.company = item.scompany
			this.exper_data.equipment = item.deviceName
			this.exper_data.equipment = item.deviceName
			this.exper_data.type_index = this.$utils._get(this.get_typeLevel_obj(item),'type_index',[0,0])
			this.type_picker_copy[1] = this.type_level_data[this.exper_data.type_index[0]]
			this.exper_data.price = item.wages
			this.exper_data.start_time = this.$utils.format_date(item.sstartTime)
			this.exper_data.end_time = this.$utils.format_date(item.sendTime)
			this.exper_data.remark = item.scontext
			this.exper_model = true
			this.exper_edit = true
		},
		removeCard(item){
			this.$http.post('personwx.cardfiledel/1.0/',{
				id:item.id
			}).then(res =>{
				console.log(res)
				this.get_card_list()
			})
		}
	}
};
</script>

<style lang="less" scoped>
.step-two {
	width: 100%;
	height: 100%;
	// padding-bottom: 120rpx;
	.main{
		padding:0 30rpx;
	}
}
.top-tips{
	width: 100%;
	height: 56rpx;
	line-height: 56rpx;
	text-align: center;
	
}
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
	overflow: hidden;
}
.block-title{
	padding: 20rpx 0;
}
.cu-form-group{
	.title{
		flex: 0 0 auto;
	}
}
.picker-box{
	width: 50%;
	height: 100rpx;
}
.certificate{
	height: 260rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	.add-box{
		
	}
	.remove{
		position: absolute;
		right: 0;
		top: 12rpx;
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		border-radius: 100%;
	}
}
.img-form-box{
	padding: 20rpx 50rpx;
	width: 100%;
	height: 320rpx;
	display: flex;
	position: relative;
	.cer-img{
		width: 100%;
		height: 100%;
	}
	.upload-box{
		padding: 50rpx;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.has-img{
		position: absolute;
		top: 20rpx;
		left: 50rpx;
		right: 50rpx;
		bottom: 20rpx;
		background-color: rgba(240,240,240,.5);
	}
}

.experience-box{
	padding: 0 20rpx;
}
.experience-item{
	padding: 20rpx 0;
	border-bottom: 1px dashed #CCCCCC;
}
.add-experience{
	width:80%;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px dashed #0081ff;
	padding: 10rpx 0;
	border-radius: 10rpx;
	margin: 20rpx auto;
}
.footer-tool {
	// position: fixed;
	// bottom: 0;
	// left: 0;
	height: 120rpx;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.picker-no-icon{
	picker{
		&:after{
			content: '';
		}
	}
}
.picke-icon{
	picker{
		&:after{
			content: "\E79B";
		}
	}
}
// .cu-form-group{
// 	justify-content: flex-start;
// }

</style>
