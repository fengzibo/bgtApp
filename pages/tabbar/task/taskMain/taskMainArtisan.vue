<template>
	<view class="task-main">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">任务详情</block>
		</cu-custom>
		<view class="scroll-box">
			<scroll-view class="scroll-v" scroll-y>
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作概要
					</view>
					<view class="action text-red">有效期：{{validityPeriod}}</view>
				</view>
				<view class="job-summary bg-white">
					<view class="text-black text-xl">{{r_item.title}}</view>
					<view class="people margin-top-sm">
						<text class="want text-sm" v-for="item in requirementInfo" :key="item.type">
							{{item.type}}工价：
							<text class="text-red text-df">{{item.price}}元/时</text>
						</text>
					</view>
					<view class="tags margin-top-sm flex-wrap">
						<view class="cu-tag radius bg-red" v-for="item in welfareInfo" :key="item">{{item}}</view>
					</view>
					<view class="boss margin-top-sm">
						<view class="cu-avatar round bg-red">{{avatar_str}}</view>
						<text class="text-grey margin-left-sm">{{r_item.createdBy}}</text>
						<view class="tel margin-left-sm text-xl">
							<text class="cuIcon-phone text-blue"></text>
							<text class="text-df">{{r_item.phone}}</text>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作要求
					</view>
				</view>
				<view class="requirements bg-white">
					<text class="requirements-main text-black text-df">
						<text v-for="(item,index) in workRequest" :key="index">{{index+1}}.{{item}}\n</text>
					</text>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						工作需求
					</view>
				</view>
				<view class="requirements bg-white">
					<text class="requirements-main text-black text-df">1.人数：<text v-for="(item,index) in requirementInfo" :key="index">{{item.type}} {{item.num}}人{{comma(index)}}</text>\n 2.上工日期为：{{validityPeriod}}\n 3.工作地点：{{workAddress}}。</text>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>
						接活流程
					</view>
				</view>
				<view class="process bg-white">
					<view class="process-main">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-text text-white"></text>
						</view>
						
						<text class="text-df text-grey">申请接活</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue "></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-mail text-white"></text>
						</view>
						<text class="text-df text-grey">等待通知</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue"></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-check text-white"></text>
						</view>
						<text class="text-df text-grey">录用通知</text>
					</view>
					<view class="process-arrow text-xl">
						<text class="cuIcon-right text-blue"></text>
					</view>
					<view class="process-main text-sl">
						<view class="process-icon text-xxl bg-gradual-blue">
							<text class="cuIcon-repair text-white"></text>
						</view>
						<text class="text-df text-grey">上工</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="footer-tool bg-white padding solid-top">
			<template v-if="r_item.rpStatus == '1'">
				<button class="cu-btn round bg-blue"  @tap="showRsm('yes')">我要接工作</button>
				<button class="cu-btn round bg-blue" @tap="go_back">我考虑下</button>
				<button class="cu-btn round bg-blue" form-type="submit" @tap="showRsm('no')">不想接</button>
			</template>
			<template v-else-if="r_item.rpStatus == '2'">
				<view class="text-green">已同意</view>
			</template>
			<template v-else-if="r_item.rpStatus == '3'">
				<view class="text-red">已拒绝</view>
			</template>
			<template v-else-if="r_item.rpStatus == '4'">
				<view class="text-blue">待审核</view>
			</template>
			<template v-else-if="r_item.rpStatus == '5'">
				<view class="text-green">录用</view>
			</template>
			<template v-else-if="r_item.rpStatus == '6'">
				<view class="text-red">不录用</view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail_res: {
				name: '全自动热压机',
				time: '2019-09-30',
				schedule: '40%',
				hour: 210,
				cost: 40000,
				err: 20,
				address: '深圳市龙华区大浪行政中心浪心科技园F栋301',
				member: 7
			},
			r_item:{},
			tmplIds:['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps','9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'],
			avatar_str:''
		};
	},
	onLoad: function (option) {
		
	    this.r_item = JSON.parse(decodeURIComponent(option.item));
		this.avatar_str = this.r_item.createdBy.substring(0,1)
		console.log( this.r_item)
	},
	computed:{
		validityPeriod(){
			return this.$utils.format_date(this._get('validityPeriod',''))
		},
		workAddress(){
			try{
				let address = JSON.parse(this._get('workAddress',''))
				if(Array.isArray(address)){
					return address.join()
				}else{
					return address
				}
			}catch(e){
				//TODO handle the exception
			}
			
			
		},
		item_tag(){
			let welfareInfo = this._get('welfareInfo',[])
			let workRequest = this._get('workRequest',[])
			return welfareInfo.concat(workRequest)
		},
		welfareInfo(){
			let welfareInfo = this._get('welfareInfo',[])
			return welfareInfo
		},
		workRequest(){
			let workRequest = this._get('workRequest',[])
			return workRequest
		},
		requirementInfo(){
			let r_info= []
			try{
				 r_info= JSON.parse(this._get('requirementInfo',[]))
			}catch(e){
				//TODO handle the exception
			}
			return r_info
		},
		
	},
	methods: {
		_get(key,defaultValue){
			return this.$utils._get(this.r_item,key,defaultValue)
		},
		goto_work(){
			this.$store.commit('setArtisanWorkState','waitStart')
			uni.switchTab({
				url:'../../workbench/workbench',
			})
		},
		go_back(){
			uni.navigateBack({
			    delta: 1
			});
		},
		showRsm(status){
			wx.requestSubscribeMessage({
				tmplIds: this.tmplIds,
				success:(res) => {
					console.log(res)
					if(res['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps'] === 'accept' || res['9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'] === 'accept'){
						this.$store.commit('setIsSubscribe',true)
						if(status == 'yes'){
							this.submitWork()
						}else{
							this.refusedWork()
						}
					}else{
						this.$store.commit('setIsSubscribe',false)
					}
				},
				fail(err){
					console.log(err)
				}
			});
		},
		submitWork(){
			this.$http.post('personwx.recpersonchangestatus/1.0/',{
				id:this._get('rpId',''),
				status: '2',
			}).then(res =>{
				console.log(res)
				if(res.data.code == '0'){
					uni.$emit('refreshJwt')
					uni.showToast({
					    title: '接工成功',
					    duration: 2000,
						success:() =>{
							this.go_back()
						}
					});
					
				}
			})
		},
		refusedWork(){
			this.$http.post('personwx.recpersonchangestatus/1.0/',{
				id:this._get('rpId',''),
				status: '3',
			}).then(res =>{
				console.log(res)
				if(res.data.code == '0'){
					uni.showToast({
					    title: '已拒绝',
					    duration: 2000,
						success:() =>{
							this.go_back()
						}
					});
					
				}
			})
		},
		comma(index){
			return index<this.requirementInfo.length-1?'，':''
		}
	}
};
</script>

<style lang="less" scoped>
.task-main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.scroll-box {
		flex: 1;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	.scroll-v {
		height: 100%;
		width: 100%;
	}
}

.job-summary {
	padding: 20rpx 30rpx;
	.people {
		display: flex;
		align-items: center;
		.want {
			display: flex;
			align-items: center;
		}
	}
	.tags {
		display: flex;
		align-items: center;
		.cu-tag{
			margin: 5rpx 0 5rpx 10rpx;
		}
	}
	.boss {
		display: flex;
		align-items: center;
		.tel {
			display: flex;
			align-items: center;
		}
	}
}
.requirements {
	padding: 20rpx 30rpx;
}
.requirements-main {
}
.process{
	display: flex;
	padding: 20rpx 30rpx;
	justify-content: space-between;
	align-items: center;
}
.process-main{
	display: flex;
	flex-direction: column;
	align-items: center;
	.process-icon{
		width: 80rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		border-radius: 100%;
		margin-bottom: 10rpx;
	}
}
.process-arrow{
	padding-bottom: 40rpx;
}
.footer-tool {
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	.cu-btn{
		width: 200rpx;
		text-align: center;
	}
}

</style>
