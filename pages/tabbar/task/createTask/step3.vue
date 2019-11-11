<template>
	<view class="steps-main">
		<view class="task-main">
			<view class="title text-lg">招自动化设备电工、钳工师傅</view>
			<view class="text-grey margin-top-sm">
				电工<text class="text-red">8</text>/<text class="text-blue" style="margin-right:20rpx;">10</text>
				钳工<text class="text-red">8</text>/<text class="text-blue">10</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top title">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				应招人员列表(<text class="text-text-orange">12</text>)人
			</view>
			<view class="action">
				<button class="cu-btn round bg-blue" @tap="show_modal = !show_modal"><text class="cuIcon-add"></text>招募人员</button>
			</view>
		</view>
		<view class="no-list text-gray text-lg" v-if="list.length<=0">
			暂无人员，请点击招募人员按钮进行招募
		</view>
		<view class="people-list" v-else>
			<view class="item padding bg-white solid-bottom" v-for="(item,index) in list" :key="index" @tap="goto_detail">
				<view class="content">
					<view class="cu-avatar round lg bg-blue"></view>
					<view class="content-info margin-left">
						<view class="content-info-top">
							<view class="text-orange"><view class="text-cut">{{item.name}}</view></view>
							<view class="text-gray text-sm margin-left">{{item.age}}岁</view>
							<view v-for="tag in item.tag" :key="tag">
								<view class='cu-tag  margin-left line-green'>{{tag}}</view>
							</view>
						</view>
						<view class="content-info-addr text-grey text-sm">
							<text class="cuIcon-locationfill margin-right-xs"></text>
							<text>{{ item.address }}</text>
						</view>
					</view>
				</view>
				<view class="action">
					<view class="text-xs people-status bg-grey" :class="[status_class(item.status_no)]">{{item.status}}</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="show_modal?'show':''" @tap="show_modal=!show_modal">
			<view class="cu-dialog" @tap.stop="">
				<view class="padding-xl">
					<button class="cu-btn block bg-blue margin-tb-sm lg" open-type="share">
						发送到群招募
					</button>
					<button class="cu-btn block bg-blue margin-tb-sm lg">
						<!-- <text class="cuIcon-loading2 cuIconfont-spin"></text> -->
						精准人员招募
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list:[
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'待审核',
					status_no:2,
				},
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'已录用',
					status_no:1,
				},
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'已拒绝',
					status_no:0,
				},
			],
			show_modal:false,
		};
	},
	onShareAppMessage(res) {
		console.log(res)
	    if (res.from === 'button') {// 来自页面内分享按钮
	      console.log(res.target)
	    }
	    return {
	      title: '快来加入我们',
	      path: 'pages/tabbar/task/task',
		  imageUrl:'@/static/no-team.png'
	    }
	},
	computed: {},
	methods: {
		goto_detail(){
			uni.navigateTo({
				url: '/pages/auditDetail/auditDetail'
			});
		},
		status_class(status_no){
			if(status_no === 1){
				return 'bg-gradual-green'
			}else if(status_no === 2){
				return 'bg-gradual-blue'
			}else{
				return ''
			}
		}
	}
};
</script>

<style lang="less" scoped>
.steps-main {
	height: 100%;
	width: 100%;
}
.task-main{
	display: flex;
	flex-direction: column;
	background-color: #fff;
	padding: 20rpx 30rpx;
	.title{
		
	}
}
.no-list{
	text-align: center;
	line-height: 100rpx;
	
}
.people-list{
	.item{
		display: flex;
		align-items: center;
		.content{
			display: flex;
			align-items: center;
			flex: 1 1 auto;
			width: 100%;
			.content-info{
				display: flex;
				flex-direction: column;
				.content-info-top{
					display: flex;
					align-items: center;
				}
				.content-info-addr{
					display: flex;
					align-items: center;
					margin-top: 10rpx;
				}
			}
		}
		.action{
			flex:0 0 auto;
			.people-status{
				width: 96rpx;
				height: 96rpx;
				border-radius: 100%;
				text-align: center;
				line-height: 96rpx;
				color: #fff;
			}
		}
	}
	
}
</style>
