import Vue from 'vue'
import App from './App'
import store from './store'
import cuCustom from './colorui/components/cu-custom.vue'
import MescrollUni from "./components/mescroll-uni/mescroll-uni.vue";
import Http from './http/index.js'
import Config from './http/config'
import utils from './utils/utils.js'
Vue.component('mescroll-uni', MescrollUni)
Vue.component('cu-custom', cuCustom)
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$http = Http
Vue.prototype.$api_url = Config.api_url
Vue.prototype.$utils = utils

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
