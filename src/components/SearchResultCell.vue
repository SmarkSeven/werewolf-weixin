<template>
  <div class="search-result-cell" @click="onClick">
    <img v-if="imgUrl" v-lazy="imgUrl" alt="icon" class="icon" :class="{'circle': type === 'author'}">
    <div class="box" :class="{'bigger': !imgUrl}">
      <p class="sub"><span>{{sub}}</span></p>
      <p class="content">{{content}}</p>
    </div>
    <div class="right-arrow"></div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';

export default{
  data() {
    return {
      src: 'http://image.wufazhuce.com/Fq2rAhpbB-4oWN0iLLheD5sDALnA',
    };
  },
  props: ['imgUrl', 'sub', 'content', 'type', 'id', 'musicId'],
  methods: {
    ...mapMutations([
      'updateMusicId',
      'updateMusicName',
      'updateAudioAuthor',
      'updateMusicTitle',
      'updateAudioAlbum',
    ]),
    onClick() {
      let path = `/${this.type}/${this.id}`;
      if (this.type === 'music') {
        path = `/${this.type}/${this.id}/${this.musicId}`;
      }
      this.$router.push({ path });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
  .search-result-cell {
    position: relative;
    // height: rem(169);
    padding: rem(30) rem(60) rem(15) 0;
    // border-bottom: rem(1) solid #e8e8e8;
    background-image: linear-gradient(left, #f8f8f8, #f8f8f8);
    background-position: 0 100%;
    background-size: 100% rem(4);
    background-repeat: no-repeat;
  }
  .icon {
    height: rem(122);
    width: rem(122);
    margin-right: rem(18);
  }
  .circle {
    border-radius: 50%;
  }
  .right-arrow {
    position: absolute;
    top: 50%;
    right: rem(18);
    margin-top: rem(-17);
    height: rem(35);
    width: rem(35);
    border: 2px solid #e8e8e8;
    border-left-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(45deg);
  }
  .box {
    display: inline-block;
    height: 100%;
    p {
      width: rem(650);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .sub {
      padding-top: rem(10);
      font-size: 11px;
      color: #999;
      font-weight: 300;
      line-height: 12px;;
      span {
        font-size: 12px;
        transform: scale(.85);
      }
    }
    .content {
      font-size: 14px;
      line-height: 12px;
      padding-top: rem(25);
      padding-bottom: rem(10);
      font-weight: 400;
    }

  }
  .bigger {
    p{
      width: rem(770);
    }
  }
</style>
