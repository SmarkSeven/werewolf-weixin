<template>
  <div id='question-page'>
    <header-bar></header-bar>
    <question-header :title="title" :content="questionContent" :asker="asker" :answerer="answerer"></question-header>
    <hp :content="answerContent" :copyright="copyright" :hpAuthorIntroduce="hpAuthorIntroduce"></hp>
    <div class="divide-line"></div>
    <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
    <related-label v-if="related.length > 0"></related-label>
    <related v-for="(item,index) in relatedQuestion" :related="item" tag="问答" @on-clicke-item="toRelated" :key="item.id"></related>
    <comment-label></comment-label>
    <comment v-for="(comment,index) in comments" :comment="comment" :key="comment.id"></comment>
    <footer-bar :data="footerData"></footer-bar>
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
import QuestionHeader from './QuestionHeader';
import Hp from './Hp';

export default{
  components: {
    HeaderBar,
    QuestionHeader,
    Hp,
    Author,
    CommentLabel,
    Comment,
    RelatedLabel,
    Related,
    FooterBar,
  },
  data() {
    return {
      question: null,
      comments: [],
      related: [],
      // update: {
      //   praisenum: '0',
      //   sharenum: '0',
      //   commentnum: '0',
      // },
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      questionId: state => state.questionId,
    }),
    title() {
      return this.question && this.question.question_title;
    },
    authors() {
      return this.question && this.question.author_list;
    },
    questionContent() {
      return this.question && this.question.question_content;
    },
    answerContent() {
      return this.question && this.question.answer_content.replace(/style="height:\d+px; width:\d+px"/g, '');
    },
    asker() {
      return this.question && `${this.question.asker.user_name}`;
    },
    answerer() {
      return this.question && `${this.question.answerer.user_name}`;
    },
    copyright() {
      return this.question && this.question.copyright;
    },
    hpAuthorIntroduce() {
      return this.question && `${this.question.charge_edt}${this.question.charge_email}`;
    },
    relatedQuestion() {
      return this.related;
    },
    footerData() {
      return this.question && {
        id: this.question.questionId,
        contentId: this.question.question_id,
        category: this.question.content_type,
        praisenum: this.question.praisenum,
        commentnum: this.question.commentnum,
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
      this.getQuestion(contentId);
      this.getCommentData(contentId);
      this.getRelated(contentId);
      // this.getUpdate(contentId);
    },
    async getQuestion(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/question/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.question = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/comment/praiseandtime/question/${contentId}/0?${this.basicQueryString}`);
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
        const resp = await this.$http.get(`${this.host}/related/question/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.related = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    // async getUpdate(contentId) {
    //   const dateString = new Date().toLocaleString().replace(/[\u4e00-\u9fa5]/g, '').replace(/\//g, '-');
    //   try {
    //     const resp = await this.$http.get(`${this.host}/question/update/${contentId}/${dateString}?${this.basicQueryString}`);
    //     const result = resp.data;
    //     if (result.res === 0 && result.data) {
    //       this.update = result.data;
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
    toAuthor() {
    },
    toRelated(relatedId) {
      // 跳转推荐页面
      console.log('go!');
      this.$router.push({ path: `/question/${relatedId}` });
    },
  },
};
</script>
<style lang="scss">
 @import '../styles/rem.scss';
 #question-page {
   padding-bottom: rem(135);
   .divide-line {
     margin: 0 rem(60);
     margin-top: rem(-10);
     margin-bottom: rem(110);
     height: 1px;
     background-color: #E0E0E0;
   }
 }
</style>
