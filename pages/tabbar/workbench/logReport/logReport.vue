<template>
	<view class="log-report">
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">日志提报</block>
			</cu-custom>
			<dark-calendar :open="false" @on-click="change_date"></dark-calendar>
		</view>
		<view class="no-data" v-if="no_data">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="aspectFit" class="no-data-img"></image>
		
		</view>
		<template v-if="!no_data">
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					未完成计划进度（100%表示计划完成）
				</view>
			</view>
			<view class="flex justify-between bg-white padding align-center solid-bottom" v-for="(item, index) in proTaskList" :key="item.id">
				<view class="text-black">
					<!-- <view class="">{{ item.taskNo }}</view> -->
					<view >{{ item.taskName }}</view>
				</view>
				<view class="text-right">
					<!-- <view class="text-gray">创建日期：{{ deliveryPeriod(item.createTime) }}</view> -->
					<view class="flex align-center justify-end text-cyan">
						<view class="solid-bottom input-bdc"><input style="width: 120rpx;" v-model="work_log_data[index].value" /></view>
						<text class="margin-left-sm">%</text>
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					人员工时
				</view>
			</view>
			<view class="flex align-center justify-between padding bg-white solid-bottom" v-for="(item, index) in proPersonList" :key="item.id">
				<view class="flex align-center">
					<view class="cu-avatar lg round bg-red" :style="{ backgroundImage: `url(${item.headImg})` }"></view>
					<view class="margin-left-sm">
						<view class="text-black">{{ item.pname }}</view>
						<view class="margin-top-sm">{{ item.typeName }}</view>
					</view>
				</view>
				<view class="flex align-center text-cyan">
					当日工时：
					<view class="solid-bottom input-bdc"><input style="width: 120rpx;text-align: right;" v-model="person_log_data[index].value" /></view>
					<text class="margin-left-sm">小时</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>
					{{ projectInfo.deviceName }}({{ projectInfo.deviceNum }})总体进度
				</view>
				<view class="action text-cyan">
					<view class="solid-bottom input-bdc"><input style="width: 120rpx;text-align: right;" v-model="all_progress.value" /></view>
					<text class="margin-left-sm">%</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					备注
				</view>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" placeholder="请输入备注" v-model="all_progress.remark"></textarea>
			</view>
			<view class="footer-tool bg-white solid-top margin-top">
				<button class="cu-btn bg-blue" @tap="save_log" style="flex:2;height: 100%;">提交</button>
				<!-- <button class="cu-btn round bg-blue" @tap="goto_recruiting">补招人员</button> -->
				<button class="cu-btn bg-red" style="flex:1;height: 100%;" @tap="back()">返回</button>
			</view>
		</template>
	</view>
</template>

<script>
import darkCalendar from '../../../../components/dark-calendar/dark-calendar.vue';
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			proPersonList: [],
			proTaskList: [],
			projectInfo: {},
			work_log_data: [],
			person_log_data: [],
			all_progress: {
				id: '',
				type: '',
				value: '',
				remark:''
			},
			workDate:'',
		};
	},
	components: {
		darkCalendar
	},
	computed: {
		...mapState(['bgt_c_task', 'bgt_ct_id']),
		no_data(){
			let projectInfo_b = JSON.stringify(this.projectInfo) == "{}",
				proTaskList_b = this.proTaskList.length == 0,
				proPersonList_b = this.proPersonList.length == 0
			return projectInfo_b &&  proTaskList_b && proPersonList_b
		}
	},
	onLoad() {
		uni.$on('refreshList', () => {
			console.log('refreshList');
			this.init()
		});
		this.init()
	},
	onUnload() {
		uni.$off('refreshJwt');
	},
	methods: {
		init(){
			this.workDate = this.$utils.format_date(new Date())
			this.get_day_log()
		},
		get_day_log() {
			this.$http
				.get('/personwx.getdaylog/1.0/', {
					proId: this.bgt_ct_id,
					workDate: this.workDate
				})
				.then(res => {
					console.log(res);
					let task_data = [],
						person_data = [];
					this.proPersonList = this.$_.get(res,'data.proPersonList',[]);
					this.proTaskList = this.$_.get(res,'data.proTaskList',[])
					this.projectInfo = this.$_.get(res,'data.projectInfo',{});
					this.proTaskList.forEach(item => {
						let obj = {
							id: item.id,
							type: item.type,
							value: this.$_.get(item,'schedule','')
						};
						task_data.push(obj);
					});
					this.proPersonList.forEach(item => {
						let obj = {
							id: item.id,
							type: item.type,
							value: this.$_.get(item,'dayHours','')
						};
						person_data.push(obj);
					});
					this.work_log_data = task_data;
					this.person_log_data = person_data;
					this.all_progress.id = this.projectInfo.id;
					this.all_progress.type = this.projectInfo.type;
					this.all_progress.value = this.$_.get(this.projectInfo,'schedule','')
					this.all_progress.remark = this.$_.get(this.projectInfo,'remark','')
				});
		},
		deliveryPeriod(time) {
			return this.$utils.format_date(time);
		},
		back(){
			uni.navigateBack({
				delta: 1
			});
		},
		save_log(){
			let data = this.work_log_data.concat(this.person_log_data,this.all_progress)
			console.log(data)
			console.log(JSON.stringify(data))
			this.$http.post('personwx.updatedaylog/1.0/',{
				workLogData:JSON.stringify(data)
			}).then(res =>{
				console.log(res)
				if(this.$_.get(res,'data.code','') == 0){
					uni.$emit('taskToWork')
					uni.showToast({
					    title: '日志提报成功',
					    duration: 2000,
						success: () => {
							setTimeout(() => {
								this.back()
							}, 300);
						}
					});
				}else{
					uni.showToast({
					    title: '日志提报失败',
					    duration: 2000,
					});
				}
			})
		},
		change_date(date){
			console.log(date)
			this.workDate = this.$utils.format_date(new Date(date))
			this.get_day_log()
		}
	}
};
</script>

<style lang="less" scoped>
.log-report {
	padding-bottom: 80rpx;
}
.input-bdc {
	&::after {
		border-color: #1cbbb4;
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
	button {
		border-radius: 0;
	}
}
.no-data {
	.no-data-img {
		width: 60%;
		margin: 0 auto;
		display: block;
	}
}
</style>
