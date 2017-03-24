<template>
<div class='essay-page'>
  <header-bar></header-bar>
  <div class="essay">
    <h1>{{title}}</h1>
    <span class="author-label">{{authorName}}</span>
    <div class="ph-content" v-html="content"></div>
    <p class="hp_author_introduce">{{hpAuthorIntroduce}}</p>
    <p class="copyright">{{copyright}}</p>
  </div>
   <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
   <related-label v-if="related.length > 0"></related-label>
   <related v-for="(item,index) in related" :related="item" tag="阅读" @on-clicke-item="toRelated" :key="item.id"></related>
   <comment-label></comment-label>
   <comment v-for="(comment,index) in comments" :comment="comment" :key="comment.id"></comment>
   <footer-bar></footer-bar>
</div>
</template>
<script>
import { mapState } from 'vuex';
import Author from './Author';
import CommentLabel from './CommentLabel';
import Comment from './Comment';
import RelatedLabel from './RelatedLabel';
import Related from './Related';
import FooterBar from './FooterBar';
import HeaderBar from './HeaderBar';

export default{
  components: {
    Author,
    CommentLabel,
    Comment,
    RelatedLabel,
    Related,
    HeaderBar,
    FooterBar,
  },
  data() {
    return {
      essay: null,
      comments: [],
      related: [],
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
    authorName() {
      return this.essay && `文╱${this.essay.hp_author}`;
    },
    copyright() {
      return this.essay && this.essay.copyright;
    },
    hpAuthorIntroduce() {
      return this.essay && `${this.essay.hp_author_introduce}${this.essay.editor_email}`;
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
      this.getEssayData(contentId);
      this.getCommentData(contentId);
      this.getRelated(contentId);
      this.getUpdate(contentId);
    },
    async getEssayData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/essay/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.essay = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/comment/praiseandtime/essay/${contentId}/0?${this.basicQueryString}`);
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
      console.log('go!');
      this.$router.push({ path: `/essay/${relatedId}` });
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.essay-page {
  padding-bottom: rem(250);
  background-color: #fff;
  .essay {
    padding: 0 rem(60);
    .ph-content {
      img {
        display: inline-block;
        padding-top: rem(70);
        width: 100%;
        height: auto;
      }
    }
    h1 {
      padding: 0 0 rem(50) 0;
      padding-top: rem(200);
      font-weight: normal;
      font-size: 22px;
      line-height: 1.4;
      background: linear-gradient(black, black) no-repeat;
      background-size: rem(230) rem(15);
      background-position: 0% 100%;
    }
    .author-label {
      display: inline-block;
      height: rem(61);
      margin: rem(70) 0;
      line-height: rem(61);
      font-size: 13.2px;
      font-weight: 500;
    }
    .ph-content {
      font-size: 12.8px;
      line-height: 1.8;
      color: rgb(51, 51, 51);
      font-weight: 600;
    }
    .hp_author_introduce, .copyright {
      color: hsla(0, 90%, 0%, .2);
      font-size: 12px;
      -webkit-transform-origin-x: 0;
      -webkit-transform: scale(0.84);
      font-weight: 600;
    }
    .hp_author_introduce {
      padding-top: rem(40);
      padding-bottom: rem(70);
    }
    .copyright {
      margin-bottom: rem(70);
    }
  }
}


</style>
