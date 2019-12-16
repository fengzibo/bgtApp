<template>
	<view>
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">工时结算</block>
			</cu-custom>
			<view class="plh-height"></view>
		</view>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="130" :top="c_CustomBar">
			<view class="padding detail-main">
				<view class="people-main bg-white">
					<view class="info">
						<view class="name">
							<text class="text-bold text-black text-xl">{{ personinfo.pname }}</text>
						</view>
						<view class="cu-tag text-xl line-green margin-top-sm">{{ personinfo.typeName }}</view>
					</view>
					<view class="avatar bg-white"><view class="cu-avatar xl round bg-red" :style="{ backgroundImage: `url(${personinfo.headImg})` }"></view></view>
				</view>
				<view class="no-data" v-if="no_data"><image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="aspectFit" class="no-data-img"></image></view>
				<view v-else class="margin-top-lg bg-white padding skills-card">
					<view class="flex align-center justify-around solid-bottom" v-for="item in work_detail" :key="item.id">
						<view class="text-gray">
							{{deliveryPeriod(item.createdTime)}}
						</view>
						<view class="">
							工价：
							<text class="text-red">{{item.wages}}</text>元
						</view>
						<view class="">
							累计工时
							<text class="text-blue">{{item.validTotalNum}}</text>小时
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>

		<view class="footer-tool bg-white solid-top">
			<view class="footer-from flex align-center padding">
				<view class="flex-sub flex align-center">
					<view style="flex: 0 0 auto;">
						工价：
					</view>
					<view class="solid-bottom input-bdc text-red"><input style="width: 120rpx;text-align: left;" v-model="wages" /></view>
				</view>
				<view class="margin-left-sm">
					累计工时：
					<text class="text-red">{{ personinfo.cumulativeHours || 0 }}小时</text>
				</view>
				<view class="margin-left-sm">
					结算金额：
					<text class="text-red">{{ sum_price }}元</text>
				</view>
			</view>
			<view class="flex justify-center align-center footer-btn-box">
				<button class="cu-btn bg-blue" style="flex:2;height: 100%;" @tap="sub_settle">确定</button>
				<button class="cu-btn bg-red" style="flex:1;height: 100%;" @tap="back()">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	data() {
		return {
			personinfo: {},
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false,
				textNoMore: '-- 已经到底了 --'
			},
			work_detail: [],
			loading: true,
			wages: ''
		};
	},
	onLoad(option) {
		this.personinfo = JSON.parse(decodeURIComponent(option.item));
		this.wages = this.$_.get(this.personinfo, 'wages', '');
		uni.$on('refreshList', () => {
			console.log('refreshList');
			this.init();
		});
		this.init();
	},
	onUnload() {
		uni.$off('refreshJwt');
	},
	computed: {
		c_CustomBar() {
			return this.CustomBar;
		},
		...mapGetters(['id']),
		no_data() {
			return !this.loading && this.work_detail.length == 0;
		},
		sum_work_tiem() {
			let time = 0;
			this.work_detail.forEach(item => {
				time += this.$_.toNumber(item.workTime);
			});
			return time;
		},
		sum_price() {
			return this.$_.get(this.personinfo, 'cumulativeHours', 0) * this.$_.toNumber(this.wages);
		}
	},
	methods: {
		init() {
			this.get_work_time();
		},
		downCallback(mescroll) {
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		async upCallback(mescroll) {
			//联网加载数据
			await this.get_work_time();
			mescroll.endSuccess(false);
			// setTimeout(() => {
			// 	mescroll.endErr();
			// }, 1000);
		},
		get_work_time() {
			this.$http
				.get('personwx.personproworktimedetail/1.0/', {
					pid: this.personinfo.id,
					proId:this.personinfo.proId
				})
				.then(res => {
					console.log(res);
					this.work_detail = res.data.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		sub_settle() {
			if(this.wages === ''){
				uni.showToast({
				    title: '请输入工价',
				    duration: 2000,
					icon:"none"
				});
				return
			}
			uni.showModal({
				title: '提示',
				content: `当前结算金额为${this.sum_price}元，确认是否结算`,
				confirmText: '确认结算',
				success: res => {
					if (res.confirm) {
						console.log('用户点击确定');
						this.$http
							.post('personwx.personproworktimeseet/1.0/', {
								pid: this.personinfo.id,
								proId: this.personinfo.proId,
								wages: this.wages
							})
							.then(res => {
								console.log(res);
								uni.showToast({
								    title: '结算成功',
								    duration: 2000,
									icon:'success',
									success: () => {
										setTimeout(() =>{
											this.back();
										},300)
										
									}
								});
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		deliveryPeriod(time) {
			return this.$utils.format_date(time);
		},
		
	}
};
</script>

<style lang="less" scoped>
.plh-height {
	height: 208upx;
}
.detail-main {
	padding-top: 64upx;
}
.people-main {
	border-radius: 10upx;
	position: relative;
	padding: 84upx 0 30upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;

		.name {
			display: flex;
			align-items: center;
		}
		.limit {
			display: flex;
			align-items: center;
		}
	}
	.avatar {
		position: absolute;
		top: -64upx;
		left: 50%;
		transform: translateX(-50%);
		padding: 10upx;
		border-radius: 100%;
		align-items: center;
	}
}
.footer-tool {
	width: 100%;
	position: fixed;
	left: 0;
	bottom: var(--window-bottom);
	z-index: 10;
	.footer-from {
		height: 80rpx;
		width: 100%;
		.input-bdc {
			&::after {
				border-color: #e54d42;
			}
		}
	}
	.footer-btn-box {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
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
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
}
</style>
