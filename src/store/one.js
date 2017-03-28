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
      state.currentItemCategory = payload.currentItemCategory;
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

export default one;
