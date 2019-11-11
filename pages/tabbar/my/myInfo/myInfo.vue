<template>
	<view class="">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">基本信息</block>
		</cu-custom>
	
		<scroll-view scroll-y class="scrollPage">
			<step-one :res="res" v-if="!loading"></step-one>
		</scroll-view>	
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import stepOne from './step1.vue';
export default {
	data() {
		return {
			res:'',
			loading:true,
		};
	},
	components: {
		stepOne
	},
	onLoad() {
		this.init()
	},
	computed:{
		...mapGetters(['id']),
	},
	methods: {
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
};
</script>

<style scoped lang="less">
	
</style>
