(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabbar/task/createTask/step3"],{"06bb":function(t,e,r){"use strict";var n=r("d9ca"),i=r.n(n);i.a},"0ff0":function(t,e,r){"use strict";var n,i=function(){var t=this,e=t.$createElement,r=(t._self._c,t.__map(t.recruit_list,function(e,r){var n=t.avatarUrl(e.avatarUrl),i=t.status_class(e.status),a=t.status_text(e.status);return{$orig:t.__get_orig(e),m0:n,m1:i,m2:a}}));t.$mp.data=Object.assign({},{$root:{l0:r}})},a=[];r.d(e,"b",function(){return i}),r.d(e,"c",function(){return a}),r.d(e,"a",function(){return n})},6391:function(t,e,r){"use strict";r.r(e);var n=r("0ff0"),i=r("fd09");for(var a in i)"default"!==a&&function(t){r.d(e,t,function(){return i[t]})}(a);r("06bb");var u,s=r("f0c5"),o=Object(s["a"])(i["default"],n["b"],n["c"],!1,null,"6e3d4704",null,!1,n["a"],u);e["default"]=o.exports},c631:function(t,e,r){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r={data:function(){return{list:[{name:"李小吧",age:"22",tag:["电工学徒"],address:"深圳市龙华区大浪街",status:"待审核",status_no:2},{name:"李小吧",age:"22",tag:["电工学徒"],address:"深圳市龙华区大浪街",status:"已录用",status_no:1},{name:"李小吧",age:"22",tag:["电工学徒"],address:"深圳市龙华区大浪街",status:"已拒绝",status_no:0}],show_modal:!1,recruiting_info:{},recruit_list:[],requirementInfo_list:[]}},props:{route_id:{type:String,default:function(){return""}},task_id:{type:String,default:function(){return""}}},onShareAppMessage:function(t){return console.log(t),"button"===t.from&&console.log(t.target),{title:"快来加入我们",path:"pages/tabbar/task/task",imageUrl:"@/static/no-team.png"}},computed:{},mounted:function(){var e=this;t.$on("refreshzmList",function(){e.init()}),t.$on("refreshJwt",function(t){e.init()}),this.init()},beforeDestroy:function(){console.log("beforeDestroy"),t.$off("refreshzmList"),t.$off("refreshJwt")},methods:{init:function(){this.get_recruiting_info()},get_recruiting_info:function(){var t=this;this.$http.get("personwx.projectrecruitActive/1.0/",{status:0,proId:this.route_id?this.route_id:this.task_id}).then(function(e){console.log(e),t.recruiting_info=e.data.data[e.data.data.length-1],t.get_recruit_list(t.recruiting_info.id);try{t.requirementInfo_list=JSON.parse(t.$utils._get(t.recruiting_info,"requirementInfo","[]")),console.log(t.requirementInfo_list)}catch(r){}})},goto_detail:function(e){t.navigateTo({url:"/pages/auditDetail/auditDetail?id=".concat(e.id,"&pid=").concat(e.pid)})},get_recruit_list:function(t){var e=this;this.$http.get("personwx.listrecruitperson/1.0/",{recId:t}).then(function(t){console.log("get_recruit_list",t),e.recruit_list=t.data.data,e.$emit("update_recruiting_info",{info:e.recruiting_info,list:e.recruit_list})})},status_class:function(t){switch(t){case"1":return"bg-gradual-blue";case"2":return"bg-gradual-green";case"3":return"bg-gradual-red";case"4":return"bg-gradual-purple";case"5":return"bg-gradual-pink";default:return""}},status_text:function(t){switch(t){case"1":return"待回复";case"2":return"待审核";case"3":return"已拒绝";case"4":return"待审核";case"5":return"录用";case"6":return"不录用";default:return""}},goto_recruiting:function(){t.navigateTo({url:"/pages/personList/personList?recId=".concat(this.recruiting_info.id)})},show_p_modal:function(){this.$emit("show_modal")},avatarUrl:function(t){return"url(".concat(t,")")},current_zm_num:function(t){var e=0;return this.recruit_list.forEach(function(t){"2"===t.status&&e++}),e}}};e.default=r}).call(this,r("543d")["default"])},d9ca:function(t,e,r){},fd09:function(t,e,r){"use strict";r.r(e);var n=r("c631"),i=r.n(n);for(var a in n)"default"!==a&&function(t){r.d(e,t,function(){return n[t]})}(a);e["default"]=i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/tabbar/task/createTask/step3-create-component',
    {
        'pages/tabbar/task/createTask/step3-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("6391"))
        })
    },
    [['pages/tabbar/task/createTask/step3-create-component']]
]);
