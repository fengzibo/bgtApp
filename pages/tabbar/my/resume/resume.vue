<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个人履历</block>
		</cu-custom>
		<view class="top-tips bg-gradual-orange text-white">
			更完整的工作信息将会给您带来更多的工作机会
		</view>
		<step-two :res="res" v-if="!loading"></step-two>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	import stepTwo from '../myInfo/step2.vue';
	export default {
		data() {
			return {
				res:'',
				loading:true,
			};
		},
		components: {
			stepTwo
		},
		onLoad() {
			this.init()
		},
		computed:{
			...mapGetters(['id']),
		},
		methods:{
			init(){
				uni.showLoading({
				    title: '加载中'
				});
				this.$http.get('personwx.personinfo/1.0/',{
					id:this.id
				}).then(res =>{
					console.log(res)
					this.res = this.$utils._get(res,'data.data','{}')
					this.loading = false
					uni.hideLoading();
				})
			},
		}
	}
</script>

<style lang="less" scoped>
	.top-tips{
		width: 100%;
		height: 56rpx;
		line-height: 56rpx;
		text-align: center;
	}

</style>
