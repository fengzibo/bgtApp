<template>
	<view>
		<view class="bg-gradual-blue">
			<cu-custom :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">招募列表</block>
			</cu-custom>
			<view class="plh-height"></view>
		</view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索名称" v-model="search_value" confirm-type="搜索" @confirm="init"></input>
			</view>
			<view class="action">
				<text class="cuIcon-sort" @tap="conditions_modal = true"></text>
			</view>
		</view>
		<view class="no-data" v-if="no_data">
			<image src="https://boboyun.oss-cn-hangzhou.aliyuncs.com/bgt/noData.png" mode="aspectFit" class="no-data-img"></image>
			<!-- <view class="text-gray text-center" style="margin-top:-140rpx;">
				没有数据
			</view> -->
		</view>
		<mescroll-uni @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback" :bottom="100" :top="c_CustomBar" v-if="!loading && !no_data">
			<view class="person-list bg-white" >
				<checkbox-group @change="checkboxChange">
					<view class="flex align-center" v-for="item in p_list" :key="item.id">
						<view class="item-left">
							<checkbox :value="item.id" :checked="item.checked" style="transform:scale(0.7)"/>
						</view>
						<view class="flex-sub solid-bottom flex align-center item-right padding-tb-sm" @tap="goto_detail(item)">
							<view class="cu-avatar lg round" :style="{backgroundImage: avatarUrl(item.headImg)}"></view>
							<view class="flex-sub align-center">
								<view class="flex justify-between align-center">
									<view class="name text-black text-lg">
										<!-- 岚荨,男/22(电工学徒) -->
										{{item.name}},{{item.sex}}（{{item.typeLevelName}}）
									</view>
									<view class="score bg-gradual-blue text-white text-df">
										{{item.rating}}
									</view>
								</view>
								<view class="info flex align-center">
									<text class="text-red text-lg margin-right-sm padding-tb-sm">￥{{item.wage ||0}}/时</text>
									<!-- <view class="item-tag cu-tag line-red">
										学习强
									</view> -->
								</view>
								<view class="flex justify-between text-gray text-sm ">
									<view class="introduce">
										参与项目数{{item.tatolPro|| 0}},工时{{item.totalHours || 0}}时
									</view>
									<!-- <view class="r-address">
										2.4公里
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
		</mescroll-uni>
		<view class="cu-bar bg-white tabbar border footer-tool" v-if="!loading && !no_data">
			<view class="action text-orange text-xs">
				已选择：<text class="text-red">{{check_length}}</text>人
			</view>
				<button class="bg-red submit" @tap="showRsm">完成</button>
		</view>
		<view class="cu-modal drawer-modal justify-end" :class="conditions_modal?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-xl" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-form-group">
					<view class="title">状态</view>
					<radio-group class="block flex-sub flex justify-around" @change="RadioChange">
						<view class="flex align-center">
							<radio :class="status_radio=='0'?'checked':''" :checked="status_radio=='0'?true:false" value="0" style="transform:scale(0.7)"></radio>
							<text>空闲</text>
						</view>
						<view class="flex align-center">
							<radio :class="status_radio=='1'?'checked':''" :checked="status_radio=='1'?true:false" value="1" style="transform:scale(0.7)"></radio>
							<text>工作中</text>
						</view>
						<view class="flex align-center">
							<radio :class="status_radio=='2'?'checked':''" :checked="status_radio=='2'?true:false" value="2" style="transform:scale(0.7)"></radio>
							<text>休息</text>
						</view>
					</radio-group>
				</view>
				<view class="cu-form-group type-group">
					<view class="title">
						人员类型
					</view>
					<checkbox-group @change="typeChange" class="check-group">
						<label v-for="item in type_list" :key="item.id">
							<checkbox :value="item.id" :checked="item.checked" style="transform:scale(0.6)"/>
							<text>{{item.typeName}}</text>
						</label>
					</checkbox-group>
				</view>
				<view class="cu-form-group margin-top">
					<view class="title">是否包工头</view>
					<switch @change="SwitchHead" :class="switch_is_head?'checked':''" :checked="switch_is_head"></switch>
				</view>
				<!-- <view class="cu-form-group margin-top">
					<view class="title">是否做过相关设备</view>
					<switch @change="SwitchHsd" :class="hasSameDevice?'checked':''" :checked="hasSameDevice"></switch>
				</view> -->
				<view class="cu-form-group">
					<view class="title">是否做过相关设备</view>
					<input placeholder="请输入相关设备" class="text-right" v-model="sameDevice"></input>
				</view>
				<view class="cu-form-group">
					<view class="title special-tilte">评分</view>
					<radio-group class="block flex-sub flex justify-around" @change="rateChange">
						<view class="flex align-center">
							<radio :class="rateOrder?'checked':''" :checked="rateOrder" value="1" style="transform:scale(0.7)"></radio>
							<text>高</text>
						</view>
						<view class="flex align-center">
							<radio :class="!rateOrder?'checked':''" :checked="!rateOrder" value="0" style="transform:scale(0.7)"></radio>
							<text>低</text>
						</view>
					</radio-group>
				</view>
				<view class="cu-form-group">
					<view class="title special-tilte">参与项目频次</view>
					<radio-group class="block flex-sub flex justify-around" @change="projChange">
						<view class="flex align-center">
							<radio :class="projNumOrder?'checked':''" :checked="projNumOrder" value="1" style="transform:scale(0.7)"></radio>
							<text>高</text>
						</view>
						<view class="flex align-center">
							<radio :class="!projNumOrder?'checked':''" :checked="!projNumOrder" value="0" style="transform:scale(0.7)"></radio>
							<text>低</text>
						</view>
					</radio-group>
				</view>
				<view class="cu-bar btn-group margin-top">
					<button class="cu-btn bg-grey shadow-blur round" @tap="res_conditions">重置</button>
					<button class="cu-btn bg-blue shadow-blur round" @tap="sub_search">搜索</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				InputBottom:0,
				downOption: {
					auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				upOption:{
					auto:false,
					isLock:true,
					textNoMore:'--没有更多数据了--'
				},
				conditions:{
					status:'0',
					isHead:'0'
				},
				p_list:[],
				loading:true,
				conditions_modal:false,
				status_radio:'0',
				switch_is_head:false,
				recId:'',
				proId:'',
				tmplIds:['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps','9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'],
				mescroll:null,
				type_list:[],
				search_value:'',
				select_types:[],
				hasSameDevice:false,
				rateOrder:false,
				projNumOrder:false,
				sameDevice:''
			};
		},
		computed:{
			c_CustomBar(){
				return this.CustomBar + uni.upx2px(100)
			},
			no_data(){
				return this.p_list.length<=0 && !this.loading
			},
			check_length(){
				let num = 0
				this.p_list.forEach(item =>{
					if(item.checked){
						num++
					}
				})
				return num
			}
		},
		onLoad(option) {
			this.recId = option.recId || ''
			this.proId = option.proId || ''
			
			
			uni.$on('refreshList',() =>{
				console.log('refreshList')
				this.init()
				this.get_type_list()
			})
			this.init()
			this.get_type_list()
		},
		onUnload() {
			uni.$off('refreshJwt')
		},
		methods:{
			init(cb){
				uni.showLoading({
				    title: '加载中'
				});
				this.$http.get('personwx.personinfolist/1.0/',{
					status:this.conditions.status,
					isHead:this.conditions.isHead,
					searchKey:this.search_value,
					types:this.select_types.join(','),
					hasSameDevice:this.sameDevice,
					rateOrder:this.rateOrder,
					projNumOrder:this.projNumOrder,
					rpId:this.recId
				}).then(res =>{
					console.log(res)
					this.p_list = res.data.data
					this.p_list.forEach(item =>{
						this.$set(item,'checked',false)
					})
					this.loading = false
					this.$nextTick(() =>{
						uni.hideLoading();
					})
					
					if(typeof cb == 'function'){
						cb()
					}
					
				})
			},
			get_type_list(){
				this.$http.post('personwx.tylelist/1.0/').then(res =>{
					this.type_list = this.$utils._get(res,'data.data.data',[])
					console.log(res)
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
				mescroll.showNoMore()
			},
			downCallback(mescroll) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
				
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				setTimeout(() =>{
					this.init(() =>{
						mescroll.endSuccess(this.p_list.length, false)
					})
				},300)
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			checkboxChange(e){
				var items = this.p_list,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.id)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			goto_detail(item){
				uni.navigateTo({
					url: `/pages/auditDetail/auditDetail?pid=${item.id}&isWork=true`
				});
			},
			hideModal(){
				this.conditions_modal = false
			},
			RadioChange(e){
				this.status_radio = e.detail.value
			},
			SwitchHead(e){
				this.switch_is_head = e.detail.value
			},
			SwitchHsd(e){
				this.hasSameDevice = e.detail.value
			},
			rateChange(e){
				this.rateOrder = e.detail.value == '1'?true:false
			},
			projChange(e){
				this.projNumOrder = e.detail.value == '1'?true:false
			},
			res_conditions(){
				this.status_radio = '0',
				this.switch_is_head = false
				this.type_list.forEach(item =>{
					this.$set(item,'checked',false)
				})
				this.projNumOrder = false
				this.rateOrder = false
				this.hasSameDevice = false
				this.sameDevice = ''
			},
			sub_search(){
				this.conditions.status = this.status_radio
				this.conditions.isHead = this.switch_is_head?'1':'0'
				this.loading = true
				this.conditions_modal = false
				let f_type_list = this.$_.filter(this.type_list,['checked',true])
				console.log(f_type_list)
				this.select_types = this.$_.map(f_type_list,'id')
				console.log(this.select_types)
				this.init()
			},
			showRsm(){
				
				wx.requestSubscribeMessage({
					tmplIds: this.tmplIds,
					success:(res) => {
						console.log(res)
						if(res['Srd7KdqNHEUsgzsGJLUNUHgB4RBc_IQIlspLT2V5Gps'] === 'accept' || res['9ISRNbi4HPawlkd-vZHt-7xX_CxQ91XPo8KTCsuTZCw'] === 'accept'){
							uni.showLoading({
								title: '加载中'
							})
							let Ids=[],
								openIds=[];
							this.p_list.forEach(item =>{
								if(item.checked){
									Ids.push(item.id)
									openIds.push(item.openId)
								}
							})
							let params = {
								Ids:Ids.join(),
								openIds:openIds.join(),
								recId:this.recId,
								path:'pages/tabbar/task/task',
								proId:this.proId
							}
							console.log(params)
							this.$http.post('personwx.chooseperson/1.0/',params).then(res =>{
								console.log(res)
								if(this.$utils._get(res,'data.success',false)){
									uni.$emit('refreshzmList')
									uni.navigateBack({
									    delta: 1
									});
									uni.hideLoading()
								}
							})
						}
					},
					fail(err){
						console.log(err)
					}
				});
			},
			avatarUrl(avatarUrl){
				return `url(${avatarUrl})`
			},
			typeChange(e) {
				var items = this.type_list,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.id)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
.person-list{
	padding: 0 30rpx;
	.item-left{
		margin-right: 10rpx;
	}
	.item-right{
		.cu-avatar{
			margin-right: 10rpx;
		}
		.name{
			
		}
		.score{
			width: 50rpx;
			height: 50rpx;
			border-radius: 100%;
			line-height: 50rpx;
			text-align: center;
			
		}
		.item-tag{
			
		}
	}
}
.no-data{
	.no-data-img{
		width: 60%;
		margin: 0 auto;
		display: block;
	}
}
.footer-tool{
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	button{
		border: none;
		padding: 0;
		border-radius: 0;
	}
}
.check-group{
	flex: 1 1 0;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	label{
		display: flex;
		align-items: center;
		flex: 1;
		min-width: 50%;
	}
}
.type-group{
	align-items: flex-start;
	.title{
		flex: 0;
		min-width: 160rpx;
	}
}
.cu-form-group{
	.special-tilte{
		width: 220rpx;
	}
}

</style>
