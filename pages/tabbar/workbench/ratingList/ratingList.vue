<template>
	<view class="">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">评级人员列表</block>
		</cu-custom>
		<view class="people-list">
			<view class="item padding bg-white solid-bottom flex align-center" v-for="item in person_list" :key="item.id" @tap="goto_detail(item)">
				<view class="action solid-right text-center" style="padding: 0 30rpx;">
					<view class="text-xl text-blue">
						{{item.totalHours || 0}}
					</view>
					<view class="text-gray">
						累计工时
						
					</view>
				</view>
				<view class="content flex flex-sub align-center padding-left" >
					<view class="cu-avatar round lg bg-blue" :style="{backgroundImage: `url(${item.headImg})`}"></view>
					<view class="content-info margin-left flex flex-direction">
						<view class="content-info-top flex">
							<view class="text-orange">
								<view class="text-cut">{{item.pname}}</view>
							</view>
						</view>
						<view class="cu-tag line-green margin-top-sm">{{item.typeName}}</view>
					</view>
				</view>
				<!-- <view class="cu-tag status" :class="[status_color(item.status)]">
					{{status_text(item.status)}}
				</view> -->
				<view class="action">
					<view class="text-xl people-status bg-gradual-blue">{{format_rating(item.rating)}}</view>
				</view>
			</view>
			<!-- <view class="replenish padding">
				<button class="cu-btn block bg-blue lg">
					<text class="cuIcon-roundadd"></text> 人员补充</button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				person_list:[]
			}
		},
		
		components:{
		},
		onLoad() {
			uni.$on('refreshList', () => {
				console.log('refreshList');
				this.get_people_list()
			});
			uni.$on('finshRate', () => {
				console.log('finshRate');
				this.get_people_list()
			});
			this.get_people_list()
		},
		onUnload() {
			uni.$off('refreshJwt');
			uni.$off('finshRate');
		},
		mounted() {
			// this.get_people_list()
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
		},
		methods: {
			get_people_list(){
				this.$http.get('personwx.headpersonlist/1.0/',{
					proId:this.bgt_ct_id,
					pid:this.id
				}).then(res =>{
					console.log(res)
					this.person_list = this.$utils._get(res,'data.data',[])
				})
			},
			status_text(status){
				switch (status){
					case '0':
						return '确认不来了'
						break;
					case '1':
						return '待确认'
						break;	
					case '2':
						return '确认工作'
						break;	
					case '3':
						return '下工'
						break;	
					default:
						break;
				}
			},
			status_color(status){
				switch (status){
					case '0':
						return 'line-red'
						break;
					case '1':
						return 'line-blue'
						break;	
					case '2':
						return 'line-green'
						break;	
					case '3':
						return 'line-gray'
						break;	
					default:
						break;
				}
			},
			goto_detail(item){
				uni.navigateTo({
					url: `/pages/tabbar/workbench/ratingDetail/ratingDetail?item=` + encodeURIComponent(JSON.stringify(item))
				});
			},
			format_rating(rating){
				return this.$_.ceil(rating, 2);
			}
		}
	}
</script>

<style lang="less" scoped>
	.people-list{
		.status{
			height: auto;
			font-size: 32rpx;
			padding: 8rpx 24rpx;
		}
		.action{
			flex:0 0 auto;
			.people-status{
				width: 96rpx;
				height: 96rpx;
				border-radius: 100%;
				text-align: center;
				line-height: 96rpx;
				color: #fff;
			}
		}
	}
</style>
