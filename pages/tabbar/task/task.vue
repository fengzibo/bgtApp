<template>
	<view class="task-index">
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">任务中心</block>
		</cu-custom>
		<view class="no-task" v-if="!has_task && !loading">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">没有任务</text><br>
			<view class="flex margin-top justify-around">
				<button class="cu-btn round bg-gradual-green lg" @tap="init">刷新任务</button>
				<button class="cu-btn round bg-gradual-blue lg" @tap="goto_add">前往创建任务</button>
				
			</view>
		</view>
		<template v-if="user_role=== 'head' && has_task && !loading">
			<view class="tab-list bg-white">
				<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
					<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
				</view>
			</view>
			<swiper :current="current_tab.index" class="swiper-box" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item" v-for="(tab, index1) in tab_list" :key="index1">
					<scroll-view class="scroll-v" scroll-y @scrolltolower="loadMore(index1)">
						<view class="list">
							<view class="list-item bg-white " v-for="item in tab.data" :key="item.id" @tap="go_detail(item)">
								<view class="top-main text-grey">
									<text class="title">{{ item.deviceName }}({{item.deviceNum}})</text>
									<text class="time">交期：{{ deliveryPeriod(item.deliveryPeriod) }}</text>
								</view>
								<view class="center-main">
									<view class="schedule">
										<template v-if="item.status == '3'">
											<text class="schedule-num">进度 {{ item.proProgress || 0 }}%</text>
											<view class="schedule-bar" :style="{width: item.proProgress || 0}"></view>
										</template>
										<view class="schedule-num text-green" v-else>
											{{item.status == '2'?'待启动':'招募中'}}
										</view>
									</view>
									<view class="com-view">
										<text class="num">{{ item.limit }}</text>
										<text class="tip text-grey">累计工时</text>
									</view>
									<view class="com-view">
										<text class="num err-color">{{ item.err || 0 }}</text>
										<text class="tip text-grey">累计异常</text>
									</view>
									<view class="com-view">
										<text class="num"><text class="text-blue">{{item.ss || 0}}</text>/ <text >{{ item.budget }}</text> </text>
										<text class="tip text-grey">实时/预算</text>
									</view>
								</view>
								<view class="bottom-main text-gray">
									<text class="cuIcon-locationfill margin-right-xs"></text>
									<text>{{ item.scompany }}</text>
								</view>
							</view>
						</view>
						<!-- <view class="loading-more">
			                <text class="loading-more-text">{{tab.loadingText}}</text>
			            </view> -->
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="fixed-add shadow bg-blue" @tap="goto_add">
				<view class="cuIcon-add text-white text-df"></view>
			</view>
		</template>
		<task-artisan v-if="user_role=== 'artisan'" class="task-artisan"></task-artisan>
	</view>
</template>

