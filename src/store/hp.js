const hp = {
  state: {
    hpItem: {},
  },
  mutations: {
    updateHpItem(state, payload) {
      state.hpItem = payload.hpItem;
    },
  },
};

export default hp;
