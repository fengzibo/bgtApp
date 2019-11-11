<template>
	<view>
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">审核详情</block>
			</cu-custom>
			<view class="plh-height"></view>
		</view>
		<mescroll-uni :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="128" :top="c_CustomBar">
			<view class="padding detail-main">
				<view class="people-main bg-white">
					<view class="info">
						<view class="name">
							<text class="text-bold text-black text-xl">小王</text>
							<text class="cuIcon-female text-red sex-icon"></text>
						</view>
						<view class="price margin-top-sm text-red text-xl margin-bottom-sm">28/时</view>
						<sunui-star iconName="cuIcon-favorfill" :disabledStar="true"></sunui-star>
						<view class="addr text-gray margin-top-sm ">
							<text class="cuIcon-locationfill margin-right-xs"></text>
							<text>深圳市龙华区</text>
						</view>
					</view>
					<view class="avatar bg-white"><view class="cu-avatar xl round bg-red"></view></view>
				</view>
				<view class="margin-top-lg bg-white padding skills-card">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						掌握技能
					</view>
					<view class="padding">
						<view class="cu-tag radius margin-right bg-blue">电工</view>
						<view class="cu-tag radius bg-orange">钳工</view>
					</view>
				</view>
				<view class="margin-top-lg bg-white padding skills-card">
					<view class="action">
						<text class="cuIcon-titles text-blue"></text>
						最近工作情况
					</view>
					<view class="work-list">
						<view class="item solid-bottom" v-for="(item,index) in detail_list" :key="index">
							<view class="cu-avatar round lg bg-blue"></view>
							<view class="work-info">
								<view class="work-do">
									<view class="text-cut work-name text-lg text-black">{{item.wName}}</view>
									<view class="time text-sm text-gray">{{item.wTime}}</view>
								</view>
								<view class="work-intr text-gray text-sm">{{item.wIntr}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<view class="bottom-btn bg-white">
			<view class="main">
				<button class="bg-gradual-blue cu-btn lg">同意加入</button>
				<button class="bg-gradual-red cu-btn lg">拒绝</button>
			</view>
		</view>
	</view>
</template>

<script>
import sunuiStar from '../../../../components/sunui-star/sunui-star.vue';
export default {
	data() {
		return {
			downOption: {
				auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				auto: false
			},
			detail_list:[
				{
					wName:'什么工作什么工作什么工作什么工作',
					wTime:'2019/9/1 ~ 2019/9/2',
					wIntr:'工作认真负责，学习能力强，工作认真负责，学习能力强，遇到异常可以单独处理工作认真负责，学习能力强，遇到异常可以单独处理'
				},
				{
					wName:'什么工作什么工作什么工作什么工作',
					wTime:'2019/9/1 ~ 2019/9/2',
					wIntr:'工作认真负责，学习能力强，工作认真负责，学习能力强，遇到异常可以单独处理工作认真负责，学习能力强，遇到异常可以单独处理'
				},
				{
					wName:'什么工作什么工作什么工作什么工作',
					wTime:'2019/9/1 ~ 2019/9/2',
					wIntr:'工作认真负责，学习能力强，工作认真负责，学习能力强，遇到异常可以单独处理工作认真负责，学习能力强，遇到异常可以单独处理'
				},
				{
					wName:'什么工作什么工作什么工作什么工作',
					wTime:'2019/9/1 ~ 2019/9/2',
					wIntr:'工作认真负责，学习能力强，工作认真负责，学习能力强，遇到异常可以单独处理工作认真负责，学习能力强，遇到异常可以单独处理'
				},
			]
		};
	},
	components: {
		sunuiStar
	},
	computed:{
		c_CustomBar(){
			return this.CustomBar
		}
	},
	methods: {
		downCallback(mescroll) {
			// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
			// loadSwiper();
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			//联网加载数据
			setTimeout(() => {
				mescroll.endErr();
			}, 1000);
		}
	}
};
</script>

<style lang="less" scoped>
.plh-height {
	height: 208upx;
}
.detail-main {
	padding-top: 64upx;
}
.people-main {
	border-radius: 10upx;
	position: relative;
	padding: 84upx 0 30upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
	.info {
		display: flex;
		flex-direction: column;
		align-items: center;

		.name {
			position: relative;
			.sex-icon {
				position: absolute;
				right: -38upx;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
	.avatar {
		position: absolute;
		top: -64upx;
		left: 50%;
		transform: translateX(-50%);
		padding: 10upx;
		border-radius: 100%;
		align-items: center;
	}
}
.skills-card {
	border-radius: 10upx;
	box-shadow: 6upx 6upx 8upx rgba(0, 129, 255, 0.1);
}
.work-list {
	.item {
		display: flex;
		align-items: center;
		padding:20upx 0;
		&:after{
			border-color: #ddd;
		}
		&:last-child:after{
			border-color: transparent;
		}
		.cu-avatar {
			flex: 0 0 auto;
			margin-right: 20upx;
		}
		.work-info {
			flex: 1 1 auto;
			overflow: hidden;
		}
		.work-do {
			display: flex;
			align-items: center;
			.work-name {
				flex: 1 1 auto;
			}
			.time {
				flex: 0 0 auto;
				margin-left: 10upx;
			}
		}
		.work-intr {
			display: -webkit-box;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			word-break: break-all;
		}
	}
}
.bottom-btn{
	position: fixed;
	width: 100%;
	height: 128upx;
	bottom: 0;
	z-index: 1024;
	box-shadow: 6upx -6upx 8upx rgba(0, 129, 255, 0.1);
	.main{
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100%;
		.cu-btn{
			min-width: 200upx;
		}
	}
}
</style>
