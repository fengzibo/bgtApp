(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["colorui/components/cu-custom"],{"07c5":function(t,a,n){"use strict";(function(t){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={data:function(){return{StatusBar:this.StatusBar,CustomBar:this.CustomBar}},name:"cu-custom",computed:{style:function(){var t=this.StatusBar,a=this.CustomBar,n=this.bgImage,e="height:".concat(a,"px;padding-top:").concat(t,"px;");return this.bgImage&&(e="".concat(e,"background-image:url(").concat(n,");")),e}},props:{bgColor:{type:String,default:""},isBack:{type:[Boolean,String],default:!1},bgImage:{type:String,default:""},searchClass:{type:String,default:""}},methods:{BackPage:function(){t.navigateBack({delta:1})}}};a.default=n}).call(this,n("543d")["default"])},"4f47":function(t,a,n){"use strict";var e=function(){var t=this,a=t.$createElement;t._self._c},u=[];n.d(a,"a",function(){return e}),n.d(a,"b",function(){return u})},"52a4":function(t,a,n){"use strict";n.r(a);var e=n("4f47"),u=n("aabd");for(var r in u)"default"!==r&&function(t){n.d(a,t,function(){return u[t]})}(r);var c=n("2877"),o=Object(c["a"])(u["default"],e["a"],e["b"],!1,null,null,null);a["default"]=o.exports},aabd:function(t,a,n){"use strict";n.r(a);var e=n("07c5"),u=n.n(e);for(var r in e)"default"!==r&&function(t){n.d(a,t,function(){return e[t]})}(r);a["default"]=u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'colorui/components/cu-custom-create-component',
    {
        'colorui/components/cu-custom-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("52a4"))
        })
    },
    [['colorui/components/cu-custom-create-component']]
]);