<script>
import { mapState,mapGetters } from 'vuex';
import 	taskArtisan from './taskArtisan.vue'
export default {
	data() {
		return {
			tab_list: [
				{
					name: '当前任务',
					id: 'dcrw',
					data:[]
				},
				{
					name: '已完成',
					id: 'ywc',
					data:[]
				}
			],
			current_tab: {
				id: 'dcrw',
				index: 0
			},
			loading:true
		};
	},
	onLoad() {
		console.log('onLoad')
		try {
			const version = uni.getStorageSync('version')
			console.log('version',version)
			if(version !== '1.1.2'){
				uni.clearStorageSync();
				uni.reLaunch ({
					url: '/pages/welcome/welcome'
				})
				return 
			}
			const value = uni.getStorageSync('user_info');
			console.log(value)
			if (!value) {
				uni.reLaunch ({
					url: '/pages/welcome/welcome'
				})
			}else{
				if(this.user_role=== 'head'){
					this.init()
				}
			}
		} catch (e) {
		    // error
			console.log(e)
		}
		uni.$on('refreshList',() =>{
			console.log('refreshList')
			if(this.user_role=== 'head'){
				this.init()
			}
		})
		uni.$on('refreshJwt',(data) =>{
			console.log('refreshJwt',data)
			if(this.user_role=== 'head'){
				this.init()
			}
		})
	},
	onShow() {
		console.log('show')
	},
	onReady() {
		console.log('ready')
	},
	onUnload() {
		uni.$off('refreshList')
		uni.$off('refreshJwt')
	},
	components:{
		taskArtisan
	},
	watch:{
		user_role(val){
			console.log(val)
			if(val=== 'head'){
				this.init()
			}
		},
		refresh_num(val){
			console.log('task_refresh_num',val)
		}
	},
	computed: {
		...mapState(['refresh_num']),
		...mapGetters(['user_role']),
		has_task(){
			console.log('has_task',this.tab_list[this.current_tab.index])
			return this.$utils._get(this.tab_list[this.current_tab.index],'data',[]).length>0
		}
	},
	methods: {
		init(){
			Promise.all([this.get_dcrw_list(),this.get_ywc_list()]).then(values =>{
				console.log(values)
				this.tab_list[0].data = this.$utils._get(values[0],'data.data',[]) 
				this.tab_list[1].data = this.$utils._get(values[1],'data.data',[]) 
				this.loading = false
			})
		},
		get_dcrw_list(){
			return this.$http.get('personwx.projectinfolist/1.0/',{
				isFinish:'0',
			})
		},
		get_ywc_list(){
			return this.$http.get('personwx.projectinfolist/1.0/',{
				isFinish:'1',
			})
		},
		select_tab(id, index) {
			this.current_tab.id = id;
			this.current_tab.index = index;
		},
		ontabchange(event) {
			console.log(event);
			let index = event.detail.current;
			this.current_tab.index = index;
			this.current_tab.id = this.tab_list[index].id;
		},
		loadMore(index) {
			console.log(index);
		},
		go_detail(item){
			console.log(item)
			let status = this.$utils._get(item,'status','0')
			this.$store.commit('setCurrentTask',item)
			switch (status){
				case '0':
				case '1':
					uni.navigateTo({
						url: `/pages/tabbar/task/createTask/createTask?id=${item.id}`
					});
					break;
				case '2':
					uni.switchTab({
						url:"/pages/tabbar/workbench/workbench"
					})
					break;
				default:
					break;
			}
			
			// if(this.$utils._get(item,'status','0') == '0'){
			// 	uni.switchTab({
			// 		url:"/pages/tabbar/workbench/workbench"
			// 	})
			// }else{
			// 	uni.navigateTo({
			// 		url: '/pages/tabbar/task/taskMain/taskMain'
			// 	});
			// }
		},
		goto_add(){
			uni.navigateTo({
				url: '/pages/tabbar/task/createTask/createTask'
			});
		},
		deliveryPeriod(time){
			return this.$utils.format_date(time)
		}
	}
};
</script>

<style scoped lang="less">
.task-index {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
}
.tab-list {
	padding: 0 30rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 90rpx;
	flex: 0 0 auto;
	.item {
		display: block;
		padding: 18rpx 0;
		border-bottom: 1px solid #7e8095;
		color: #7e8095;
		transition: all 0.3s;
		&.active {
			color: #0d64ff;
			border-color: #0d64ff;
		}
	}
}
.swiper-box {
	flex: 1 1 0;
	height: 100%;
	overflow: hidden;
	.scroll-v {
		height: 100%;
	}
	.list{
		padding-top: 10rpx;
	}
	.list-item {
		padding: 20rpx 30rpx;
		margin-bottom: 10rpx;
		.top-main {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			.title {
				// font-weight: bold;
			}
		}
		.center-main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			.schedule {
				width: 190rpx;
				color: #f37b1d;
				display: flex;
				flex-direction: column;
				font-size: 16px;
				flex: 0 0 auto;
				.schedule-num {
					font-weight: bold;
				}
				.schedule-bar{
					position: relative;
					height: 10rpx;
					border-radius: 5rpx;
					overflow: hidden;
					&:before{
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 5rpx;
						width: 160rpx;
						height: 10rpx;
						background-image: linear-gradient(90deg, #ff9700, #ed1c24);
					}
				}
			}
			.com-view {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.num {
					// font-weight: bold;
					color: #101010;
					font-size: 16px;
					&.err-color {
						color: #e51c23;
					}
				}
				.tip {
					font-size: 12px;
					margin-top: 10rpx;
				}
			}
		}
		.bottom-main {
			display: flex;
			align-items: center;
			font-size: 10px;
		}
	}
}
.fixed-add{
	position: absolute;
	bottom: 30rpx;
	right: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60rpx;
	height: 60rpx;
	border-radius: 100%;
}
.no-task{
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
.task-artisan{
	flex: 1 1 0;
}
</style>
