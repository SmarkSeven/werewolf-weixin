<template>
  <div id="app">
    <transition name="one-fade-top">
      <music-player class="player" v-show="showMusicPlayer && isMobile"></music-player>
    </transition>
    <transition name="one-fade-right">
        <player-toggle v-show="showPlayerToggle && isMobile"></player-toggle>
    </transition>
    <transition v-if="isMobile" :name="direction === 'forward' ? 'one-pop-in' : 'one-pop-out'">
      <router-view class="router-view"></router-view>
    </transition>
    <notification
      :options="options"
      :show="showNotification"
      @close="closeNotification">
    </notification>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MusicPlayer from './components/MusicPlayer';
import PlayerToggle from './components/PlayerToggle';
import Notification from './components/Notification';

export default {
  name: 'app',
  data() {
    return {
      isMobile: true,
      showNotification: false,
      showPlayerToggle: false,
      options: {
        autoClose: true,
        backgroundColor: '#fc5050',
        barColor: '#415f77',
        countdownBar: false,
        content: '这是一个 Mobile web 项目, 请用移动浏览器浏览',
        showTime: 5000,
        textColor: '#fff',
      },
    };
  },
  components: {
    MusicPlayer,
    PlayerToggle,
    Notification,
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
  methods: {
    closeNotification() {
      this.showNotification = false;
      this.options = {};
    },
    checkBrowser() {
      const system = {};
      const userAgent = navigator.userAgent;
      system.iphone = userAgent.indexOf('iphone') !== -1;
      system.android = userAgent.indexOf('Android') !== -1;
      system.iPad = userAgent.indexOf('iPad') !== -1;
      if (!system.iphone && !system.android && !system.iPad) {
        this.isMobile = false;
        this.showNotification = true;
      } else {
        this.isMobile = true;
        this.showNotification = false;
      }
    },
  },
  watch: {
    playState() {
      if (this.playState === 'playing' && !this.showPlayerToggle) {
        this.showPlayerToggle = true;
      }
    },
  },
  created() {
    this.checkBrowser();
    const body = document.querySelector('body');
    body.onresize = this.checkBrowser;
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
  display: none;
	width: 4px;
	background-color: #F5F5F5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  display: none;
	background-color: white;

}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  display: none;
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #555;
}
</style>
