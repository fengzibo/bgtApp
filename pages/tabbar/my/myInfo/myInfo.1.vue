<template>
	<view class="">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">基本信息</block>
		</cu-custom>
	
		<scroll-view scroll-y class="scrollPage">
			<form @submit="formSubmit">
				<view class="cu-form-group padding-xl flex justify-center">
					<avatar selWidth="400upx" selHeight="400upx" @upload="myUpload" :avatarSrc="form_data.url" avatarStyle="width: 200upx; height: 200upx; border-radius: 100%;"></avatar>
				</view>

				<view class="cu-form-group margin-top">
					<view class="title">姓名</view>
					<input placeholder="请输入姓名" name="name" :value="form_data.name" :class="{'text-right':!focus_obj.name}" @focus="input_focus('name')" @blur="input_blur('name')"></input>
					<!-- <text class='cuIcon-right text-gray'></text> -->
				</view>
				<view class="cu-form-group">
					<view class="title">性别</view>
					<picker @change="PickerChange" :value="sex_index" :range="picker"  name="sex">
						<view class="picker">
							{{form_data.sex}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">年龄</view>
					<input placeholder="请输入年龄" name="age" :value="form_data.age" :class="{'text-right':!focus_obj.age}" type="number"  @focus="input_focus('age')" @blur="input_blur('age')"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">居住地址</view>
					<textarea maxlength="-1"  name="addr" placeholder="请输入居住地址" auto-height :value="form_data.addr" :class="{'text-right':!focus_obj.addr}" @focus="input_focus('addr')" @blur="input_blur('addr')"></textarea>
				</view>
				<view class="cu-form-group">
					<view class="title">备注</view>
					<textarea maxlength="-1"  name="remark" placeholder="请输入居住地址" auto-height :value="form_data.remark" :class="{'text-right':!focus_obj.remark}" @focus="input_focus('remark')" @blur="input_blur('remark')" ></textarea>
				</view>
				<view class="padding-lg">
					<button class="cu-btn block  bg-gradual-blue margin-tb-sm lg" :loading="save_loading" formType="submit">保存</button>
				</view>
			</form>
		</scroll-view>
		</view>
</template>

<script>
import avatar from '../../../../components/yq-avatar/yq-avatar.vue';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			form_data:{
				url: '../../static/login.png',
				name:'王某某',
				sex:'男',
				age:'18',
				addr:'杭州市萧山区',
				remark:'123456'
			},
			picker: ['男', '女'],
			sex_index:0,
			focus_obj:{
				name:false,
				age:false,
				addr:false,
				remark:false,
			},
			save_loading:false,
		};
	},
	components: {
		avatar
	},
	onLoad() {
		this.init()
	},
	computed:{
		...mapGetters(['id']),
	},
	methods: {
		init(){
			this.$http.get('personwx.personinfo/1.0/',{
				id:this.id
			}).then(res =>{
				console.log(res)
			})
		},
		myUpload(rsp) {
			console.log(rsp)
			this.form_data.url = rsp.path; //更新头像方式一
			//rsp.avatar.imgSrc = rsp.path; //更新头像方式二
		},
		formSubmit(e) {
			console.log(e)
			if(this.save_loading){
				return
			}
			this.save_loading = true
			setTimeout(() =>{
				
				uni.showToast({
					title:'保存成功',
					icon: 'success',
					position: 'bottom',
					success: () => {
						this.save_loading = false
						
						// uni.hideToast();
						uni.navigateBack();
					}
				});
			},500)
		},
		PickerChange(e){
			this.sex_index = e.detail.value
			this.form_data.sex = this.picker[this.sex_index]
		},
		input_focus(key){
			console.log(key)
			this.focus_obj[key] = true
		},
		input_blur(key){
			this.focus_obj[key] = false
		}
	}
};
</script>

<style scoped lang="less">
	
</style>
