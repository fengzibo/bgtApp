<template>
	<view class="create-info">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">基本信息</block>
		</cu-custom>
		<view class="top-tips bg-gradual-orange text-white" v-if="show_tips">
			{{tip_text}}
		</view>
		<view class="bg-white padding steps-box">
			<view class="cu-steps">
				<view class="cu-item" :class="[index >= num ? '' : 'text-blue', index === num ? 'current' : '']" v-for="(item, index) in numList" :key="index">
					<text class="num" :data-index="index + 1"></text>
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="create-main">
		<!-- 	:scroll-top="scrollTop" @scroll="scroll" -->
			<scroll-view class="scroll-v" scroll-y >
				<template v-if="num === 0">
					<step-one ref="stepOne" @next="next" @showTips="showTips"></step-one>
				</template>
					<template v-if="num === 1">
					<step-two ref="stepTwo" @next="next"></step-two>
				</template>
				<template v-if="num === 2">
					<step-three ref="stepThree"></step-three>
				</template>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapState,mapGetters } from 'vuex';
import stepOne from './step1.vue';
import stepTwo from './step2.vue';
import stepThree from './step3.vue';
export default {
	data() {
		return {
			numList: [
				{
					name: '基本信息'
				},
				{
					name: '工作信息完善'
				},
				{
					name: '完成'
				}
			],
			num: 0,
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			show_tips:false,
			tip_text:''
		};
	},
	onLoad() {
		this.init()
	},
	components: {
		stepOne,
		stepTwo,
		stepThree
	},
	computed: {
		...mapState(['user_info']),
		...mapGetters(['id']),
	},
	methods: {
		init(){
			if(this.id){
				this.num = 1
				this.showTips('更完整的工作信息将会给您带来更多的工作机会')
			}
		},
		scroll(e) {
			console.log(e);
			this.old.scrollTop = e.detail.scrollTop;
		},
		next(){
			this.num++
			if(this.num === 2){
				this.show_tips = false
			}
		},
		showTips(data){
			this.show_tips = true
			this.tip_text = data
		}
	}
};
</script>

<style lang="less" scoped>
.create-info {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.steps-box {
		flex: 0 0 auto;
		padding-top: 0;
	}
	.create-main {
		flex: 1;
		overflow: hidden;
		.scroll-v {
			width: 100%;
			height: 100%;
		}
	}
	.current{
		color: #0081ff;
	}
	.top-tips{
		flex: 0 0 auto;
		width: 100%;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
	}
}
</style>
