<template>
  <div id="app">
    <router-view class="router-view"></router-view>
    <music-player class="player" v-show="showMusicPlayer"></music-player>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MusicPlayer from './components/MusicPlayer';

export default {
  name: 'app',
  components: {
    MusicPlayer,
  },
  computed: {
    ...mapState({
      showMusicPlayer: state => state.one.showMusicPlayer,
    }),
  },
};
</script>

<style lang="less">
@import '../src/styles/animate.css';
@import '~vux/src/styles/reset.less';
body {
  background-color: #fff;
}
#app {
  height: 100%;
  .player {
    height: 100%;
    width: 100%;
    z-index: 9999;
  }
}
* {
  box-sizing: border-box;
}
.one-pop-out-enter-active,
.one-pop-out-leave-active,
.one-pop-in-enter-active,
.one-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.one-pop-out-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.one-pop-out-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.one-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.one-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
