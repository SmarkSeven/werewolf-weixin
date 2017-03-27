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
import EssayPage from './components/EssayPage';
import MusicPage from './components/MusicPage';
import MoviePage from './components/MoviePage';
import QuestionPage from './components/QuestionPage';

Vue.use(Vuex);
Vue.use(Lazyload);
Vue.use(VueRouter);
Vue.prototype.$http = axios;
Vue.use(LoadingPlugin);

const storage = {
  state: {
    // 点赞内容ID
    praiseContents: [],
  },
  mutations: {
    pushPraiseContentId(state, payload) {
      state.praiseContents.push(payload.contentId);
    },
    deletePraiseContentId(state, payload) {
      const index = state.praiseContents.indexOf(payload.contentId);
      if (index > -1) {
        state.praiseContents.splice(index, 1);
      }
    },
  },
  actions: {
    async praise({ state, commit, rootState }, payload) {
      let type;
      let dataSet;
      const contentId = payload.contentId;
      const index = state.praiseContents.indexOf(contentId);
      const updatePraiseContentIdPayload = { contentId };
      const updatePraisenumPayload = { contentId };
      console.log(payload, payload.category, typeof payload.category);
      switch (payload.category) {
        case 0:
          dataSet = 'oneList';
          type = 'hpcontent';
          break;
        case 1:
          dataSet = 'readingList';
          type = 'essay';
          break;
        case 2:
          type = 'serial';
          dataSet = 'readingList';
          break;
        case 3:
          type = 'question';
          dataSet = 'readingList';
          break;
        case 4:
          type = 'music';
          dataSet = 'musicList';
          break;
        case 5:
          type = 'movie';
          dataSet = 'movieList';
          break;
        default:
      }
      updatePraisenumPayload.dataSet = dataSet;
      if (index > -1) {
        commit('deletePraiseContentId', updatePraiseContentIdPayload);
        updatePraisenumPayload.num = -1;
        console.log(updatePraisenumPayload);
        commit('updatePraisenum', updatePraisenumPayload);
      } else {
        let path;
        const form = {
          jwt: rootState.one.jwt,
          deviceid: '00000000-91eb-998f-dcb4-6c1045073748',
          devicetype: 'android',
        };
        if (payload.category === 5) {
          path = '/movie/praisestory';
          form.storyid = payload.storyId;
          form.movieid = contentId;
        } else {
          path = '/praise/add';
          form.itemid = contentId;
          form.cmtid = 0;
          form.type = type;
        }
        const resp = await axios.post(`${path}?${rootState.one.basicQueryString}`, form);
        if (resp.data.res === 0) {
          commit('pushPraiseContentId', updatePraiseContentIdPayload);
          updatePraisenumPayload.num = 1;
          console.log(updatePraisenumPayload);
          commit('updatePraisenum', updatePraisenumPayload);
        }
      }
    },
  },
};

const one = {
  state: {
    host: 'http://v3.wufazhuce.com:8000/api',
    basicQueryString: 'user_id=7878484&channel=pp&version=4.0.7&uuid=00000000-41eb-998f-dab4-6c1045072748&platform=android',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTA1MjcwMjMsInVzZXJpZCI6IjUxMDU1NTQifQ.iHN9EPkMHV2u1BzsfbMbxr5NEb87Icf-P2Eu4AQMHLA',
    weather: null,
    lastReadingId: 0,
    lastMusicId: 0,
    lastMovieId: 0,
    maxIndex: 0,
    currentItemCateogry: 0,
    currentIndex: -1,
    oneIdList: [],
    oneList: [],
    readingList: [],
    musicList: [],
    movieList: [],
  },
  mutations: {
    updateLastReadingId(state, payload) {
      state.lastReadingId = payload.lastReadingId;
    },
    updateLastMusicId(state, payload) {
      state.lastMusicId = payload.lastMusicId;
    },
    updateLastMovieId(state, payload) {
      state.lastMovieId = payload.lastMovieId;
    },
    updateWeather(state, payload) {
      state.weather = payload.weather;
    },
    updateOneIdList(state, payload) {
      state.oneIdList = payload.oneIdList;
    },
    updateCurrentIndex(state, payload) {
      state.currentIndex = payload.currentIndex;
    },
    updateMaxIndex(state, payload) {
      state.maxIndex = payload.maxIndex;
    },
    updateOneList(state, payload) {
      state.oneList = payload.oneList;
    },
    pushReadingList(state, payload) {
      state.readingList.push(...payload.readingList);
    },
    pushMusicList(state, payload) {
      state.musicList.push(...payload.musicList);
    },
    pushMovieList(state, payload) {
      state.movieList.push(...payload.movieList);
    },
    updateCurrentItemCategory(state, payload) {
      state.currentItemCateogry = payload.currentItemCateogry;
    },
    updatePraisenum(state, payload) {
      state[payload.dataSet].forEach((item) => {
        if (Number(item.content_id) === payload.contentId) {
          item.like_count += payload.num;
        }
      });
    },
  },
  actions: {},
  getters: {},
};

const music = {
  state: {
    musicId: 0,
    title: undefined,
    author: undefined,
    musicName: undefined,
    audioAuthor: undefined,
    audioAlbum: undefined,
  },
  mutations: {
    updateMusicTitle(state, payload) {
      state.title = payload.title;
    },
    updateMusicId(state, payload) {
      state.musicId = payload.musicId;
    },
    updateMusicName(state, payload) {
      state.musicName = payload.musicName;
    },
    updateAudioAuthor(state, payload) {
      state.audioAuthor = payload.audioAuthor;
    },
    updateAudioAlbum(state, payload) {
      state.audioAlbum = payload.audioAlbum;
    },
    updateWordsAuthor(state, payload) {
      state.author = payload.author;
    },
  },
};

const question = {
  state: {
    questionId: 0,
  },
  mutations: {
    updateQuestionId(state, payload) {
      state.questionId = payload.questionId;
    },
  },
};

const reading = {
  state: {
    readingData: undefined,
  },
  mutations: {
    updateReadingAuthorName(state, payload) {
      state.authorName = payload.authorName;
    },
  },
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
    storage,
    user,
    music,
    question,
    reading,
    vuex,
  },
});
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/reading',
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
  {
    path: '/essay/:id',
    component: EssayPage,
  },
  {
    path: '/music/:id',
    component: MusicPage,
  },
  {
    path: '/movie/:id',
    component: MoviePage,
  },
  {
    path: '/question/:id',
    component: QuestionPage,
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
