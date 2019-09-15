<template>
	<uni-swipe-action :options="options">
		<view class="cu-list menu-avatar">
			<view class="cu-item">
				<view class="cu-avatar round lg"  style="background-image:url(../../../static/login.png);"></view>
				<view class="content">
					<view class="text-grey">王xx</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							<!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
							我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。
						</view>
					</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">22:20</view>
					<!-- <view class="cu-tag round bg-grey sm">5</view> -->
				</view>
			</view>
		</view>
	</uni-swipe-action>
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
