// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import axios from 'axios';
import { LoadingPlugin } from 'vux';
import { Lazyload, InfiniteScroll } from 'mint-ui';
import { sync } from 'vuex-router-sync';
import question from './store/question';
import storage from './store/storage';
import vuex from './store/vuex';
import one from './store/one';
import music from './store/music';
import reading from './store/reading';
import user from './store/user';
import App from './App';
import routes from './route/routes';

Vue.use(Vuex);
Vue.use(Lazyload);
Vue.use(InfiniteScroll);
Vue.use(VueRouter);
Vue.prototype.$http = axios;
Vue.use(LoadingPlugin);


const store = new Vuex.Store({
  modules: {
    one,
    storage,
    user,
    music,
    question,
    reading,
    vuex,
  },
});

const router = new VueRouter({
  mode: 'history',
  routes,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     console.log(savedPosition);
  //     return savedPosition;
  //   }
  //   return { x: 0, y: 0 };
  // },
});
router.beforeEach((to, from, next) => {
  const back = new RegExp('(^/$)|(^/reading$)|(^/music$)|(^/movie$)', 'g');
  if (back.test(to.path)) {
    console.log('back');
  }
  next();
});

FastClick.attach(document.body);

sync(store, router);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app-box');
