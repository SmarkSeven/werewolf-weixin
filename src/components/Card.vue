<template>
  <div class="card" :class="[cardType]" @click="clickCard">
    <!--card类型-->
    <div class="tag label">{{tag}}</div>
    <!--标题-->
    <p class="title">{{cardItem.title}}</p>
    <span class="author">{{author}}</span>
    <div v-if="cardItem.category === '4'" class="music-box">
      <div class="music-box-left">
        <div class="music-img-box">
          <img class="music-img" :class="{'music-img-rotate': isPlaying}" v-lazy="cardItem.img_url"></img>
        </div>
         <img class="music-xiami" src="../assets/xiami_logo.png" alt="">
         <div :class="{'music-play-btn': !isPlaying, 'music-pause-btn': isPlaying}" @click.stop="play"></div>
      </div>
      <div class="music-box-right"><img src="../assets/feeds_music_story.png" class="music-story" alt="music-story"></div>
    </div>
    <div v-else class="inner-box" @click.stop="clickImg">
        <img class="img" v-lazy="cardItem.img_url">
    </div>
    <p v-show="cardItem.category === '0' || cardItem.category === '4'" class="label info">{{info}}</p>
    <p class="forward" :class="{'forward-bottom': cardItem.category != 5}" v-html="forward"></p>
    <p v-show="cardItem.category === '5'" class="movie-subtitle">——《{{cardItem.subtitle}}》</p>
    <p v-show="cardItem.category === '0'" class="label words-info">{{cardItem.words_info}}</p>
    <div class="footer">
      <div v-show="cardItem.category != '0'" class="date label">{{date}}</div>
      <div class="share-btn" @click.stop="share">
      </div>
      <div class="like-btn" @click.stop="like" :class="{'liked': isPraised}"></div>
      <div class="like-num label">{{cardItem.like_count}}</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
// import { Toast } from 'mint-ui';
import getDateDiff from '../js/date.js';

