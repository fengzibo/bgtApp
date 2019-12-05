<template>
	<view class="workbench">
		<cu-custom bgColor="bg-gradual-blue">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">工作台</block>
		</cu-custom>
		<w-head v-if="user_role==='head'" :location="location"></w-head>
		<w-artisan v-if="user_role==='artisan'" class="workbench-artisan"></w-artisan>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	import wHead from './workbenchHead.vue'
	import wArtisan from './workbenchArtisan.vue'
	const chooseLocation = requirePlugin('chooseLocation');
	export default {
		data() {
			return {
				location:null
			}
		},
		onShow () {
			this.location = chooseLocation.getLocation();
			console.log('show,loc',this.location)// 如果点击确认选点按钮，则返回选点结果对象，否则返回null
		},
		components:{
			wHead,
			wArtisan
		},
		computed: {
			...mapGetters(['user_role']),
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>

.workbench{
}
.workbench-artisan{;
}

</style>
