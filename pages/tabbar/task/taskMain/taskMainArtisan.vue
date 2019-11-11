<template>
	<view class="task-main">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">任务详情</block>
		</cu-custom>
		<view class="scroll-box">
			<scroll-view class="scroll-v" scroll-y>
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作概要
					</view>
					<view class="action text-red">有效期：2019-10-29</view>
				</view>
				<view class="job-summary bg-white">
					<view class="text-black text-xl">招自动化设备电工钳工师傅</view>
					<view class="people margin-top-sm">
						<text class="want text-sm">
							钳工工价：
							<text class="text-red text-df">30元/时</text>
						</text>
						<text class="want text-sm margin-left">
							电工工价：
							<text class="text-red text-df">30元/时</text>
						</text>
					</view>
					<view class="tags margin-top-sm">
						<view class="cu-tag radius bg-red">包吃包住</view>
						<view class="cu-tag radius bg-red">要面试</view>
						<view class="cu-tag radius bg-red">经验不限</view>
						<view class="cu-tag radius bg-red">月结</view>
					</view>
					<view class="boss margin-top-sm">
						<view class="cu-avatar round bg-red">王</view>
						<text class="text-grey margin-left-sm">王老板</text>
						<view class="tel margin-left-sm text-xl">
							<text class="cuIcon-phone text-blue"></text>
							<text class="text-df">13666666666</text>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作要求描述
					</view>
				</view>
				<view class="requirements bg-white">
					<text class="requirements-main text-black text-df">1.本工作包吃包住\n 2.上工前需要面试，面试合格将录用。\n 3.工资按月结算，不拖欠款。</text>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作需求
					</view>
				</view>
				<view class="requirements bg-white">
					<text class="requirements-main text-black text-df">1.人数：电工 10人，钳工：10人\n 2.上工日期为：2019-10-30\n 3.工作地点：深圳市龙华新区大浪。</text>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						接活流程
					</view>
				</view>
				<view class="process bg-white">
					<view class="process-main">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-text text-white"></text>
						</view>
						
						<text class="text-df text-grey">申请接活</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue "></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-mail text-white"></text>
						</view>
						<text class="text-df text-grey">等待通知</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue"></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-check text-white"></text>
						</view>
						<text class="text-df text-grey">录用通知</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue"></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-repair text-white"></text>
						</view>
						<text class="text-df text-grey">上工</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="footer-tool bg-white padding solid-top">
			<button class="cu-btn round bg-blue" @tap="goto_work">我要接工作</button>
			<button class="cu-btn round bg-blue" @tap="go_back">我考虑下</button>
			<button class="cu-btn round bg-blue" @tap="go_back">不想接</button>
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
		goto_work(){
			this.$store.commit('setArtisanWorkState','waitStart')
			uni.switchTab({
				url:'../../workbench/workbench',
			})
		},
		go_back(){
			uni.navigateBack({
			    delta: 1
			});
		}
	}
};
</script>

<style lang="less" scoped>
.task-main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.scroll-box {
		flex: 1;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	.scroll-v {
		height: 100%;
		width: 100%;
	}
}

.job-summary {
	padding: 20rpx 30rpx;
	.people {
		display: flex;
		align-items: center;
		.want {
			display: flex;
			align-items: center;
		}
	}
	.tags {
		display: flex;
		align-items: center;
	}
	.boss {
		display: flex;
		align-items: center;
		.tel {
			display: flex;
			align-items: center;
		}
	}
}
.requirements {
	padding: 20rpx 30rpx;
}
.requirements-main {
}
.process{
	display: flex;
	padding: 20rpx 30rpx;
	justify-content: space-between;
	align-items: center;
}
.process-main{
	display: flex;
	flex-direction: column;
	align-items: center;
	.process-icon{
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 100%;
		margin-bottom: 10rpx;
	}
}
.process-arrow{
	padding-bottom: 40rpx;
}
.footer-tool {
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	.cu-btn{
		width: 200rpx;
		text-align: center;
	}
}

</style>