export default{
  props: {
    cardItem: Object,
  },
  computed: {
    ...mapState({
      weather: state => state.one.weather,
      praiseContents: state => state.storage.praiseContents,
      playId: state => state.music.playId,
      playState: state => state.music.playState,
    }),
    tag() {
      const tag = this.cardItem.tag_list[0];
      switch (this.cardItem.content_type) {
        case '1':
          return `- ${tag ? tag.title : '阅读'} -`;
        case '2':
          return `- ${tag ? tag.title : '连载'} -`;
        case '3':
          return `- ${tag ? tag.title : '问答'} -`;
        case '4':
          return `- ${tag ? tag.title : '音乐'} -`;
        case '5':
          return `- ${tag ? tag.title : '电影'} -`;
        default:
          if (this.weather) {
            return `${this.weather.climate}, ${this.weather.city_name}`;
          }
      }
    },
    author() {
      let name = this.cardItem.author.user_name;
      const category = this.cardItem.content_type;
      if (category === '3') {
        name = this.cardItem.answerer.user_name;
        return `${name}答`;
      }
      return `文╱${name}`;
    },
    cardType() {
      switch (this.cardItem.content_type) {
        case '0': // 绘画
          return 'hp-card';
        case '1': // 阅读
        case '2': // 连载
        case '3': // 问答
          return 'read-card';
        case '4': // 音乐
          return 'music-card';
        case '5': // 电影
          return 'movie-card';
        default:
          return '';
      }
    },
    // 是否经点赞
    isPraised() {
      const index = this.praiseContents.indexOf(Number(this.cardItem.content_id));
      if (index > -1) {
        return true;
      }
      return false;
    },
    date() {
      return getDateDiff(new Date(this.cardItem.post_date).getTime());
    },
    forward() {
      const forward = this.cardItem.forward.replace(/\r\n/g, '<br>');
      return forward;
    },
    info() {
      const cardItem = this.cardItem;
      if (cardItem.category === '4') {
        const author = cardItem.audio_author;
        const musicName = cardItem.music_name;
        const audioAlbum = cardItem.audio_album;
        return `${musicName} · ${author} | ${audioAlbum}`;
      }
      return `${cardItem.title} | ${cardItem.pic_info}`;
    },
    musicId() {
      const cardItem = this.cardItem;
      if (cardItem.category === '4') {
        return cardItem.audio_url;
      }
    },
    cardInfo() {
      return {
        id: Number(this.cardItem.id),
        category: Number(this.cardItem.content_type),
        contentId: Number(this.cardItem.content_id),
        storyId: Number(this.cardItem.movie_story_id),
      };
    },
    // 当前音乐是否正在播放
    isPlaying() {
      return this.musicId === this.playId && this.playState === 'playing';
    },
  },
  methods: {
    ...mapMutations([
      'updateMusicId',
      'updateMusicTitle',
      'updateMusicName',
      'updateAudioAuthor',
      'updateAudioAlbum',
      'updateWordsAuthor',
      'updateQuestionId',
      'updateReadingAuthorName',
      'updateCurrentItemCategory',
      'updatePlayList',
      'updatePlayIndex',
      'updatePlayState',
      'updatePlayId',
      'updateShowMusicPlayer',
      'updateDirection']),
    ...mapActions(['fetchAudioFromXiami', 'praise']),
    play() {
      // 当前音乐正在播放
      if (this.musicId === this.playId && this.playState === 'playing') {
        this.updatePlayState({ playState: 'pause' });
        return;
      }
      // 当前音乐处于暂停状态
      if (this.musicId === this.playId && this.playState === 'pause') {
        this.updatePlayState({ playState: 'playing' });
        return;
      }
      const playload = {
        musicTitle: this.cardItem.music_name,
        musicId: this.musicId,
        singer: this.cardItem.audio_author,
        audioUrl: this.musicId,
      };
      // 当前音乐不处于就绪状态
      if (this.cardItem.audio_platform === '1') {
        // 音频来多米音乐
        this.fetchAudioFromXiami(playload);
      }
      if (this.cardItem.audio_platform === '2') {
        this.updatePlayList({ playList: [playload] });
        this.updatePlayIndex({ playIndex: 0 });
      }
    },
    clickImg() {
      if (this.cardItem === '0') {
        this.$emit('on-img-click');
      } else {
        this.clickCard();
      }
    },
    clickCard() {
      const cardItem = this.cardItem;
      let path = '';
      if (cardItem.category === '0') {
        return;
      } else if (cardItem.category === '1') { // 前往阅读视图
        path = `/essay/${cardItem.content_id}`;
      } else if (cardItem.category === '3') { // 前往问答视图
        path = `/question/${cardItem.content_id}`;
      } else if (cardItem.category === '4') { // 前往音乐视图
        console.log(cardItem.audio_platform);
        if (cardItem.audio_platform === '2') {
          path = `/music/${cardItem.content_id}/one`;
        } else {
          path = `/music/${cardItem.content_id}/${cardItem.audio_url}`;
        }
      } else if (cardItem.category === '5') {
        path = `/movie/${cardItem.content_id}`;
      }
      this.updateDirection({ direction: 'forward' });
      this.$router.push({ path });
    },
    like() {
      const praisePayload = {
        id: Number(this.cardItem.id),
        category: Number(this.cardItem.content_type),
        contentId: Number(this.cardItem.content_id),
        storyId: Number(this.cardItem.movie_story_id),
      };
      this.praise(praisePayload);
    },
    share() {
      this.$emit('click-share', this.cardInfo);
    },
  },
};

