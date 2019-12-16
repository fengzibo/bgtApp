<template>
	<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="0" :top="c_CustomBar">
		<view class="bg-gradual-red padding">
			<view class="flex align-center">
				<view class="text-center flex-sub">
					<view class="text-sm">任务总数</view>
					<view class="text-xxl" style="margin-top: 10rpx;">{{ round(headHoursInfo.allProjectNum) }}</view>
				</view>
				<view class="text-center flex-sub">
					<view class="text-sm">累计工时</view>
					<view class="text-xxl" style="margin-top: 10rpx;">{{ round(headHoursInfo.allHours) }}</view>
				</view>
				<view class="text-center flex-sub">
					<view class="text-sm">已结算工时</view>
					<view class="text-xxl" style="margin-top: 10rpx;">{{ round(headHoursInfo.settlementHours) }}</view>
				</view>
				<view class="text-center flex-sub">
					<view class="text-sm">结算金额(元)</view>
					<view class="text-xxl" style="margin-top: 10rpx;">{{ round(headHoursInfo.settlementIncome) }}</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>
				待结算人员列表
			</view>
		</view>
		<view class="no-data" v-if="no_data">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="aspectFit" class="no-data-img"></image>
		
		</view>
		<view class="bg-white solid-bottom padding" v-for="item in headHoursDetailList" :key="item.proId" >
			<view class="item-title flex justify-between padding-tb solid-bottom has-link" @tap="goto_detail(item)">
				<view class="text-black text-bold">
					{{ item.scompany }}
				</view>
				结算
			</view>
			<view class="flex justify-between align-center  padding-top">
				<view class="flex align-center">
					<view class="cu-avatar lg round" :style="{ backgroundImage: `url(${item.headImg})` }"></view>
					<view class="margin-left-sm">
						<view class="name">
							<text class="text-cyan">{{ item.pname }}</text>
							<text class="margin-left-sm">{{ item.typeName }}</text>
						</view>
						<view class="text-grey margin-top-sm">{{ item.deviceName }}({{ item.deviceNum }})</view>
					</view>
				</view>
				<view class="text-cyan">
					<view class="flex align-center">
						<text class="text-cyan text-xxl">{{ item.cumulativeHours || 0 }}</text>
						<text style="margin-left: 6rpx;">小时</text>
					</view>
					<view class="text-grey margin-top-sm">{{ item.proStartTime }}</view>
				</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false,
				textNoMore:'-- 已经到底了 --'
			},
			hours_detail: {},
			loading: true
		};
	},
	comments: {},
	computed: {
		c_CustomBar() {
			return this.CustomBar;
		},
		...mapGetters(['id']),
		headHoursDetailList() {
			return this.$_.get(this.hours_detail, 'headHoursDetailList', []);
		},
		headHoursInfo() {
			return this.$_.get(this.hours_detail, 'headHoursInfo', {});
		},
		no_data() {
			return !this.loading && this.headHoursDetailList.length == 0;
		}
	},
	mounted() {
		uni.$on('refreshJwt',() =>{
			console.log('refreshJwt')
			this.init()
		})
		this.init();
	},
	beforeDestroy() {
		uni.$off('refreshJwt')
	},
	methods: {
		init() {
			this.get_hours_detail();
		},
		get_hours_detail() {
			this.$http
				.get('personwx.headhoursdetail/1.0/', {
					pid: this.id
				})
				.then(res => {
					console.log(res);
					this.hours_detail = res.data.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		async upCallback(mescroll) {
			//联网加载数据
			await this.get_hours_detail();
			mescroll.endSuccess(false);
		},
		goto_detail(item){
			uni.navigateTo({
				url: `/pages/tabbar/workHours/hoursSettle/hoursSettle?item=` + encodeURIComponent(JSON.stringify(item))
			});
		},
		round(num){
			let res = this.$_.round(this.$_.toNumber(num),2)
			return this.$_.isNaN(res)?0:res
		}
	}
};
</script>

<style lang="less" scoped>
.no-data {
	.no-data-img {
		width: 60%;
		margin: 0 auto;
		display: block;
	}
}
.has-link{
	position: relative;
	padding-right: 34rpx;
	&::before{
		font-family: cuIcon;
		display: block;
		content: "\E6A3";
		position: absolute;
		font-size: 34rpx;
		color: #8799a3;
		line-height: 100rpx;
		width: 60rpx;
		text-align: center;
		top: 0;
		bottom: 0;
		right: -20rpx;
		margin: auto;

	}
}
</style>
