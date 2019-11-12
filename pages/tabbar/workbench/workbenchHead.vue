<template>
	<view>
		<view class="padding">
			<view class="bg-white padding skills-card">
				<view class="info-main" :style="{ height: is_unfold ? 'auto' : '220rpx' }">
					<view class="flex justify-between">
						<view class="text-lg text-black">全自动热压机装配</view>
						<view class="text-lg">
							<text class="cuIcon-writefill text-blue"></text>
						</view>
					</view>
					
					<view class="info-box">
						<view class="label text-gray">开工日期：</view>
						<view class="text text-black">2019-10-30</view>
					</view>
					<view class="info-box">
						<view class="label text-gray">工作地点：</view>
						<view class="text text-black">深圳市龙华区大浪街</view>
					</view>
					<view class="info-box">
						<view class="label text-gray">注意事项：</view>
						<view class="text text-black">
							<view class="margin-bottom-sm">1.记得带上身份证</view>
							<view class="margin-bottom-sm">2.记得带上身份证</view>
						</view>
					</view>
				</view>

				<view class="unfold-more text-grey text-sm" @tap="is_unfold = !is_unfold">{{ is_unfold ? '收起更多' : '展开更多' }}</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom title">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				人员列表(
				<text class="text-orange" style="vertical-align: middle;">12</text>
				)人
			</view>
		</view>
		<view class="people-list">
			<view class="item padding bg-white solid-bottom" v-for="(item, index) in list" :key="index" @tap="goto_detail">
				<view class="action solid-right">
					<view class="text-lg people-status " :class="[status_class(item.status_no)]">{{ item.status }}</view>
				</view>
				<view class="content">
					<view class="cu-avatar round lg bg-blue"></view>
					<view class="content-info margin-left">
						<view class="content-info-top">
							<view class="text-orange">
								<view class="text-cut">{{ item.name }}</view>
							</view>
							<view class="text-gray text-sm margin-left">{{ item.age }}岁</view>
							<view v-for="tag in item.tag" :key="tag">
								<view class="cu-tag  margin-left line-green">{{ tag }}</view>
							</view>
						</view>
						<view class="content-info-addr text-grey text-sm">
							<text class="cuIcon-locationfill margin-right-xs"></text>
							<text>{{ item.address }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-tool bg-white solid-top">
			<button class="cu-btn round bg-blue">发送开工确认</button>
			<button class="cu-btn round bg-blue">补招人员</button>
			<button class="cu-btn round bg-red">关闭任务</button>
		</view>
	</view>
</template>

<script>
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
			]
		};
	},
	mounted() {
		this.init()
	},
	methods: {
		init(){
			
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
		goto_detail() {
			uni.navigateTo({
				url: '/pages/auditDetail/auditDetail'
			});
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
		align-items: flex-start;
		margin-top: 20rpx;
		.label {
			flex: 0 0 auto;
		}
		.text {
			flex: 1;
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
	height: 100rpx;
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 10;
}
</style>
