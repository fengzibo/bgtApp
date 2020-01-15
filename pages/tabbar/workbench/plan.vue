<template>
	<view class="plan">
		<view class="plan-list">
			<view class="item padding bg-white solid-bottom" v-for="item in plan_list" :key="item.id" @tap="goto_detail(item)">
				<view class="flex justify-between align-center">
					<view class="text-bold margin-right">
						{{item.title}}
					</view>
					<!-- <view class="text-gray text-sm">
						{{f_time(item.createdTime)}}
					</view> -->
					<view class="flex align-center flex-sub">
						<view class="process flex-sub">
							<view class="cu-progress round sm striped active" >
								<view class="bg-green" :style="{'width':item.taskProcess+'%'}"></view>
							</view>
						</view>
						<view class="margin-left-sm">
							进度{{item.taskProcess}}%
						</view>
					</view>
				</view>
				<!-- <view class="flex align-center margin-top-sm">
					<view class="process flex-sub">
						<view class="cu-progress round sm striped active" >
							<view class="bg-green" :style="{'width':item.taskProcess+'%'}"></view>
						</view>
					</view>
					<view class="margin-left-sm">
						进度{{item.taskProcess}}%
					</view>
				</view> -->
				<view class="flex margin-top-sm">
					<view class="cu-avatar sm round bg-red margin-right-sm" v-for="(avr,i) in item.people" :key="i" :style="{backgroundImage: `url(${avr.avaurl})`}"></view>
				</view>
			</view>
		</view>
		<view class="padding">
			<button class="cu-btn block bg-blue lg" @tap="go_add_plan">
				<text class="cuIcon-settings"></text> 创建生产计划</button>
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
					this.plan_list.forEach(item =>{
						let list = item.userList.split(',')
						let plan_people = []
						list.forEach(val =>{
							let arr = val.split(':')
							let obj = {
								name:arr[2],
								avaurl:arr[0]+':'+arr[1]
							}
							plan_people.push(obj)
						})
						this.$set(item,'people',plan_people)
					})
					console.log(this.plan_list)
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
