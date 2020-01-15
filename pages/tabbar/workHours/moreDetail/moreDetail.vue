<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">更多明细</block>
		</cu-custom>
		<view class="cu-form-group">
			<view class="title">查询任务</view>
			<!-- <input class="text-right" placeholder="所属行业" name="input" v-model="form_data.industry" /> -->
			<picker @change="industryChange" :value="industry_index" :range="industry_list"  range-key="materialName">
				<view class="picker">
					{{form_data.industry}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">查询姓名</view>
			<input class="text-right" placeholder="输入姓名" name="equipment_name" v-model="form_data.name" @blur="onBlur"/>
		</view>
		<view class="cu-form-group picker-no-icon" @tap="open">
			<view class="title">查询时间</view>
			<view class="action">{{search_time}}</view>
		</view>
		<view class="no-data" v-if="no_data">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="aspectFit" class="no-data-img"></image>
		
		</view>
		<view v-else class="margin-top-lg bg-white padding">
		    
		   <view class="grid  text-center col-4 solid-bottom">
				<view class="padding-cus text-bold" >日期</view>
				<view class="padding-cus text-bold" >姓名</view>
				<view class="padding-cus text-bold" >工时(小时)</view>
				<view class="padding-cus text-bold" >成本(元)</view>
		   </view>
		   <view class="grid  text-center col-4 solid-bottom" v-for="item in list" :key="item.id" >
				<view class="padding-cus" >{{deliveryPeriod(item.workTimeDate)}}</view>
				<view class="padding-cus" >{{ item.pname }}</view>
				<view class="padding-cus" >{{item.validTotalNum}}</view>
				<view class="padding-cus" >{{item.wages}}</view>
		   </view>
		   <view class="grid text-center col-4"  v-if="list.length>0">
				<view class="padding-cus text-bold" >共计</view>
				<view class="padding-cus text-bold" >--</view>
				<view class="padding-cus text-bold text-red">{{countHours}}</view>
				<view class="padding-cus text-bold text-red">{{countCost}}</view>
		   </view>
		</view>
		<uni-calendar 
			ref="calendar"
			:insert="false"
			:range="true"
			@confirm="confirm"
		 ></uni-calendar>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		data() {
			return {
				industry_list:[],
				industry_index:0,
				form_data:{
					industry:'请选择',
					name:'',
					start_time:'YY-MM-DD',
					end_time:'YY-MM-DD'
				},
				list:[],
				search_time:'点击选择时间',
				loading:true,
				name_flag:''
			};
		},
		components: {
			uniCalendar
		},
		onLoad() {
			uni.$on('refreshList', () => {
				console.log('refreshList');
				this.init();
			});
			this.init();
		},
		computed:{
			...mapGetters(['id']),
			pro_id(){
				return this.$_.get(this.industry_list[this.industry_index],'proId','')
			},
			fromDate(){
				return this.form_data.start_time === 'YY-MM-DD'?'': this.form_data.start_time
			},
			toDate(){
				return this.form_data.end_time === 'YY-MM-DD'?'': this.form_data.end_time
			},
			no_data(){
				return !this.loading && this.list.length === 0;
			},
			countCost(){
				let cost = 0
				this.list.forEach(item =>{
					cost += item.wages
				})
				return cost
			},
			countHours(){
				let cost = 0
				this.list.forEach(item =>{
					cost += item.validTotalNum
				})
				return cost
			}
		},
		
		methods:{
			init(){
				this.get_industry_list()
				this.get_list()
			},
			get_industry_list(){
				this.$http.post('clientapp.getProForSelect/1.0/',{
					pid:this.id
				}).then(res =>{
					this.industry_list = this.$_.concat([{
						materialName:'请选择'
					}],res.data.data.data) 
				})
			},
			industryChange(e){
				console.log(e)
				let val = this.$_.toNumber(e.detail.value)
				if(this.industry_index !== val){
					this.industry_index = val
					this.form_data.industry = this.industry_list[val].materialName
					this.update_list()
				}
				
			},
			get_list(cb){
				this.$http.post('personwx.getPerProAllHours/1.0/',{
					pid:this.id,
					proId:this.pro_id,
					fromDate:this.fromDate,
					toDate:this.toDate,
					pname:this.form_data.name
				}).then(res =>{
					console.log(res)
					this.list = res.data.data.data
				}).finally(() =>{
					this.loading = false
					if(typeof cb === 'function'){
						cb()
					}
				})
			},
			open(){
				this.$refs.calendar.open();
			},
			confirm(e) {
				console.log(e);
				
				if(e.range.data.length>0){
					this.form_data.start_time = e.range.after
					this.form_data.end_time = e.range.before
					this.search_time = e.range.after + ' - ' + e.range.before
				}else{
					this.form_data.start_time = e.fulldate
					this.form_data.end_time = ''
					this.search_time = e.fulldate
				}
				
				this.update_list()
			},
			deliveryPeriod(time) {
				return this.$utils.format_date(time);
			},
			update_list(){
				uni.showLoading({
				    title: '加载中',
					mask:true,
				});
				this.get_list(() =>{
					uni.hideLoading();
				})
			},
			onBlur(e){
				if(this.name_flag !== e.detail.value){
					this.name_flag = e.detail.value
					this.update_list()
				}
				
			}
		}
	}
</script>

<style lang="less">
.no-data {
	.no-data-img {
		width: 60%;
		margin: 0 auto;
		display: block;
	}
}
.padding-cus{
	padding: 20rpx 0;
}
</style>
