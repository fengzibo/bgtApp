<template>
	<view class="workbench-artisan">
		<view class="no-task" v-if="artisan_work_state=== 'noTask'">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">当前没有相关在进行的任务</text><br>
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">去找点活干干</button><br>
			<button class="cu-btn round bg-gradual-orange lg margin-top" @tap="goto_rest">最近有点累，要休息一段时间</button>
		</view>
		<view class="rest" v-if="artisan_work_state=== 'rest'">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/rest.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-df">您已经休息了<text class="text-xl text-red">70小时</text>了，是否已经恢复到了最佳状态</text><br>
			<button class="cu-btn round bg-gradual-blue lg margin-top" @tap="goto_work">是的，我要去找活干了</button><br>
			<!-- <button class="cu-btn round bg-gradual-orange lg margin-top" @tap="goto_rest">还没恢复</button> -->
		</view>
		<view class="has-task" v-if="artisan_work_state==='waitStart'">
			<view class="flex top-manager solid-bottom bg-white">
				<view class="manager flex-sub">
					<view class="cu-avatar round bg-red">王</view>
					<text class="text-grey margin-left-sm">小包头</text>
					<view class="tel margin-left-sm text-xl flex align-center">
						<text class="cuIcon-phone text-blue"></text>
						<text class="text-df">13666666666</text>
					</view>
				</view>
				<view class="post-title">
					<text class="text-blue text-xl">
						项目\n经理
					</text>
				</view>
			</view>
			
			<view class="wait-work text-center">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/wait-work.png" mode="aspectFit" style="width: 100%"></image>
				<text class="text-black text-xl text-bold">预计开工日期:2019-10-30</text><br>
				<text class="text-gray text-sm padding block">具体时间，请关注推送消息。</text><br>
				<button class="cu-btn round bg-gradual-red lg margin-top" @tap="exit_work">我临时有事，我要退出</button>
			</view>
		</view>
		<view class="confirm-info" v-if="artisan_work_state==='confirmInfo'">
			<view class="flex top-manager solid-bottom bg-white">
				<view class="manager flex-sub">
					<view class="cu-avatar round bg-red">王</view>
					<text class="text-grey margin-left-sm">小包头</text>
					<view class="tel margin-left-sm text-xl flex align-center">
						<text class="cuIcon-phone text-blue"></text>
						<text class="text-df">13666666666</text>
					</view>
				</view>
				<view class="post-title">
					<text class="text-blue text-xl">
						项目\n经理
					</text>
				</view>
			</view>
			<view class="bg-white padding skills-card">
				<view class="info-main" :style="{ height: is_unfold ? 'auto' : '220rpx' }">
					<view class="text-lg text-black">全自动热压机装配</view>
					<view class="info-box">
						<view class="label text-gray">开工日期：</view>
						<view class="text text-black">2019-10-30</view>
					</view>
					<view class="info-box">
						<view class="label text-gray">工作地点：</view>
						<view class="text text-black">深圳市龙华区大浪街</view>
					</view>
					<view class="info-box">
						<view class="label text-gray">住院事项：</view>
						<view class="text text-black">
							<view class="margin-bottom-sm">1.记得带上身份证</view>
							<view class="margin-bottom-sm">2.记得带上身份证</view>
						</view>
					</view>
				</view>
			
				<view class="unfold-more text-grey text-sm" @tap="is_unfold = !is_unfold">{{ is_unfold ? '收起更多' : '展开更多' }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				is_unfold:false,
			}
		},
		components:{
		},
		computed: {
			...mapState(['artisan_work_state']),
			...mapGetters(['user_role'])
		},
		methods: {
			goto_work(){
				uni.switchTab({
				    url: '/pages/tabbar/task/task'
				});
			},
			goto_rest(){
				this.$store.commit('setArtisanWorkState','rest')
			},
			exit_work(){
				
			}
		}
	}
</script>

<style lang="less" scoped>
.workbench-artisan{
	width: 100%;
}
.no-task,.rest{
	text-align: center;
	padding: 30rpx;
	width: 100%;
}
.top-manager{
	padding: 10rpx 30rpx;
	.manager{
		display: flex;
		align-items: center;
	}
	.post-title{
		flex: 0 0 auto;
	}
}
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);

	.info-main {
		overflow: hidden;
		transition: all 0.3s;
	}
	.info-box {
		display: flex;
		align-items: flex-start;
		margin-top: 20rpx;
		.label {
			flex: 0 0 auto;
		}
		.text {
			flex: 1;
		}
	}
	.unfold-more {
		text-align: center;
		padding-top: 10rpx;
	}
}
</style>