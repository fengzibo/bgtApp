<template>
	<view class="task-artisan-main">
		<view class="top-banner" v-if="has_task">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/WechatIMG73.jpeg" mode="widthFix"></image>
		</view>
		
		<view class="no-task" v-if="!has_task && !loading">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">没有任务</text><br>
			<text class="text-orange text-df">开启订阅将更利于接收任务，不错过每一个任务</text>
			<view class="flex margin-top justify-around">
				<button class="cu-btn round bg-gradual-green lg" @tap="init" v-if="!is_subscribe">刷新任务</button>
				<button class="cu-btn round bg-gradual-blue lg" @tap="showRsm">开启订阅</button>
				
			</view>
		</view>
		<template v-if="has_task && !loading">
			<!-- <view class="tab-list bg-white">
				<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }"  @tap="select_tab(tab.id, index)">
					<text class="cuIcon-titles text-blue"></text>
					<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
				</view>
			</view> -->
			<view class="tab-list bg-white">
				<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
					<text class="item-text">{{ tab.name }}({{ tab.data.length }})</text>
				</view>
			</view>
			<swiper :current="current_tab.index" class="swiper-box" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item" v-for="(tab, index1) in tab_list" :key="index1">
					<scroll-view class="scroll-v" scroll-y @scrolltolower="loadMore(index1)">
						<view class="subscribe-box flex justify-between padding-sm align-center" v-if="!is_subscribe">
							<text class="text-white text-sm">开启订阅将更利于接收任务，不错过每一个任务</text>
							<button class="cu-btn round bg-gradual-blue" @tap="showRsm">开启订阅</button>
						</view>
						<view class="list">
							<view class="list-item bg-white " v-for="item in tab.data" :key="item.id" @tap="go_detail(item)">
								<view class="top-main text-grey">
									<text class="title text-black text-xl">{{ item.title }}</text>
									<text class="price text-red text-xl">{{ item_price(item)}}</text>
								</view>
								<view class="center-main">
									<view class="cu-tag radius bg-red" v-for="(tag, tIndex) in item.welfareInfo" :key="tIndex">{{ tag }}</view>
								</view>
								<view class="bottom-main text-gray justify-between">
									<view class="flex-sub flex align-center">
										<text class="cuIcon-locationfill margin-right-xs"></text>
										<text>{{ item_work_address(item.workAddress)}}</text>
									</view>
									<view class="flex">发布日期{{ item_start_date(item.startData) }}/工期{{item.limit}}{{item.unit}}</view>
								</view>
							</view>
						</view>
						<!-- <view class="loading-more">
							<text class="loading-more-text">{{tab.loadingText}}</text>
						</view> -->
					</scroll-view>
				</swiper-item>
			</swiper>
		</template>
	</view>
</template>
<script>
import { mapState,mapGetters } from 'vuex';
export default {
	data() {
		return {
			tab_list: [
				// {
				// 	name: '正在招工',
				// 	id: 'zzzg',
				// 	data: []
				// },
				{
					name: '待我回复',
					id: 'dwhf',
					data: []
				},
				{
					name: '我参与过的',
					id: 'wcygd',
					data: []
				}
			],
			current_tab: {
				id: 'dwhf',
				index: 0
			},
			loading:true,
			tmplIds:['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps','9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw']
		};
	},
	components: {},
	computed: {
		...mapState(['user_info','is_subscribe']),
		...mapGetters(['id','user_role','test_user']),
		// test_user(){
		// 	return uni.getStorageSync('user_info')
		// },
		test_user2(){
			return this.user_info
		},
		has_task(){
			return this.tab_list[0].data.length>0
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
		uni.$on('refreshJwt',(data) =>{
			console.log('refreshJwt',data)
			this.init()
		})
	},
	beforeDestroy() {
		uni.$off('refreshJwt')
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
			this.$http.get('personwx.personreclist/1.0/',{
				status:'0',
				rpStatus:'2'
			}).then(res =>{
				console.log('personreclist',res)
				if(res.data.code == '0'){
					let data = res.data.data
					data.forEach((item,index) =>{
						item.workRequest = JSON.parse(item.workRequest)
						item.welfareInfo = JSON.parse(item.welfareInfo)
					})
					this.tab_list[0].data = data
					this.loading = false
				}
			})
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
		go_detail(item) {
			uni.navigateTo({
				url: '/pages/tabbar/task/taskMain/taskMainArtisan?item='+encodeURIComponent(JSON.stringify(item))
			});
		},
		item_price(item){
			console.log(item)
			let r_info= []
			try{
				 r_info= JSON.parse(item.requirementInfo)
			}catch(e){
				//TODO handle the exception
			}
			
			let min = 0,max = 0;
			r_info.forEach((val,index) =>{
				let price = Number.parseFloat(val.price)
				if(index == 0){
					min = price
					max = price
				}else{
					min = price<min?price:min
					max = price>max?price:max
				}
			})
			return `${min} - ${max}元/时`
		},
		item_tag(item){
			console.log('item_tag',item)
			let welfareInfo = JSON.parse(item.welfareInfo)
			let workRequest = JSON.parse(item.workRequest)
			return welfareInfo
		},
		item_start_date(time){
			return this.$utils.format_date(time)
		},
		item_work_address(addr){
			let address = JSON.parse(addr)
			if(Array.isArray(address)){
				return address.join()
			}else{
				return address
			}
			
		},
		showRsm(){
			wx.requestSubscribeMessage({
				tmplIds: this.tmplIds,
				success:(res) => {
					console.log(res)
					if(res['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps'] === 'accept' || res['9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'] === 'accept'){
						this.$store.commit('setIsSubscribe',true)
					}else{
						this.$store.commit('setIsSubscribe',false)
					}
				},
				fail(err){
					console.log(err)
				}
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
		font-size: 32rpx;
		border-bottom: 1px solid #7e8095;
		color: #7e8095;
		transition: all 0.3s;
		&.active {
			color: #0081ff;
			border-color: #0081ff;
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
.no-task{
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
.top-banner{
	width: 100%;
	padding: 30rpx 30rpx 10rpx;
	background-color: #fff;
	image{
		width: 100%;
		display: block;
		border-radius: 10rpx;
	}
}
.subscribe-box{
	position: fixed;
	background-color: rgba(0,0,0,.5);
	bottom: var(--window-bottom);
	left: 0;
	width: 100%;
}
</style>
