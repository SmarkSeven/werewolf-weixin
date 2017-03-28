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

export default question;
