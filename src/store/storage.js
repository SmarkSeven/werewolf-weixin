import axios from 'axios';

const localStorage = window.localStorage;
let praiseContents;
let praiseComments;
let collection;

function typeHelper(category) {
  let type;
  switch (category) {
    case 0:
      type = 'hpcontent';
      break;
    case 1:
      type = 'essay';
      break;
    case 2:
      type = 'serial';
      break;
    case 3:
      type = 'question';
      break;
    case 4:
      type = 'music';
      break;
    case 5:
      type = 'movie';
      break;
    default:
  }
  return type;
}

(() => {
  praiseContents = JSON.parse(localStorage.getItem('contentIds')) || [];
  praiseComments = JSON.parse(localStorage.getItem('commnetIds')) || [];
  collection = JSON.parse(localStorage.getItem('collection')) || [];
})();

// 本地缓存数据
const storage = {
  state: {
    // 点赞内容ID
    praiseContents,
    // 点赞评论ID
    praiseComments,
    // 收藏
    collection,
  },
  mutations: {
    pushPraiseContentId(state, payload) {
      state.praiseContents.push(payload.contentId);
      localStorage.setItem('contentIds', JSON.stringify(state.praiseContents));
    },
    deletePraiseContentId(state, payload) {
      const index = state.praiseContents.indexOf(payload.contentId);
      if (index > -1) {
        state.praiseContents.splice(index, 1);
        localStorage.setItem('contentIds', JSON.stringify(state.praiseContents));
      }
    },
    pushPraiseCommentId(state, payload) {
      state.praiseComments.push(payload.praiseCommentId);
      localStorage.setItem('commnetIds', JSON.stringify(state.praiseComments));
    },
    deletePraiseCommentId(state, payload) {
      const index = state.praiseComments.indexOf(payload.praiseCommentId);
      if (index > -1) {
        state.praiseComments.splice(index, 1);
        localStorage.setItem('commnetIds', JSON.stringify(state.praiseComments));
      }
    },
    pushCollection(state, payload) {
      console.log('hire', payload);
      state.collection.push(payload.contentId);
      localStorage.setItem('collection', JSON.stringify(state.collection));
    },
    deleteCollection(state, payload) {
      const index = state.collection.indexOf(payload.contentId);
      if (index > -1) {
        state.collection.splice(index, 1);
        localStorage.setItem('collection', JSON.stringify(state.collection));
      }
    },
  },
  actions: {
    // 添加或删除点赞内容ID
    async praise({ state, commit, rootState }, payload) {
      let dataSet;
      const contentId = payload.contentId;
      const index = state.praiseContents.indexOf(contentId);
      const updatePraiseContentIdPayload = { contentId };
      const updatePraisenumPayload = { contentId };
      switch (payload.category) {
        case 0:
          dataSet = 'oneList';
          break;
        case 1:
        case 2:
        case 3:
          dataSet = 'readingList';
          break;
        case 4:
          dataSet = 'musicList';
          break;
        case 5:
          dataSet = 'movieList';
          break;
        default:
      }
      updatePraisenumPayload.dataSet = dataSet;
      if (index > -1) {
        commit('deletePraiseContentId', updatePraiseContentIdPayload);
        updatePraisenumPayload.num = -1;
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
          form.type = typeHelper(payload.category);
        }
        const resp = await axios.post(`${path}?${rootState.one.basicQueryString}`, form);
        if (resp.data.res === 0) {
          commit('pushPraiseContentId', updatePraiseContentIdPayload);
          updatePraisenumPayload.num = 1;
          commit('updatePraisenum', updatePraisenumPayload);
        }
      }
    },
    // 添加或删除点赞评论ID
    async praiseComment({ state, commit, rootState }, payload) {
      const praiseCommentId = payload.cmtid;
      const index = state.praiseComments.indexOf(praiseCommentId);
      const updatePraiseCommnetPayload = { praiseCommentId };
      if (index > -1) {
        const resp = await axios.post(`/comment/unpraise?${rootState.one.basicQueryString}`, payload);
        if (resp.data.res === 0) {
          commit('deletePraiseCommentId', updatePraiseCommnetPayload);
        }
      } else {
        const resp = await axios.post(`/comment/praise?${rootState.one.basicQueryString}`, payload);
        if (resp.data.res === 0) {
          commit('pushPraiseCommentId', updatePraiseCommnetPayload);
        }
      }
    },
    // 添加或删除收藏
    async collect({ state, commit, rootState }, payload) {
      const contentId = payload.contentId;
      const index = state.collection.indexOf(contentId);
      const updatePraiseCommnetPayload = { contentId };
      const form = { jwt: rootState.one.jwt, id: contentId, type: payload.category };
      if (index > -1) {
        const resp = await axios.post(`/collection/del?${rootState.one.basicQueryString}`, form);
        if (resp.data.res === 0) {
          commit('deleteCollection', updatePraiseCommnetPayload);
        }
      } else {
        const resp = await axios.post(`/collection/add?${rootState.one.basicQueryString}`, form);
        console.log('hire 1');
        if (resp.data.res === 0) {
          commit('pushCollection', updatePraiseCommnetPayload);
          console.log('hire 1', updatePraiseCommnetPayload);
        }
      }
    },
  },
};

export default storage;
