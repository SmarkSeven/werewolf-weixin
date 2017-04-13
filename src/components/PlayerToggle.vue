<template>
    <div id="player-toggle" @click="show">
      <div class="circle" :class="{'rotate': playState === 'playing'}" ></div>
      <div class="small-circle"></div>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default{
  computed: {
    ...mapState({
      playState: state => state.music.playState,
    }),
  },
  methods: {
    ...mapMutations(['updateShowMusicPlayer']),
    show() {
      this.updateShowMusicPlayer({ show: true });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
@import '../styles/animation.css';
#player-toggle {
  position: absolute;
  top: rem(320);
  right: 0;
  height: rem(60);
  width: rem(75);
  background-color: #b5b5b5;
  z-index: 99;
  .circle {
    position: absolute;
    top: 0;
    left: rem(-30);
    height: rem(60);
    width: rem(60);
    border: rem(8) solid #fff;
    border-radius: 50%;
    background-color: #000;
    animation: rotate 10s linear infinite;
    animation-play-state: paused;
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: rem(12);
      left: rem(12);
      height: rem(20);
      width: rem(20);
      border: rem(1) solid #fff;
      border-left-color: transparent;
      border-right-color: transparent;
      border-radius: 100%;
    }
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: rem(5);
      left: rem(5);
      height: rem(34);
      width: rem(34);
      border: rem(2) solid #fff;
      border-left-color: transparent;
      border-right-color: transparent;
      border-radius: 50%;
    }
  }
  .rotate {
    animation-play-state: running;
  }
  .small-circle {
    position: absolute;
    top: rem(27);
    left: rem(-3);
    height: rem(6);
    width: rem(6);
    border-radius: 50%;
    background-color: #fff;
  }
}

</style>

