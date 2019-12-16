<template>
	<view class="error-report">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">异常提报</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text>
				异常信息
			</view>
		</view>
		<view class="bg-white">
			<view class="cu-form-group">
				<view class="title">物料名称</view>
				<input class="text-right" placeholder="请输入物料名称"  name="materialName" v-model="form_data.materialName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">规格型号</view>
				<input class="text-right" placeholder="请输入规格型号"  name="materialName" v-model="form_data.specModel"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">数量</view>
				<input class="text-right" placeholder="请输入数量"  name="materialName" v-model="form_data.num"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">异常描述</view>
				<textarea maxlength="-1" class="text-right" name="remark" placeholder="请输入服务备注" auto-height v-model="form_data.description" ></textarea>
			</view>
		</view>
		<!-- <view class="cu-form-group">
			<view class="title">规格型号</view>
			<picker @change="PickerChange" :value="sex_index" :range="picker"  name="sex" disabled>
				<view class="picker">
					{{form_data.sex}}
				</view>
			</picker>
		</view> -->
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text>
				异常处理
			</view>
		</view>
		<view class="bg-white">
			<view class="cu-form-group">
				<view class="title">原因分析</view>
				<textarea maxlength="-1" class="text-right" name="remark" placeholder="请输入原因分析" auto-height v-model="form_data.reason" ></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">处理方式</view>
				<picker @change="methodChange" :value="method_value" :range="method_picker"  name="method">
					<view class="picker">
						{{form_data.method}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">处理方法</view>
				<textarea maxlength="-1" class="text-right" name="remark" placeholder="请输入处理方法" auto-height v-model="form_data.approach" ></textarea>
			</view>
			<view class="cu-form-group">
				<view class="title">处理时长</view>
				<input class="text-right" placeholder="请输入处理时长"  name="materialName" v-model="form_data.processingTime"></input>
				<view class="action">
					小时
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">责任归属</view>
				<picker @change="attributionChange" :value="attribution_value" :range="attribution_picker"  name="attribution">
					<view class="picker">
						{{form_data.attribution}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">处理人</view>
				<input class="text-right" placeholder="请输入处理人"  name="dealName" v-model="form_data.dealName"></input>
			</view>
		</view>
		<view class="footer-tool bg-white solid-top margin-top">
			<button class="cu-btn bg-blue" @tap="save_error" style="flex:2;height: 100%;">提交</button>
			<!-- <button class="cu-btn round bg-blue" @tap="goto_recruiting">补招人员</button> -->
			<button class="cu-btn bg-red" style="flex:1;height: 100%;" @tap="back()">返回</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				form_data:{
					materialName:'',
					specModel:'',
					num:'',
					description:'',
					reason:'',
					method:'自修',
					approach:'',
					processingTime:'',
					attribution:'机构研发',
					dealName:''
				},
				method_value:0,
				method_picker:['自修','返修'],
				attribution_value:0,
				attribution_picker:['机构研发','采购','供应商','生产'],
				item_data:{}
			}
		},
		onLoad(option) {
			if(option.item){
				this.item_data = JSON.parse(decodeURIComponent(option.item));
				this.init();
			}
			
			uni.$on('refreshList', () => {
				console.log('refreshList');
				this.init();
			});
		},
		onUnload() {
			uni.$off('refreshJwt');
		},
		computed: {
			...mapState(['bgt_c_task', 'bgt_ct_id'])
		},
		methods: {
			methodChange(e){
				this.method_value = e.detail.value
				this.form_data.method = this.method_picker[this.method_value]
			},
			attributionChange(e){
				this.attribution_value = e.detail.value
				this.form_data.attribution = this.attribution_picker[this.attribution_value]
			},
			init(){
				this.form_data.materialName = this.item_data.materialName
				this.form_data.specModel = this.item_data.specModel
				this.form_data.num = this.item_data.num
				this.form_data.description = this.item_data.description
				this.form_data.reason = this.item_data.reason
				this.form_data.method = this.item_data.method
				this.method_value = this.$_.indexOf(this.method_picker,this.form_data.method)
				this.form_data.approach = this.item_data.approach
				this.form_data.processingTime = this.item_data.processingTime
				this.form_data.attribution = this.item_data.attribution
				this.attribution_value = this.$_.indexOf(this.attribution_picker,this.form_data.attribution)
				this.form_data.dealName = this.item_data.dealName
			},
			
			save_error(){
				let params = this.$_.cloneDeep(this.form_data)
				params.id = this.$_.get(this.item_data,'id','')
				params.proId = this.bgt_ct_id
				console.log(params)
				this.$http.post('personwx.projectabnormalitysu/1.0/',params).then(res =>{
					console.log(res)
					if(this.$_.get(res,'data.success',false)){
						uni.showToast({
						    title: '异常提报成功',
						    duration: 2000,
							success: () => {
								setTimeout(() => {
									uni.$emit('refErrList')
									this.back()
								}, 300);
							}
						});
					}else{
						uni.showToast({
						    title: '异常提报失败',
						    duration: 2000,
						});
					}
					
				})
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="less" scoped>
.error-report{
	padding-bottom: 80rpx;
}
.footer-tool {
	width: 100%;
	height: 80rpx;
	flex: 0 0 auto;
	display: flex;
	justify-content: space-around;
	align-items: center;
	position: fixed;
	left: 0;
	bottom: var(--window-bottom);
	z-index: 10;
	button {
		border-radius: 0;
	}
}
</style>
