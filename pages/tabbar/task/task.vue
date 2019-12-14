<template>
	<view class="task-index">
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">任务中心</block>
		</cu-custom>
		<view class="no-task" v-if="!has_task && !loading">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">没有任务</text><br>
			<view class="flex margin-top justify-around">
				<button class="cu-btn round bg-gradual-green lg" @tap="init">刷新任务</button>
				<button class="cu-btn round bg-gradual-blue lg" @tap="goto_add">前往创建任务</button>
				
			</view>
		</view>
		<view class="tab-list bg-white">
			<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
				<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
			</view>
		</view>
		<template v-if="user_role=== 'head' && has_task && !loading">
			<mescroll-uni @down="downCallback" @up="upCallback" :up="upOption"  @scroll="scroll" :down="downOption" @init="mescrollInit" :top="c_CustomBar">
				
				<view class="list">
					<view class="list-item bg-white " v-for="item in p_list" :key="item.id" @tap="go_detail(item)">
						<view class="top-main text-grey">
							<text class="title">{{ item.deviceName }}({{item.deviceNum}})</text>
							<text class="time">交期：{{ deliveryPeriod(item.deliveryPeriod) }}</text>
						</view>
						<view class="center-main">
							<view class="schedule">
								<template v-if="item.status == '3'">
									<text class="schedule-num">进度 {{ item.proProgress || 0 }}%</text>
									<view class="schedule-bar" :style="{width: item.proProgress || 0}"></view>
								</template>
								<view class="schedule-num text-green" v-else>
									{{item.status == '2'?'待启动':'招募中'}}
								</view>
							</view>
							<view class="com-view">
								<text class="num">{{ item.allHours || 0 }}</text>
								<text class="tip text-grey">累计工时</text>
							</view>
							<view class="com-view">
								<text class="num err-color">{{ item.abnormalityNum || 0 }}</text>
								<text class="tip text-grey">累计异常</text>
							</view>
							<view class="com-view">
								<text class="num"><text class="text-blue">{{item.allcost || 0}}</text>/ <text >{{ item.budget }}</text> </text>
								<text class="tip text-grey">实时/预算</text>
							</view>
						</view>
						<view class="bottom-main text-gray">
							<view class="flex align-center">
								<text class="cuIcon-locationfill margin-right-xs"></text>
								<text>{{ item.scompany }}</text>
							</view>
							<view>
								{{deliveryPeriod(item.createdTime)}}
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
			<view class="fixed-add shadow bg-blue" @tap="goto_add">
				<view class="cuIcon-add text-white text-df"></view>
			</view>
		</template>
		<task-artisan v-if="user_role=== 'artisan' && show_artisan" class="task-artisan"></task-artisan>
	</view>
</template>

