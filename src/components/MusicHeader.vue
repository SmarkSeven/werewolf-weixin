<template>
  <div class="music-header">
    <div class="music-header-box" @click="showDetail">
      <img class="music-header-img" :src="cover" alt="allbum-imgs">
      <img class="muisc-header-xiami" src="../assets/xiami_logo.png" alt="xiami-logo">
      <div :class="{'music-header-play-btn': !playing ,'music-header-pause-btn': playing}" @click.stop="play"></div>
    </div>
    <p class="music-header-subtitle">· {{musicName}} ·</p>
    <p class="music-header-audioAlbum">{{audioAuthor}} | {{audioAlbum}}</p>
    <h1 class="music-header-title">{{title}}</h1>
    <p class="music-header-author">{{author}}</p>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'music-header',
  props: ['cover'],
  data() {
    return {
      playing: false,
    };
  },
  computed: {
    ...mapState({
      title: state => state.music.title,
      author: state => state.music.author,
      musicName: state => state.music.musicName,
      audioAuthor: state => state.music.audioAuthor,
      audioAlbum: state => state.music.audioAlbum,
    }),
  },
  methods: {
    showDetail() {
      this.$emit('on-item-click');
    },
    play() {
      this.playing = !this.playing;
      console.log('music page play');
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.music-header {
  position: relative;
  padding-top: rem(1080);
  .music-header-box {
    position: absolute;
    padding: rem(48);
    margin-bottom: rem(110);
    height: rem(1312);
    width: rem(1312);
    top: rem(-360);
    left: rem(-476);
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    box-shadow: rem(8) rem(6) rem(15) rgb(246, 246, 246);
    .music-header-img {
        height: rem(1216);
        width: rem(1216);
        border-radius: 50%;
    }
    .muisc-header-xiami {
      position: absolute;
      height: rem(101);
      width: rem(101);
      top: rem(614);
      right: rem(65);
      border-radius: rem(10);
    }
    .music-header-play-btn, .music-header-pause-btn {
      position: absolute;
      height: rem(192);
      width: rem(192);
      top: rem(565);
      right: rem(565);
      border-radius: 50%;
      background: rgba(255, 255, 255, .6);
      &:after {
        content: '';
        display: block;
        position: absolute;
      }
    }
    .music-header-play-btn {
      &:after {
        top: rem(50);
        left: rem(58);
        border-top: rem(46) solid transparent;
        border-right: rem(78) solid transparent;
        border-bottom: rem(46) solid transparent;
        border-left: rem(78) solid white;
      }
    }
    .music-header-pause-btn {
      &:after {
        height: rem(92);
        width: rem(18);
        top: rem(50);
        left: rem(54);
        border-right: rem(30) solid white;
        border-left: rem(30) solid white;
      }
    }
  }
  p {
    text-align: center;
    color: rgb(196, 196, 196);
  }
 .music-header-subtitle {

  }
 .music-header-title {
      padding: 0 rem(60);
      padding-bottom: rem(10);
      padding-top: rem(75);
      font-weight: normal;
      font-size: 22px;
      line-height: 1.4;
    }
    .music-header-author {
      margin-top: rem(25);
      margin-bottom: rem(30);
      font-size: 13.2px;
      color: black;
    }
}
</style>
