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

export default reading;
