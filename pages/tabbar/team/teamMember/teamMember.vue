<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" class="search" searchClass="search-form radius">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">
				<view style="display: flex;width: 100%;">
					<text class="cuIcon-search"></text>
					<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索图片、文章、视频" confirm-type="search"></input>
				</view>
				
			</block>
			<block slot="right">
				<view class="action">
					<text class="cuIcon-sort"></text>
				</view>
			</block>
		</cu-custom>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				InputBottom:0,
			};
		},
		methods:{
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			}
		}
	}
</script>

<style lang="less">

</style>
