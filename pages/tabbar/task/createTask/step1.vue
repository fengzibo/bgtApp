<template>
	<view class="steps-main">
		<form @submit="formSubmit" v-if="!loading">
			<view class="cu-form-group">
				<view class="title">任务名称</view>
				<input class="text-right" placeholder="请输入任务名称" name="task_name"   v-model="form_data.task_name"/>
			</view>
			<view class="cu-form-group">
				<view class="title">任务行业</view>
				<!-- <input class="text-right" placeholder="所属行业" name="input" v-model="form_data.industry" /> -->
				<picker @change="industryChange" :value="industry_index" :range="industry_list"  name="industry" range-key="description">
					<view class="picker">
						{{form_data.industry}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">设备名称</view>
				<input class="text-right" placeholder="设备名称" name="equipment_name" v-model="form_data.equipment_name" />
			</view>
			<view class="cu-form-group">
				<view class="title">设备数量</view>
				<input class="text-right" placeholder="设备数量" name="deviceNum" type="number" v-model="form_data.deviceNum" />
			</view>
			<view class="cu-form-group">
				<view class="title">生产任务</view>
				<input class="text-right" placeholder="请输入生产任务" name="task_no" v-model="form_data.task_no" />
			</view>
			<view class="cu-form-group">
				<view class="title">服务公司</view>
				<input class="text-right" placeholder="服务公司" name="company" v-model="form_data.company" />
			</view>
			<view class="cu-form-group">
				<view class="title">预算</view>
				<input class="text-right" placeholder="请输入预算" name="budget" v-model="form_data.budget" />
			</view>
			<view class="cu-form-group">
				<view class="title">交期</view>
				<picker mode="date" v-model="form_data.delivery" start="2015-09-01" end="2020-09-01" @change="DateChange">
					<view class="picker">{{ form_data.delivery }}</view>
				</picker>
			</view>
			<view class="cu-form-group align-start">
				<view class="title">任务备注</view>
				<textarea maxlength="-1" placeholder="请输入任务备注" v-model="form_data.remark"></textarea>
			</view>
		</form>
	</view>
</template>

<script>
//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
const  graceChecker = require("@/common/graceChecker.js");
import { mapState,mapGetters } from 'vuex';
export default {
	data() {
		const currentDate = this.$utils.format_date(new Date())
		return {
			form_data: {
				task_name: '',
				industry: '请选择任务行业',
				equipment_name: '',
				task_no: '',
				company: '',
				budget: '',
				delivery: currentDate,
				remark: '',
				deviceNum:''
			},
			industry_list:[],
			industry_index:0,
			loading:true,
		};
	},
	props: {
		route_id: {
			type: String,
			default() {
				return '';
			}
		}
	},
	computed:{
		...mapState(['current_task']),
	},
	mounted() {
		this.init()
		console.log(this.route_id)
	},
	methods: {
		init(){
			uni.showLoading({
			    title: '加载中'
			});
			this.loading = true
			this.$http.post('personwx.hyxx/1.0/',{
				dictId:'e7f70f44ebf3d55e2fac4af73e29ba36'
			}).then(res =>{
				console.log(res)
				this.industry_list = this.$utils._get(res,'data.data.data',[])
				this.form_data.industry = this.industry_list[0].description
				if(this.route_id){
					this.form_data.task_name = this.current_task.deviceName
					let index  = this.industry_list.findIndex(o =>{
						return o.id == this.current_task.industry
					})
					this.industry_index = index<0?0:index
					console.log(this.industry_index)
					this.form_data.industry = this.industry_list[this.industry_index].description
					this.form_data.equipment_name = this.current_task.deviceName
					this.form_data.deviceNum = this.current_task.deviceNum
					this.form_data.task_no = this.current_task.proNumber
					this.form_data.company = this.current_task.scompany
					this.form_data.budget = this.current_task.budget
					this.form_data.delivery = this.$utils.format_date(this.current_task.deliveryPeriod) 
					this.form_data.remark = this.current_task.description
				}
				 uni.hideLoading();
				 this.loading = false
			})
		},
		
		DateChange(e) {
			this.form_data.delivery = e.detail.value;
		},
		formSubmit(cb) {
			//将下列代码加入到对应的检查位置
			//定义表单规则
			uni.showLoading({
			    title: ''
			});
			let rule = [
				{name:"task_name", checkType : "notnull", checkRule:"",  errorMsg:"任务名称不能为空"},
				{name:"industry", checkType : "notnull", checkRule:"",  errorMsg:"任务行业不能为空"},
				{name:"equipment_name", checkType : "notnull", checkRule:"",  errorMsg:"设备名称不能为空"},
				{name:"company", checkType : "notnull", checkRule:"",  errorMsg:"服务公司不能为空"},
			];
			//进行表单检查
			// let formData = e.detail.value;
			let checkRes = graceChecker.check(this.form_data, rule);
			if(checkRes){
				
				this.$http.post('personwx.projectinfo/1.0/',{
					industry:this.industry_list[this.industry_index].id,
					scompany:this.form_data.company,
					deviceName:this.form_data.equipment_name,
					deviceNum:this.form_data.deviceNum,
					proNumber:this.form_data.task_no,
					budget:this.form_data.budget,
					deliveryPeriod:this.form_data.delivery,
					description:this.form_data.remark,
					id:this.route_id?this.route_id:''
				}).then(res =>{
					console.log(res)
					uni.showToast({title:"提交成功!", icon:"success"});
					uni.hideLoading();
					cb(res.data.data.id)
					
				})
				
			}else{
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
		},
		industryChange(e){
			this.industry_index = e.detail.value
			this.form_data.industry = this.industry_list[this.industry_index].description
		}
	}
};
</script>

<style lang="less" scoped>
.steps-main {
	height: 100%;
	width: 100%;
}
</style>