<script>
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import { mapState,mapGetters } from 'vuex';
import 	taskArtisan from './taskArtisan.vue'
export default {
	data() {
		return {
			tab_list: [
				{
					name: '当前任务',
					id: 'dcrw',
					data:[],
					y: 0,
				},
				{
					name: '已完成',
					id: 'ywc',
					data:[],
					y: 0,
				}
			],
			current_tab: {
				id: 'dcrw',
				index: 0
			},
			loading:true,
			show_artisan:false,
			mescroll: null, //mescroll实例对象
			upOption: {
				onScroll: true, // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				isLock:true,
				auto:false
			},
			downOption:{
				auto:false
			},
			preIndex:0
		};
	},
	onLoad() {
		console.log('onLoad')
		try {
			const version = uni.getStorageSync('version')
			console.log('version',version)
			if(version !== '1.1.7'){
				uni.clearStorageSync();
				this.show_artisan = false
				uni.reLaunch ({
					url: '/pages/welcome/welcome'
				})
				return 
			}
			const value = uni.getStorageSync('user_info');
			console.log(value)
			if (!value) {
				this.show_artisan = false
				uni.reLaunch ({
					url: '/pages/welcome/welcome'
				})
			}else{
				if(this.user_role=== 'head'){
					this.init()
				}else{
					this.show_artisan = true
				}
			}
		} catch (e) {
		    // error
			console.log(e)
		}
		uni.$on('refreshList',() =>{
			console.log('refreshList')
			if(this.user_role=== 'head'){
				this.init()
			}else{
				this.show_artisan = true
			}
		})
		uni.$on('refreshJwt',(data) =>{
			console.log('refreshJwt',data)
			if(this.user_role=== 'head'){
				this.init()
			}else{
				this.show_artisan = true
			}
		})
	},
	onShow() {
		console.log('show')
	},
	onReady() {
		console.log('ready')
	},
	onUnload() {
		uni.$off('refreshList')
		uni.$off('refreshJwt')
	},
	components:{
		taskArtisan,
		MescrollUni
	},
	watch:{
		user_role(val){
			console.log(val)
			if(val=== 'head'){
				this.init()
			}
		},
		refresh_num(val){
			console.log('task_refresh_num',val)
		}
	},
	computed: {
		...mapState(['refresh_num']),
		...mapGetters(['user_role']),
		has_task(){
			// console.log('has_task',this.tab_list[this.current_tab.index])
			// return this.$utils._get(this.tab_list[this.current_tab.index],'data',[]).length>0
			return this.tab_list.some((item,index) =>{
				return item.data.length>0
			})
		},
		p_list(){
			return this.tab_list[this.current_tab.index].data
		},
		c_CustomBar() {
			return this.CustomBar + uni.upx2px(90);
		},
		workbench_id_list(){
			let list = []
			this.tab_list[0].data.forEach(item =>{
				if(item.status == '2' || item.status == '3'){
					list.push(item)
				}
			})
			return list
		}
	},
	methods: {
		init(){
			Promise.all([this.get_dcrw_list(),this.get_ywc_list()]).then(values =>{
				console.log(values)
				this.tab_list[0].data = this.$utils._get(values[0],'data.data',[]) 
				this.tab_list[1].data = this.$utils._get(values[1],'data.data',[]) 
				this.loading = false
			})
		},
		get_dcrw_list(){
			return this.$http.get('personwx.projectinfolist/1.0/',{
				isFinish:'0',
			})
		},
		get_ywc_list(){
			return this.$http.get('personwx.projectinfolist/1.0/',{
				isFinish:'1',
			})
		},
		up_get_data(){
			this.$http.get('personwx.projectinfolist/1.0/',{
				isFinish:JSON.stringify(this.current_tab.index),
			}).then(res =>{
				console.log(res)
				this.tab_list[this.current_tab.index].data = this.$utils._get(res,'data.data',[])
				this.mescroll.endSuccess()
			})
		},
		select_tab(id, index) {
			this.current_tab.id = id;
			this.current_tab.index = index;
			let preTab = this.tab_list[this.preIndex];
			preTab.y = this.mescroll.getScrollTop(); // 滚动条位置
			this.preIndex = index;
		},
		ontabchange(event) {
			console.log(event);
			let index = event.detail.current;
			this.current_tab.index = index;
			this.current_tab.id = this.tab_list[index].id;
		},
		loadMore(index) {
			console.log(index);
		},
		go_detail(item){
			console.log(item)
			let status = this.$utils._get(item,'status','0')
			this.$store.commit('setCurrentTask',item)
			switch (status){
				case '0':
				case '1':
					uni.navigateTo({
						url: `/pages/tabbar/task/createTask/createTask?id=${item.id}`
					});
					break;
				case '2':
				case '3':
					this.$store.commit('set_bgt_c_task',this.workbench_id_list)
					this.$store.commit('set_bgt_ct_id',item.id)
					uni.switchTab({
						url:"/pages/tabbar/workbench/workbench"
					})
					break;
				default:
					break;
			}
			
			// if(this.$utils._get(item,'status','0') == '0'){
			// 	uni.switchTab({
			// 		url:"/pages/tabbar/workbench/workbench"
			// 	})
			// }else{
			// 	uni.navigateTo({
			// 		url: '/pages/tabbar/task/taskMain/taskMain'
			// 	});
			// }
		},
		goto_add(){
			uni.navigateTo({
				url: '/pages/tabbar/task/createTask/createTask'
			});
		},
		deliveryPeriod(time){
			return this.$utils.format_date(time)
		},
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			setTimeout(() => {
				this.up_get_data()
			}, 300);
		},
		// 滚动事件 (需在up配置onScroll:true才生效)
		scroll(mescroll) {
			console.log('滚动条位置 = ' + mescroll.getScrollTop() + ', navTop = ' + this.navTop);
			// 菜单悬浮的原理: 监听滚动条的位置大于某个值时,控制顶部菜单的显示和隐藏
			if (mescroll.getScrollTop() >= this.navTop) {
				this.isShowSticky = true; // 显示悬浮菜单
			} else {
				this.isShowSticky = false; // 隐藏悬浮菜单
			}
		},
	}
};
</script>

<style scoped lang="less">
.task-index {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
}
.tab-list {
	padding: 0 30rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 90rpx;
	flex: 0 0 auto;
	.item {
		display: block;
		padding: 18rpx 0;
		border-bottom: 1px solid #7e8095;
		color: #7e8095;
		transition: all 0.3s;
		&.active {
			color: #0d64ff;
			border-color: #0d64ff;
		}
	}
}
.list{
		padding-top: 10rpx;
	}
	.list-item {
		padding: 20rpx 30rpx;
		margin-bottom: 10rpx;
		.top-main {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			.title {
				// font-weight: bold;
			}
		}
		.center-main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			.schedule {
				width: 190rpx;
				color: #f37b1d;
				display: flex;
				flex-direction: column;
				font-size: 16px;
				flex: 0 0 auto;
				.schedule-num {
					font-weight: bold;
				}
				.schedule-bar{
					position: relative;
					height: 10rpx;
					border-radius: 5rpx;
					overflow: hidden;
					&:before{
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 5rpx;
						width: 160rpx;
						height: 10rpx;
						background-image: linear-gradient(90deg, #ff9700, #ed1c24);
					}
				}
			}
			.com-view {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.num {
					// font-weight: bold;
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
			justify-content: space-between;
			font-size: 10px;
		}
	}
.fixed-add{
	position: absolute;
	bottom: 30rpx;
	right: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 60rpx;
	height: 60rpx;
	border-radius: 100%;
	z-index: 100;
}
.no-task{
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
.task-artisan{
	flex: 1 1 0;
}
</style>
