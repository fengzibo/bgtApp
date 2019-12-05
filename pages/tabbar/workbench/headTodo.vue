<template>
	<view class="head-todo">
		<view class="no-list padding">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-data.png" mode="aspectFit" class="no-data-img"></image>
			<view class="text-gray text-center">
				--没有待办事项--
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				list:[]
			}
		},
		
		components:{
		},
		mounted() {
			this.get_todo_list()
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
		},
		methods: {
			get_todo_list(){
				this.$http.get('personwx.headtodolist/1.0/',{
					proId:this.bgt_ct_id,
					pid:this.id
				}).then(res =>{
					console.log(res)
					this.list = this.$utils._get(res,'data.data',[])
				})
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
