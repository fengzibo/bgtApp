(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabbar/task/createTask/createTask"],{1539:function(t,e,n){"use strict";var o=n("349e"),r=n.n(o);r.a},"348c":function(t,e,n){"use strict";n.r(e);var o=n("784a"),r=n("c272");for(var i in r)"default"!==i&&function(t){n.d(e,t,function(){return r[t]})}(i);n("1539");var a=n("2877"),s=Object(a["a"])(r["default"],o["a"],o["b"],!1,null,"24ae42ae",null);e["default"]=s.exports},"349e":function(t,e,n){},"64af":function(t,e,n){"use strict";(function(t){n("ac93"),n("921b");o(n("66fd"));var e=o(n("348c"));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},"784a":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement;t._self._c;t._isMounted||(t.e0=function(e){t.show_modal=!0},t.e1=function(e){t.show_modal=!t.show_modal})},r=[];n.d(e,"a",function(){return o}),n.d(e,"b",function(){return r})},c272:function(t,e,n){"use strict";n.r(e);var o=n("f31e"),r=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);e["default"]=r.a},f31e:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n("2f62");function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){i(t,e,n[e])})}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var a=function(){return Promise.all([n.e("common/vendor"),n.e("pages/tabbar/task/createTask/step1")]).then(n.bind(null,"342e"))},s=function(){return Promise.all([n.e("common/vendor"),n.e("pages/tabbar/task/createTask/step2")]).then(n.bind(null,"f66a"))},u=function(){return n.e("pages/tabbar/task/createTask/step3").then(n.bind(null,"6391"))},c=function(){return n.e("pages/tabbar/task/createTask/step4").then(n.bind(null,"46f2"))},l={data:function(){return{numList:[{name:"任务信息"},{name:"招募信息"},{name:"人员招募筛选"},{name:"开始生产"}],form_title:["任务基本信息","招募信息","任务需求"],num:0,scrollTop:0,old:{scrollTop:0},task_id:"",route_id:"",loading:!0,recruiting_info:{},show_modal:!1}},components:{stepOne:a,stepTwo:s,stepThree:u,stepFour:c},onLoad:function(t){var e=this;if(console.log(getCurrentPages()),console.log(t.id),setTimeout(function(){e.$store.commit("setRefreshNum",Math.random())},3e3),this.route_id=t.id,this.route_id){var n=this.current_task.status;"0"==n?this.num=1:"1"==n&&(this.num=2)}this.loading=!1},computed:r({},(0,o.mapState)(["current_task"])),methods:{next:function(){var e=this;switch(this.num){case 0:this.$refs.stepOne.formSubmit(function(n){e.num++,e.task_id=n,t.$emit("refreshList")});break;case 1:this.$refs.stepTwo.formSubmit(function(){t.$emit("refreshList"),e.num++});break;default:break}this.scrollTop=this.old.scrollTop,this.$nextTick(function(){this.scrollTop=0})},prev:function(){this.num--},scroll:function(t){this.old.scrollTop=t.detail.scrollTop},update_recruiting_info:function(t){this.recruiting_info=t},endCreate:function(t){var e=this,n={proId:this.recruiting_info.proId,recId:this.recruiting_info.id,formId:t.detail.formId,path:"pages/tabbar/task/task"};console.log(n),this.$http.post("personwx.finishrecruit/1.0/",n).then(function(t){console.log(t),e.scrollTop=e.old.scrollTop,e.$nextTick(function(){this.scrollTop=0}),e.num++})},goto_recruiting:function(){t.navigateTo({url:"/pages/personList/personList?recId=".concat(this.recruiting_info.id)})}}};e.default=l}).call(this,n("543d")["default"])}},[["64af","common/runtime","common/vendor"]]]);