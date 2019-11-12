<template>
	<view class="steps-main">
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">招募标题</view>
				<input class="text-right" placeholder="请输入招募标题" name="recruiting_name"   v-model="form_data.recruiting_name"/>
			</view>
			
			<view class="cu-form-group">
				<view class="title">人员类型</view>
				<checkbox-group class="check-group" @change="checkboxChange">
					<label v-for="item in member_type" :key="item.value">
						<checkbox :value="item.value" :checked="item.checked" style="transform:scale(0.6)"/>
						<text>{{item.name}}</text>
					</label>
				</checkbox-group>
			</view>
			<template v-for="item in member_type">
				<view class="cu-form-group" v-if="item.checked" :key="item.name">
					<view class="title">
						<input placeholder="请输入类型" name="input"   v-model="item.data.name" v-if="item.name === '其他'"/>
						<text v-else>{{item.data.name}}</text>
					</view>
					<view class="group-right-layout">
						<input class="text-right" placeholder="请输入人员数量" name="input" type="number"  v-model="item.data.people"/>人
						<input class="text-right" placeholder="请输入价格" name="input" type="number"  v-model="item.data.price"/>元/时
					</view>
					
				</view>
			</template>
			<view class="cu-form-group margin-top">
				<view class="title">开工时间</view>
				<picker mode="date" v-model="form_data.start_time" start="2015-09-01" end="2020-09-01" @change="startDateChange">
					<view class="picker">{{ form_data.start_time }}</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">任务周期</view>
				<view class="group-right-layout">
					<input class="text-right" placeholder="请输入任务周期" name="input" type="number"  v-model="form_data.task_cycle" />
					<picker v-model="form_data.cycle_particle" @change="cycleChange" :range="particle" style="flex: 0 0 auto;">
						<view class="picker">{{ form_data.cycle_particle }}</view>
					</picker>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">工作地点</view>
				<!-- <input class="text-right" placeholder="请输入工作地点" name="input" v-model="form_data.work_place"/> -->
				<view class="flex-sub work-place text-right"  @tap="changeShow('QS_Picekr_city')">
					{{form_data.work_place}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">要求补充</view>
				<view class="tag-layout">
					<view class="type-tag cu-tag " :class="[is_in_selectClaim(item,select_claim)?'bg-blue':'line-grey']" v-for="item in claim_array" :key="item" @tap="selectClaim(item,select_claim)">{{item.itemValue}}</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">福利信息</view>
				<view class="tag-layout">
					<view class="type-tag cu-tag " :class="[is_in_selectClaim(item,select_welfare)?'bg-blue':'line-grey']" v-for="item in welfare_array" :key="item" @tap="selectClaim(item,select_welfare)">{{item.itemValue}}</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">其他说明</view>
				<input class="text-right" placeholder="请输入其他说明" name="input" v-model="form_data.explain"/>
			</view>
			<view class="cu-form-group">
				<view class="title">招募有效期</view>
				<picker mode="date" v-model="form_data.valid_date" start="2015-09-01" end="2020-09-01" @change="validDateChange">
					<view class="picker">{{ form_data.valid_date }}</view>
				</picker>
			</view>
		</form>
		<QSpicker type="city" ref="QS_Picekr_city" pickerId="city_1" :dataSet="citySet" showReset @hideQSPicker="hideQSPicker($event)"
		 @showQSPicker="showQSPicker($event)" @confirm="confirm($event)" />
	</view>
</template>

<script>
//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
const  graceChecker = require("@/common/graceChecker.js");
import QSpicker from '@/components/QuShe-picker/QuShe-picker.vue';
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		})
		return {
			form_data: {
				recruiting_name: '',
				start_time:currentDate,
				task_cycle:'',
				cycle_particle:'天',
				work_place:'请选择工作地点',
				explain:'',
				valid_date:currentDate
			},
			particle:['天','周','月','年'],
			particle_index:0,
			member_type:[
				{
					value:'dg',
					name:'电工',
					data:{
						name:'电工',
						people:'',
						price:''
					}
				},
				{
					value:'qz',
					name:'钳工',
					data:{
						name:'钳工',
						people:'',
						price:''
					}
				},
				{
					value:'qt',
					name:'其他',
					data:{
						name:'',
						people:'',
						price:''
					}
				}
			],
			claim_array:['面试','工作经验不限','熟手'],
			select_claim:[],
			welfare_array:['包吃','包住'],
			select_welfare:[],
			citySet: {
				defaultValue: [0, 0, 0]
			},
		};
	},
	props: {
		task_id: {
			type: String,
			default() {
				return '';
			}
		}
	},
	components:{
		QSpicker
	},
	computed:{
		requirementInfo(){
			let arr =[]
			this.member_type.forEach(item =>{
				if(item.checked){
					let obj = {}
					obj.type = item.data.name
					obj.num = item.data.people
					obj.price = item.data.price
					arr.push(obj)
				}
			})
			return arr
		},
		workRequest(){
			let arr = []
			this.select_claim.forEach(item =>{
				arr.push(item.itemValue)
			})
			return "{" + arr.join() + "}"
		},
		welfareInfo(){
			let arr = []
			this.select_welfare.forEach(item =>{
				arr.push(item.itemValue)
			})
			return "{" + arr.join() + "}"
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init(){
			uni.showLoading({
			    title: '加载中'
			});
			this.loading = true
			Promise.all([
				this.$http.post('personwx.hyxx/1.0/',{
					dictId:'1a52c05cef9d569b88a03cf8f2884965'
				}),
				this.$http.post('personwx.hyxx/1.0/',{
					dictId:'3dd875e620061483a0af551098c99e91'
				})
			]).then(values =>{
				console.log(values)
				this.claim_array = values[0].data.data.data
				this.welfare_array = values[1].data.data.data
				uni.hideLoading();
				this.loading = false
			})
			
			// this.$http.post('personwx.hyxx/1.0/',{
			// 	dictId:'1a52c05cef9d569b88a03cf8f2884965'
			// }).then(res =>{
			// 	console.log('工作要求',res)
			// 	this.claim_array = res.data.data.data
			// 	uni.hideLoading();
			// 	this.loading = false
			// })
			// this.$http.post('personwx.hyxx/1.0/',{
			// 	dictId:'3dd875e620061483a0af551098c99e91'
			// }).then(res =>{
			// 	this.welfare_array = res.data.data.data
			// 	console.log('福利信息',res)
			// })
		},
		startDateChange(e) {
			this.form_data.start_time = e.detail.value;
		},
		validDateChange(e) {
			this.form_data.valid_date = e.detail.value;
			
		},
		formSubmit(cb) {
			//将下列代码加入到对应的检查位置
			//定义表单规则
			// let rule = [
			// 	{name:"task_name", checkType : "notnull", checkRule:"",  errorMsg:"任务名称不能为空"},
			// 	{name:"industry", checkType : "notnull", checkRule:"",  errorMsg:"任务行业不能为空"},
			// 	{name:"equipment_name", checkType : "notnull", checkRule:"",  errorMsg:"设备名称不能为空"},
			// 	{name:"company", checkType : "notnull", checkRule:"",  errorMsg:"服务公司不能为空"},
			// ];
			// //进行表单检查
			// // let formData = e.detail.value;
			// let checkRes = graceChecker.check(this.form_data, rule);
			// if(checkRes){
			// 	uni.showToast({title:"验证通过!", icon:"none"});
			// }else{
			// 	uni.showToast({ title: graceChecker.error, icon: "none" });
			// }
			let pamars = {
				title:this.form_data.recruiting_name,
				requirementInfo:this.requirementInfo,
				startData:this.form_data.start_time,
				duration:this.form_data.task_cycle,
				unit:this.form_data.cycle_particle,
				workAddress:this.form_data.work_place,
				workRequest:this.workRequest,
				welfareInfo:this.welfareInfo,
				remark:this.form_data.explain,
				validityPeriod:this.form_data.valid_date,
				proId:this.task_id
			}
			console.log(pamars)
			this.$http.post('personwx.projectrecruitadd/1.0/',pamars).then(res =>{
				console.log(res)
				cb()
			})
		},
		checkboxChange(e) {
			let items = this.member_type,
				values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i]
				if(values.includes(item.value)){
					this.$set(item,'checked',true)
				}else{
					this.$set(item,'checked',false)
				}
			}
			console.log(this.member_type)
		},
		cycleChange(e){
			console.log(e)
			this.particle_index = e.target.value
			this.form_data.cycle_particle = this.particle[this.particle_index]
		},
		is_in_selectClaim(item,arr){
			let index = arr.findIndex((o) =>{
				return o.id == item.id
			})
			return index>=0
		},
		selectClaim(item,arr){
			if(this.is_in_selectClaim(item,arr)){
				arr.splice(arr.findIndex((o) =>{
					return o.id == item.id
				}),1)
			}else{
				arr.push(item)
			}
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			// if (type === 'start') {
			// 	year = year - 60;
			// } else if (type === 'end') {
			// 	year = year + 2;
			// }
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		changeShow(name) {
			this.$refs[name].show();
		},
		showQSPicker(res) {
			console.log(res)
			console.log(`pickerId为${res},类型为${res.type}的QS-picker显示了`);
		},
		hideQSPicker(res) {
			console.log(`pickerId为${res.pickerId},类型为${res.type}的QS-picker隐藏了了`);
		},
		confirm(res) {
			console.log('获取了用户选择----->' + JSON.stringify(res));
			this.form_data.work_place = res.data.label
		}
	}
};
</script>

<style lang="less" scoped>
.steps-main {
	height: 100%;
	width: 100%;
}
.cu-form-group{
	.title{
		flex: 0 0 auto;
		width: 180rpx;
	}
	.check-group{
		flex: 1 1 0;
		width: 100%;
		display: flex;
		justify-content: space-around;
		label{
			display: flex;
			align-items: center;
		}
	}
	.group-right-layout{
		display:flex;
		align-items: center;
		flex: 1 1 0;
	}
	.work-place{
		position: relative;
		padding-right: 40rpx;
		line-height: 100rpx;
		&:after{
			font-family: cuIcon;
			display: block;
			content: "\E6A3";
			position: absolute;
			font-size: 34rpx;
			color: #8799a3;
			line-height: 100rpx;
			width: 60rpx;
			text-align: center;
			top: 0;
			bottom: 0;
			right: -20rpx;
			margin: auto;

		}
	}
}
.tag-layout{
	flex: 1 1 0;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.type-tag{
	padding: 10rpx 20rpx;
	text-align: center;
	border-radius: 6rpx;
	margin: 10rpx;
}
</style>
