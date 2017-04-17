<template>
  <div id="hp-page">
    <header-bar :leftOptions="leftOptions" title=图文></header-bar>
    <main>
      <div class="tag">{{date}}</div>
      <p class="title">对流层, 地球</p>
      <div class="inner-box">
          <img class="img" :src="hp.hp_img_url">
      </div>
      <p class="label info">{{hp.hp_author}} |</p>
      <p class="forward forward-bottom" v-html="forward"></p>
      <div class="footer">
        <div class="share-btn" @click.stop="share">
        </div>
        <div class="like-btn" @click.stop="like" :class="{'liked': isPraised}"></div>
        <div class="like-num label">{{hp.praisenum + factor}}</div>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import HeaderBar from './HeaderBar';

export default{
  components: {
    HeaderBar,
  },
  data() {
    return {
      hp: {},
      leftOptions: {
        showBack: true,
      },
      factor: 0,
    };
  },
  computed: {
    ...mapState({
      host: state => state.one.host,
      weather: state => state.one.weather,
      praiseContents: state => state.storage.praiseContents,
    }),
    // 是否经点赞
    isPraised() {
      const index = this.praiseContents.indexOf(Number(this.hp.hpcontent_id));
      if (index > -1) {
        return true;
      }
      return false;
    },
    date() {
      return new Date(this.hp.maketime).toLocaleDateString().replace(/\//g, ' / ');
    },
    forward() {
      return this.hp.hp_content;
    },
    cardInfo() {
      return {
        id: Number(this.hp.hpcontent_id),
        category: Number(0),
        contentId: Number(this.hp.hpcontent_id),
        storyId: Number(this.hp.hpcontent_id),
      };
    },
  },
  methods: {
    ...mapActions(['praise']),
    async fetchData(id) {
      const resp = await this.$http.get(`${this.host}/hp/detail/${id}`);
      const result = resp.data;
      if (resp.status === 200 && result.res === 0) {
        this.hp = result.data;
      }
    },
    like() {
      const praisePayload = {
        id: Number(this.hp.hpcontent_id),
        category: Number(0),
        contentId: Number(this.hp.hpcontent_id),
      };
      if (this.isPraised) {
        this.factor = this.factor - 1;
      } else {
        this.factor = this.factor + 1;
      }
      this.praise(praisePayload);
    },
    share() {
      this.$emit('click-share', this.cardInfo);
    },
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      vm.fetchData(to.params.id);
    });
  },
};

</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#hp-page {
  background-color: white;
  main {
    padding-top: 56px;
  }
  .tag {
    margin: 0 auto;
    font-size: 16px;
    color: black;
    text-align: center;
  }
  .title {
    padding: 0;
    text-align: center;
    font-size: 12px;
    transform: scale(.8);
    color: hsla(0, 90%, 0%, .3);
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
  .footer {
    padding: 0 rem(8) rem(10) rem(38);
    height: rem(120);
    line-height: rem(80);
    border-bottom: rem(30) solid #f8f8f8;
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
      margin-right: rem(-25);
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
    img {
      width: 100%;
    }
  }
  .label {
    color: hsla(0, 90%, 0%, .3);
    font-weight: 500;
  }
}
  .info{
    text-align: center;
    transform: scale(0.75);
    font-size: 12px;
  }
  .info {
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
@keyframes rotate{
  0%{
    transform:rotate(0deg);
  }
  100%{
    transform:rotate(360deg);
  }
}
</style>
