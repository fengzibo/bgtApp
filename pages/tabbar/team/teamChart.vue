<template>
	<view class="charts-box">
		<view class="charts-main">
			<canvas
				canvas-id="canvasColumn"
				id="canvasColumn"
				class="charts"
				:style="{
					width: cWidth * pixelRatio + 'px',
					height: cHeight * pixelRatio + 'px',
					transform: 'scale(' + 1 / pixelRatio + ')',
					'margin-left': (-cWidth * (pixelRatio - 1)) / 2 + 'px',
					'margin-top': (-cHeight * (pixelRatio - 1)) / 2 + 'px'
				}"
				@touchstart="touchColumn"
			></canvas>
		</view>
	</view>
	
</template>

<script>
import uCharts from '../../../js_sdk/u-charts/u-charts/u-charts.min.js';
let _self;
let canvaColumn = null;
export default {
	data() {
		return {
			cWidth: '',
			cHeight: '',
			serverData: {
				categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
				series: [
					{
						name: '成交量1',
						data: [15, { value: 20, color: '#f04864' }, 45, 37, 43, 34]
					},
					{
						name: '成交量2',
						data: [30, { value: 40, color: '#facc14' }, 25, 14, 34, 18]
					}
				]
			}
		};
	},
	mounted() {
		_self = this;
		this.cWidth = uni.upx2px(750);
		this.cHeight = uni.upx2px(500);
		this.showColumn('canvasColumn', this.serverData);
		console.log(this.pixelRatio);
	},
	computed: {},
	methods: {
		showColumn(canvasId, chartData) {
			canvaColumn = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'column',
				legend: { show: true, position: 'top' },
				fontSize: 11,
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				animation: true,
				categories: chartData.categories,
				series: chartData.series,
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					//disabled:true
				},
				dataLabel: true,
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				extra: {
					column: {
						type: 'group',
						width: (_self.cWidth * _self.pixelRatio * 0.45) / chartData.categories.length
					}
				}
			});
		},
		touchColumn(e) {
			canvaColumn.showToolTip(e, {
				format: function(item, category) {
					if (typeof item.data === 'object') {
						return category + ' ' + item.name + ':' + item.data.value;
					} else {
						return category + ' ' + item.name + ':' + item.data;
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.charts-box{
	display: flex;
}
.charts-box{
	width: 750upx;
	height: 500upx;
	overflow: hidden;
}
.charts {
	width: 100%;
	height: 100%;
	flex: 1;
	background-color: #FFFFFF;
}
</style>
