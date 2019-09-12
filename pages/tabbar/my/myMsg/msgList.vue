<template>
	<uni-swipe-action :options="options"><view class="cont">SwipeAction 基础使用场景</view></uni-swipe-action>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
export default {
	data() {
		return {
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	components: {
		uniSwipeAction
	},
	methods: {}
};
</script>

<style lang="less" scoped></style>
