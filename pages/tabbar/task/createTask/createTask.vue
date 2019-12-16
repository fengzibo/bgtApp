<template>
	<view class="create-task">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">创建任务</block>
		</cu-custom>
		<template v-if="num !== 3">
			<view class="bg-white padding steps-box">
				<view class="cu-steps">
					<view class="cu-item" :class="[index >= num  ? '' : 'text-blue',index === num?'current':'']" v-for="(item, index) in numList" :key="index">
						<text class="num" :data-index="index + 1"></text>
						{{ item.name }}
					</view>
				</view>
			</view>
			<view class="create-main">
				<view class="cu-bar bg-white solid-bottom margin-top title">
					<view class="action">
						<text class="cuIcon-title text-orange"></text>
						{{form_title[num]}}
					</view>
				</view>
				<view class="content" v-if="!loading">
					<scroll-view class="scroll-v" scroll-y :scroll-top="scrollTop" @scroll="scroll">
						<template v-if="num === 0">
							<step-one ref="stepOne" :route_id="route_id" :location="location"></step-one>
						</template>
						<template v-if="num === 1">
							<step-two ref="stepTwo" :task_id="task_id" :route_id="route_id" :recruiting_info="recruiting_info" :startTime="startTime"></step-two>
						</template>
						<template v-if="num === 2">
							<step-three ref="stepThree" :task_id="task_id" :route_id="route_id" @update_recruiting_info="update_recruiting_info" @show_modal="show_modal=true"></step-three>
						</template>
					</scroll-view>
				</view>
			</view>
			<view class="footer-tool bg-white padding">
				<button class="cu-btn round bg-blue" @tap="prev" v-if="num>0">上一步</button>
				<button class="cu-btn round bg-blue" @tap="next" v-if="num<2">下一步</button>
				
				<form @submit="endCreate" v-if="num == 2 && can_create" :report-submit="true">
					<button class="cu-btn round bg-blue" form-type="submit">结束招募</button>
				</form>
				<button class="cu-btn round bg-blue" v-if="num == 2 && !can_create" @tap="go_list">返回任务列表</button>
			</view>
		</template>
		<template v-if="num === 3">
			<step-four></step-four>
		</template>
		<view class="cu-modal bottom-modal" :class="show_modal?'show':''" @tap="show_modal=!show_modal">
			<view class="cu-dialog" @tap.stop="">
				<view class="padding-xl">
					<button class="cu-btn block bg-blue margin-tb-sm lg" open-type="share">
						发送到群招募
					</button>
					<button class="cu-btn block bg-blue margin-tb-sm lg" @tap="goto_recruiting">
						<!-- <text class="cuIcon-loading2 cuIconfont-spin"></text> -->
						精准人员招募
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import stepOne from './step1.vue';
import stepTwo from './step2.vue';
import stepThree from './step3.vue';
import stepFour from './step4.vue';
import { mapState,mapGetters } from 'vuex';
const chooseLocation = requirePlugin('chooseLocation');
export default {
	data() {
		return {
			numList: [
				{
					name: '任务信息'
				},
				{
					name: '招募信息'
				},
				{
					name: '人员招募筛选'
				},
				{
					name: '开始生产'
				}
			],
			form_title:['任务基本信息','招募信息','任务需求'],
			num: 0,
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			task_id:'',
			route_id:'',
			loading:true,
			recruiting_info:{},
			recruit_list:[],
			show_modal:false,
			location:null,
			startTime:''
		};
	},
	components: {
		stepOne,
		stepTwo,
		stepThree,
		stepFour
	},
	onLoad(option) {
		console.log(getCurrentPages())
		console.log(option.id)
		setTimeout(() => {
			this.$store.commit('setRefreshNum',Math.random())
			
		}, 3000);
		this.route_id = option.id
		if(this.route_id){
			let status = this.current_task.status
			if( status == '0'){
				this.num = 1
			}else if(status == '1'){
				this.num = 2
			}
			
		}
		this.loading = false
	},
	onShow () {
		this.location = chooseLocation.getLocation();
		console.log('show,loc',this.location)// 如果点击确认选点按钮，则返回选点结果对象，否则返回null
	},
	computed:{
		...mapState(['current_task']),
		can_create(){
			return this.$_.some(this.recruit_list, ['status', '5']);
		}
	},
	methods: {
		next(){
			switch (this.num){
				case 0:
					this.$refs.stepOne.formSubmit((id,startTime) =>{
						
						this.num++
						this.task_id = id
						this.startTime = startTime
						uni.$emit('refreshList')
					})
					break;
				case 1:
					this.$refs.stepTwo.formSubmit(() =>{
						uni.$emit('refreshList')
						this.num++
					})
					break;
				default:
					break;
			}
			
			this.scrollTop = this.old.scrollTop
			this.$nextTick(function() {
				this.scrollTop = 0
			});
		},
		prev(){
			this.num--
		},
		scroll(e){
			// console.log(e)
			this.old.scrollTop = e.detail.scrollTop
		},
		update_recruiting_info(data){
			this.recruiting_info = data.info
			this.recruit_list = data.list
		},
		endCreate(e){
			let people_num = 0 
			this.recruit_list.forEach(item =>{
				if(item.status == '5'){
					people_num++
				}
			})
			uni.showModal({
			    title: '提示',
			    content: `当前您选择了${people_num}人，其他人将自动不录用，是否确定？`,
			    success: res => {
			        if (res.confirm) {
			            console.log('用户点击确定');
						let pamars = {
							proId:this.recruiting_info.proId,
							recId:this.recruiting_info.id,
							formId:e.detail.formId,
							path:'pages/tabbar/task/task',
						}
						console.log(pamars)
						// return 
						this.$http.post('personwx.finishrecruit/1.0/',pamars).then(res =>{
							console.log(res)
							this.scrollTop = this.old.scrollTop
							this.$nextTick(function() {
								this.scrollTop = 0
							});
							this.num ++ 
							uni.$emit('refreshList')
							// this.$store.commit('setHasTask',true)
						})
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
			});
			
		},
		goto_recruiting(){
			this.show_modal = false
			uni.navigateTo({
				url: `/pages/personList/personList?recId=${this.recruiting_info.id}&proId=${this.recruiting_info.proId}`
			});
		},
		go_list(){
			uni.switchTab({
				url:"/pages/tabbar/task/task"
			})
		}
	}
};
</script>

<style lang="less" scoped>
.create-task {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.steps-box {
		flex: 0 0 auto;
	}
	.create-main {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		.title {
			flex: 0 0 auto;
		}
		.content {
			flex: 1 1 0;
			height: 100%;
			width: 100%;
			overflow: hidden;
			padding-bottom: 30rpx;
			.scroll-v {
				height: 100%;
			}
		}
	}
	.footer-tool {
		flex: 0 0 auto;
		display: flex;
		justify-content: space-around;
	}
	.current{
		color: #0081ff;
	}
}
</style>
