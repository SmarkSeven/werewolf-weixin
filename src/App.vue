<template>
  <div id="app">
   <music-player class="player" v-show="showMusicPlayer"></music-player>
    <transition
      :name="direction === 'forward' ? 'one-pop-in' : 'one-pop-out'"
    >
      <router-view class="router-view"></router-view>
    </transition>
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
      direction: state => state.one.direction,
    }),
    enterActiveClass() {
      if (this.direction === 'forward') {
        return 'animated fadeInRight';
      }
      return 'animated fadeInLeft';
    },
  },
};
</script>

<style lang="less">
@import '../src/styles/animate.css';
@import '~vux/src/styles/reset.less';
* {
  box-sizing: border-box;
}
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
.router-view {
  height: 100%;
}
.one-pop-out-enter-active,
.one-pop-out-leave-active,
.one-pop-in-enter-active,
.one-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  // top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.one-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.one-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.one-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.one-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-fade-enter-active {
  transition: all .4s ease;
}
.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateX(100px);
  opacity: 0;
}
</style>
