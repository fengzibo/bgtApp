(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/logBack/logBack"],{"2e58":function(t,e,n){"use strict";n.r(e);var a=n("69c6"),r=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);e["default"]=r.a},5391:function(t,e,n){"use strict";n.r(e);var a=n("fe1f"),r=n("2e58");for(var o in r)"default"!==o&&function(t){n.d(e,t,function(){return r[t]})}(o);n("dc21");var i,u=n("f0c5"),c=Object(u["a"])(r["default"],a["b"],a["c"],!1,null,"8f2c12d8",null,!1,a["a"],i);e["default"]=c.exports},5916:function(t,e,n){},"69c6":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n("2f62");function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),a.forEach(function(e){o(t,e,n[e])})}return t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i={data:function(){return{from_url:""}},onLoad:function(t){var e=getCurrentPages();console.log(e);var n=e[e.length-2];this.from_url="/"+n.route;var a=n.options;if("{}"!==JSON.stringify(a)){var r="";for(var o in a)r+=o+"="+a[o];this.from_url=this.from_url+"?"+r}},computed:r({},(0,a.mapState)(["user_info"])),methods:{logBack:function(){var e=this;t.showLoading({title:"登录中"});var n=this.user_info;t.request({url:this.$api_url+"personwx.refreshJWT/1.0/",data:{openId:this.$store.getters.openId,loginName:n.loginName,city:n.city,country:n.country,gender:n.gender,language:n.language,nickName:n.nickName,province:n.province,avatarUrl:n.avatarUrl},method:"GET",header:{"Content-Type":"application/x-www-form-urlencoded"},success:function(n){console.log(n.data);var a=e.$store.state.user_info;a.id=e.$utils._get(n,"data.data.id",""),a.jwt=e.$utils._get(n,"data.data.jwt",""),a.openid=e.$utils._get(n,"data.data.openId",""),a.loginName=e.$utils._get(n,"data.data.loginName",a.nickName),a.status=e.$utils._get(n,"data.data.status","0"),e.$store.commit("setUserInfo",a),e.$store.commit("setRefreshJwt",!1);var r=e.$utils._get(n,"data.data.isHead","0"),o=e.$utils._get(n,"data.data.isSubscribe",!1),i=t.getStorageSync("isHead"),u=""===i?r:i;e.$store.commit("set_isHead_res",r),e.$store.commit("setIsHead",u),e.$store.commit("setIsSubscribe","1"===o),t.hideLoading(),t.showToast({title:"登录成功",duration:2e3,icon:"none",success:function(){t.navigateBack({delta:1}),t.$emit("refreshJwt")}})}})}}};e.default=i}).call(this,n("543d")["default"])},dc21:function(t,e,n){"use strict";var a=n("5916"),r=n.n(a);r.a},f75b:function(t,e,n){"use strict";(function(t){n("ac93"),n("921b");a(n("66fd"));var e=a(n("5391"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},fe1f:function(t,e,n){"use strict";var a,r=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"b",function(){return r}),n.d(e,"c",function(){return o}),n.d(e,"a",function(){return a})}},[["f75b","common/runtime","common/vendor"]]]);