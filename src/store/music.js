const music = {
  state: {
    musicId: 0,
    title: undefined, // 文章标题
    author: undefined,  // 文章作者
    musicName: undefined, // 当前展示项的音乐名
    audioAuthor: undefined, // 当前展示项的音乐作者
    audioAlbum: undefined, // 专辑
    playList: [], // 音乐播放列表
    playIndex: -1, // 当前播放项下标
    playState: 'pause',  // 播放状态 pause | playing
    playId: '', // 正在播放的音乐ID
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
    updatePlayList(state, payload) {
      state.playList = payload.playList;
    },
    updatePlayIndex(state, payload) {
      state.playIndex = payload.playIndex;
    },
    updatePlayState(state, payload) {
      state.playState = payload.playState;
    },
    updatePlayId(state, payload) {
      state.playId = payload.playId;
    },
  },
};

export default music;
