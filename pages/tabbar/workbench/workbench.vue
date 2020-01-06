<template>
	<view class="workbench">
		<cu-custom bgColor="bg-gradual-blue">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">工作台</block>
		</cu-custom>
		<view class="no-task" v-if="!is_login">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-task.png" mode="aspectFit" style="width: 100%"></image>
			<text class="text-grey text-xl">当前没有相关在进行的任务</text>
			<br />
			<button class="cu-btn round bg-gradual-red lg margin-top" @tap="init">刷新工作台</button>
		</view>
		<template v-else>
			<w-head v-if="user_role==='head'" :location="location"></w-head>
			<w-artisan v-if="user_role==='artisan'" class="workbench-artisan"></w-artisan>
		</template>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	import wHead from './workbenchHead.vue'
	import wArtisan from './workbenchArtisan.vue'
	const chooseLocation = requirePlugin('chooseLocation');
	export default {
		data() {
			return {
				location:null,
			}
		},
		onShow () {
			this.location = chooseLocation.getLocation();
			console.log('show,loc',this.location)// 如果点击确认选点按钮，则返回选点结果对象，否则返回null
		},
		onLoad() {
			console.log('onLoad')
		},
		components:{
			wHead,
			wArtisan
		},
		computed: {
			...mapState(['is_login']),
			...mapGetters(['user_role']),
		},
		methods: {
			init(){
				this.login_tips()
			},
			login_tips(){
				uni.showModal({
				    title: '提示',
				    content: '您还未登录，登录体验更佳',
					cancelText:'先看看',
					confirmText:'前往登录',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.navigateTo({
								url: '/pages/welcome/welcome'
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
		}
	}
</script>

<style lang="less" scoped>

.no-task,
.rest {
	text-align: center;
	padding: 30rpx;
	width: 100%;
}

</style>
