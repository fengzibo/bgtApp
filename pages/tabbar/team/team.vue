<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">我的团队</block>
		</cu-custom>
		<view class="team-content" v-if="!loading && isHead == '1'">
			<view class="no-team" v-if="!has_team">
				<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/no-team.png" mode="aspectFit" style="width: 80%;"></image>
				<button class="cu-btn block bg-blue lg margin-top-lg" @tap="goto_add">
					<text class="cuIcon-roundadd"></text>
					添加团队
				</button>
			</view>
			<template v-else>
				<view class="team-main padding shadow-warp">
					<view class="flex align-center team-info">
						<view class="cu-avatar xl round bg-red">
							<image :src="team.logo" mode="aspectFill" style="width: 100%;height:100%;border-radius: 100%;"></image>
						</view>
						<view class="margin-left team-text">
							<view class="team-name text-xxl margin-bottom-sm">{{team.tname}}
							<text class="cuIcon-edit margin-left-sm text-blue" @tap="goto_edit"></text>
							</view>
							<view class="team-addr text-cut text-lg text-gray">
								<text class="cuIcon-locationfill"></text>
								{{team_addr}}
							</view>
						</view>
						<view class="team-recruit" @tap="goto_share">
							<view class="ewm text-sl text-center"><text class="cuIcon-qr_code"></text></view>
							<button class="cu-btn bg-blue">招募成员</button>
						</view>
					</view>
					<view class="team-intro text-df margin-top">{{team.profile}}</view>
					
				</view>
				
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						成员列表（{{personList.length}}）
					</view>
				<!-- 	<view class="action">
						<button class="cu-btn bg-blue">一个月</button>
						<button class="cu-btn bg-blue margin-left">三个月</button>
					</view> -->
				</view>
				<view class="no-people text-gray text-lg text-center padding-top" v-if="personList.length<=0">
					暂无人员，请点击招募成员按钮进行招募
				</view>
				<view class="people-list" v-else>
					<view class="item padding bg-white solid-bottom" v-for="item in personList" :key="item.id" @tap="goto_detail(item)">
						<view class="content">
							<view class="cu-avatar round lg bg-blue" :style="{backgroundImage: `url(${item.avatarUrl})`}"></view>
							<view class="content-info margin-left">
								<view class="content-info-top">
									<view class="text-orange"><view class="text-cut">{{item.panem}} {{item.sex}}</view></view>
									<view class="text-gray text-sm margin-left">{{item.age?item.age:18}}岁</view>
									<view v-for="tag in ['电工学徒']" :key="tag">
										<view class='cu-tag  margin-left line-green'>{{tag}}</view>
									</view>
								</view>
								<view class="content-info-addr text-grey text-sm">
									<text class="cuIcon-locationfill margin-right-xs"></text>
									<text>{{ item.homeAddress }}</text>
								</view>
							</view>
						</view>
						<view class="action">
							<view class="text-xl people-status bg-gradual-blue">{{num_fixed(item.rating)}}</view>
						</view>
					</view>
				</view>
			</template>
		</view>
		<team-artisan v-if="isHead == '0'" ></team-artisan>
		<!-- <view class="cu-modal" :class="ewmModal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					Modal 内容。
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	import 	teamArtisan from './teamArtisan.vue'
	export default {
		data() {
			return {
				team_detail:{},
				loading:true,
			}
		},
		components:{
			teamArtisan
		},
		onLoad() {
			this.init()
			uni.$on('refteam',()=>{
				this.init()
			})
			uni.$on('refreshJwt',(data) =>{
				this.init()
			})
		},
		onUnload() {
			uni.$off('refteam')
			uni.$off('refreshJwt')
		},
		computed:{
			...mapState(['isHead','user_info','has_team']),
			...mapGetters(['user_role']),
			team(){
				return this.$utils._get(this.team_detail,'team',{})
			},
			personList(){
				return this.$utils._get(this.team_detail,'personList',[])
			},
			team_addr(){
				try{
					return JSON.parse(this.$utils._get(this.team,'location',[])).join('')
				}catch(e){
					//TODO handle the exception
					return this.$utils._get(this.team,'location','')
				}
			},
			
		},
		methods:{
			init(){
				if(this.isHead == '1'){
					this.get_team()
				}
			},
			get_team(){
				uni.showLoading({
				    title: '加载中'
				});
				this.$http.get('personwx.getteam/1.0/',{
					loginName:this.$utils._get(this.user_info,'loginName',''),
					loginUserId:this.$utils._get(this.user_info,'id',''),
				}).then(res =>{
					console.log(res)
					if(this.$utils._get(res,'data.code','') == '1'){
						this.$store.commit('setHasTeam',false)
					}else if(this.$utils._get(res,'data.code','') == '0'){
						this.$store.commit('setHasTeam',true)
						this.team_detail = res.data.data
					}
				}).finally(() =>{
					uni.hideLoading();
					this.loading = false
				})
			},
			goto_add() {
				uni.navigateTo({
					url: '/pages/tabbar/team/addTeam/addTeam'
				});
			},
			goto_edit(){
				uni.navigateTo({
					url: '/pages/tabbar/team/addTeam/addTeam?team='+encodeURIComponent(JSON.stringify(this.team))
				});
			},
			goto_detail(item){
				
				uni.navigateTo({
					url: `/pages/auditDetail/auditDetail?id=${item.id}&pid=${item.pid}` 
				});
			},
			num_fixed(num){
				if(typeof num === 'number' && !isNaN(num)  ){
					return num.toFixed(1)
				}else {
					return Number(num).toFixed(1)
				}
				
			},
			goto_share(){
				uni.navigateTo({
					url: '/pages/shareTeam/shareTeam?team='+encodeURIComponent(JSON.stringify(this.team))
				});
			}
		}
	}
</script>

<style lang="less" scoped>
.no-team{
	width: 100%;
	padding: 100rpx 30rpx 0;
	text-align: center;
}
.team-main {
	background-color: #ffffff;
}
.team-info {
	.cu-avatar {
		flex: 0 0 auto;
	}
	.team-text {
		flex: 1 1 auto;
	}
	.team-recruit {
		flex: 0 0 auto;
	}
}
.people-list{
	.item{
		display: flex;
		align-items: center;
		.content{
			display: flex;
			align-items: center;
			flex: 1 1 auto;
			width: 100%;
			.content-info{
				display: flex;
				flex-direction: column;
				.content-info-top{
					display: flex;
					align-items: center;
				}
				.content-info-addr{
					display: flex;
					align-items: center;
					margin-top: 10rpx;
				}
			}
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
	
}
</style>
