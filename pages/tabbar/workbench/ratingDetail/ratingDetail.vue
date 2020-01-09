<template>
	<view>
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">人员评分</block>
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
				<view class="margin-top-lg bg-white padding skills-card" v-for="item in detail_data" :key="item.id">
					<!-- <tui-rate :current="rate_cur" @change="change_rate_cur" :hollow="true" :score="score"></tui-rate> -->
					
					<view class="flex align-center" >
						<view class="text-bold text-black text-lg  margin-right-sm" style="width: 200rpx;">
							{{item.paName}}
						</view>
						<tui-rate v-if="item.subList.length === 0"  :current="item.rate_cur" @change="change_rate_cur($event,item)" :hollow="true" :score="item.score"></tui-rate>
					</view>
					<view class="flex align-center" v-for="(sub,index) in item.subList" :key="index">
						<view class="margin-right-sm" style="width: 200rpx;">
							{{sub.paName}}
						</view>
						<tui-rate :current="sub.rate_cur" @change="change_rate_cur($event,sub)" :hollow="true" :score="sub.score"></tui-rate>
					</view>
				</view>
			</view>
			
			
		</mescroll-uni>
		<view class="footer-tool bg-white solid-top">
			<button class="cu-btn bg-blue" style="flex:2;height: 100%;" @tap="submit_rate">提交</button>
			
		</view>
	</view>
</template>

<script>
import tuiRate from "@/components/rate/rate.vue"
export default {
	data() {
		return {
			downOption: {
				use:false,
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				use:false,
				auto: false
			},
			
			detail_data: {},
			personinfo: {},
		};
	},
	components: {
		// sunuiStar
		tuiRate
	},
	computed: {
		c_CustomBar() {
			return this.CustomBar;
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
				.get('personwx.getparams/1.0/')
				.then(res => {
					console.log(res);
					if (res.data.code == 0) {
						this.detail_data = res.data.data;
						this.detail_data.forEach(item =>{
							this.$set(item,'rate_cur',0)
							this.$set(item,'score',0)
							item.subList.forEach(sub =>{
								this.$set(sub,'rate_cur',0)
								this.$set(sub,'score',0)
							})
						})
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
		
		change_rate_cur(e,item){
			item.rate_cur = e.index
			item.score = e.score
		},
		submit_rate(){
			let rateDate = []
			this.detail_data.forEach(item =>{
				let obj = {
					id:item.id,
					value:this.$_.add(item.rate_cur,item.score)*2,
					subList:[]
				}
				item.subList.forEach(sub =>{
					obj.subList.push({
						id:sub.id,
						value:this.$_.add(sub.rate_cur,sub.score)*2,
					})
				})
				rateDate.push(obj)
				
			})
			this.$http.get('personwx.commentperson/1.0/',{
				rateDate:JSON.stringify(rateDate),
				pid:this.personinfo.pid,
				proId:this.personinfo.proId
			}).then(res => {
				console.log(res)
				if (res.data.code == 0) {
					uni.showToast({
					    title: '提交成功',
						icon:'success',
					    duration: 2000
					});
					uni.$emit('finshRate')
					setTimeout(() =>{
						uni.navigateBack({
							delta: 1
						});
					},400)
					
				}
			});
			
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
