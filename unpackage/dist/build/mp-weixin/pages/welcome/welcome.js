(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/welcome/welcome"],{"741b":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement;e._self._c},o=[];n.d(t,"a",function(){return a}),n.d(t,"b",function(){return o})},"7b03":function(e,t,n){},"8a08":function(e,t,n){"use strict";n.r(t);var a=n("a8c7"),o=n.n(a);for(var r in a)"default"!==r&&function(e){n.d(t,e,function(){return a[e]})}(r);t["default"]=o.a},a8c7:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n("2f62");function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),a.forEach(function(t){r(e,t,n[t])})}return e}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i={data:function(){return{}},onLoad:function(){},methods:o({},(0,a.mapMutations)(["setUserInfo","setIsHead","setRefreshJwt"]),{getUserInfoCb:function(t){var n=this;if(console.log(t),"getUserInfo:ok"===t.detail.errMsg){e.showLoading({title:"授权中"});var a=t.detail,o=a.userInfo;e.login({provider:"weixin",success:function(t){console.log(t),"login:ok"===t.errMsg&&n.$http.post("personwx.login/1.0/",{code:t.code,appid:"wx6d2818e2adb8d93a",avatarUrl:o.avatarUrl,city:o.city,country:o.country,gender:o.gender,language:o.language,nickName:o.nickName,province:o.province,loginName:o.nickName}).then(function(t){console.log("res",t),o.openid=n.$utils._get(t,"data.data.openId",""),o.jwt=n.$utils._get(t,"data.data.jwt",""),o.loginName=n.$utils._get(t,"data.data.loginName",o.nickName),o.status=n.$utils._get(t,"data.data.status",0),o.id=n.$utils._get(t,"data.data.id","");var a=n.$utils._get(t,"data.data.isHead","");n.setIsHead(a),n.setUserInfo(o),e.setStorageSync("version","1.1.1"),n.setRefreshJwt(!1),e.switchTab({url:"../tabbar/task/task"}),e.hideLoading()})}})}else e.showToast({title:"请先授权登录",duration:2e3})}})};t.default=i}).call(this,n("543d")["default"])},ac6e:function(e,t,n){"use strict";n.r(t);var a=n("741b"),o=n("8a08");for(var r in o)"default"!==r&&function(e){n.d(t,e,function(){return o[e]})}(r);n("e854");var i=n("2877"),c=Object(i["a"])(o["default"],a["a"],a["b"],!1,null,"cf11ae48",null);t["default"]=c.exports},bce3:function(e,t,n){"use strict";(function(e){n("ac93"),n("921b");a(n("66fd"));var t=a(n("ac6e"));function a(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},e854:function(e,t,n){"use strict";var a=n("7b03"),o=n.n(a);o.a}},[["bce3","common/runtime","common/vendor"]]]);