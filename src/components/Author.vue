<template>
<div id="author-cell">
  <p class="author-label">作者</p>
  <div class="author-info" @click="onClick">
      <div class="author-avtor">
        <img :src="author.web_url" alt="avtor">
      </div>
      <div class="author-introduce">
        <p class="author-name">{{author.user_name}} <span class="web-name"> {{author.wb_name}}</span></p>
        <p class="author-desc">{{author.summary}}</p>
      </div>
      <div class="btn-follow" :class="{'followed': isFollowed}" @click.stop="follow">{{followBtnText}}</div>
  </div>
</div>

</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default{
  props: {
    author: Object,
  },
  computed: {
    ...mapState({
      followAuthors: state => state.storage.followAuthors,
    }),
    isFollowed() {
      if (this.author) {
        const index = this.followAuthors.indexOf(this.author.user_id);
        if (index > -1) {
          return true;
        }
      }
      return false;
    },
    followBtnText() {
      if (this.isFollowed) {
        return '已关注';
      }
      return '关注';
    },
  },
  methods: {
    ...mapMutations(['updateDirection']),
    ...mapActions(['followAuthor']),
    onClick() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push({ path: `/author/${this.author.user_id}` });
      // this.$emit('on-click-item', this.author.user_id);
    },
    follow() {
      this.author.fans_total = Number(this.author.fans_total);
      if (this.isFollowed) {
        this.author.fans_total -= 1;
      } else {
        this.author.fans_total += 1;
      }
      this.followAuthor({
        followUserId: this.author.user_id,
      });
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
#author-cell {
  margin:0 rem(63) rem(70) rem(65);
  padding-left: rem(5);
  .author-label {
    height: rem(75);
    width: 100%;
    margin-bottom: rem(65);
    padding: 0 0 rem(40) 0;
    font-size: 12.8px;
    background: linear-gradient(black,black) no-repeat;
    background-size: rem(210) rem(9);
    background-position: 0% 100%;
  }
  .author-info {
    position: relative;
    height: rem(120);
    div {
      display: inline-block;
    }
    .author-avtor {
      height: rem(120);
      width: rem(120);
      border-radius: 50%;
      overflow: hidden;
      img {
        padding: 0;
        width: rem(120);
        height: rem(120);
      }
    }
    .author-introduce {
      margin-left: rem(35);
      top: rem(-15);
      height: rem(120);
      p {
        width: rem(750);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .author-name {
        font-size: 12.4px;
        line-height: 1.2;
        font-weight: 500;
        span {
          display: inline-block;
          font-size: 11px;
          -webkit-transform-origin-x: 0;
          -webkit-transform: scale(0.82);
          font-weight: 600;
        }
      }
      .author-desc {
        color: hsla(0, 90%, 0%, .2);
        font-size: 12px;
        -webkit-transform-origin-x: 0;
        -webkit-transform: scale(0.76);
        font-weight: 600;
      }
    }
    .btn-follow {
        position: absolute;
        top: rem(10);
        right: rem(3);
        padding: rem(12) rem(45);
        text-align: center;
        line-height: rem(60);
        font-size: 12px;
        transform: scale(0.74);
        -webkit-transform-origin-x: 0;
        font-weight: 700;
        border-radius: rem(10);
        border: rem(2) solid rgb(138,138,138);
      }
    .followed {
      padding: rem(12) rem(25);
      color: white;
      background: #555;
      font-weight: 600;
    }
  }
}
</style>
