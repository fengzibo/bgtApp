<template>
	<view>
		<!-- 菜单 (悬浮,预先隐藏)-->
		<view class="tab-list bg-white" v-if="isShowSticky">
			<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
				<text class="item-text">
					{{ tab.name }}
					<text v-if="tab.data !== null">({{ tab.data.length }})</text>
				</text>
			</view>
		</view>
		<mescroll-uni @down="downCallback" @up="upCallback" :up="upOption" @scroll="scroll" @init="mescrollInit" @topclick="topClick" :top="c_CustomBar">
			<view class="top-banner">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/WechatIMG73.jpeg" mode="widthFix"></image>
			</view>
			<!-- 菜单 (在mescroll-uni中不能使用fixed,否则iOS滚动时会抖动, 所以需在mescroll-uni之外存在一个一样的菜单) -->
			<view class="tab-list bg-white" id="tabInList">
				<view class="item" v-for="(tab, index) in tab_list" :key="tab.id" v-bind:class="{ active: current_tab.id == tab.id }" @tap="select_tab(tab.id, index)">
					<text class="item-text">
						{{ tab.name }}
						<text v-if="tab.data !== null">({{ tab.data.length }})</text>
					</text>
				</view>
			</view>
			<!-- 数据列表 -->
			<view class="list">
				<view class="list-item bg-white " v-for="item in pdList" :key="item.id" @tap="go_detail(item)">
					<view class="top-main text-grey">
						<text class="title text-black text-xl">{{ item.title }}</text>
						<text class="price text-red text-xl">{{ item_price(item) }}</text>
					</view>
					<view class="center-main">
						<view class="cu-tag radius bg-red" v-for="(tag, tIndex) in item.welfareInfo" :key="tIndex">{{ tag }}</view>
					</view>
					<view class="bottom-main text-gray justify-between">
						<view class="flex-sub flex align-center">
							<text class="cuIcon-locationfill margin-right-xs"></text>
							<text>{{ item_work_address(item.workAddress) }}</text>
						</view>
						<view class="flex">发布日期：{{ item_start_date(item.startData) }}</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<view class="subscribe-box flex justify-between padding-sm align-center" v-if="!is_subscribe">
			<text class="text-white text-sm">开启订阅将更利于接收任务，不错过每一个任务</text>
			<button class="cu-btn round bg-gradual-blue" @tap="showRsm">开启订阅</button>
		</view>
	</view>
</template>

