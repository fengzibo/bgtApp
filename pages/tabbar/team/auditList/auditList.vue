<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">审核列表</block>
		</cu-custom>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="0" :top="c_CustomBar">
			<view class="audit-list" v-for="(item,index) in list_data" :key="index">
				<view class="item padding bg-white solid-bottom" @tap="goto_detail">
					<view class="content">
						<view class="cu-avatar round lg bg-blue"></view>
						<view class="text-orange margin-left"><view class="text-cut">{{item.name}}</view></view>
						<view class="text-gray text-sm margin-left">{{item.sex}}/{{item.age}}岁</view>
						<view v-for="tag in item.tag" :key="tag">
							<view class='cu-tag round margin-left bg-blue'>{{tag}}</view>
						</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.time}}</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				upOption:{
					auto:false,
				},
				list_data:[
					{
						url:'',
						name:'小王',
						sex:'男',
						age:'22',
						tag:['技工','管理'],
						time:'12:12'
					},
					{
						url:'',
						name:'小李',
						sex:'男',
						age:'22',
						tag:['技工'],
						time:'12:12'
					}
				]
			};
		},
		computed:{
			c_CustomBar(){
				return this.CustomBar
			}
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
			goto_detail(){
				uni.navigateTo({
					url:"auditDetail"
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.audit-list{
	.item{
		display: flex;
		align-items: center;
		.content{
			display: flex;
			align-items: center;
			flex: 1 1 auto;
			width: 100%;
		}
		.action{
			flex:0 0 auto;
		}
		&:after{
			border-color: #ddd;
		}
	}
}
</style>
