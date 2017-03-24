<template>
<div class="page-footer">
  <div class="page-footer-left">
    <div class="page-footer-collect" @click="collect"></div>
    <div class="page-footer-like" @click="like"></div>
    <div class="page-footer-comment" @click="comment"></div>
  </div>
  <div class="page-footer-right">
    <div class="page-footer-like-count"><span>{{likeCount}}</span>喜欢</div>
    <div class="page-footer-comment-count" @click="cliclComentLabel"><span>{{commentCount}}</span>评论</div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    commentCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    collect() {
      this.$emit('on-collect');
    },
    like() {
      this.$emit('on-like');
    },
    comment() {
      this.$emit('on-comment');
    },
    cliclComentLabel() {
      this.$emit('on-comment-label');
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.page-footer {
  position: fixed;
  padding-top: rem(5);
  height: rem(135);
  display: flex;
  bottom: -1px;
  z-index: 999;
  background-color: white;
  box-shadow: 0 rem(-1) rem(2) rem(2) whitesmoke;
  .page-footer-left {
    display: flex;
    width: rem(540);
    height: 100%;
    flex-wrap: nowrap;
    div {
      height: 100%;
      width: rem(180);
      flex-grow: 1;
      background-size: rem(60) rem(60);
      background-position: center;
      background-repeat: no-repeat;
    }
    .page-footer-collect {
      background-image: url('../assets/bubble_collect.png');
    }
    .page-footer-like {
      background-image: url('../assets/bubble_like.png');
    }
    .page-footer-comment {
      background-image: url('../assets/comment_image.png');
      background-size: rem(50) rem(50);
    }
  }
  .page-footer-right {
    width: rem(540);
    height: rem(130);
    display: flex;
    justify-content: flex-end;
    div {
      line-height: rem(130);
      -webkit-transform-origin-x: 0;
      -webkit-transform: scale(0.84);
      font-size: 12px;
      color:  hsla(0, 10%, 0%, .35);
    }
    .page-footer-comment-count {
      position: relative;
      min-width: rem(150);
      padding-right: rem(55);
      padding-left: rem(10);
      &:after {
        position: absolute;
        display: block;
        z-index: 999;
        left: 0;
        top: 50%;
        height: rem(1);
        width: rem(1);
        background-color: hsla(0, 10%, 0%, .35);
      }
    }
    .page-footer-like-count {
      margin-right: rem(10);
      padding-left: rem(20);
    }
    .page-footer-comment-count, .page-footer-like-count {
      span {
        display: inline-block;
        min-width: rem(20);
        margin-right: rem(10);
      }
    }
  }
}
</style>
