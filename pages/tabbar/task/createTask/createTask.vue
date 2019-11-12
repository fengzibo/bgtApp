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
				<view class="content">
					<scroll-view class="scroll-v" scroll-y :scroll-top="scrollTop" @scroll="scroll">
						<template v-if="num === 0">
							<step-one ref="stepOne"></step-one>
						</template>
						<template v-if="num === 1">
							<step-two ref="stepTwo" :task_id="task_id"></step-two>
						</template>
						<template v-if="num === 2">
							<step-three ref="stepThree"></step-three>
						</template>
					</scroll-view>
				</view>
			</view>
			<view class="footer-tool bg-white padding">
				<button class="cu-btn round bg-blue" @tap="prev" v-if="num>0">上一步</button>
				<button class="cu-btn round bg-blue" @tap="next" v-if="num<3">{{num == 2?'结束人员招募并完成创建':'下一步'}}</button>
			</view>
		</template>
		<template v-if="num === 3">
			<step-four></step-four>
		</template>
	</view>
</template>

<script>
import stepOne from './step1.vue';
import stepTwo from './step2.vue';
import stepThree from './step3.vue';
import stepFour from './step4.vue';
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
		};
	},
	components: {
		stepOne,
		stepTwo,
		stepThree,
		stepFour
	},
	onLoad(option) {
		console.log(option.id)
	},
	methods: {
		next(){
			switch (this.num){
				case 0:
					this.$refs.stepOne.formSubmit((id) =>{
						
						this.num++
						this.task_id = id
					})
					break;
				case 1:
					this.$refs.stepTwo.formSubmit(() =>{
						
						this.num++
					})
					break;
				default:
					break;
			}
			// this.num++
			this.scrollTop = this.old.scrollTop
			this.$nextTick(function() {
				this.scrollTop = 0
			});
			if(this.num ==2){
				this.$store.commit('setHasTask',true)
			}
		},
		prev(){
			this.num--
		},
		scroll(e){
			// console.log(e)
			this.old.scrollTop = e.detail.scrollTop
		},
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
