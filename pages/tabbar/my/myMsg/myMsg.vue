<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">我的消息</block>
		</cu-custom>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="0" :top="CustomBar">
			<msg-list></msg-list>
		</mescroll-uni>
	</view>
	
</template>

<script>
	import msgList from './msgList.vue';
	export default {
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				upOption:{
					auto:false,
				}
			};
		},
		components: {
			msgList
		},
		computed:{
		},
		methods:{
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				setTimeout(() =>{
					mescroll.endErr()
				},1000)
			},
		}
	}
</script>

<style lang="less" scoped>

</style>
