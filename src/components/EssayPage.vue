<template>
    <div id='essay-page' v-show="show">
      <header-bar :leftOptions="leftOptions" title="一个阅读"></header-bar>
      <essay-header :title="title" :authorName="author"></essay-header>
      <hp :content="content" :hpAuthorIntroduce="hpAuthorIntroduce" :copyright="copyright"></hp>
      <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
      <related-label v-if="related.length > 0"></related-label>
      <related v-for="(item,index) in related" :related="item" tag="阅读" @on-clicke-item="toRelated" :key="item.id"></related>
      <comment-label></comment-label>
      <comment-list :contentId="$route.params.id" type="essay"></comment-list>
      <footer-bar :data="footerData"></footer-bar>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import Author from './Author';
import CommentLabel from './CommentLabel';
import Comment from './Comment';
import RelatedLabel from './RelatedLabel';
import Related from './Related';
import FooterBar from './FooterBar';
import HeaderBar from './HeaderBar';
import EssayHeader from './EssayHeader';
import Hp from './Hp';
import CommentList from './CommentList';

export default{
  components: {
    HeaderBar,
    EssayHeader,
    Hp,
    Author,
    CommentLabel,
    Comment,
    RelatedLabel,
    Related,
    FooterBar,
    CommentList,
  },
  data() {
    return {
      essay: null,
      comments: [],
      related: [],
      show: true,
      leftOptions: {
        showBack: true,
      },
      update: {
        praisenum: 0,
        sharenum: 0,
        commentnum: 0,
      },
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      authorName: state => state.reading.authorName,
      savedPosition: state => state.one.savedPosition,
    }),
    title() {
      return this.essay && this.essay.hp_title;
    },
    authors() {
      return this.essay && this.essay.author;
    },
    content() {
      return this.essay && this.essay.hp_content.replace(/style="height:\d+px; width:\d+px"/g, '');
    },
    author() {
      if (this.essay && this.essay.tag_list.length === 0) {
        return `文╱${this.authorName}`;
      }
      return this.essay && `文╱${this.essay.hp_author}`;
    },
    copyright() {
      return this.essay && this.essay.copyright;
    },
    hpAuthorIntroduce() {
      return this.essay && `${this.essay.hp_author_introduce}${this.essay.editor_email}`;
    },
    footerData() {
      return this.essay && this.update && {
        contentId: this.essay.content_id,
        category: this.essay.content_type,
        praisenum: this.update.praisenum,
        commentnum: this.update.commentnum,
      };
    },
  },
  created() {
    const self = this;
    setTimeout(() => {
      self.show = true;
    }, 200);
  },
  beforeRouteEnter(to, from, next) {
    // 文章内容ID
    const contentId = to.params.id;
    next((vm) => {
      // 获取essay数据
      vm.getData(contentId);
    });
  },
  beforeRouteUpdate(to, from, next) {
    const contentId = to.params.id;
    this.getData(contentId);
    next();
  },
  beforeRouteLeave(to, from, next) {
    const el = document.querySelector('#essay-page');
    const top = el.scrollTop;
    this.updateSavedPosition({
      path: from.path,
      position: { top },
    });
    next();
  },
  methods: {
    ...mapMutations(['updateSavedPosition']),
    getData(contentId) {
      this.getEssayData(contentId);
      this.getCommentData(contentId, 0);
      this.getRelated(contentId);
      this.getUpdate(contentId);
    },
    loadMore() {
      this.loading = true;
      const commentLen = this.comments.length;
      const lastComment = this.comments[commentLen - 1];
      const contentId = this.$route.params.id;
      if (lastComment) {
        this.getCommentData(contentId, lastComment.id);
      } else {
        this.loading = false;
      }
    },
    async getEssayData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/essay/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (contentId) {
          this.loading = false;
        }
        if (result.res === 0 && result.data) {
          this.essay = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId, commentId) {
      try {
        const resp = await this.$http.get(`${this.host}/comment/praiseandtime/essay/${contentId}/${commentId}?${this.basicQueryString}`);
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
    async getRelated(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/related/essay/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.related = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getUpdate(contentId) {
      const dateString = new Date().toLocaleString().replace(/[\u4e00-\u9fa5]/g, '').replace(/\//g, '-');
      try {
        const resp = await this.$http.get(`${this.host}/essay/update/${contentId}/${dateString}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.update = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toAuthor() {
    },
    toRelated(relatedId) {
      // 跳转推荐页面
      this.$router.push({ path: `/essay/${relatedId}` });
    },
  },
  // mounted() {
  //   const el = document.querySelector('#essay-page');
  //   const position = this.savedPosition[this.path];
  //   if (position) {
  //     setTimeout(() => {
  //       el.scrollTop = position.top;
  //     }, 100);
  //   }
  // },
};
</script>
<style lang="scss">
 @import '../styles/rem.scss';
 #essay-page {
   padding-bottom: rem(135);
   height: 100%;
   overflow: scroll;
 }
 .appear-class {
    opacity: 0;
    transform: translateX(300px);
    transition: all 5s;
 }
 .appear-active-class {
  transition: all 5s;
 }
</style>
