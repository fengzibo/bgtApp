<template>
	<view class="plan">
		<view class="plan-list">
			<view class="item padding bg-white solid-bottom" v-for="item in plan_list" :key="item.id" @tap="goto_detail(item)">
				<view class="flex justify-between">
					<view class="text-bold">
						{{item.title}}
					</view>
					<view class="text-gray text-sm">
						{{f_time(item.createdTime)}}
					</view>
				</view>
				<view class="text-lg margin-tb-sm">
					{{item.description}}
				</view>
				<view class="text-grey">
					{{item.deviceNo}}
				</view>
			</view>
		</view>
		<view class="padding">
			<button class="cu-btn block bg-blue lg" @tap="go_add_plan">
				<text class="cuIcon-settings"></text> 管理更多生产计划</button>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				plan_list:[]
			}
		},
		
		components:{
		},
		mounted() {
			uni.$on('refplan',()=>{
				this.get_plan_list()
			})
			this.get_plan_list()
		},
		beforeDestroy() {
			uni.$off('refplan')
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
		},
		methods: {
			get_plan_list(){
				this.$http.get('personwx.headprojecttask/1.0/',{
					proId:this.bgt_ct_id,
					status:'0'
				}).then(res =>{
					console.log(res)
					this.plan_list = this.$utils._get(res,'data.data',[])
				})
			},
			go_add_plan(){
				uni.navigateTo({
					url: '/pages/tabbar/workbench/addPlan/addPlan'
				});
			},
			f_time(time){
				return this.$utils.format_date(time)
			},
			goto_detail(item){
				uni.navigateTo({
					url: '/pages/tabbar/workbench/addPlan/addPlan?item=' + encodeURIComponent(JSON.stringify(item))
				});
			}
		}
	}
</script>

<style lang="less" scoped>
</style>
