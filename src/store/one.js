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
    currentItemCategory: 0,
    currentIndex: -1,
    oneIdList: [],
    oneList: [],  // 首页数据
    readingList: [],  // 阅读列表
    musicList: [],  // 音乐列表
    movieList: [],  // 电影列表
    showMusicPlayer: false,  // 是否显示音乐播放控件
    savedPosition: {},
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
    // 向电影列表添加数据
    pushMovieList(state, payload) {
      state.movieList.push(...payload.movieList);
    },
    // 更新当前显示内容的分类
    updateCurrentItemCategory(state, payload) {
      state.currentItemCategory = payload.currentItemCategory;
    },
    // 更新点赞数量
    updatePraisenum(state, payload) {
      state[payload.dataSet].forEach((item) => {
        if (Number(item.content_id) === payload.contentId) {
          item.like_count += payload.num;
        }
      });
    },
    // 更新音乐播放控件显示状态
    updateShowMusicPlayer(state, payload) {
      state.showMusicPlayer = payload.show;
    },
    // 记录视图滚动位子
    updateSavedPosition(state, payload) {
      state.savedPosition[payload.path] = payload.position;
    },
  },
  actions: {},
  getters: {},
};

export default one;
