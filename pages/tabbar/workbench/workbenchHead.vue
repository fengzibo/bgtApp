<template>
	<view class="workbench-head">
		<view class="no-task" v-if="no_work">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">当前没有相关在进行的任务</text>
			<br />
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">前往任务列表</button>
			<br />
			<button class="cu-btn round bg-gradual-red lg margin-top" @tap="init">刷新工作台</button>
		</view>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :top="c_CustomBar" v-else>
		<view class="swiper-box">
			<swiper class="swiper" :current="current_swiper" :indicator-dots="false" :autoplay="false" :style="{ height: swiperHeight }" @change="swiperChange" >
				<swiper-item v-for="(item,index) in bgt_c_task" :key="item.id">
					<view class="padding" :id="'content'+index" style="position: relative;">
						<view class="bg-gradual-blue padding skills-card text-white" >
								<!-- :style="{ height: is_unfold ? 'auto' : '220rpx' }" -->
								<view class="info-main" style="height: auto;" v-if="item.status === '2'">
									<view class="flex justify-between">
										<view class="text-lg">{{item.deviceName}}</view>
										<!-- <view class="text-lg">
											<text class="cuIcon-writefill text-blue"></text>
										</view> -->
									</view>
									
									<view class="info-box">
										<view class="label">开工日期：</view>
										<!-- <view class="text">{{ deliveryPeriod(item.deliveryPeriod) }}</view> -->
										<picker mode="date" :value="form_data.startTime" start="2015-09-01" end="2020-09-01" @change="dpDateChange">
											<view class="picker">{{ form_data.startTime }}</view>
										</picker>
									</view>
									<view class="info-box has-arrow">
										<view class="label">工作地点：</view>
										<!-- <view class="text">{{item.scompany}}</view> -->
										<input class="text-left" placeholder="工作地点"  v-model="form_data.address" :disabled="true" placeholder-style="color:#fff" @tap="chooseLocation"/>
									</view>
									<view class="info-box textarea-box">
										<view class="label">注意事项：</view>
										<textarea maxlength="-1" placeholder="请输入任务备注" v-model="form_data.description" auto-height placeholder-style="color:#fff" @linechange="get_swiper_c_height"></textarea>
									</view>
								</view>
								<!-- <view class="unfold-more text-sm" @tap="case_more">{{ is_unfold ? '收起更多' : '展开更多' }}</view> -->
							<template v-if="item.status === '3'">
								<view class="flex align-center justify-between">
									<view class="text-bold">
										{{item.deviceName}}
									</view>
									<view class="">
										交期：{{deliveryPeriod(item.deliveryPeriod)}}
									</view>
								</view>
								<view class="flex padding-tb">
									<view class="flex-sub text-center">
										<view class="text-lg">
											{{ item.allHours || 0 }}
										</view>
										<view class="">
											累计工时
										</view>
									</view>
									<view class="flex-sub text-center">
										<view class="text-lg">
											{{ item.abnormalityNum || 0 }}
										</view>
										<view class="">
											异常数
										</view>
									</view>
									<view class="flex-sub text-center">
										<view class="text-lg">
											{{item.allcost || 0}}/{{ item.budget }}
										</view>
										<view class="">
											实时/预算（万）
										</view>
									</view>
								</view>
								<view class="flex align-center">
									<view class="process flex-sub">
										<view class="cu-progress round sm striped active" >
											<view class="bg-green" :style="{'width':item.proProgress+'%'}"></view>
										</view>
									</view>
									<view class="margin-left-sm">
										进度{{item.proProgress || 0}}%
									</view>
								</view>
								<view class="margin-top-sm">
									{{item.scompany}}
								</view>
							</template>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="work-swiper-dot">
				<view class="dot-item bg-blue" :class="{'active':current_swiper == index}" v-for="(item,index) in bgt_c_task" :key="item.id"></view>
			</view>
		</view>
		 
		
		<template v-if="current_bgt_c_task.status == '2'">
		
			<view class="cu-bar bg-white solid-bottom title">
				<view class="action">
					<text class="cuIcon-title text-orange"></text>
					人员列表(
					<text class="text-orange" style="vertical-align: middle;">{{person_list.length}}</text>
					)人
				</view>
			</view>
			<view class="people-list">
				<view class="item padding bg-white solid-bottom" v-for="item in person_list" :key="item.id" @tap="goto_detail(item)">
					<view class="action solid-right">
						<!-- :class="[status_class(item.status)]   status_text(item.status)" -->
						<view class="text-lg people-status text-blue">准备中</view>
					</view>
					<view class="content">
						<view class="cu-avatar round lg bg-blue" :style="{backgroundImage: `url(${item.headImg})`}"></view>
						<view class="content-info margin-left">
							<view class="content-info-top">
								<view class="text-orange">
									<view class="text-cut">{{ item.name }}</view>
								</view>
								<view class="text-gray text-sm margin-left">{{ item.age }}岁</view>
								<!-- <view v-for="tag in item.tag" :key="tag">
									<view class="cu-tag  margin-left line-green">{{ tag }}</view>
								</view> -->
								<view class="cu-tag  margin-left line-green">{{ item.typeLevelName }}</view>
							</view>
							<view class="content-info-addr text-grey text-sm">
								<text class="cuIcon-locationfill margin-right-xs"></text>
								<text>{{ expectedPlace(item.expectedPlace)}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		<template v-if="current_bgt_c_task.status == '3'">
			<view class="cu-list grid col-4 no-border">
				<view class="cu-item text-black" @tap="scan">
					<view class="cuIcon-scan">
					</view>
					<text>扫码</text>
				</view>
				<view class="cu-item text-yellow" @tap="goto_error">
					<view class="cuIcon-warn ">
					</view>
					<text>异常提报</text>
				</view>
				<view class="cu-item text-orange" @tap="goto_log">
					<view class="cuIcon-calendar ">
					</view>
					<text>日志提报</text>
				</view>
				<view class="cu-item text-grey" @tap="finish_task">
					<view class="cuIcon-roundclose">
					</view>
					<text>任务结案</text>
				</view>
			</view>
			<scroll-view scroll-x class="bg-white nav margin-top-sm">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in tab_list" :key="index" @tap="tabSelect" :data-id="index">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
			<head-todo v-if="TabCur == 0"></head-todo>
			<people-list v-if="TabCur == 1"></people-list>
			<plan v-if="TabCur == 2"></plan>
			<err-manage v-if="TabCur == 3"></err-manage>
		</template>
		</mescroll-uni>
		<view class="footer-tool bg-white solid-top" v-if="current_bgt_c_task.status == '2' && !no_work">
			<button class="cu-btn bg-blue" @tap="send_start" style="flex:2;height: 100%;">发送开工确认</button>
			<!-- <button class="cu-btn round bg-blue" @tap="goto_recruiting">补招人员</button> -->
			<button class="cu-btn bg-red" style="flex:1;height: 100%;">关闭任务</button>
		</view>
	</view>
</template>

<script>
import { mapState,mapGetters } from 'vuex';
import headTodo from './headTodo.vue'
import peopleList from './peopleList.vue'
import plan from './plan.vue'
import errManage from './errManage.vue'
import permision from "@/utils/permission.js"
export default {
	data() {
		return {
			is_unfold: false,
			list: [
				{
					name: '李小吧',
					age: '22',
					tag: ['电工学徒'],
					address: '深圳市龙华区大浪街',
					status: '准备中',
					status_no: 2
				},
				{
					name: '李小吧',
					age: '22',
					tag: ['电工学徒'],
					address: '深圳市龙华区大浪街',
					status: '确认能来',
					status_no: 1
				},
				{
					name: '李小吧',
					age: '22',
					tag: ['电工学徒'],
					address: '深圳市龙华区大浪街',
					status: '确认不来',
					status_no: 0
				},
				{
					name: '李小吧',
					age: '22',
					tag: ['电工学徒'],
					address: '深圳市龙华区大浪街',
					status: '等待确认',
					status_no: 3
				}
			],
			swiperHeight:'',
			project_detail:{},
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false,
				isLock:true,
			},
			current_swiper:0,
			form_data:{
				startTime:'',
				address:'',
				points:'',
				description:''
			},
			tab_list:[
				{
					name:'待办事项',
					data:[],
					is_rquest:false
				},
				{
					name:'人员列表',
					data:[],
					is_rquest:false
				},
				{
					name:'生产计划',
					data:[],
					is_rquest:false
				},
				{
					name:'异常管理',
					data:[],
					is_rquest:false
				},
			],
			TabCur:0,
			scrollLeft:0,
			no_work:false
		};
	},
	props: {
		location:{
			default:null
		}
	},
	components:{
		headTodo,
		peopleList,
		plan,
		errManage
	},
	mounted() {
		uni.$on('refreshJwt',(data) =>{
			this.init()
		})
		uni.$on('taskToWork',(data) =>{
			this.init()
		})
		this.init()
	},
	beforeDestroy() {
		uni.$off('refreshJwt')
		uni.$off('taskToWork')
	},
	computed:{
		...mapState(['bgt_c_task','bgt_ct_id']),
		...mapGetters(['user_role','id']),
		person_list(){
			return this.$utils._get(this.project_detail,'personList',[])
		},
		project(){
			return this.$utils._get(this.project_detail,'project',{})
		},
		c_CustomBar(){
			return this.CustomBar
		},
		current_bgt_c_task(){
			return this.bgt_c_task.find((item) =>{
				return item.id == this.bgt_ct_id
			})
		}
	},
	watch:{
		bgt_ct_id(val){
			console.log(val)
			this.current_swiper = this.bgt_c_task.findIndex((item) =>{
				return item.id == val
			})
			this.init()
		},
		location:{
			handler(val){
				console.log('wlocation',val)
				if(val){
					this.form_data.address = val.address
					this.form_data.points = `[${val.latitude},${val.longitude}]`
					console.log(this.form_data)
				}
			},
			deep:true
		}
	},
	methods: {
		init(){
			console.log(this.bgt_c_task,this.bgt_ct_id)
			this.get_head_project()
			// if(this.bgt_ct_id == ''){
				
			// }else{
			// 	this.get_project_detail()
			// }
		},
		set_form_data(){
			let index = this.bgt_c_task.findIndex((item) =>{
				return item.id == this.bgt_ct_id
			})
			this.current_swiper = index
			this.form_data.startTime = this.$utils.format_date(this.$_.get(this.bgt_c_task[index],'startTime',''))
			this.form_data.address = this.$utils._get(this.bgt_c_task[index],'address','')
			this.form_data.points = this.$utils._get(this.bgt_c_task[index],'points','')
			this.form_data.description = this.bgt_c_task[index].description
		},
		get_head_project(cb){
			this.$http.get('personwx.headproject/1.0/',{
				pid:this.id,
				isFinish:'0'
			}).then(res =>{
				console.log(res)
				if(this.$utils._get(res,'data.code') === '0'){
					if(res.data.data.length == 0){
						this.no_work = true
						return
					}else{
						this.no_work = false
					}
					this.$store.commit('set_bgt_c_task',this.$utils._get(res,'data.data',[]))
					if(this.bgt_ct_id == ''){
						this.$store.commit('set_bgt_ct_id',this.$utils._get(res,'data.data[0].id',''))
					}
					this.get_project_detail(cb)
				}
			})
		},
		get_project_detail(cb){
			this.set_form_data()
			this.$http.get('personwx.projectDetail/1.0/',{
				id:this.bgt_ct_id
			}).then(res =>{
				if(this.$utils._get(res,'data.code') === '0'){
					console.log(res)
					this.project_detail = this.$utils._get(res,'data.data',{})
					if(typeof cb === 'function'){
						cb()
					}
					this.$nextTick(() =>{
						this.get_swiper_c_height()
					})
				}
				
			})
		},
		get_swiper_c_height(){
			const query = uni.createSelectorQuery().in(this);
			query.select('#content'+this.current_swiper).boundingClientRect(data => {
			  console.log("得到布局位置信息" + JSON.stringify(data));
			  console.log("节点离页面顶部的距离为" + data.top);
			  this.swiperHeight = data.height+'px'
			}).exec();
		},
		status_class(status_no) {
			if (status_no === 1) {
				return 'text-green';
			} else if (status_no === 2) {
				return 'text-blue';
			} else if (status_no === 3) {
				return 'text-orange';
			} else {
				return 'text-grey';
			}
		},
		status_text(status_no){
			if (status_no === 1) {
				return '确认能来';
			} else if (status_no === 2) {
				return '准备中';
			} else if (status_no === 3) {
				return '等待确认';
			} else {
				return '确认不来';
			}
		},
		expectedPlace(addr){
			let address = ''
			try{
				address = JSON.parse(addr).join('')
			}catch(e){
				//TODO handle the exception
			}
			return address
		},
		goto_detail(item) {
			uni.navigateTo({
				url: `/pages/auditDetail/auditDetail?id=${this.project.id}&pid=${item.id}&isWork=true` 
			});
		},
		deliveryPeriod(time){
			return this.$utils.format_date(time)
		},
		case_more(){
			this.is_unfold = !this.is_unfold
			this.$nextTick(() =>{
				this.get_swiper_c_height()
			})
			
		},
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			//联网加载数据
			setTimeout(() => {
				this.get_head_project(() =>{
					mescroll.endSuccess(this.person_list.length,false)
				})
			}, 300);
		},
		goto_recruiting(){
			this.show_modal = false
			uni.navigateTo({
				url: `/pages/personList/personList?recId=${this.project.id}&proId=${this.project.pid}`
			});
		},
		swiperChange(e){
			console.log(e)
			this.current_swiper = e.detail.current
			let id = this.$utils._get(this.bgt_c_task[this.current_swiper],'id','')
			this.$store.commit('set_bgt_ct_id',id)
			// this.$nextTick(() =>{
			// 	this.get_project_detail()
			// })
		},
		send_start(){
			uni.showModal({
			    title: '提示',
			    content: '确认输入的开工信息是否有误',
			    success:(res) => {
			        if (res.confirm) {
			            console.log('用户点击确定');
						this.$http.post('personwx.updateprojectinfo/1.0/',{
							startTime:this.form_data.startTime,
							address:this.form_data.address,
							points:this.form_data.points,
							description:this.form_data.description,
							id:this.bgt_ct_id
						}).then(res =>{
							console.log(res)
							let params ={
								id:this.bgt_ct_id,
								address:this.form_data.address,
								points:this.form_data.points,
								startTime: this.form_data.startTime
							}
							console.log(params)
							this.$http.post('personwx.startproject/1.0/',params).then(res =>{
								console.log(res)
								if (res.data.code == '0'){
									this.get_head_project()
								}
							})
							
						})
						
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
			});
			
		},
		dpDateChange(e){
			this.form_data.startTime = e.detail.value
		},
		chooseLocation(){
			const key = 'CLABZ-JECLX-JDZ43-TAZKO-FNNM7-NVF2G'; //使用在腾讯位置服务申请的key
			const referer = '智造劳务'; //调用插件的app的名称
			let location
			if(this.form_data.points == ''){
				location = ''
			}else{
				const loctaionp = JSON.parse(this.form_data.points)
				location = JSON.stringify({
				  latitude: loctaionp[0],
				  longitude: loctaionp[1]
				});
			}
			
			wx.navigateTo({
			  url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
			});
		},
		tabSelect(e){
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
		},
		goto_log(){
			uni.navigateTo({
				url:'/pages/tabbar/workbench/logReport/logReport'
			})
		},
		goto_error(){
			
			uni.navigateTo({
				url:'/pages/tabbar/workbench/errorReport/errorReport'
			})
		},
		async scan(){
			let status = await this.checkPermission();
			if (status !== 1) {
				return;
			}
			uni.scanCode({
				success: res => {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
				},
				fail: err => {
					console.log(err);
				}
			});
		},
		async checkPermission(code) {
			let status = permision.isIOS ? await permision.requestIOS('camera') : await permision.requestAndroid(
				'android.permission.CAMERA');
		
			if (status === null || status === 1) {
				status = 1;
			} else {
				uni.showModal({
					content: '需要相机权限',
					confirmText: '设置',
					success: function(res) {
						if (res.confirm) {
							permision.gotoAppSetting();
						}
					}
				});
			}
			return status;
		},
		finish_task(){
			uni.showModal({
			    title: '提示',
			    content: '辛苦了，确认任务结案？',
				'confirmText':'确认结案',
			    success:(res) => {
			        if (res.confirm) {
			            console.log('用户点击确定');
						this.$http.post('personwx.projectfinish/1.0/',{
							id:this.bgt_ct_id
						}).then(res =>{
							console.log(res)
							if(this.$_.get(res,'data.code','') == '0'){
								uni.showToast({
								    title: '任务结案成功',
								    duration: 2000,
									icon:'success',
									success:() =>{
										uni.$emit('refreshList')
										this.init()
										setTimeout(() => {
											uni.switchTab({
												url:"/pages/tabbar/task/task"
											})
										}, 300);
										
									}
								})
							}else{
								uni.showToast({
								    title: '任务结案失败',
								    duration: 2000,
								});
							}
						})
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
			});
			
		},
		goto_work(){
			uni.switchTab({
				url:"/pages/tabbar/task/task"
			})
		}
	}
};
</script>

<style lang="less" scoped>
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);

	.info-main {
		overflow: hidden;
		transition: all 0.3s;
	}
	.info-box {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		.label {
			flex: 0 0 auto;
		}
		.text {
			flex: 1;
		}
		picker{
			flex: 1;
			position: relative;
			padding-right: 40rpx;
			border-bottom: 1rpx solid #fff;
			line-height: 60rpx;
			height: 60rpx;
			&:after{
				font-family: cuIcon;
				display: block;
				content: "\E6A3";
				position: absolute;
				font-size: 34rpx;
				color: #fff;
				width: 60rpx;
				text-align: center;
				top: 50%;
				right: -20rpx;
				margin: auto;
				transform: translateY(-50%);
			}
		}
		input{
			flex: 1;
			position: relative;
			border-bottom: 1rpx solid #fff;
			line-height: 60rpx;
			height: 60rpx;
		}
		textarea{
			margin: 7rpx 0;
			max-height: 4.6em;
			width: 100%;
			line-height: 1.2em;
		}
		&.textarea-box{
			align-items: flex-start;
		}
		&.has-arrow{
			input{
				padding-right: 40rpx;
				&:after{
					font-family: cuIcon;
					display: block;
					content: "\E6A3";
					position: absolute;
					font-size: 34rpx;
					color: #fff;
					width: 60rpx;
					text-align: center;
					top: 50%;
					right: -20rpx;
					margin: auto;
					transform: translateY(-50%);
				}
			}
		}
	}
	.unfold-more {
		text-align: center;
		padding-top: 10rpx;
	}
}
.people-list {
	padding-bottom: 100rpx;
	.item {
		display: flex;
		align-items: center;
		.content {
			display: flex;
			align-items: center;
			flex: 1 1 auto;
			width: 100%;
			.content-info {
				display: flex;
				flex-direction: column;
				.content-info-top {
					display: flex;
					align-items: center;
				}
				.content-info-addr {
					display: flex;
					align-items: center;
					margin-top: 10rpx;
				}
			}
		}
		.action {
			flex: 0 0 auto;
			margin-right: 20rpx;
			.people-status {
				width: 200rpx;
				line-height: 80rpx;
				text-align: center;
			}
		}
	}
}
.footer-tool {
	width: 100%;
	height: 80rpx;
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: var(--window-bottom);
	z-index: 10;
	button{
		border-radius: 0;
	}
}
.swiper .wx-swiper-dot{
	bottom: 0;
}
.swiper-box{
	position: relative;
}
.work-swiper-dot{
	position: absolute;
	bottom: 10rpx;
	left: 50%;
	transform: translateX(-50%);
	.dot-item{
		width: 40rpx;
		height: 6rpx;
		border-radius: 3rpx;
		margin: 0 10rpx;
		display: inline-block;
		opacity: .3;
		&.active{
			opacity: 1;
		}
	}
}
.no-task {
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
</style>
