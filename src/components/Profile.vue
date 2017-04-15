<template>
  <div id="profile">
    <header-bar id="profile-header">
      <div class="left-arrow" @click="goBack" v-show="leftOptions.showBack"></div>
      <span id="profile-title">半个节拍</span>
    </header-bar>
    <header>
      <img class="avtor" src="../assets/profile_bg.png">
      <p class="nickname">半个节拍</p>
    </header>
    <main>
      <div class="cell" @click="toFollow">
        <div class="icon">
          <x-icon type="person"></x-icon>
        </div>
        <span class="title">我的关注</span>
        <span class="follow-num">{{followData.total}}</span>
      </div>
      <div class="group-title">收藏</div>
      <div class="cell" @click="toCollectionReading">
        <div class="icon">
          <x-icon type="ios-paper"></x-icon>
        </div>
        <span class="title">文章</span>
      </div>
      <div class="cell" @click="toCollectionMovie">
        <div class="icon">
          <x-icon type="ios-film"></x-icon>
        </div>
        <span class="title">电影</span>
      </div>
      <div class="cell" @click="toCollectionMusic">
        <div class="icon">
          <x-icon type="music-note"></x-icon>
        </div>
        <span class="title">音乐</span>
    </div>
    </main>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import HeaderBar from './HeaderBar';

export default{
  components: {
    HeaderBar,
  //  [XIcon.name]: XIcon,
  },
  data() {
    return {
      leftOptions: {
        showBack: true,
      },
      followData: {},
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
  },
  methods: {
    ...mapMutations(['updateDirection']),
    goBack() {
      this.updateDirection({ direction: 'forward' });
      this.$router.go(-1);
    },
    toFollow() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push('follow');
    },
    toCollectionReading() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push('collection/reading');
    },
    toCollectionMovie() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push('collection/movie');
    },
    toCollectionMusic() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push('collection/music');
    },
    scrollHandler(e) {
      const header = document.querySelector('#profile-header');
      const title = document.querySelector('#profile-title');
      let boxShadow;
      const scrollTop = e.target.scrollTop;
      let opacity;
      console.log(e.target);
      if (scrollTop <= 46) {
        opacity = scrollTop / 46;
        boxShadow = 'none';
      } else {
        opacity = 1;
        boxShadow = '0 0.00185rem 0.00093rem 0.00185rem whitesmoke';
      }
      header.style.backgroundColor = `rgba(255,255,255,${opacity})`;
      header.style.boxShadow = boxShadow;
      title.style.color = `rgba(0,0,0,${opacity * 0.8})`;
    },
    async fetchFollw() {
      const params = new URLSearchParams(this.basicQueryString);
      params.set('uid', 5105554);
      params.set('type', 1);
      params.set('channel', 'oppo');
      try {
        const resp = await this.$http.get(`${this.host}/user/follow_list?${params.toString()}`);
        const result = resp.data;
        console.log(result);
        if (result.res === 0) {
          this.followData = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    const el = document.querySelector('#profile');
    el.addEventListener('scroll', this.scrollHandler);
    // 获取数据
    this.fetchFollw();
  },
  beforeRouteLeave: (to, from, next) => {
    const el = document.querySelector('#profile');
    el.removeEventListener('scroll', this.scrollHandler);
    next();
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#profile {
  height: 100%;
  width: 100%;
  overflow: scroll;
  #profile-header {
    background-color: transparent;
    box-shadow: none;
  }
  #profile-title {
    color: transparent;
  }
  .left-arrow {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 8px;
    left: 10px;
    &:before {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      border: 1px solid #9b9b9b;
      border-width: 1px 0 0 1px;
      transform: rotate(315deg);
      top: 8px;
      left: 7px;
    }
  }
  header {
    padding-top: rem(200);
    height: rem(1078);
    text-align: center;
    filter: brightness(.9);
    background-image: url('../assets/profile_bg.png');
    background-size:  cover;
    background-repeat:  no-repeat;
    .avtor {
      height: rem(188);
      width: rem(188);
      border-radius: 50%;
    }
    .nickname {
      margin-top: rem(24);
      font-size: 13px;
      color: #000;
    }
  }
  main {
    padding-bottom: rem(130);
    .cell {
    position: relative;
    padding: 0 rem(32) 0 rem(45);
    height: rem(135);
    line-height: rem(135);
    background-color: #fff;
    background-image: linear-gradient(left, #f8f8f8, #f8f8f8);
    background-position: rem(140) 100%;
    background-size: rem(900) rem(4);
    background-repeat: no-repeat;
    .follow-num {
      float: right;
      margin-right: rem(45);
      padding-top: rem(11);
      color: #9b9b9b;
    }
    .icon {
      position: absolute;
      top: rem(20);
      left: rem(45);
      height: rem(55);
      width: rem(55);
    }
    .title {
     margin-left: rem(110);
     font-size: 13px;
    }
    &:first-child {
      background-image: none;
    }
    &:after {
      content: "";
      position: absolute;
      width: rem(25);
      height: rem(25);
      border: 1px solid #9b9b9b;
      border-width: 1px 1px 0px 0;
      transform: rotate(45deg);
      top: rem(60);
      right: rem(32);
    }
  }
  .group-title {
     padding-left: rem(45);
     height: rem(108);
     font-size: 12px;
     line-height: rem(108);
     background-color: #f8f8f8;
     color: #9c9c9c;
   }
  }
}
</style>