</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
html {
  -webkit-text-size-adjust: none;
}
.card {
  padding: rem(17) 0 rem(40) 0;
  margin-bottom: rem(30);
  background-color: white;
  .tag {
    margin: 0 auto;
    margin-bottom: rem(44);
    height: rem(64);
    font-size: 12px;
    transform: scale(0.83);
    text-align: center;
  }
  .title {
    padding: 0 rem(77);
    margin-bottom: rem(20);
    line-height: rem(78);
    font-size: 19px;
    font-weight: 600;
  }
  .author {
    display: inline-block;
    padding: 0 rem(77);
    height: rem(61);
    line-height: rem(61);
    font-size: 14px;
    font-weight: 500;
  }
  .img{
    height: rem(570);
    width: rem(1020);
  }
  .img-border {
    text-align: center;
    transform: scale(0.55);
    font-size: 12px;
    font-weight: 600;
  }
  .forward {
    margin-top: rem(46);
    padding:0 rem(70);
    line-height: rem(68);
    font-size: 12.4px;
    font-weight: 600;
  }
  .forward-bottom {
    margin-bottom: rem(40);
  }
  .movie-subtitle {
    text-align: right;
    margin-bottom: rem(40);
    padding-right: rem(75);
    font-size: 14px;
  }
  .footer {
    padding: 0 rem(8) 0 rem(38);
    height: rem(80);
    line-height: rem(80);
    div {
      display: inline-block;
      -webkit-transform-origin-x: 0;
      transform: scale(0.7);
      font-size: 12px;
      font-weight: 600;
    }
    .date {
      float: left;
    }
    .like-num, .like-btn, .share-btn {
      float: right;
      color: hsla(0, 90%, 0%, .3);
      font-weight: 700;
    }
    .like-num {
      margin-top: rem(5);
      margin-right: rem(-16);
    }
    .like-btn {
      margin-right: rem(60);
      height: rem(80);
      width: rem(80);
      background-image: url('../assets/bubble_like.png');
      background-size: 108%;
    }
    .liked {
      background-image: url('../assets/bubble_liked.png');
    }
    .share-btn {
      position: relative;
      display: inline-block;
      height: rem(80);
      width: rem(80);
      background-image: url('../assets/bubble_share.png');
      background-size: 108%;
      &:before {
        position: absolute;
        content: '·';
        height: rem(18);
        width: rem(18);
        left: rem(-66);
        top: rem(32);
        line-height: rem(18);
        font-size: 16px;
        font-weight: bold;
        color: hsla(0, 10%, 0%, .25);
      }
    }
  }
  .inner-box {
    padding: 0 rem(30);
    padding-top: rem(30);
  }
  .label {
    color: hsla(0, 90%, 0%, .3);
    font-weight: 500;
  }
}
.hp-card {
  .title, .author {
    display: none;
  }
  .info, .words-info {
    text-align: center;
    -webkit-transform: scale(0.75);
    font-size: 12px;
  }
  .nfo {
    margin-top: rem(-8);
  }
  .words-info {
    padding: rem(22) 0;
  }
  .inner-box{
    margin-top: rem(30);
    padding: 0;
  }
  .img {
    width: 100%;
    height: auto;
  }
}
.music-card {
  .info {
    padding-top: rem(20);
    padding-left: rem(80);
    -webkit-transform-origin-x: 0;
    transform: scale(0.85);
    font-size: 12px;
    font-weight: 400;
  }
  .music-box {
    display: flex;
    height: rem(725);
    flex-wrap: nowrap;
    justify-content: flex-end;
    margin-top: rem(30);
  }
  .music-box-left {
    position: relative;
    height: 100%;
    width: rem(900);
    border-top-right-radius: rem(362.5);
    border-bottom-right-radius: rem(362.5);
    box-shadow: rem(8) rem(6) rem(15) rgb(246, 246, 246), rem(4) rem(-4) rem(20) rgb(246, 246, 246);
    background-color: white;
    .music-img-box {
      float: right;
      height: rem(680);
      width: rem(680);
      margin-top: rem(22.5);
      margin-right: rem(25);
      border-radius: 50%;
      overflow: hidden;
      .music-img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        filter: brightness(.85);
        animation: rotate 20s linear infinite;
        animation-play-state: paused;
      }
      .music-img-rotate {
        animation-play-state: running;
      }
    }
    .music-xiami {
      position: absolute;
      height: rem(75);
      width: rem(75);
      left: rem(120);
      bottom: rem(25);
      border-radius: rem(10);
    }
    .music-play-btn, .music-pause-btn {
      position: absolute;
      height: rem(91);
      width: rem(91);
      top: rem(312);
      right: rem(318);
      border-radius: 50%;
      background: rgba(255, 255, 255, .6);
    }
    .music-play-btn {
      &:after {
        content: '';
        display: block;
        position: absolute;
        top: rem(22.6);
        left: rem(32);
        border-top: rem(25) solid transparent;
        border-right: rem(36) solid transparent;
        border-bottom: rem(22.5) solid transparent;
        border-left: rem(36) solid white;
      }
    }
    .music-pause-btn {
      &:after {
        content: '';
        display: block;
        position: absolute;
        height: rem(43);
        width: rem(9);
        top: rem(24.6);
        left: rem(28);
        border-right: rem(15) solid white;
        border-left: rem(15) solid white;
      }
    }
  }
  .music-box-right {
    width: rem(180);
    padding-left: rem(9);
    .music-story {
      height: 100%;
    }
  }
}
.movie-card {
  .inner-box {
    padding: rem(115) rem(30) rem(80) rem(30);
    background-image: url('../assets/movie-background.png');
    background-size: cover;
    box-shadow: 0 -2px 5px  #fff inset;
  }
}
@keyframes rotate{
  0%{
    transform:rotate(0deg);
  }
  100%{
    transform:rotate(360deg);
  }
}
</style>
