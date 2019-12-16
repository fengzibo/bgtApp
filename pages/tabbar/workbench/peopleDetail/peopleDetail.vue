<template>
	<view>
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">人员详情</block>
			</cu-custom>
			<view class="plh-height"></view>
		</view>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="80" :top="c_CustomBar">
			<view class="padding detail-main">
				<view class="people-main bg-white">
					<view class="info">
						<view class="name">
							<!-- 	<text class="text-red">
								<text class="cuIcon-female  sex-icon"></text>{{personinfo.age}}岁
							</text> -->
							<text class="text-bold text-black text-xl">{{ personinfo.pname }}</text>

							<!-- <text class="margin-left text-df text-xxl text-red">{{personinfo.rating}}分</text> -->
						</view>
						<view class="cu-tag text-xl line-green margin-top-sm">{{ personinfo.typeName }}</view>
						<!-- <view class="limit margin-top-sm text-grey text-df">
							{{personinfo.workYear}}年工作年限<text class="text-xl margin-left-sm margin-right-sm">/</text>{{personinfo.homeAddress}}
						</view> -->
						<!-- <view class="price margin-top-sm text-red text-xl margin-bottom-sm">28/时</view> -->
						<!-- <sunui-star iconName="cuIcon-favorfill" :disabledStar="true"></sunui-star> -->
						<!-- 	<view class="addr text-gray margin-top-sm ">
							<text class="cuIcon-locationfill margin-right-xs"></text>
							<text>{{personinfo.address}}</text>
						</view> -->
					</view>
					<view class="avatar bg-white"><view class="cu-avatar xl round bg-red" :style="{ backgroundImage: avatarUrl(personinfo.headImg) }"></view></view>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" v-if="hasph">
				<view class="action">
					<text class="cuIcon-titles text-green "></text>
					工时信息
				</view>
				<view class="action text-sm text-gray">更新：{{deliveryPeriod(new Date())}}</view>
			</view>
			<view class="padding flex text-center text-grey bg-white" v-if="hasph">
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-orange">{{personHours.yesterdayHours || 0}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-repairfill margin-right-xs"></text>
						昨天工时
					</view>
				</view>
				<view class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-blue">{{personHours.todayHours || 0}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-timefill margin-right-xs"></text>
						今日工时
					</view>
				</view>
				<view class="flex flex-sub flex-direction">
					<view class="text-xxl text-green">{{personHours.allHours || 0}}</view>
					<view class="margin-top-sm">
						<text class="cuIcon-favorfill margin-right-xs"></text>
						累计工时
					</view>
					
				</view>
			</view>
			<view class="bg-white nav margin-top-sm">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index == TabCur ? 'text-blue cur' : ''" v-for="(item, index) in tab_list" :key="index" @tap="tabSelect" :data-id="index">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view class="task-main" v-if="no_task">
				<view class="no-list padding">
					<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-data.png" mode="aspectFit" class="no-data-img"></image>
					<view class="text-gray text-center">--没有任务--</view>
				</view>
			</view>
			<view class="plan-list" v-else>
				<view class="item padding bg-white solid-bottom" v-for="item in plan_list" :key="item.id">
					<view class="flex justify-between">
						<view class="text-bold">
							{{item.title}}
						</view>
						<view class="text-gray text-sm">
							{{deliveryPeriod(item.createdTime)}}
						</view>
					</view>
					<view class="flex align-center margin-top-sm">
						<view class="process flex-sub">
							<view class="cu-progress round sm striped active" >
								<view class="bg-green" :style="{'width':item.taskProcess+'%'}"></view>
							</view>
						</view>
						<view class="margin-left-sm">
							进度{{item.taskProcess}}%
						</view>
					</view>
					<view class="flex margin-top-sm">
						<view class="cu-avatar sm round bg-red margin-right-sm" v-for="(avr,i) in item.people" :key="i" :style="{backgroundImage: `url(${avr.avaurl})`}"></view>
					</view>
				</view>
			</view>
			
		</mescroll-uni>
		<view class="footer-tool bg-white solid-top">
			<button class="cu-btn bg-blue" style="flex:2;height: 100%;" @tap="down_work">标记为下工</button>
			<!-- <button class="cu-btn round bg-blue" @tap="goto_recruiting">补招人员</button> -->
			<button class="cu-btn bg-red" style="flex:1;height: 100%;" @tap="back()">返回</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false
			},
			tab_list: [
				{
					name: '进行中的任务'
				},
				{
					name: '已完成的任务'
				}
			],
			TabCur: 0,
			detail_data: {},
			personinfo: {}
		};
	},
	components: {
		// sunuiStar
	},
	computed: {
		c_CustomBar() {
			return this.CustomBar;
		},
		personHours() {
			return this.$utils._get(this.detail_data, 'personHours', {});
		},
		hasph(){
			return JSON.stringify(this.personHours) !== '{}'
		},
		finshTask() {
			let ft_list = this.$utils._get(this.detail_data, 'finshTask', []);
			ft_list.forEach(item =>{
				let list = item.userList.split(',')
				let plan_people = []
				list.forEach(val =>{
					let arr = val.split(':')
					let obj = {
						name:arr[2],
						avaurl:arr[0]+':'+arr[1]
					}
					plan_people.push(obj)
				})
				this.$set(item,'people',plan_people)
			})
			return ft_list
		},
		activeTask() {
			let at_list = this.$utils._get(this.detail_data, 'activeTask', [])
			at_list.forEach(item =>{
				let list = item.userList.split(',')
				let plan_people = []
				list.forEach(val =>{
					let arr = val.split(':')
					let obj = {
						name:arr[2],
						avaurl:arr[0]+':'+arr[1]
					}
					plan_people.push(obj)
				})
				this.$set(item,'people',plan_people)
			})
			return at_list
		},
		plan_list(){
			return this.TabCur === 0?this.activeTask:this.finshTask
		},
		no_task(){
			return this.plan_list.length === 0
		}
	},
	onLoad(option) {
		this.personinfo = JSON.parse(decodeURIComponent(option.item));
		uni.$on('refreshList', () => {
			console.log('refreshList');
			this.init();
		});
		this.init();
	},
	onUnload() {
		uni.$off('refreshJwt');
	},
	methods: {
		init() {
			this.$http
				.get('personwx.personconsol/1.0/', {
					id: this.personinfo.proId,
					pid: this.personinfo.pid
				})
				.then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.detail_data = res.data.data;
					}
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
			await this.init()
			mescroll.endErr();
			// setTimeout(() => {
			// 	mescroll.endErr();
			// }, 1000);
		},
		deliveryPeriod(time) {
			return this.$utils.format_date(time);
		},
		avatarUrl(avatarUrl) {
			return `url(${avatarUrl})`;
		},
		back() {
			uni.navigateBack({
				delta: 1
			});
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
		},
		down_work(){
			
		}
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
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
}

.footer-tool {
	width: 100%;
	height: 80rpx;
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: var(--window-bottom);
	z-index: 10;
	button {
		border-radius: 0;
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
