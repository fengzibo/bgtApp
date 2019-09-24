<template>
	<view>
		<view class="no-team" v-if="!has_team">
			<image src="../../../static/no-team.png" mode="widthFix"></image>
			<button class="cu-btn block bg-blue lg margin-top-lg" @tap="goto_add">
				<text class="cuIcon-roundadd"></text>
				添加团队
			</button>
		</view>
		<template v-else>
			<cu-custom bgColor="bg-gradual-blue" :isBack="false">
				<!-- <block slot="backText">返回</block> -->
				<block slot="content">我的团队</block>
			</cu-custom>
			<view class="team-main padding shadow-warp">
				<view class="flex align-center team-info">
					<view class="cu-avatar xl round bg-red"></view>
					<view class="margin-left team-text">
						<view class="team-name text-xxl margin-bottom-sm">团队名字</view>
						<view class="team-addr text-cut text-lg text-gray">
							<text class="cuIcon-locationfill"></text>
							团队地址
						</view>
					</view>
					<view class="team-recruit">
						<view class="ewm text-sl text-center"><text class="cuIcon-qr_code"></text></view>
						<button class="cu-btn bg-blue">招募成员</button>
					</view>
				</view>
				<view class="team-intro text-df margin-top">我们是一个什么杨团队，我们要干什么，将来这个团队会变成一个什么杨的团队</view>
				<view class="flex text-center text-grey solid-top margin-top padding-top">
					<view class="flex flex-sub flex-direction solid-right">
						<navigator url="/pages/tabbar/team/auditList/auditList" hover-class="none">
							<view class="text-xxl text-orange">1000</view>
						</navigator>
						<view class="margin-top-sm">
							<!-- <text class="cuIcon-repairfill margin-right-xs"></text> -->
							待审核人数
						</view>
					</view>
					<view class="flex flex-sub flex-direction solid-right">
						<view class="text-xxl text-blue">2000</view>
						<view class="margin-top-sm">
							<!-- <text class="cuIcon-timefill margin-right-xs"></text> -->
							今日新增人数
						</view>
					</view>
					<view class="flex flex-sub flex-direction">
						<navigator url="/pages/tabbar/team/teamMember/teamMember" hover-class="none">
							<view class="text-xxl text-green">100</view>
						</navigator>
						<view class="margin-top-sm">
							<!-- <text class="cuIcon-favorfill margin-right-xs"></text> -->
							总人数
						</view>
					</view>
				</view>
			</view>

			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>
					数据统计
				</view>
				<view class="action">
					<button class="cu-btn bg-blue">一个月</button>
					<button class="cu-btn bg-blue margin-left">三个月</button>
				</view>
			</view>
			<t-chart></t-chart>
		</template>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import tChart from './teamChart.vue';
export default {
	data() {
		return {};
	},
	components: {
		tChart
	},
	computed: {
		...mapState(['has_team'])
	},
	methods: {
		goto_add() {
			uni.navigateTo({
				url: '/pages/tabbar/team/addTeam/addTeam'
			});
		}
	}
};
</script>

<style lang="less" scoped>
.no-team {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: calc(100vh - var(--window-bottom));
	image {
		width: 80%;
	}
}
.team-main {
	background-color: #ffffff;
}
.team-info {
	.cu-avatar {
		flex: 0 0 auto;
	}
	.team-text {
		flex: 1 1 auto;
	}
	.team-recruit {
		flex: 0 0 auto;
	}
}
</style>
