<template>
  <div id="music-player">
    <header>
      <p class="music-title">南方姑娘</p>
      <input class="range" id="range" type="range" ref="range" value="0" @input="onInput">
      <p class="timer">03’03"</p>
      <p class="singer">王菲</p>
      <div class="play-box">
        <div class="last"></div>
        <div :class="{'play': playing, 'pause': !playing}" @click="play"></div>
        <div class="next"></div>
      </div>
      <div class="btn-box">
        <div class="cycle-mode"></div>
        <span class="source">来自虾米音乐</span>
        <div class="collect"></div>
        <div class="detail-content"></div>
      </div>
    </header>
    <div class="mask"></div>
  </div>
</template>
<script>
export default{
  data() {
    return {
      min: 0,
      max: 100,
      step: 0.1,
      playing: false,
    };
  },
  methods: {
    onInput(e) {
      const v = (e.target.value * 100) / this.max;
      const range = this.$refs.range;
      range.style.backgroundSize = `100% 3px, ${v}% 3px`;
    },
    play() {
      this.playing = !this.playing;
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
#music-player{
  position: fixed;
  height: 100%;
  width: 100%;
  header {
    position: relative;
    padding: 0 rem(42);
    .music-title {
      padding-top: rem(25);
      height: rem(125);
      color: rgb(162,162,162);
      text-align: center;
      letter-spacing: 1px;
      line-height: rem(100);
      font-size: 12.9px;
      text-shadow: rem(1) rem(1) rem(1)  rgb(162,162,162);
    }
    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      height: 21px;
      background: linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)) no-repeat, linear-gradient(black, black) no-repeat;
      background-size: 100% 3px, 0% 3px;
      background-position: 0 9px, 0 9px;
    }
    input[type=range]:focus {
        outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: 6px;
      height: 10px;
      width: 10px;
      border-radius: 50%;
      border: 3px solid black;
      box-shadow: 0px 1px 3px black;
      background-color: red;
    }
    input[type=range]::-webkit-slider-runnable-track{
      height: 21px;
    }
    .timer {
      position: absolute;
      top: rem(165);
      right: rem(24);
      color: rgb(200,200,200);
      -webkit-transform-origin-x: 0;
      -webkit-transform: scale(0.8);
      font-size: 12px;
    }
    .singer {
      height: rem(70);
      padding-top: rem(10);
      text-align: center;
      align-items: center;
      line-height: rem(60);
      color: rgb(200,200,200);
      font-size: 11px;
    }
    .play-box{
      display: flex;
      height: rem(115);
      justify-content: center;
      align-items: center;
      .last,.next {
        height: rem(100);
      }
      .last, .next {
        position: relative;
        height: rem(44);
        width: rem(86);
      }
      .last, .next {
        &:before, &:after {
          content: '';
          display: block;
          position: absolute;
          top: rem(-3);
          border-left: rem(43) solid transparent;
          border-top: rem(25) solid transparent;
          border-bottom: rem(25) solid transparent;
          border-right: rem(43) solid transparent;
        }
      }
      .last {
        border-left: rem(10) solid black;
        &:before {
          left: rem(-49);
          border-right: rem(43) solid black;
        }
        &:after {
          left: rem(-13);
          border-right: rem(43) solid black;
        }
      }
      .last:active {
        border-left-color: rgb(100,100,100);
        &:before, &:after {
          border-right-color: rgb(100,100,100);
        }
      }
      .next {
        border-right: rem(10) solid black;
        &:before {
          right: rem(-49);
          border-left: rem(43) solid black;
        }
        &:after {
          right: rem(-13);
          border-left: rem(43) solid black;
        }
      }
      .next:active {
        border-right-color: rgb(100,100,100);
        &:before, &:after {
          border-left-color: rgb(100,100,100);
        }
      }
      .play {
        height: rem(60);
        width: rem(48);
        margin: 0 rem(80);
        background: linear-gradient(to right, black 33.33%, white 0,white 66.66%,black 0,black 100% );
      }
      .pause {
        height: rem(56);
        width: rem(96);
        margin-left: rem(80);
        margin-right: rem(32);
        border-left: rem(48) solid black;
        border-right: rem(48) solid transparent;
        border-top: rem(28) solid transparent;
        border-bottom: rem(28) solid transparent;
      }
    }
    .btn-box {
      position: relative;
      height: rem(140);
      padding-top: rem(10);
      text-align: center;
      line-height: rem(140);
      .cycle-mode, .collect, .detail-content {
        position: absolute;
        top: rem(45);
        height: rem(65);
        width: rem(80);
        background-size: contain;
        background-repeat: no-repeat;
      }
      .cycle-mode {
        left: 0;
        background-image: url('../assets/player_all_cycle.png');
      }
      .source {
        padding: rem(3) 0;
        padding-left: rem(60);
        color: rgb(200,200,200);
        font-size: 11px;
        background: url('../assets/xiami_logo.png') no-repeat;
        background-size: rem(40) rem(40);
      }
      .collect {
        right: rem(110);
        background-image: url('../assets/music_collection.png');
      }
      .detail-content {
        right: rem(-15);
        background-image: url('../assets/detail_content.png');
      }
    }
  }
  .mask {
    height: 100%;
    width: 100%;
    background-color:rgba(0,0,0,.33);
  }
}

</style>
