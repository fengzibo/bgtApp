<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">生产计划</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>
				计划信息
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">设备编码</view>
			<input placeholder="设备编码" name="deviceNo" v-model="form_data.deviceNo" />
		</view>
		<view class="cu-form-group">
			<view class="title">计划名称</view>
			<input placeholder="计划名称" name="deviceNo" v-model="form_data.title" />
		</view>
		<view class="cu-form-group align-start">
			<view class="title">计划描述</view>
			<textarea maxlength="-1" placeholder="请输入计划描述" v-model="form_data.description"></textarea>
		</view>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>
				人员信息
			</view>
		</view>
		<checkbox-group @change="checkboxChange">
			<label class="item padding bg-white solid-bottom flex align-center" v-for="item in person_list" :key="item.id">
				<view class="action solid-right text-center" style="padding: 0 30rpx;">
					<view class="text-xl text-blue">
						{{item.hours}}
					</view>
					<view class="text-gray">
						累计工时
					</view>
				</view>
				<view class="content flex flex-sub align-center padding-left" >
					<view class="cu-avatar round lg bg-blue" :style="{backgroundImage: `url(${item.headImg})`}"></view>
					<view class="content-info margin-left flex flex-direction">
						<view class="content-info-top flex">
							<view class="text-orange">
								<view class="text-cut">{{item.pname}}</view>
							</view>
						</view>
						<view class="cu-tag line-green margin-top-sm">{{item.typeName}}</view>
					</view>
				</view>
				<view class="paln-check">
					 <checkbox :value="item.id" :checked="item.checked" />
				</view>
			</label>
		</checkbox-group>
		<view class="footer-tool bg-white solid-top">
			<button class="cu-btn bg-blue" @tap="save_plan" style="flex:2;height: 100%;">保存</button>
			<!-- <button class="cu-btn round bg-blue" @tap="goto_recruiting">补招人员</button> -->
			<button class="cu-btn bg-red" style="flex:1;height: 100%;" @tap="back()">返回</button>
		</view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from 'vuex';
	export default {
		data() {
			return {
				form_data:{
					deviceNo:'',
					title:'',
					description:''
				},
				person_list:[],
				check_arr:[],
				r_item:null
			};
		},
		computed: {
			...mapState(['bgt_c_task','bgt_ct_id']),
			...mapGetters(['user_role','id']),
			is_detail(){
				return this.r_item !== null
			},
			
		},
		onLoad(option) {
			if(option.item){
				this.r_item = JSON.parse(decodeURIComponent(option.item));
				console.log(this.r_item)
				this.set_data()
				this.get_plan_detail()
			}
			this.get_people_list()
		},
		mounted() {
			
		},
		methods:{
			set_data(){
				this.form_data.deviceNo = this.r_item.deviceNo
				this.form_data.title = this.r_item.title
				this.form_data.description = this.r_item.description
			},
			get_people_list(){
				this.$http.get('personwx.headpersonlist/1.0/',{
					proId:this.bgt_ct_id,
					pid:this.id
				}).then(res =>{
					console.log(res)
					this.person_list = this.$utils._get(res,'data.data',[])
				})
			},
			get_plan_detail(){
				this.$http.get('personwx.personconsoltaskget/1.0/',{
					id:this.r_item.id
				}).then(res =>{
					console.log('detail',res)
				})
			},
			checkboxChange(e) {
				var items = this.person_list,
					values = e.detail.value;
					console.log(values)
					this.check_arr = values
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.id)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			save_plan(){
				this.$http.post('personwx.personconsoltasksu/1.0/',{
					id:this.$utils._get(this.r_item,'id',''),
					deviceNo:this.form_data.deviceNo,
					title:this.form_data.title,
					description:this.form_data.description,
					pids:this.check_arr.join(','),
					proId:this.bgt_ct_id
				}).then(res =>{
					console.log(res)
					uni.$emit('refplan')
					this.back()
				})
			},
			back(){
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="less" scoped>
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
	button{
		border-radius: 0;
	}
}
</style>
