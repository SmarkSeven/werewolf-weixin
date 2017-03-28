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

export default music;
