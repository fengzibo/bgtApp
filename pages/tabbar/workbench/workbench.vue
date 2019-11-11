<template>
	<view class="workbench">
		<cu-custom bgColor="bg-gradual-blue">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">工作台</block>
		</cu-custom>
		<w-head v-if="user_role==='head'"></w-head>
		<w-artisan v-if="user_role==='artisan'" class="workbench-artisan"></w-artisan>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	import wHead from './workbenchHead.vue'
	import wArtisan from './workbenchArtisan.vue'
	export default {
		data() {
			return {
				
			}
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