<script>
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import { mapState, mapGetters } from 'vuex';
export default {
	components: {
		MescrollUni
	},
	data() {
		return {
			mescroll: null, //mescroll实例对象
			upOption: {
				onScroll: true, // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
				isLock:true
			},
			tab_list: [
				// {
				// 	name: '正在招工',
				// 	id: 'zzzg',
				// 	data: []
				// },
				{
					name: '待我回复',
					id: 'dwhf',
					data: null,
					num: 1,
					y: 0,
					curPageLen: 0,
					hasNext: true
				},
				{
					name: '我参与的项目',
					id: 'wcygd',
					data: null,
					num: 1,
					y: 0,
					curPageLen: 0,
					hasNext: true
				}
			],
			current_tab: {
				id: 'dwhf',
				index: 0
			},
			tmplIds: ['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps', '9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'],
			tabIndex: 0, // 当前菜单下标
			preIndex: 0, // 前一个菜单下标
			navTop: null, // nav距离到顶部的距离 (如计算不准确,可直接写死某个值)
			isShowSticky: false // 是否悬浮
		};
	},
	computed: {
		...mapState(['user_info', 'is_subscribe']),
		...mapGetters(['id', 'user_role', 'test_user','openId']),
		// 列表数据
		pdList() {
			return this.tab_list[this.current_tab.index].data;
		},
		c_CustomBar() {
			return this.CustomBar;
		}
	},
	mounted() {
		uni.$on('refreshJwt', data => {
			console.log('refreshJwt', data);
			// this.mescroll.triggerDownScroll()
			this.mescroll.resetUpScroll();
		});
		if (!this.id) {
			uni.navigateTo({
				url: '/pages/tabbar/my/myInfo/createInfo'
			});
			// uni.showModal({
			// 	titel: '提示',
			// 	content: '您的资料不完整，请先完善',
			// 	cancelText: '去完善',
			// 	cancelColor: '#007AFF',
			// 	confirmText: '先看看',
			// 	confirmColor: '#007AFF',
			// 	success: res => {
			// 		if (res.confirm) {
			// 			console.log('用户点击先看看');
			// 		} else if (res.cancel) {
			// 			console.log('用户点击去完善');
			// 			uni.navigateTo({
			// 				url: '/pages/tabbar/my/myInfo/createInfo'
			// 			});
			// 		}
			// 	}
			// });
			
		}
	},
	beforeDestroy() {
		uni.$off('refreshJwt');
	},
	methods: {
		init(mescroll) {
			
			let c_index = this.current_tab.index
			let rpStatus =  c_index === 0?'1,2,4':'5'
			let params = {
				rpStatus: rpStatus
			}
			// if( c_index === 0){
			// 	params.status='0'
			// }
			this.$http
				.get('personwx.personreclist/1.0/',params)
				.then(res => {
					console.log('personreclist', res);
					if (res.data.code == '0') {
						let data = res.data.data;
						data.forEach((item, index) => {
							item.workRequest = JSON.parse(item.workRequest);
							item.welfareInfo = JSON.parse(item.welfareInfo);
						});
						this.tab_list[c_index].data = data;
						this.$nextTick(() => {
							// 需先隐藏加载状态
							// mescroll.endSuccess(data.length);
							if(data.length > 0 ){
								mescroll.removeEmpty()
							}else{
								mescroll.showEmpty()
							}
							// 再记录当前页的数据
							this.tab_list[c_index].curPageLen = data.length; // 当前页长
							this.tab_list[c_index].hasNext = false;

							// 设置nav到顶部的距离 (需根据自身的情况获取navTop的值, 这里放到列表数据渲染完毕之后)
							// 也可以放到onReady里面,或者菜单顶部的数据(轮播等)加载完毕之后..
							if (!this.navTop) this.setNavTop();
							// 保持tab悬浮,列表数据显示第一条
							// if(this.isChangeTab){
							// 	this.isChangeTab = false;
							// 	uni.hideLoading();
							// 	if(this.isShowSticky) this.mescroll.scrollTo(this.navTop, 0)
							// }
						});
					}
				})
				.finally(() => {
					mescroll.endErr();
				});
		},
		select_tab(id, index) {
			this.current_tab.id = id;
			this.current_tab.index = index;
			let preTab = this.tab_list[this.preIndex];
			preTab.y = this.mescroll.getScrollTop(); // 滚动条位置
			this.preIndex = index;
			// 当前菜单的数据
			let curTab = this.tab_list[index];
			if (!curTab.data) {
				// 没有初始化,则初始化
				// this.isChangeTab = true;
				this.mescroll.resetUpScroll();
			} else {
				// 初始化过,则恢复之前的列表数据
				// this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
				// this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
				if(curTab.curPageLen > 0 ){
					this.mescroll.removeEmpty()
				}else{
					this.mescroll.showEmpty()
				}
				this.$nextTick(() => {
					this.mescroll.scrollTo(curTab.y, 0); // 恢复滚动条的位置
				});
			}
		},
		go_detail(item) {
			uni.navigateTo({
				url: '/pages/tabbar/task/taskMain/taskMainArtisan?item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		item_price(item) {
			let r_info = [];
			try {
				r_info = JSON.parse(item.requirementInfo);
			} catch (e) {
				//TODO handle the exception
			}

			let min = 0,
				max = 0;
			r_info.forEach((val, index) => {
				let price = Number.parseFloat(val.price);
				if (index == 0) {
					min = price;
					max = price;
				} else {
					min = price < min ? price : min;
					max = price > max ? price : max;
				}
			});
			return `${min} - ${max}元/时`;
		},
		item_tag(item) {
			console.log('item_tag', item);
			let welfareInfo = JSON.parse(item.welfareInfo);
			let workRequest = JSON.parse(item.workRequest);
			return welfareInfo;
		},
		item_start_date(time) {
			return this.$utils.format_date(time);
		},
		item_work_address(addr) {
			let address = JSON.parse(addr);
			if (Array.isArray(address)) {
				return address.join();
			} else {
				return address;
			}
		},
		showRsm() {
			wx.requestSubscribeMessage({
				tmplIds: this.tmplIds,
				success: res => {
					console.log(res);
					if (res['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps'] === 'accept' || res['9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'] === 'accept') {
						this.$http.post('personwx.openSubscribe/1.0/',{
							openId:this.openId,
							isSubscribe:'1',
						}).then(res =>{
							console.log(res)
							if(this.$utils._get(res,'data.code','') == '0'){
								this.$store.commit('setIsSubscribe', true);
							}
						})
						
					} else {
						this.$http.post('personwx.openSubscribe/1.0/',{
							openId:this.openId,
							isSubscribe:'0',
						}).then(res =>{
							if(this.$utils._get(res,'data.code','') == '0'){
								this.$store.commit('setIsSubscribe', false);
							}
						})
					}
				},
				fail(err) {
					console.log(err);
				}
			});
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
				this.init(mescroll);
			}, 300);
		},
		// 设置nav到顶部的距离 (滚动条为0, 菜单顶部的数据加载完毕获取到的navTop数值是最精确的)
		setNavTop() {
			let view = uni
				.createSelectorQuery()
				.in(this)
				.select('#tabInList');
			view.boundingClientRect(data => {
				console.log('tabInList基本信息 = ' + JSON.stringify(data));
				this.navTop = data.top; // 到屏幕顶部的距离
			}).exec();
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
		// 点击回到顶部按钮时,先隐藏悬浮菜单,避免闪动
		topClick() {
			this.isShowSticky = false;
		},
		
	}
};
</script>

<style lang="less" scoped>
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
.subscribe-box {
	position: fixed;
	background-color: rgba(0, 0, 0, 0.5);
	bottom: var(--window-bottom);
	left: 0;
	width: 100%;
	z-index: 100;
}
.top-banner {
	width: 100%;
	padding: 30rpx 30rpx 10rpx;
	background-color: #fff;
	image {
		width: 100%;
		display: block;
		border-radius: 10rpx;
	}
}
</style>
