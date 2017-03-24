<template>
<div class="comment-cell">
  <!--评论者信息-->
  <main class="comment-header">
    <div class="comment-avtor">
      <img :src="comment.user.web_url" alt="avtor">
    </div>
    <div class="comment-name">{{comment.user.user_name}}</div>
    <div class="comment-date">{{commentDate}}</div>
  </main>
  <!--回复-->
  <div v-if="comment.quote" class="comment-reply">
    <p class="comment-reply-name">{{comment.touser.user_name}}:</p>
    <p class="comment-reply-content">{{comment.quote}}</p>
  </div>
  <p class="comment-content">{{comment.content}}</p>
  <footer class="comment-footer">
    <div class="commnet-footer-content">
      <div class="comment-praise" @click="praise">
        <span class="comment-praisenum">{{comment.praisenum}}</span>
      </div>
      <div class="comment-btn" @click="commitComment"></div>
    </div>
    <div class="comment-line"></div>
  </footer>
</div>
</template>
<script>
import getDateDiff from '../js/date.js';

export default {
  props: {
    comment: Object,
  },
  computed: {
    commentDate() {
      return getDateDiff(new Date(this.comment.created_at).getTime(), true);
    },
  },
  methods: {
    commitComment() {
      // TODO 回复评论
      console.log('回复评论');
    },
    praise() {
      // TODO 点赞或取消
      console.log('点赞');
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.comment-cell {
  padding-top: rem(44);
  background-color: #fff;
  .comment-header {
    height: rem(56);
    margin-bottom: rem(25);
    padding-left: rem(65);
    padding-right: rem(47);
    color: hsla(0, 90%, 0%, .3);
    font-weight: 700;
    div {
      display: inline-block;
    }
    .comment-avtor {
      height: rem(56);
      width: rem(56);
      border-radius: 50%;
      overflow: hidden;
      img {
        width: rem(56);
        height: rem(56);
      }
    }
    .comment-name {
      height: rem(56);
      max-width: rem(450);
      margin-left: rem(23);
      font-size: 12px;
      line-height: rem(56);
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .comment-date {
      float: right;
      font-size: 12px;
      -webkit-transform-origin-x: 0;
      -webkit-transform: scale(0.8);
      font-weight: 500;
    }
  }
  .comment-reply {
    margin: 0 rem(66) rem(20) rem(150);
    padding: rem(35) rem(70) rem(25) rem(30);
    border: rem(2) solid hsla(0, 90%, 0%, .3);
    .comment-reply-name {
      height: rem(40);
      max-width: rem(370);
      line-height: rem(40);
      margin-bottom: rem(12);
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .comment-reply-content {
      max-height: rem(120);
      line-height: rem(60);
      font-size: 12.5px;
      color: rgb(125,125,125);
      display: -webkit-box;  //弹性伸缩盒子模型
      -webkit-box-orient: vertical;  //垂直排列框的子元素
      -webkit-line-clamp: 2;  //限制在一个块元素显示的文本的行数
      overflow: hidden;
    }
  }
  .comment-content {
    margin-left: rem(150);
    margin-right: rem(90);
    margin-bottom: rem(27);
    font-size: 12.8px;
    line-height: rem(65);
    display: -webkit-box;  //弹性伸缩盒子模型
    -webkit-box-orient: vertical;  //垂直排列框的子元素
    -webkit-line-clamp: 5;  //限制在一个块元素显示的文本的行数
    overflow: hidden;
  }
  .comment-footer {
    .commnet-footer-content {
      height: rem(60);
      margin-right: rem(100);
      padding-bottom: rm(10);
      div {
        float: right;
        height: rem(60);
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.8);
        font-size: 12px;
        color: hsla(0, 90%, 0%, .4);
        text-align: left;
      }
      .comment-praise {
        width: rem(140);
        padding-left: rem(90);
        background: url('../assets/comment_laud.png') no-repeat;
        background-size: rem(50) rem(50);
        background-position: rem(28) rem(-5);
      }
      .comment-btn {
        width: rem(120);
        background: url('../assets/comment_image.png') no-repeat;
        background-size: rem(50) rem(50);
        background-position: center rem(1);
      }
    }
    .comment-line {
      height: rem(30);
      background-color: rgb(250,250,250);
    }
  }
}
</style>
