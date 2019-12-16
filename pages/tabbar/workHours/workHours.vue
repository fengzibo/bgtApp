<template>
	<view>
		<cu-custom bgColor="bg-gradual-red">
			<block slot="backText">返回</block>
			<block slot="content">工时</block>
		</cu-custom>
		<!-- <view class="work-hours">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/WechatIMG79.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">建设中</text>
			<br />
		</view> -->
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="0" :top="c_CustomBar" v-if="user_role==='artisan'">
			<view class="bg-gradual-red" style="padding: 0 15px;">
				<!-- <view class="flex fitler-head solid">
					<view class="flex-sub text-center" :class="[{'active':active_filter==='seven'}]" @tap="filter_time('seven')">近7天</view>
					<view class="flex-sub text-center solid-left" :class="[{'active':active_filter==='month'}]" @tap="filter_time('month')">最近一个月</view>
					<view class="flex-sub text-center solid-left" :class="[{'active':active_filter==='all'}]" @tap="filter_time('all')">全部</view>
				</view> -->
				<!-- <view class="case-all">
					<button class="cu-btn round bg-grey sm">
						查看全部明细
						<text class="cuIcon-right"></text>
					</button>
				</view> -->
				<view class="flex justify-around text-white padding-tb">
					<view class="text-center">
						<view class="text-sm">累计工时(小时)</view>
						<view class="text-sl" style="margin-top: 6rpx;">{{ personHoursInfo.allHours || 0 }}</view>
					</view>
					<view class="text-center">
						<view class="text-sm">累计收入(元)</view>
						<view class="text-sl" style="margin-top: 6rpx;">{{ personHoursInfo.allIncome || 0 }}</view>
					</view>
				</view>
				
				<view class="flex padding-bottom text-white">
					<view class="flex-sub text-center">
						<view class="text-xxl">{{ personHoursInfo.settlementHours || 0 }}</view>
						<view class="text-sm" style="margin-top: 6rpx;">已结算</view>
					</view>
					<view class="flex-sub text-center">
						<view class="text-xxl">{{ personHoursInfo.settlementIncome || 0 }}</view>
						<view class="text-sm" style="margin-top: 6rpx;">结算金额(元)</view>
					</view>
					<view class="flex-sub text-center">
						<view class="text-xxl">{{ personHoursInfo.unSettlementHours || 0 }}</view>
						<view class="text-sm" style="margin-top: 6rpx;">待结算</view>
					</view>
				</view>
				<view class="text-white text-sm solid-top padding-tb-sm flex align-center">
					<view class="lg text-wihte cuIcon-warnfill text-sm"></view>
					工时统计和结算金额仅供参考，最终以实际结算为主
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>
					工时变动记录
				</view>
			</view>
			<view class="flex justify-between align-center bg-white solid-bottom padding" v-for="item in personHoursDetailList" :key="item.id">
				<view class="">
					<view class="text-cyan text-sm">
						{{deliveryPeriod(item.workTimeDate)}}
					</view>
					<view class="text-black text-lg margin-tb-sm">
						全自动热压机组装
					</view>
					<view class="flex text-sm text-gray align-center">
						<text class="cuIcon-locationfill margin-right-xs"></text>
						<text>{{item.scompany}}</text>
					</view>
				</view>
				<view class="text-cyan">
					<view class="text-xxl">
						{{item.isSettlement === '0'?'+':'-'}}{{item.validTotalNum}}
					</view>
					<view class="text-df margin-top-sm">
						{{item.isSettlement === '0'?'上班':'结算'}}
					</view>
				</view>
			</view>
			
		</mescroll-uni>
		<hours-head  v-if="user_role==='head'" ></hours-head>
	</view>
</template>
<script>
	import { mapState,mapGetters } from 'vuex';
import hoursHead from './workHoursHead.vue'
let i = 0;
export default {
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: true,
				textNoMore:'-- 已经到底了 --'
			},
			zgs: '',
			yjs: '',
			yjsy: '',
			jsygsr: '',
			active_filter:'seven',
			hours_detail:{}
		};
	},
	components:{
		hoursHead
	},
	computed: {
		c_CustomBar() {
			return this.CustomBar;
		},
		...mapGetters(['user_role','id']),
		personHoursDetailList(){
			return this.$_.get(this.hours_detail,'personHoursDetailList',[])
		},
		personHoursInfo(){
			return this.$_.get(this.hours_detail,'personHoursInfo',{})
		}
	},
	onLoad() {
		// this.init()
		uni.$on('refreshJwt',() =>{
			console.log('refreshJwt')
			if(this.user_role !== 'head'){
				this.init()
			}
		})
	},
	onUnload() {
		uni.$off('refreshJwt')
	},
	methods: {
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			//联网加载数据
			this.get_hours_detail(() =>{
				this.$nextTick(() =>{
					mescroll.endSuccess(this.personHoursDetailList.length, false)
				})
			})
		},
		numDH() {
			if (i < 20) {
				setTimeout(() => {
					this.zgs = i;
					this.yjs = i;
					this.yjsy = i;
					this.jsygsr = i;
					i++;
					this.numDH();
				}, 20);
			} else {
				this.zgs = this.coutNum(65);
				this.yjs = this.coutNum(15);
				this.yjsy = this.coutNum(4567);
				this.jsygsr = this.coutNum(2023);
			}
		},
		coutNum(e) {
			// if (e > 1000 && e < 10000) {
			// 	e = (e / 1000).toFixed(1) + 'k';
			// }
			if (e > 10000) {
				e = (e / 10000).toFixed(1) + 'W';
			}
			return e;
		},
		filter_time(type){
			this.active_filter = type
		},
		init(){
			if(this.user_role==='artisan'){
				this.get_hours_detail()
			}
		},
		get_hours_detail(cb){
			this.$http.get('personwx.personhoursdetail/1.0/',{
				pid:this.id
			}).then(res =>{
				console.log(res)
				this.hours_detail = res.data.data
			}).finally(() =>{
				if (typeof cb === 'function') {
					cb();
				}
			})
		},
		deliveryPeriod(time) {
			return this.$utils.format_date(time);
		},
	}
};
</script>

<style lang="less" scoped>
.work-hours {
	width: 100%;
	padding: 30rpx;
	text-align: center;
}
.fitler-head {
	width: 70%;
	margin: 0 auto;
	&::after {
		border-color: #e54d42;
	}
	.flex-sub {
		padding: 15rpx 0;
		&.solid-left {
			&::after {
				border-color: #e54d42;
			}
		}
		&.active {
			background-color: #e54d42;
		}
	}
}
.case-all{
	position: relative;
	text-align: right;
	.cu-btn{
		position: relative;
		right:15rpx;
		top: 20rpx;
	}
}
</style>

