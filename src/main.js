// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import AV from 'leancloud-storage';
import { sync } from 'vuex-router-sync';
import { AjaxPlugin, WechatPlugin, ToastPlugin, LoadingPlugin } from 'vux'
import Home from './components/Home';
import MakeActivity from './components/MakeActivity';
import ActivityDetail from './components/ActivityDetail';

import App from './App';
require('es6-promise').polyfill();

// 微信appId
const WEIXIN_APPID = 'wx4e95556bd902571e';

// leancloud appId 和 key
const LEANCLOUD_APPID = 'c6KKhCV5q3k4B4NBemy5KIwJ-gzGzoHsz';
const LEANCLOUD_APPKEY = 'ams2UmcHwhie8y4cq2FeV4qD';

// 懒加载组件
// const Home = resolve => require(['./components/Home.vue'], resolve);
// const MakeActivity = resolve => require(['./components/MakeActivity.vue'], resolve);
// const ActivityDetail = resolve => require(['./components/ActivityDetail.vue'], resolve);

Vue.use(WechatPlugin);
Vue.use(AjaxPlugin);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin)
Vue.use(VueRouter);
Vue.use(Vuex);

// 微信网页code
function searchParam(name) {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

const CODE = searchParam('code');
// if (!CODE) {
//   let url = encodeURIComponent(window.location.href);
//   window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4e95556bd902571e&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
// }
// 注册leancloud
AV.init({appId: LEANCLOUD_APPID, appKey: LEANCLOUD_APPKEY });
Vue.prototype.$AV = AV;

// 获取JSSDK配置信息
Vue.http.get(`/werewolf/jssdk/sign?url=${escape(window.location.href)}`)
.then((response) => {
    let result = response.data;
    Vue.wechat.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: WEIXIN_APPID, // 必填，公众号的唯一标识
    timestamp: result.timestamp, // 必填，生成签名的时间戳
    nonceStr: result.nonceStr, // 必填，生成签名的随机串
    signature: result.signature,// 必填，签名，见附录1
    jsApiList: [
        'onMenuShareAppMessage',
        'onMenuShareTimeline'
    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
})
.catch(function (error) {
    console.log(error);
});

const routes = [{
  path: '/',
  name: 'home',
  component: Home,
},
{
  path: '/makeactivity',
  name: 'makeactivity',
  component: MakeActivity,
},
{
  path: '/activitydetail/:id',
  name: 'activitydetail',
  component: ActivityDetail,
}];

const router = new VueRouter({
  routes,
});

// 状态模块
const app = {
  state: {
    direction: 'begin', // 路由方向
    currentUser: null,
  },
  mutations: {
    // 更新路由方向
    updateDirection(state, payload) {
      state.direction = payload.direction;
    },
    updateCurrentUser(state, payload) {
      state.currentUser = payload.currentUser;
    },
  },
};

// 状态管理器
const store = new Vuex.Store({
  modules: {
    app,
  },
});

// 状态管理器中添加 router 模块
sync(store, router);

FastClick.attach(document.body);

Vue.config.productionTip = false;

// 处理过效果
router.beforeEach((to, from, next) => {
  let direction;
  if (from.path === '/' && from.name !== 'home') {
    direction = 'begin';
  } else if (to.name === 'home') {
     direction = 'back';
  } else {
     direction = 'forward';
  }
  store.commit('updateDirection', { direction });
  next();
});

// 获取用户信息
Vue.http.get(`http://www.supersheep.cn/werewolf/weixinUserinfo?code=${CODE}`)
.then((response) => {
  let res = response.data;
  if (res.errcode) {
    // 获取微信信息失败
    alert(res.errmsg);
    return;
  }
  // 用户登录
  AV.User.signUpOrlogInWithAuthData({
      openid: res.openid,
      access_token: res.token,
      expires_at: new Date(+ new Date() + 7100 * 1000).toISOString(),
    }, 'weixin').then(function (user) {
      let currentUser = AV.User.current();
      currentUser.set('username', res.nickname);
      currentUser.set('headimgurl', res.headimgurl);
      currentUser.set('sex', res.sex);
      currentUser.set('country', res.country);
      currentUser.set('province', res.province);
      currentUser.set('city', res.city);
      currentUser.save().then(function (user) {
        // 成功保存之后，执行其他逻辑.
        // Vue.prototype.$user = user;
        // 更新但前用户状态
        store.commit('updateCurrentUser', { 'currentUser': user });
      }, function (error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message);
      });

    }, function (e) {
      // TODO 记录日志
      console.log(e);
  });
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box');
