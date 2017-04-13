<template>
  <div id="app">
   <transition name="one-fade-top">
     <music-player class="player" v-show="showMusicPlayer"></music-player>
   </transition>
   <transition name="one-fade-right">
      <player-toggle v-show="showPlayerToggle"></player-toggle>
   </transition>
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
import PlayerToggle from './components/PlayerToggle';

export default {
  name: 'app',
  data() {
    return {
      showPlayerToggle: false,
    };
  },
  components: {
    MusicPlayer,
    PlayerToggle,
  },
  computed: {
    ...mapState({
      showMusicPlayer: state => state.one.showMusicPlayer,
      playState: state => state.music.playState,
      direction: state => state.one.direction,
    }),
    enterActiveClass() {
      if (this.direction === 'forward') {
        return 'animated fadeInRight';
      }
      return 'animated fadeInLeft';
    },
  },
  watch: {
    playState() {
      if (this.playState === 'playing' && !this.showPlayerToggle) {
        this.showPlayerToggle = true;
      }
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

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
	width: 4px;
	background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
	background-color: white;

}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}
</style>
