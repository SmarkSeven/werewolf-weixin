<template>
  <div id="music-player">
    <header>
      <p class="music-title">{{musicName}}</p>
      <input class="range" id="range" type="range" ref="range" :max="duration" :value="currentTime"  @input="onInput">
      <p class="timer">{{restTime}}</p>
      <p class="singer">{{audioAuthor}}</p>
      <div class="play-box">
        <div class="last" @click="last"></div>
        <div :class="{'play': playState === 'playing', 'pause': playState === 'pause'}" @click="play"></div>
        <div class="next" @click="next"></div>
      </div>
      <div class="btn-box">
        <div class="cycle-mode":class="{'single-cycle': !singleLoop}" @click="cycleMode"></div>
        <span class="source">来自虾米音乐</span>
        <div class="collect"></div>
        <div class="detail-content"></div>
      </div>
    </header>
    <div class="mask" @click="onMaskClick"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { Toast } from 'mint-ui';

const audio = new Audio();

export default{
  data() {
    return {
      min: 0,
      step: 0.1,
      // DOM ELement 内部属性不能被跟踪 --- 不可枚举
      duration: 0,
      currentTime: 0,
      singleLoop: true,
    };
  },
  computed: {
    ...mapState({
      playList: state => state.music.playList,
      playIndex: state => state.music.playIndex,
      playState: state => state.music.playState,
      playId: state => state.music.playId,
    }),
    // 资源路径
    audioSrc() {
      if (this.playIndex > -1 && this.playList.length > 0) {
        return this.playList[this.playIndex].audioUrl;
      }
      return '';
    },
    // 歌曲名
    musicName() {
      if (this.playIndex > -1 && this.playList.length > 0) {
        return this.playList[this.playIndex].musicName;
      }
      return ' ';
    },
    // 歌唱者
    audioAuthor() {
      if (this.playIndex > -1 && this.playList.length > 0) {
        return this.playList[this.playIndex].musicAuthor;
      }
      return ' ';
    },
    // 剩余播放时间
    restTime() {
      const rest = this.duration - this.currentTime;
      if (rest > 0) {
        const munite = 60;
        let mins = rest / munite;
        let secs = Math.round(rest % munite);
        if (secs < 10) {
          secs = `0${secs}'`;
        } else {
          secs = `${secs}'`;
        }
        if (mins < 10) {
          mins = `0${Math.floor(mins)}"`;
        } else {
          mins = `${Math.floor(mins)}"`;
        }
        return `${mins}${secs}`;
      }
      const s = '00"';
      return `0'${s}`;
    },
  },
  created() {
    window.audio = audio;
    // const audio = this.audio;
    audio.autoplay = true;
    audio.loop = this.singleLoop;
    audio.addEventListener('canplay', () => {
      audio.play();
    });
    audio.addEventListener('load', () => {
      audio.play();
    });
    audio.addEventListener('canplaythrough', () => {
      audio.play();
    });
    audio.addEventListener('durationchange', () => {
      this.duration = audio.duration;
    });
    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      const v = (audio.currentTime * 100) / this.duration;
      const range = this.$refs.range;
      range.style.backgroundSize = `100% 3px, ${v}% 3px`;
    });
    audio.addEventListener('play', () => {
      if (this.playState !== 'playing') {
        this.updatePlayState({ playState: 'playing' });
      }
    });
    audio.addEventListener('pause', () => {
      if (this.playState !== 'pause') {
        this.updatePlayState({ playState: 'pause' });
      }
    });
    audio.addEventListener('loadstart', () => {
      Toast({
        message: '加载中...',
        position: 'bottom',
        duration: 800,
      });
    });
    audio.addEventListener('ended', () => {
      if (!audio.loop) {
        this.next();
      }
    });
  },
  watch: {
    audioSrc() {
      // 更新播放器资源
      audio.src = this.audioSrc;
      const playId = this.playList[this.playIndex].musicId;
      this.updatePlayId({ playId });
      audio.load();
    },
    playIndex() {
      // 更新播放ID
      const playId = this.playList[this.playIndex].musicId;
      this.updatePlayId({ playId });
    },
    playState() {
      if (this.playState === 'playing') {
        audio.play();
      }
      if (this.playState === 'pause') {
        audio.pause();
      }
    },
  },
  methods: {
    ...mapMutations([
      'updatePlayIndex',
      'updatePlayList',
      'updateShowMusicPlayer',
      'updatePlayId',
      'updatePlayState',
    ]),
    // 滑动竿杆
    onInput(e) {
      const input = e.target.value;
      const v = (input * 100) / this.max;
      const range = this.$refs.range;
      audio.currentTime = input;
      range.style.backgroundSize = `100% 3px, ${v}% 3px`;
    },
    // 播放或者定停
    play() {
      if (audio.readyState > 1) {
        if (audio.paused === true) {
          // audio.play();
          this.updatePlayState({ playState: 'playing' });
        } else {
          // audio.pause();
          this.updatePlayState({ playState: 'pause' });
        }
      }
    },
    // 单曲循环
    loop() {
      audio.loop = !audio.loop;
      this.singleLoop = audio.loop;
    },
    // 播放上一首
    last() {
      const len = this.playList.length;
      const payload = {};
      if (len !== 0) {
        if (len === 1) {
          audio.currentTime = 0;
          return;
        }
        if (this.playIndex > 0) {
          payload.playIndex = this.playIndex - 1;
        } else {
          payload.playIndex = 0;
        }
        this.updatePlayIndex(payload);
      }
    },
    // 播放下一首
    next() {
      const len = this.playList.length;
      const payload = {};
      if (len !== 0) {
        if (len === 1) {
          audio.currentTime = 0;
          return;
        }
        if (this.playIndex < len - 1) {
          payload.playIndex = this.playIndex + 1;
        } else {
          payload.playIndex = 0;
        }
        this.updatePlayIndex(payload);
      }
    },
    // 切换播放模式
    cycleMode() {
      this.updatePlayList({ playList: [
        {
          musicId: '1',
          musicName: '里不知道的时光',
          musicAuthor: '李钰',
          audioUrl: 'http://om5.alicdn.com/220/1220/311523/3450778_3103164_l.mp3?auth_key=90ce7e374e83a7d4995a41657fb786c8-1491447600-0-null',
        },
      ] });
      this.updatePlayIndex({ playIndex: 0 });
      // this.loop();
    },
    // 点击空白区域
    onMaskClick() {
      this.updateShowMusicPlayer({ showMusicPlayer: false });
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
  overflow: hidden;
  header {
    position: relative;
    padding: 0 rem(42);
    background-color: white;
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
        background-image: url('../assets/player_single_cycle.png');
      }
      .single-cycle {
        background-image: url('../assets/player_all_cycle.png');
      }
      .source {
        padding-left: rem(50);
        color: rgb(200,200,200);
        font-size: 11px;
        background: url('../assets/xiami_logo.png') no-repeat;
        background-size: rem(40) rem(40);
        background-position: 0 48%;
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
