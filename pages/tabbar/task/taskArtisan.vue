<template>
	<view class="task-artisan-main">
		<view class="tab-list bg-white">
			<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
				<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
			</view>
		</view>
		<swiper :current="current_tab.index" class="swiper-box" :duration="300" @change="ontabchange">
			<swiper-item class="swiper-item" v-for="(tab, index1) in tab_list" :key="index1">
				<scroll-view class="scroll-v" scroll-y @scrolltolower="loadMore(index1)">
					<view class="list">
						<view class="list-item bg-white " v-for="(item, index2) in tab.data" :key="index2" @tap="go_detail(item)">
							<view class="top-main text-grey">
								<text class="title text-black text-df">{{ item.name }}</text>
								<text class="price text-red text-xl">{{ item.price }}</text>
							</view>
							<view class="center-main">
								<view class="cu-tag radius bg-red" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</view>
							</view>
							<view class="text-grey margin-bottom-sm">
								<text>上工日期{{ item.time }}/工期{{item.time_limit}}</text>
							</view>
							<view class="bottom-main text-gray">
								<text class="cuIcon-locationfill margin-right-xs"></text>
								<text>{{ item.address }}</text>
							</view>
						</view>
					</view>
					<!-- <view class="loading-more">
		                <text class="loading-more-text">{{tab.loadingText}}</text>
		            </view> -->
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- <view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					Modal 内容。
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green " @tap="hideModal">
						<text class="cuIcon-moneybag"></text>微信支付</view>
					<view class="action margin-0 flex-sub text-green solid-left" @tap="hideModal">取消</view>
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">确定</view>
				</view>
			</view>
		</view> -->
	</view>
</template>
<script>
import { mapState,mapGetters } from 'vuex';
export default {
	data() {
		return {
			tab_list: [
				{
					name: '正在招工',
					id: 'zzzg',
					data: [
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						},
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						},
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						}
					]
				},
				{
					name: '待我回复',
					id: 'dwhf',
					data: [
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						},
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						}
					]
				},
				{
					name: '我参与过的',
					id: 'wcygd',
					data: [
						{
							name: '招自动化设备电工钳工师傅',
							time: '2019-09-30',
							time_limit: '2个月',
							tags: ['包吃包住', '要面试', '经验不限', '月结'],
							address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
							price: '30-35元/时'
						}
					]
				}
			],
			current_tab: {
				id: 'zzzg',
				index: 0
			}
		};
	},
	components: {},
	computed: {
		...mapState(['user_info']),
		...mapGetters(['id','user_role','test_user']),
		// test_user(){
		// 	return uni.getStorageSync('user_info')
		// },
		test_user2(){
			return this.user_info
		}
	},
	watch:{
		user_info:{
			handler:(val) =>{
				console.log(val)
			},
			deep:true
		}
	},
	mounted() {
		this.$nextTick(() =>{
			this.init()
		})
		
	},
	methods: {
		init(){
			if(!this.id){
				uni.showModal({
					titel:'提示',
					content:'您的资料不完整，请先完善',
					cancelText:'去完善',
					cancelColor:'#007AFF',
					confirmText:'先看看',
					confirmColor:'#007AFF',
					success:res =>{
						if (res.confirm) {
							console.log('用户点击先看看');
						} else if (res.cancel) {
							console.log('用户点击去完善');
							uni.navigateTo({
								url: '/pages/tabbar/my/myInfo/createInfo'
							});
						}
					}
				})
			}
		},
		select_tab(id, index) {
			this.current_tab.id = id;
			this.current_tab.index = index;
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
		go_detail(iitem) {
			uni.navigateTo({
				url: '/pages/tabbar/task/taskMain/taskMainArtisan'
			});
		}
	}
};
</script>

<style lang="less" scoped>
.task-artisan-main {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.tab-list {
	padding: 0 30rpx;
	display: flex;
	justify-content: space-between;
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
.swiper-box {
	flex: 1 1 0;
	height: 100%;
	overflow: hidden;
	.scroll-v {
		height: 100%;
	}
	.list {
		padding-top: 10rpx;
	}
	.list-item {
		padding: 20rpx 30rpx;
		margin-bottom: 10rpx;
		.top-main {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			.title {
				// font-weight: bold;
			}
		}
		.center-main {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 20rpx 0;
		}
		.bottom-main {
			display: flex;
			align-items: center;
			font-size: 10px;
		}
	}
}
</style>
