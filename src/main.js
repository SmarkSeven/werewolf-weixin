// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import axios from 'axios';
import { LoadingPlugin } from 'vux';
import { Lazyload } from 'mint-ui';
import { sync } from 'vuex-router-sync';
import App from './App';
import Home from './components/Home';
import Profile from './components/Profile';
import A from './components/A';
import B from './components/B';
import C from './components/C';
import Search from './components/Search';

Vue.use(Vuex);
Vue.use(Lazyload);
Vue.use(VueRouter);
Vue.prototype.$http = axios;
Vue.use(LoadingPlugin);

const one = {
  state: {
    host: 'http://v3.wufazhuce.com:8000/api',
    basicQueryString: 'channel=pp&version=4.0.7&uuid=00000000-41eb-998f-dab4-6c1045072748&platform=android',
    weather: null,
    currentIndex: -1,
    oneIdList: [],
    oneList: [],
    readingList: [],
    musicList: [],
    movieList: [],
  },
  mutations: {
    updateWeather(state, payload) {
      state.weather = payload.weather;
    },
    updateOneIdList(state, payload) {
      state.oneIdList = payload.oneIdList;
    },
    updateCurrentIndex(state, payload) {
      state.currentIndex = payload.currentIndex;
    },
    updateOneList(state, payload) {
      state.oneList = payload.oneList;
    },
    pushReadingList(state, payload) {
      state.readingList.push(payload.readingList);
    },
    pushMusicList(state, payload) {
      state.musicList.push(payload.musicList);
    },
    pushMovieList(state, payload) {
      state.movieList.push(payload.movieList);
    },
  },
  actions: {},
  getters: {},
};

const user = {
  state: {},
  mutations: {},
  actions: {},
  getters: {},
};

const vuex = {
  state: {
    isLoading: false,
  },
  mutations: {},
  actions: {},
  getters: {},
};


const store = new Vuex.Store({
  modules: {
    one,
    user,
    vuex,
  },
});
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/read',
    component: Home,
  },
  {
    path: '/music',
    component: Home,
  },
  {
    path: '/movie',
    component: Home,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/profile/ablsum',
    component: A,
  },
  {
    path: '/profile/right',
    component: C,
  },
  {
    path: 'right',
    component: B,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
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
