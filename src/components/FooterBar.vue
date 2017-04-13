<template>
<div id="page-footer">
  <div class="page-footer-left" v-if="data">
    <div class="page-footer-collect" @click="onCollectClick" :class="{'page-footer-collected': isCollected}"></div>
    <div class="page-footer-like" :class="{'page-footer-liked': isPraised}" @click="like"></div>
    <div class="page-footer-comment" @click="comment"></div>
  </div>
  <div class="page-footer-right">
    <div class="page-footer-like-count"><span>{{praisenum}}</span>喜欢</div>
    <div class="page-footer-comment-count" @click="clickCommentLabel"><span>{{commentnum}}</span>评论</div>
  </div>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { Toast } from 'mint-ui';

export default {
  components: {
    Toast,
  },
  data() {
    return {
      increment: 0,
    };
  },
  props: {
    data: {
      type: Object,
    },
    wrapper: {
      type: String,
    },
  },
  computed: {
    ...mapState({
      praiseContents: state => state.storage.praiseContents,
      collection: state => state.storage.collection,
      currentItemCategory: state => state.one.currentItemCategory,
    }),
    praisenum() {
      return this.data && (this.data.praisenum + this.increment);
    },
    commentnum() {
      return this.data && this.data.commentnum;
    },
    isPraised() {
      const index = this.praiseContents.indexOf(Number(this.data.contentId));
      if (index > -1) {
        return true;
      }
      return false;
    },
    isCollected() {
      const index = this.collection.indexOf(Number(this.data.contentId));
      if (index > -1) {
        return true;
      }
      return false;
    },
    praiseData() {
      return {
        id: Number(this.data.id),
        category: Number(this.currentItemCategory),
        contentId: Number(this.data.contentId),
        storyId: Number(this.data.movieStoryId),
      };
    },
  },
  methods: {
    ...mapActions(['praise', 'collect']),
    onCollectClick() {
      this.collect(this.praiseData);
    },
    like() {
      if (this.isPraised) {
        this.increment -= 1;
      } else {
        this.increment = 1;
      }
      this.praise(this.praiseData);
    },
    comment() {
      this.$emit('comment');
    },
    clickCommentLabel() {
      const page = document.querySelector(`#${this.wrapper}`);
      const commentElem = document.querySelector('#comment-label');
      page.scrollTop = commentElem.offsetTop;
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
#page-footer{
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
      background-size: rem(68) rem(68);
    }
    .page-footer-collected {
       background-image: url('../assets/bubble_collected.png');
    }
    .page-footer-like {
      background-image: url('../assets/bubble_like.png');
    }
    .page-footer-liked {
       background-image: url('../assets/bubble_liked.png');
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
      transform: scale(0.84);
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
