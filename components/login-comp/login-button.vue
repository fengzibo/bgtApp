<template>
	<view class="dlbutton-box">
		<!-- 按钮 -->
		<button :class="['buttonBorder', !_rotate ? 'dlbutton' : 'dlbutton_loading']" :style="{ background: bgColor, color: fontColor }">
			<view :class="_rotate ? 'rotate_loop' : ''">
				<text v-if="_rotate" class="cuIcon cuIcon-loading1 "></text>
				<text v-if="!_rotate">{{ text }}</text>
			</view>
		</button>
	</view>
</template>

<script>
export default {
	props: {
		text: String, //显示文本
		rotate: {
			//是否启动加载
			type: [Boolean, String],
			default: false
		},
		bgColor: {
			//按钮背景颜色
			type: String,
			default: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))'
		},
		fontColor: {
			//按钮字体颜色
			type: String,
			default: '#FFFFFF'
		}
	},
	computed: {
		_rotate() {
			//处理值
			return String(this.rotate) !== 'false';
		}
	}
};
</script>

<style scoped>
.dlbutton-box {
	margin-top: 96upx;
}
.dlbutton {
	color: #ffffff;
	font-size: 30upx;
	width: 601upx;
	height: 100upx;
	background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6));
	box-shadow: 0upx 0upx 13upx 0upx rgba(164, 217, 228, 0.4);
	border-radius: 2.5rem;
	line-height: 100upx;
	text-align: center;
	margin-left: auto;
	margin-right: auto;
}
.dlbutton_loading {
	color: #ffffff;
	font-size: 30upx;
	width: 100upx;
	height: 100upx;
	background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6));
	box-shadow: 0upx 0upx 13upx 0upx rgba(164, 217, 228, 0.4);
	border-radius: 2.5rem;
	line-height: 100upx;
	text-align: center;
	margin-left: auto;
	margin-right: auto;
}
.buttonBorder {
	border: none;
	border-radius: 2.5rem;
	box-shadow: 0 0 60upx 0 rgba(0, 0, 0, 0.2);
	transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
}

/* 旋转动画 */
.rotate_loop {
	animation: rotate 1s linear infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(359deg);
	}
}
</style>
