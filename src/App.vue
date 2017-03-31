<template>
  <div id="app">
    <music-player class="player" v-show="showMusicPlayer"></music-player>
    <router-view></router-view>
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
</style>
