<template>
  <div id='movie-page' v-if="show">
    <header-bar :leftOptions="leftOptions" title="一个影视"></header-bar>
    <movie-header :title="title" :authorName="authorName" :photos="photos"></movie-header>
    <hp :content="content" :hpAuthorIntroduce="hpAuthorIntroduce" :copyright="copyright"></hp>
    <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
    <related-label v-if="related.length > 0"></related-label>
    <related v-for="(item,index) in related" :related="item" tag="阅读" @on-clicke-item="toRelated" :key="item.id"></related>
    <comment-label></comment-label>
    <comment-list :contentId="itemid" type="movie" @clickComment="replay"></comment-list>
    <router-view></router-view>
    <transition name="one-fade-in">
        <comment-form
          v-if="showCommentForm"
          :operation="commentOperation"
          :cmtid="cmtid"
          :itemid="itemid"
          :username="commentUsername"
          :content="commentContent"
          type="movie"
          @cancel="showCommentForm = false"
        />
    </transition>
    <footer-bar :data="footerData" @comment="publish" wrapper="movie-page"></footer-bar>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Author from './Author';
import CommentLabel from './CommentLabel';
import CommentForm from './CommentForm';
import RelatedLabel from './RelatedLabel';
import Related from './Related';
import FooterBar from './FooterBar';
import HeaderBar from './HeaderBar';
import MovieHeader from './MovieHeader';
import Hp from './Hp';
import CommentList from './CommentList';

export default{
  components: {
    HeaderBar,
    MovieHeader,
    Hp,
    Author,
    CommentLabel,
    RelatedLabel,
    CommentForm,
    Related,
    FooterBar,
    CommentList,
  },
  data() {
    return {
      movie: null,
      movieDetail: null,
      comments: [],
      related: [],
      show: false,
      showCommentForm: false,
      update: {
        praisenum: 0,
        sharenum: 0,
        commentnum: 0,
      },
      leftOptions: {
        showBack: true,
      },
      commentOperation: 'publish',
      cmtid: 0,
      commentUsername: null,
      commentContent: null,
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      itemid: state => state.route.params.id,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
    title() {
      return this.movie && this.movie.title;
    },
    itemId() {
      return this.movie && this.movie.movie_id;
    },
    authors() {
      const movie = this.movie;
      if (movie && movie.author_list.length > 0) {
        if (movie.author_list[0].user_id !== '0') {
          return movie.author_list;
        }
      }
    },
    praisenum() {
      return this.movie && this.movie.praisenum;
    },
    photos() {
      const movieDetail = this.movieDetail;
      if (movieDetail) {
        return [movieDetail.detailcover, ...movieDetail.photo];
      }
      return [];
    },
    content() {
      return this.movie && this.movie.content.replace(/style="height:\d+px; width:\d+px"/g, '');
    },
    authorName() {
      return this.movie && `文╱${this.movie.user.user_name}`;
    },
    copyright() {
      return this.movie && this.movie.copyright;
    },
    hpAuthorIntroduce() {
      return this.movie && `${this.movie.charge_edt}${this.movie.editor_email}`;
    },
    footerData() {
      return this.movie && this.update && {
        id: this.movie.id,
        contentId: this.movie.movie_id,
        category: 5,
        movieStoryId: this.movie.id,
        praisenum: this.movie.praisenum,
        commentnum: this.update.commentnum,
      };
    },
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
  methods: {
    getData(contentId) {
      this.getMovieData(contentId);
      this.getMovieDetail(contentId);
      this.getCommentData(contentId);
      this.getRelated(contentId);
      this.getUpdate(contentId);
    },
    async getMovieData(contentId) {
      try {
        const resp = await this.$http.get(`/movie/${contentId}/story/1/0?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.movie = result.data.data[0];
          const page = document.querySelector('#movie-page');
          page.scrollTop = '0';
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getMovieDetail(contentId) {
      try {
        const resp = await this.$http.get(`/movie/detail/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.movieDetail = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId) {
      try {
        const resp = await this.$http.get(`/comment/praiseandtime/movie/${contentId}/0?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.comments = result.data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getRelated(contentId) {
      try {
        const resp = await this.$http.get(`/related/movie/${contentId}?${this.basicQueryString}`);
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
        const resp = await this.$http.get(`/movie/update/${contentId}/${dateString}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.update = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toAuthor() {
      this.$router.push({ name: 'video' });
    },
    toRelated(relatedId) {
      // 跳转推荐页面
      console.log('go!');
      this.$router.push({ path: `/movie/${relatedId}` });
    },
    replay(comment) {
      this.showCommentForm = true;
      this.commentOperation = 'replay';
      this.cmtid = comment.id;
      this.commentUsername = comment.username;
      this.commentContent = comment.content;
    },
    publish() {
      this.showCommentForm = true;
      this.commentOperation = 'publish';
      this.cmtid = 0;
      this.commentUsername = null;
      this.commentContent = null;
    },
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.show = true;
    }, 200);
  },
};
</script>
<style lang="scss">
 @import '../styles/rem.scss';

#movie-page {
    padding-bottom: rem(135);
    height: 100%;
    width: 100%;
    overflow: scroll;
}
.hidden{
  opacity: 0;
}
.show {
   opacity: 1;
 }
</style>
