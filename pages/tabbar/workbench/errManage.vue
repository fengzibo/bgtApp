<template>
	<view class="err-manage">
		<view class="no-list padding" v-if="no_list">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-data.png" mode="aspectFit" class="no-data-img"></image>
			<view class="text-gray text-center">
				--没有异常事项--
			</view>
		</view>
		<view class="err-list">
			<view class="item padding bg-white solid-bottom" v-for="item in err_list" :key="item.id" @tap="goto_detail(item)">
				<view class="flex justify-between align-center text-lg">
					<view class="text-black">
						{{item.materialName}}
					</view>
					<view :class="item.status == '1'?'text-green':'text-red'">
						{{item.status == '1'?'已处理':'待处理'}}
					</view>
				</view>
				<view class="margin-tb-sm text-df">
					{{item.description}}
				</view>
				<view class="text-right text-sm text-grey">
					提报日期：{{deliveryPeriod(item.createdTime)}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				err_list:[],
				loading:true,
			}
		},
		
		components:{
		},
		mounted() {
			uni.$on('refErrList',()=>{
				this.get_err_list()
			})
			this.get_err_list()
		},
		beforeDestroy() {
			uni.$off('refErrList')
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
			no_list(){
				return !this.loading && this.err_list.length == 0
			}
		},
		methods: {
			init(){
				this.get_err_list()
			},
			get_err_list(){
				this.$http.get('personwx.projectabnormality/1.0/',{
					proId:this.bgt_ct_id
				}).then(res =>{
					console.log(res)
					this.err_list = res.data.data
				}).finally(() =>{
					this.loading = false
				})
			},
			deliveryPeriod(time){
				return this.$utils.format_date(time)
			},
			goto_detail(item){
				uni.navigateTo({
					url: `/pages/tabbar/workbench/errorReport/errorReport?item=` + encodeURIComponent(JSON.stringify(item))
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.no-list{
		.no-data-img{
			width: 30%;
			margin: 0 auto;
			display: block;
			height: 260rpx;
		}
	}
</style>
