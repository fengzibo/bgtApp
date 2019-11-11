<template>
	<view class="task-index">
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">任务中心</block>
		</cu-custom>
		<view class="no-task" v-if="!has_task">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">没有任务</text><br>
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_add">前往创建任务</button>
		</view>
		<template v-if="user_role=== 'head' && has_task">
			<view class="tab-list bg-white">
				<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
					<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
				</view>
			</view>
			<swiper :current="current_tab.index" class="swiper-box" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item" v-for="(tab, index1) in tab_list" :key="index1">
					<scroll-view class="scroll-v" scroll-y @scrolltolower="loadMore(index1)">
						<view class="list">
							<view class="list-item bg-white " v-for="(item, index2) in tab.data" :key="index2" @tap="go_detail(item)">
								<view class="top-main text-grey">
									<text class="title">{{ item.name }}</text>
									<text class="time">交期：{{ item.time }}</text>
								</view>
								<view class="center-main">
									<view class="schedule">
										<text class="schedule-num">进度 {{ item.schedule }}</text>
										<view class="schedule-bar" :style="{width: item.schedule}"></view>
									</view>
									<view class="com-view">
										<text class="num">{{ item.hour }}</text>
										<text class="tip text-grey">累计工时</text>
									</view>
									<view class="com-view">
										<text class="num">{{ item.cost }}</text>
										<text class="tip text-grey">累计成本</text>
									</view>
									<view class="com-view">
										<text class="num err-color">{{ item.err }}</text>
										<text class="tip text-grey">累计异常</text>
									</view>
								</view>
								<view class="bottom-main text-gray">
									<text class="cuIcon-locationfill margin-right-xs"></text>
									<text>{{ item.address }}</text>
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
		<task-artisan v-if="user_role=== 'artisan' && has_task" class="task-artisan"></task-artisan>
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
					data: [
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '100%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						},
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '80%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						},
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '60%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						}
					]
				},
				{
					name: '待点评',
					id: 'ddp',
					data: [
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '80%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						},
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '80%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						}
					]
				},
				{
					name: '已完成',
					id: 'ywc',
					data: [
						{
							name: '全自动热压机',
							time: '2019-09-30',
							schedule: '80%',
							hour: 210,
							cost: 40000,
							err: 20,
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301'
						}
					]
				}
			],
			current_tab: {
				id: 'dcrw',
				index: 0
			}
		};
	},
	onLoad() {
		
		try {
		    const value = uni.getStorageSync('user_info');
		    if (!value) {
		        console.log(value);
		    	uni.reLaunch ({
		    		url: '../../welcome/welcome'
		    	})
		    }else{
		    }
		} catch (e) {
		    // error
			console.log(e)
		}
	},
	components:{
		taskArtisan
	},
	computed: {
		...mapState(['has_task']),
		...mapGetters(['user_role'])
	},
	methods: {
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
			uni.navigateTo({
				url: '/pages/tabbar/task/taskMain/taskMain'
			});
		},
		goto_add(){
			uni.navigateTo({
				url: '/pages/tabbar/task/createTask/createTask'
			});
		},
		
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
	justify-content: space-between;
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
