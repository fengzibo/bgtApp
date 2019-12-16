<template>
	<view class="team-artisan">
		<mescroll-uni @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit" :top="c_CustomBar">
			<view class="top-banner">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/WechatIMG115.jpeg" mode="widthFix"></image>
			</view>
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>
					我加入的团队
				</view>
			</view>
		<!-- 	<view class="no-group">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="widthFix"></image>
			</view> -->
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				loading:true,
				mescroll: null, //mescroll实例对象
				upOption: {
					onScroll: true, // 是否监听滚动事件, 默认false (配置为true时,可@scroll="scroll"获取到滚动条位置和方向)
					isLock:true
				},
				team_data:[]
			};
		},
		computed:{
			...mapState(['isHead']),
			...mapGetters(['user_role']),
			c_CustomBar() {
				return this.CustomBar;
			}
		},
		mounted() {
			uni.$on('refreshJwt',(data) =>{
				this.mescroll.resetUpScroll();
			})
		},
		beforeDestroy() {
			uni.$off('refreshJwt')
		},
		methods:{
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				mescroll.resetUpScroll();
			},
			upCallback(mescroll) {
				setTimeout(() => {
					this.get_team(mescroll)
				}, 300);
			},
			init(){
				this.get_team()
			},
			get_team(mescroll){
				this.$http.get('personwx.personteam/1.0/',{
					isHead:this.isHead
				}).then(res =>{
					console.log(res)
					this.team_data = this.$utils._get(res,'data.data',[])
					
				}).finally(() =>{
					this.$nextTick(() => {
						mescroll.endSuccess(this.team_data.length,false)
					});
				})
			}
		}
	}
</script>

<style lang="less" scoped>
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
	.no-group{
		padding: 30rpx;
		image{
			width: 60%;
			display: block;
			margin: 0 auto;
		}
	}
</style>
