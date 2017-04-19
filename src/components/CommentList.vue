<template>
  <ul v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10">
    <li v-for="(comment,index) in comments">
      <comment :comment="comment" :itemId="contentId" :type="type" :key="comment.id" @clickComment="replay"></comment>
    </li>
  </ul>
</template>
<script>
import { mapState } from 'vuex';
import Comment from './Comment';

export default {
  components: {
    Comment,
  },
  data() {
    return {
      comments: [],
    };
  },
  props: ['contentId', 'type'],
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
  },
  methods: {
    async getCommentData(contentId, commentId) {
      try {
        const resp = await this.$http.get(`/comment/praiseandtime/${this.type}/${contentId}/${commentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (commentId > 0) {
          this.loading = false;
        }
        if (result.res === 0 && result.data) {
          this.comments.push(...result.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    loadMore() {
      this.loading = true;
      const commentLen = this.comments.length;
      const lastComment = this.comments[commentLen - 1];
      const contentId = this.$route.params.id;
      if (lastComment) {
        console.log('loadmore', lastComment);
        this.getCommentData(contentId, lastComment.id);
      } else {
        this.loading = false;
      }
    },
    replay(payload) {
      this.$emit('clickComment', payload);
    },
  },
  created() {
    this.getCommentData(this.contentId, 0);
  },
};
</script>
