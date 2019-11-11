<template>
	<view class="task-main">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">任务详情</block>
		</cu-custom>
		<view class="main-top-info bg-white border-bottom">
			<view class="top-main text-grey">
				<text class="title">{{ detail_res.name }}</text>
				<text class="time">交期：{{ detail_res.time }}</text>
			</view>
			<view class="center-main">
				<view class="com-view">
					<text class="num">{{ detail_res.member }}</text>
					<text class="tip text-grey">累计工时</text>
				</view>
				<view class="com-view">
					<text class="num">{{ detail_res.hour }}</text>
					<text class="tip text-grey">累计工时</text>
				</view>
				<view class="com-view">
					<text class="num">{{ detail_res.cost }}</text>
					<text class="tip text-grey">累计成本</text>
				</view>
				<view class="com-view">
					<text class="num err-color">{{ detail_res.err }}</text>
					<text class="tip text-grey">累计异常</text>
				</view>
			</view>
			<view class="bottom-main">
				<view class="cu-progress round sm striped active "><view class="schedule-bar" :style="{ width: detail_res.schedule }"></view></view>

				<text class="schedule-num">进度 {{ detail_res.schedule }}</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>
				工作服务
			</view>
		</view>
		<view class="cu-list grid col-4 no-border">
			<view class="cu-item">
				<view class="cuIcon-scan text-purple">
					<!-- <view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view> -->
				</view>
				<text>扫码</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-group text-blue"></view>
				<text>人员管理</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-form text-cyan"></view>
				<text>任务计划</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-warn text-orange"></view>
				<text>装备异常</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-calendar text-cyan"></view>
				<text>日志提报</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-read text-brown"></view>
				<text>文档查阅</text>
			</view>
			<view class="cu-item">
				<view class="cuIcon-text text-green"></view>
				<text>任务结案</text>
			</view>
			<!-- <view class="cu-item" @click="switch_list">
				<view class="cuIcon-list text-grey"></view>
				<text>切换列表模式</text>
			</view> -->
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>
				任务日报
			</view>
		</view>
		<view class="uni-timeline">
			<view class="uni-timeline-item uni-timeline-first-item">
				<view class="uni-timeline-item-keynode">2019/09/30</view>
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<text class="title">项目总进度 80%，距交期还有30天</text>
					<text class="info">
						计划数【共20/新增5/完成10】
					</text>
					<text class="info">
						人员数【共9/新加0/下工6】
					</text>
					<text class="info">
						异常数【共20/新增0/关闭15】
					</text>
				</view>
			</view>
			<view class="uni-timeline-item">
				<view class="uni-timeline-item-keynode">2019/09/29</view>
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<text class="title">项目总进度 70%，距交期还有30天</text>
					<text class="info">
						计划数【共20/新增5/完成10】
					</text>
					<text class="info">
						人员数【共9/新加0/下工6】
					</text>
					<text class="info">
						异常数【共20/新增0/关闭15】
					</text>
				</view>
			</view>
			<view class="uni-timeline-item uni-timeline-last-item">
				<view class="uni-timeline-item-keynode">2019/09/28</view>
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<text class="title">项目总进度 60%，距交期还有30天</text>
					<text class="info">
						计划数【共20/新增5/完成10】
					</text>
					<text class="info">
						人员数【共9/新加0/下工6】
					</text>
					<text class="info">
						异常数【共20/新增0/关闭15】
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail_res: {
				name: '全自动热压机',
				time: '2019-09-30',
				schedule: '40%',
				hour: 210,
				cost: 40000,
				err: 20,
				address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
				member: 7
			}
		};
	},
	methods: {
		switch_list(){
			uni.switchTab({
				url: '/pages/tabbar/task/task'
			});
		}
	}
};
</script>

<style lang="less" scoped>
.task-main {
}
.main-top-info {
	padding: 30rpx;
	.top-main {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		.title {
			font-weight: bold;
		}
	}
	.center-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		.com-view {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.num {
				font-weight: bold;
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
		.schedule-num {
			font-weight: bold;
			margin-left: 30rpx;
			flex: 0 0 auto;
			color: #f37b1d;
		}
		.schedule-bar {
			background-image: linear-gradient(90deg, #ff9700, #ed1c24);
		}
	}
}
.uni-timeline {
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 30rpx;
	background-color: #fff;
	margin-top: 1rpx;
}
.uni-timeline-item {
	display: flex;
	flex-direction: row;
	position: relative;
	padding-bottom: 10rpx;
	box-sizing: border-box;
	overflow: hidden;
	.uni-timeline-item-keynode {
		flex-shrink: 0;
		box-sizing: border-box;
		padding-right: 20upx;
		text-align: right;
		font-size: 12px;
		color: #101010;
		line-height: 38rpx;
	}
	.uni-timeline-item-divider {
		flex-shrink: 0;
		position: relative;
		width: 16upx;
		height: 16upx;
		top: 8upx;
		border-radius: 50%;
		background-color: #bbb;
	}
}

.uni-timeline-item-divider::before,
.uni-timeline-item-divider::after {
	position: absolute;
	left: 8rpx;
	width: 1upx;
	height: 100vh;
	content: '';
	background: inherit;
}

.uni-timeline-item-divider::before {
	bottom: 100%;
}

.uni-timeline-item-divider::after {
	top: 100%;
}

.uni-timeline-last-item .uni-timeline-item-divider:after {
	display: none;
}

.uni-timeline-first-item .uni-timeline-item-divider:before {
	display: none;
}

.uni-timeline-item .uni-timeline-item-content {
	padding-left: 20rpx;
}

.uni-timeline-last-item .bottom-border::after {
	display: none;
}

.uni-timeline-item-content .datetime {
	color: #cccccc;
}

/* 自定义节点颜色 */
.uni-timeline-first-item .uni-timeline-item-divider {
	background-color: #1aad19;
}
.uni-timeline-item-content{
	.title{
		font-size: 12px;
		color: #101010;
		font-weight: bold;
		padding-bottom: 10rpx;
		display: block;
	}
	.info{
		font-size: 10px;
		color: #98979A;
		display: block;
		padding: 8rpx 0;
	}
}
</style>
