<template>
	<view class="workbench-artisan">
		<view class="no-task" v-if="artisan_work_state === 'noTask'">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">当前没有相关在进行的任务</text>
			<br />
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">去找点活干干</button>
			<br />
			<button class="cu-btn round bg-gradual-orange lg margin-top" @tap="goto_rest">最近有点累，要休息一段时间</button>
		</view>
		<view class="rest" v-if="artisan_work_state === 'rest'">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/rest.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-df">
				您已经休息了
				<text class="text-xl text-red">70小时</text>
				了，是否已经恢复到了最佳状态
			</text>
			<br />
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">是的，我要去找活干了</button>
			<br />
			<!-- <button class="cu-btn round bg-gradual-orange lg margin-top" @tap="goto_rest">还没恢复</button> -->
		</view>

		<view class="has-task" v-if="artisan_work_state === 'waitStart' || artisan_work_state === 'confirmInfo'">
			<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :top="c_CustomBar">
				<view class="swiper-box">
					<swiper class="swiper" :indicator-dots="false" :autoplay="false" :style="{ height: swiperHeight }" @change="swiperChange">
						<swiper-item v-for="item in project_list" :key="item.id">
							<view class="padding" id="sContent">
								<view class="bg-blue padding skills-card text-white">
									<view class="info-main">
										<view class="flex justify-between"><view class="text-lg">工作详情</view></view>
										<view class="info-box">
											<view class="label ">工作内容：</view>
											<view class="text ">{{ item.deviceName }}({{ item.deviceNum }})</view>
										</view>
										<view class="info-box">
											<view class="label ">工期：</view>
											<view class="text ">{{ item.limit }}</view>
										</view>
										<view class="info-box">
											<view class="label ">负责人：</view>
											<view class="text ">{{ item.owerName }}，{{ item.phone }}</view>
										</view>
										<view class="info-box" v-if="artisan_work_state === 'confirmInfo'">
											<view class="text">{{ c_project.scompany }}</view>
										</view>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
					<view class="work-swiper-dot">
						<view class="dot-item bg-blue" :class="{ active: curent_p_index == index }" v-for="(item, index) in project_list" :key="item.id"></view>
					</view>
				</view>
				<template v-if="artisan_work_state === 'waitStart'">
					<view class="cu-bar bg-white solid-bottom title">
						<view class="action">
							<text class="cuIcon-title text-orange"></text>
							开工信息
						</view>
					</view>
					<view class="bg-white starts-info">
						<view class="info-box">
							<view class="label text-gray">开工日期：</view>
							<view class="text text-black">{{ deliveryPeriod(c_project.deliveryPeriod) }}</view>
						</view>
						<view class="info-box">
							<view class="label text-gray">工作地点：</view>
							<view class="text text-black">{{ c_project.scompany }}</view>
						</view>
						<view class="info-box">
							<view class="label text-gray">注意事项：</view>
							<view class="text text-black">{{ c_project.description }}</view>
						</view>
					</view>
					<view class="cu-bar bg-white solid-bottom title margin-top-sm">
						<view class="action">
							<text class="cuIcon-title text-orange"></text>
							回复信息
						</view>
					</view>
					<view class="reply-info bg-white">
						<radio-group @change="radioChange">
							<label class="radio margin-tb-sm">
								<radio :disabled="has_reply" value="can" :checked="current_radio == 'can'" class="margin-right-sm" />
								我知道了，可以按时来。
							</label>
							<label class="radio margin-tb-sm">
								<radio :disabled="has_reply" value="no_can" :checked="current_radio == 'no_can'" class="margin-right-sm" />
								很抱歉，我临时有事，本次工作不参与
							</label>
						</radio-group>
						<view class="text-center padding-tb-sm">
							<button class="cu-btn round bg-blue lg" @tap="comfirm_can" v-if="!has_reply">确认</button>
							<text v-else>已回复</text>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="cu-bar bg-white solid-bottom title">
						<view class="action">
							<text class="cuIcon-title text-orange"></text>
							我的工时
						</view>
						<view class="action text-gray">更新：{{ deliveryPeriod(c_project.deliveryPeriod) }}</view>
					</view>
					<view class="flex text-center solid-top padding-tb bg-white">
						<view class="flex flex-sub flex-direction solid-right text-gray">
							<view class="text-xxl">8</view>
							<view class="margin-top-sm">昨日工时</view>
						</view>
						<view class="flex flex-sub flex-direction solid-right text-green">
							<view class="text-xxl text-blue">2</view>
							<view class="margin-top-sm">今日工时</view>
						</view>
						<view class="flex flex-sub flex-direction text-orange">
							<view class="text-xxl">100</view>
							<view class="margin-top-sm">累计工时</view>
						</view>
					</view>
					<view class="bg-white nav margin-top-sm">
						<view class="flex text-center">
							<view class="cu-item flex-sub" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in tab_list" :key="index" @tap="tabSelect" :data-id="index">
								{{ item.name }}
							</view>
						</view>
					</view>
					<view class="task-main">
						<view class="no-list padding">
							<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-data.png" mode="aspectFit" class="no-data-img"></image>
							<view class="text-gray text-center">--没有任务--</view>
						</view>
					</view>
				</template>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			is_unfold: false,
			project_list: [],
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false,
				isLock: true,
				use: false
			},
			swiperHeight: '',
			curent_p_index: 0,
			current_radio: 'can',
			has_reply: false,
			person_consol:{},
			tab_list: [
				{
					name: '进行中的任务'
				},
				{
					name: '已完成的任务'
				}
			],
			TabCur: 0,
		};
	},
	components: {},
	computed: {
		...mapState(['artisan_work_state']),
		...mapGetters(['user_role', 'id']),
		c_CustomBar() {
			return this.CustomBar;
		},
		c_project() {
			return this.project_list[this.curent_p_index];
		},
		finshTask() {
			return this.$utils._get(this.detail_data, 'finshTask', []);
		},
		activeTask() {
			return this.$utils._get(this.detail_data, 'activeTask', []);
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init(cb) {
			this.$http
				.get('personwx.personproject/1.0/', {
					pid: this.id,
					isFinish: '0'
				})
				.then(res => {
					console.log(res);
					if (this.$utils._get(res, 'data.code', '') === '0') {
						this.project_list = this.$utils._get(res, 'data.data', []);
						if (this.project_list.length > 0) {
							if (this.c_project.resWorkStatus == '1') {
								this.$store.commit('setArtisanWorkState', 'waitStart');
							} else {
								this.$store.commit('setArtisanWorkState', 'confirmInfo');
							}
						} else {
							this.$store.commit('setArtisanWorkState', 'noTask');
						}
						if(this.artisan_work_state === 'confirmInfo'){
							this.get_person_consol()
						}
						if (typeof cb === 'function') {
							
							cb();
						}
						this.$nextTick(() => {
							this.get_swiper_c_height();
						});
					}
				});
		},
		goto_work() {
			uni.switchTab({
				url: '/pages/tabbar/task/task'
			});
		},
		goto_rest() {
			this.$http
				.post('personwx.personwx.changestatus/1.0/', {
					id: this.id,
					status: '2'
				})
				.then(res => {
					console.log(res);
					this.$store.commit('setArtisanWorkState', 'rest');
				});
		},
		exit_work() {},
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			// mescroll.resetUpScroll();
			setTimeout(() => {
				this.init(() => {
					mescroll.endSuccess();
				});
			}, 300);
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			//联网加载数据
			// setTimeout(() => {
			// 	this.init(() =>{
			// 		mescroll.endSuccess()
			// 	})
			// }, 300);
		},
		get_swiper_c_height() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('#sContent')
				.boundingClientRect(data => {
					console.log('得到布局位置信息' + JSON.stringify(data));
					console.log('节点离页面顶部的距离为' + data.top);
					this.swiperHeight = data.height + 'px';
				})
				.exec();
		},
		deliveryPeriod(time) {
			return this.$utils.format_date(time);
		},
		radioChange(e) {
			this.current_radio = e.target.value;
		},
		comfirm_can() {
			this.$http
				.post('personwx.personchangestatus/1.0/', {
					id: this.c_project.resWorkId,
					status: this.current_radio === 'can' ? '2' : '0'
				})
				.then(res => {
					console.log(res);
					this.has_reply = true;
					this.init();
				});
		},
		swiperChange(e) {
			console.log(e);
			this.curent_p_index = e.detail.current;
			if (this.c_project.resWorkStatus == '1') {
				this.$store.commit('setArtisanWorkState', 'waitStart');
			} else {
				this.$store.commit('setArtisanWorkState', 'confirmInfo');
			}
			this.$nextTick(() => {
				this.get_swiper_c_height();
				if(this.artisan_work_state === 'confirmInfo'){
					this.get_person_consol()
				}
			});
			// let id = this.$utils._get(this.bgt_c_task[this.current_swiper],'id','')
			// this.$store.commit('set_bgt_ct_id',id)
		},
		get_person_consol() {
			this.$http
				.get('personwx.personconsol/1.0/', {
					id: this.c_project.id,
					pid: this.c_project.pid
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.person_consol = res.data.data;
					}
				});
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		}
	}
};
</script>

<style lang="less" scoped>
.workbench-artisan {
	width: 100%;
}
.no-task,
.rest {
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
.top-manager {
	padding: 10rpx 30rpx;
	.manager {
		display: flex;
		align-items: center;
	}
	.post-title {
		flex: 0 0 auto;
	}
}
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
}
.info-box {
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	.label {
		flex: 0 0 auto;
	}
	.text {
		flex: 1;
	}
}
.starts-info {
	padding: 10rpx 60rpx 30rpx;
}
.reply-info {
	padding: 10rpx 60rpx;
	label {
		display: block;
	}
}
.swiper-box {
	position: relative;
}
.work-swiper-dot {
	position: absolute;
	bottom: 10rpx;
	left: 50%;
	transform: translateX(-50%);
	.dot-item {
		width: 40rpx;
		height: 6rpx;
		border-radius: 3rpx;
		margin: 0 10rpx;
		display: inline-block;
		opacity: 0.3;
		&.active {
			opacity: 1;
		}
	}
}
.no-list {
	.no-data-img {
		width: 30%;
		margin: 0 auto;
		display: block;
		height: 260rpx;
	}
}
</style>
