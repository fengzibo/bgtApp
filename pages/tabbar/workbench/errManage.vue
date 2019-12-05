<template>
	<view class="">
		ERR
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
			}
		},
		
		components:{
		},
		mounted() {
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
		},
		methods: {
		}
	}
</script>

<style lang="less" scoped>
</style>
