webpackJsonp([1,2],Array(52).concat([function(t,e,n){n(122);var i=n(1)(n(79),n(136),null,null);t.exports=i.exports},function(t,e,n){n(115);var i=n(1)(n(80),n(128),null,null);t.exports=i.exports},,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{text:[String,Number]}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(9);e.default={mixins:[i.a],computed:{classes:function(){return{"vux-button-group-current":this.currentIndex===this.$parent.currentIndex,"no-border-right":this.shouldRemoveBorder}},style:function(){if(this.$parent.height)return{height:this.$parent.height+"px",lineHeight:this.$parent.height+"px"}}},data:function(){return{shouldRemoveBorder:!1}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(9);e.default={mixins:[i.b],props:{height:Number}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(144),s=n.n(i),a=n(35);e.default={components:{InlineDesc:s.a},props:{title:String,value:[String,Number,Array],isLink:Boolean,inlineDesc:[String,Number],primary:{type:String,default:"title"},link:{type:[String,Object]}},methods:{onClick:function(){n.i(a.a)(this.link,this.$router)}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{title:String,titleColor:String,labelWidth:String,labelAlign:String,labelMarginRight:String,gutter:String}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{value:{type:Boolean,default:!1},text:String,position:String},created:function(){this.show=this.value},data:function(){return{show:!1}},watch:{value:function(t){this.show=t},show:function(t){this.$emit("input",t)}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(9),s=n(139),a=n.n(s);e.default={components:{Badge:a.a},created:function(){this.$slots.icon||(this.simple=!0)},mixins:[i.a],props:{showDot:{type:Boolean,default:!1},badge:String,link:[String,Object],iconClass:String},data:function(){return{simple:!1}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(9);e.default={mixins:[i.b],props:{iconClass:String}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app"}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(141),s=n.n(i),a=n(140),r=n.n(a),o=n(143),l=n.n(o),c=n(142),u=n.n(c),v=n(147),d=n.n(v),p=n(146),f=n.n(p),h=n(138),_=n.n(h);e.default={components:{Group:l.a,Cell:u.a,ButtonTab:s.a,ButtonTabItem:r.a,Tabbar:d.a,TabbarItem:f.a,MHeader:_.a},data:function(){return{msg:"Hello World!"}},methods:{load:function(){var t=this;t.$vux.loading.show({text:"Loading"}),t.$http.get("/hello").then(function(e){t.$vux.loading.hide(),console.log(e.data)}).catch(function(e){t.$vux.loading.hide(),console.log(e)})}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{leftOptions:{type:Object,default:function(){return{showBack:!1,preventGoBack:!1}}},title:{type:String,default:function(){return"H"}},transition:String,rightOptions:{type:Object,default:function(){return{showMore:!1}}}},methods:{onClickBack:function(){this.leftOptions.preventGoBack?this.$emit("on-click-back"):this.$router?this.$router.back():window.history.back()}}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,function(t,e,n){t.exports=n.p+"static/img/vux_logo.79cbb96.png"},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t.title?n("div",{staticClass:"weui-cells__title",style:{color:t.titleColor},domProps:{innerHTML:t._s(t.title)}}):t._e(),t._v(" "),n("div",{staticClass:"weui-cells",class:{"vux-no-group-title":!t.title},style:{marginTop:t.gutter}},[t._t("after-title"),t._v(" "),t._t("default")],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",{class:["vux-badge",{"vux-badge-single":1===t.text.length}],domProps:{textContent:t._s(t.text)}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("a",{staticClass:"weui-tabbar__item",class:{"weui-bar__item_on":t.$parent.index===t.currentIndex,"vux-tabbar-simple":t.simple},attrs:{href:"javascript:;"},on:{click:function(e){t.onItemClick(!0)}}},[t.simple?t._e():n("div",{staticClass:"weui-tabbar__icon",class:[t.iconClass||t.$parent.iconClass,{"vux-reddot":t.showDot}]},[t._t("icon"),t._v(" "),n("sup",[t.badge?n("badge",{attrs:{text:t.badge}}):t._e()],1)],2),t._v(" "),n("p",{staticClass:"weui-tabbar__label"},[t._t("label")],2)])},staticRenderFns:[]}},function(t,e,n){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("m-header",{attrs:{title:t.text,leftOptions:{showBack:!0},rightOptions:{showMore:!0}}}),t._v(" "),t._m(0),t._v(" "),t._l(14,function(e){return n("group",{attrs:{title:"cell demo"},on:{click:t.load}},[n("cell",{attrs:{title:"Vux",value:"Call"}})],1)}),t._v(" "),n("button-tab",{staticStyle:{margin:"20px 40px"}},[n("button-tab-item",{attrs:{selected:""}},[t._v("Articles")]),t._v(" "),n("button-tab-item",{on:{"on-item-click":t.load}},[t._v("Products")])],1),t._v(" "),n("tabbar",[n("tabbar-item",{ref:"tab-home",class:{"selected-tabbar":!0},attrs:{selected:""}},[n("div",{slot:"icon"},[n("svg",{staticClass:"vux-x-icon vux-x-icon-android-home",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"27",height:"27",viewBox:"0 0 512 512"}},[n("path",{attrs:{d:"M208 448V320h96v128h97.6V256H464L256 64 48 256h62.4v192z"}})])]),t._v(" "),n("span",{slot:"label"},[t._v("首页")])]),t._v(" "),n("tabbar-item",[n("div",{slot:"icon"},[n("svg",{staticClass:"vux-x-icon vux-x-icon-ios-paper",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"27",height:"27",viewBox:"0 0 512 512"}},[n("path",{attrs:{d:"M112 64v336H96V112H64v305.143C64 434.157 77.843 448 94.857 448h322.285C434.157 448 448 434.157 448 417.143V64H112zm48 48h128v16H160v-16zm0 160h192v16H160v-16zm240 96H160v-16h240v16zm0-160H160v-16h240v16z"}})])]),t._v(" "),n("span",{slot:"label"},[t._v("阅读")])]),t._v(" "),n("tabbar-item",{attrs:{link:"/component/demo"}},[n("div",{slot:"icon"},[n("svg",{staticClass:"vux-x-icon vux-x-icon-ios-musical-note",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"27",height:"27",viewBox:"0 0 512 512"}},[n("path",{attrs:{d:"M352.1 102.3v-.2c-.1-.3-.1-.5-.2-.8v-.1c-.6-1.5-1.8-3-3.5-3.4l-2-.4L256 78v272.6c-8 0-22.4.4-44.5 1.3-41.8 1.6-51.4 21.6-51.4 40.9 0 24.6 13.2 43.1 61.5 41 51.8-2.3 51.4-48.5 51.4-81.7V159.6l73.6 13.5c3 .6 5.4-2.3 5.4-5.3v-64.4c0-.4.1-.8.1-1.1z"}})])]),t._v(" "),n("span",{slot:"label"},[t._v("音乐")])]),t._v(" "),n("tabbar-item",[n("div",{slot:"icon"},[n("svg",{staticClass:"vux-x-icon vux-x-icon-ios-film",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"27",height:"27",viewBox:"0 0 512 512"}},[n("path",{attrs:{d:"M56 88v336h400V88H56zm72 320H72v-48h56v48zm0-64H72v-48h56v48zm0-64H72v-48h56v48zm0-64H72v-48h56v48zm0-64H72v-48h56v48zm240 112H144v-16h224v16zm72 144h-56v-48h56v48zm0-64h-56v-48h56v48zm0-64h-56v-48h56v48zm0-64h-56v-48h56v48zm0-64h-56v-48h56v48z"}})])]),t._v(" "),n("span",{slot:"label"},[t._v("影视")])])],1)],2)},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"vux-demo"},[i("img",{staticClass:"logo",attrs:{src:n(124)}}),t._v(" "),i("h1")])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"vux-button-group"},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header"},[n("div",{staticClass:"header-left"},[n("transition",{attrs:{name:t.transition}},[n("a",{directives:[{name:"show",rawName:"v-show",value:t.leftOptions.showBack,expression:"leftOptions.showBack"}],staticClass:"header-back",on:{click:[function(e){if(!("button"in e)&&t._k(e.keyCode,"preventDefault"))return null},t.onClickBack]}},[t._v(t._s(t.leftOptions.backText))])]),t._v(" "),n("transition",{attrs:{name:t.transition}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.leftOptions.showBack,expression:"leftOptions.showBack"}],staticClass:"left-arrow",on:{click:t.onClickBack}})]),t._v(" "),t._t("left")],2),t._v(" "),n("h1",{staticClass:"header-title",on:{click:function(e){t.$emit("on-click-title")}}},[t._t("default",[n("transition",{attrs:{name:t.transition}},[n("span",{directives:[{name:"show",rawName:"v-show",value:t.title,expression:"title"}]},[t._v(t._s(t.title))])])])],2),t._v(" "),n("div",{staticClass:"header-right"},[t.rightOptions.showMore?n("a",{staticClass:"header-more",on:{click:[function(e){if(!("button"in e)&&t._k(e.keyCode,"preventDefault"))return null},function(e){t.$emit("on-click-more")}]}}):t._e(),t._v(" "),t._t("right")],2)])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"weui-tabbar"},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"weui-cell",class:{"vux-tap-active":t.isLink||!!t.link,"weui-cell_access":t.isLink||!!t.link},on:{click:t.onClick}},[n("div",{staticClass:"weui-cell__hd"},[t._t("icon")],2),t._v(" "),n("div",{staticClass:"vux-cell-bd",class:{"vux-cell-primary":"title"===t.primary}},[n("p",[t._v("\n      "+t._s(t.title)+"\n      "),t._t("after-title")],2),t._v(" "),n("inline-desc",[t._v(t._s(t.inlineDesc))])],1),t._v(" "),n("div",{staticClass:"weui-cell__ft",class:{"vux-cell-primary":"content"===t.primary}},[t._v("\n    "+t._s(t.value)+"\n    "),t._t("value"),t._v(" "),t._t("default")],2),t._v(" "),t._t("child")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",{staticClass:"vux-label-desc"},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"weui-loading_toast"},[n("div",{staticClass:"weui-mask_transparent"}),t._v(" "),n("div",{staticClass:"weui-toast",style:{position:t.position}},[n("i",{staticClass:"weui-loading weui-icon_toast"}),t._v(" "),n("p",{staticClass:"weui-toast__content"},[t._v(t._s(t.text||"加载中")),t._t("default")],2)])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("a",{staticClass:"vux-button-tab-item",class:t.classes,style:t.style,attrs:{href:"javascript:"},on:{click:t.onItemClick}},[t._t("default")],2)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},staticRenderFns:[]}},,function(t,e,n){n(117);var i=n(1)(n(81),n(130),null,null);t.exports=i.exports},function(t,e,n){n(114);var i=n(1)(n(71),n(126),null,null);t.exports=i.exports},function(t,e,n){var i=n(1)(n(72),n(135),null,null);t.exports=i.exports},function(t,e,n){n(116);var i=n(1)(n(73),n(129),null,null);t.exports=i.exports},function(t,e,n){n(119);var i=n(1)(n(74),n(132),null,null);t.exports=i.exports},function(t,e,n){n(113);var i=n(1)(n(75),n(125),null,null);t.exports=i.exports},function(t,e,n){n(120);var i=n(1)(null,n(133),null,null);t.exports=i.exports},function(t,e,n){n(121);var i=n(1)(n(76),n(134),null,null);t.exports=i.exports},function(t,e,n){var i=n(1)(n(77),n(127),null,null);t.exports=i.exports},function(t,e,n){n(118);var i=n(1)(n(78),n(131),null,null);t.exports=i.exports},,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(51),s=n(49),a=n.n(s),r=n(50),o=n(47),l=n.n(o),c=n(48),u=n(52),v=n.n(u),d=n(53),p=n.n(d);i.a.use(r.a),i.a.prototype.$http=l.a,i.a.use(c.a);var f=[{path:"/",component:p.a}],h=new r.a({routes:f});a.a.attach(document.body),i.a.config.productionTip=!1,new i.a({router:h,render:function(t){return t(v.a)}}).$mount("#app-box")}]),[149]);
//# sourceMappingURL=app.29dbaa5dd98d2ff00cb7.js.map