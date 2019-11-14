<template>
	<view class="steps-main">
		<view class="task-main">
			<view class="title text-lg">{{recruiting_info.title}}</view>
			<view class="text-grey margin-top-sm">
				<text v-for="item in requirementInfo_list" :key = "item.type">
					{{item.type}}<text class="text-red">0</text>/<text class="text-blue" style="margin-right:20rpx;">{{item.num}}</text>
				</text>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top title">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				应招人员列表(<text class="text-text-orange">{{recruit_list.length}}</text>)人
			</view>
			<view class="action">
				<button class="cu-btn round bg-blue" @tap="show_p_modal"><text class="cuIcon-add"></text>招募人员</button>
			</view>
		</view>
		<view class="no-list text-gray text-lg" v-if="recruit_list.length<=0">
			暂无人员，请点击招募人员按钮进行招募
		</view>
		<view class="people-list" v-else>
			<view class="item padding bg-white solid-bottom" v-for="item in recruit_list" :key="item.id" @tap="goto_detail(item)">
				<view class="content">
					<view class="cu-avatar round lg bg-blue" :style="[{'backgroundUrl':item.avatarUrl}]"></view>
					<view class="content-info margin-left">
						<view class="content-info-top">
							<view class="text-orange"><view class="text-cut">name</view></view>
							<view class="text-gray text-sm margin-left">18岁</view>
							<view v-for="tag in item.tag" :key="tag">
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
					<view class="text-xs people-status bg-grey" :class="[status_class(item.status)]">{{status_text(item.status)}}</view>
				</view>
			</view>
		</view>
		<!-- <view class="cu-modal bottom-modal" :class="show_modal?'show':''" @tap="show_modal=!show_modal">
			<view class="cu-dialog" @tap.stop="">
				<view class="padding-xl">
					<button class="cu-btn block bg-blue margin-tb-sm lg" open-type="share">
						发送到群招募
					</button>
					<button class="cu-btn block bg-blue margin-tb-sm lg" @tap="goto_recruiting">
						精准人员招募
					</button>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			list:[
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'待审核',
					status_no:2,
				},
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'已录用',
					status_no:1,
				},
				{
					name:'李小吧',
					age:'22',
					tag:['电工学徒'],
					address:'深圳市龙华区大浪街',
					status:'已拒绝',
					status_no:0,
				},
			],
			show_modal:false,
			recruiting_info:{},
			recruit_list:[],
			requirementInfo_list:[]
		};
	},
	props: {
		route_id: {
			type: String,
			default() {
				return '';
			}
		},
		task_id: {
			type: String,
			default() {
				return '';
			}
		},
	},
	onShareAppMessage(res) {
		console.log(res)
	    if (res.from === 'button') {// 来自页面内分享按钮
	      console.log(res.target)
	    }
	    return {
	      title: '快来加入我们',
	      path: 'pages/tabbar/task/task',
		  imageUrl:'@/static/no-team.png'
	    }
	},
	computed: {},
	mounted() {
		this.init()
	},
	methods: {
		init(){
			this.get_recruiting_info()
		},
		get_recruiting_info(){
			this.$http.get('personwx.projectrecruitActive/1.0/',{
				status:0,
				proId:this.route_id?this.route_id:this.task_id
			}).then(res =>{
				console.log(res)
				this.recruiting_info = res.data.data[res.data.data.length-1]
				// console.log(JSON.parse(this.recruiting_info.requirementInfo))
				this.get_recruit_list(this.recruiting_info.id)
				this.$emit('update_recruiting_info',this.recruiting_info)
				try{
					this.requirementInfo_list = JSON.parse(this.$utils._get(this.recruiting_info,'requirementInfo','[]'))
					console.log(this.requirementInfo_list )
				}catch(e){
					//TODO handle the exception
				}
				
			})
		},
		goto_detail(item){
			uni.navigateTo({
				url: `/pages/auditDetail/auditDetail?id=${item.id}` 
			});
		},
		get_recruit_list(recid){
			this.$http.get('personwx.listrecruitperson/1.0/',{
				recId:recid
			}).then(res =>{
				console.log('get_recruit_list',res)
				this.recruit_list = res.data.data
			})
		},
		status_class(status_no){
			switch (status_no){
				case '1':
					return 'bg-gradual-blue'
					break;
				case '2':
					return 'bg-gradual-green'
					break;
				case '3':
					return 'bg-gradual-red'
					break;
				case '4':
					return 'bg-gradual-purple'
					break;
				case '5':
					return 'bg-gradual-pink'
					break;
				default:
					return ''
					break;
			}
		},
		status_text(status_no){
			//状态 1：待回复2：已同意，3已拒绝，4：待审核,5录用，6、不录用
			switch (status_no){
				case '1':
					return '待回复'
					break;
				case '2':
					return '已同意'
					break;
				case '3':
					return '已拒绝'
					break;
				case '4':
					return '待审核'
					break;
				case '5':
					return '录用'
					break;
				case '6':
					return '不录用'
					break;
				default:
					return ''
					break;
			}
		},
		goto_recruiting(){
			uni.navigateTo({
				url: `/pages/personList/personList?recId=${this.recruiting_info.id}`
			});
		},
		show_p_modal(){
			this.$emit('show_modal')
		}
	}
};
</script>

<style lang="less" scoped>
.steps-main {
	height: 100%;
	width: 100%;
}
.task-main{
	display: flex;
	flex-direction: column;
	background-color: #fff;
	padding: 20rpx 30rpx;
	.title{
		
	}
}
.no-list{
	text-align: center;
	line-height: 100rpx;
	
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
