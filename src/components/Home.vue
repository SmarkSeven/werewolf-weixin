<template>
  <div id="home-container">
      <header-bar slot="header" :title="title">
        <img src="../assets/individual_center.png" alt="profile" slot="left" @click="toProfile">
        <div slot="right" @click="toSearch">Search</div>
      </header-bar>
      <main>
        <div class="loadmore-wrapper" ref="wrapper">
         <loadmore class="loadmore" id="load-more" :autoFill="false" :bottom-method="loadBottom" :distanceIndex="1" ref="loadmore">
           <transition-group name="list" tag="div">
            <card v-for="(item,index) in data" :key="item.id" :cardItem="item" @click-share="share" @on-img-click="showImg" ></card>
           </transition-group>
         </loadmore>
        </div>
      </main>
      <tabbar>
        <tabbar-item :selected="path === '/'" ref="tab-home" link="/">
          <div slot="icon">
              <x-icon type="android-home" :size="27"></x-icon>
          </div>
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/reading" :selected="path === '/reading'" >
          <div slot="icon">
              <x-icon type="ios-paper" :size="27"></x-icon>
          </div>
          <span slot="label">阅读</span>
        </tabbar-item>
        <tabbar-item  link="/music" :selected="path === '/music'">
          <div slot="icon" >
              <x-icon type="ios-musical-note" :size="27"></x-icon>
          </div>
          <span slot="label">音乐</span>
        </tabbar-item>
        <tabbar-item link="/movie" :selected="path === '/movie'">
          <div slot="icon">
              <x-icon type="ios-film" :size="27"></x-icon>
          </div>
          <span slot="label">影视</span>
        </tabbar-item>
      </tabbar>
  </div>
</template>

<script>
import { ViewBox, ButtonTab, ButtonTabItem, Spinner, Group, Cell, Tabbar, TabbarItem } from 'vux';
import { mapState, mapMutations, mapActions } from 'vuex';
import { Loadmore, Toast } from 'mint-ui';
import HeaderBar from './HeaderBar';
import Card from './Card';

export default {
  components: {
    ViewBox,
    Group,
    Cell,
    ButtonTab,
    ButtonTabItem,
    Loadmore,
    Tabbar,
    TabbarItem,
    HeaderBar,
    Spinner,
    Card,
    Toast,
  },
  data() {
    return {
      allLoaded: false,
      loadmoreToggle: false,
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      jwt: state => state.one.jwt,
      basicQueryString: state => state.one.basicQueryString,
      lastReadingId: state => state.one.lastReadingId,
      lastMusicId: state => state.one.lastMusicId,
      lastMovieId: state => state.one.lastMovieId,
      weather: state => state.one.weather,
      currentIndex: state => state.one.currentIndex,
      maxIndex: state => state.one.maxIndex,
      oneIdList: state => state.one.oneIdList,
      oneList: state => state.one.oneList,
      readingList: state => state.one.readingList,
      musicList: state => state.one.musicList,
      movieList: state => state.one.movieList,
      praiseContents: state => state.storage.praiseContents,
      savedPosition: state => state.one.savedPosition,
    }),
    title() {
      switch (this.path) {
        case '/music':
          return '一个音乐';
        case '/reading':
          return '一个阅读';
        case '/movie':
          return '一个电影';
        default:
          return '一个';
      }
    },
    data() {
      switch (this.path) {
        case '/music':
          return this.musicList;
        case '/reading':
          return this.readingList;
        case '/movie':
          return this.movieList;
        default:
          return this.oneList;
      }
    },
    pathDataMap() {
      return {
        '/': this.oneList,
        '/reading': this.readingList,
        '/music': this.musicList,
        '/movie': this.movieList,
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.pathDataMap[vm.path].length === 0) {
        vm.getData();
      }
      const position = vm.savedPosition[to.path];
      if (position) {
        if (to.path === '/') {
          console.log('enter:', position.top);
        }
        vm.$refs.wrapper.scrollTop = position.top;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    const top = this.$refs.wrapper.scrollTop;
    if (from.path === '/') {
      console.log('leave', top);
    }
    // 离开时记录滚动位置
    this.updateSavedPosition({
      path: from.path,
      position: { top, left: 0 },
    });
    next();
  },
  methods: {
    ...mapMutations([
      'updateLastReadingId',
      'updateLastMusicId',
      'updateLastMovieId',
      'updateWeather',
      'updateOneIdList',
      'updateCurrentIndex',
      'updateMaxIndex',
      'updateOneList',
      'pushReadingList',
      'pushMusicList',
      'pushMovieList',
      'pushPraiseContentId',
      'deletePraiseContentId',
      'updatePraisenum',
      'updateSavedPosition',
      'updateDirection',
    ]),
    ...mapActions(['praise']),
    type(category) {
      switch (category) {
        case 0: // 绘画
          return 'hpcontent';
        case 1: // 阅读
          return 'essay';
        case 2: // 连载
          return 'serial';
        case 3: // 问答
          return 'question';
        case 4: // 音乐
          return 'music';
        case 5: // 电影
          return 'movie';
        default:
          return '';
      }
    },
    showImg() {
    },
    loadBottom() {
      this.getData();
      setTimeout(this.$refs.loadmore.onBottomLoaded, 1000);
    },
    toProfile() {
      this.$router.push('profile');
    },
    toSearch() {
      this.updateDirection({ direction: 'forward' });
      this.$router.push('search');
    },
    share() {
      console.log('I want to share it whith my freinds.');
    },
    getData() {
      // 获取数据
      try {
        if (this.path === '/') {
          // this.fetchOneList();
          if (this.currentIndex === -1) {
            this.fetchOneList();
          } else {
            this.fetchOneData();
          }
        } else if (this.path === '/reading') {
          this.fetchReadingData();
        } else if (this.path === '/music') {
          this.fetchMusicData();
        } else if (this.path === '/movie') {
          this.fetchMovieData();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async fetchOneList() {
      // 获取每日列表的id列表
      const resp = await this.$http.get(`${this.host}/onelist/idlist`);
      const result = resp.data;
      if (result.res === 0) {
        this.updateOneIdList({ oneIdList: result.data });
        this.updateMaxIndex({ maxIndex: result.data.length - 1 });
        this.fetchOneData();
      }
    },
    fetchOneData() {
      // 获取每日列表
      if (this.currentIndex < this.maxIndex) {
        this.updateCurrentIndex({ currentIndex: this.currentIndex + 1 });
        const oneListId = this.oneIdList[this.currentIndex];
        this.$http.get(`${this.host}/onelist/${oneListId}/0?${this.basicQueryString}`)
        .then((resp) => {
          if (resp.data.res === 0 && resp.data.data && resp.data.data.content_list.length > 0) {
            this.updateOneList({ oneList: resp.data.data.content_list });
            this.updateWeather({ weather: resp.data.data.weather });
            this.$refs.wrapper.scrollTop = 0;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        Toast({
          message: ':-D 没有更多了',
          position: 'bottom',
          duration: 1000,
        });
      }
    },
    async fetchReadingData() {
      // 获取阅读列表
      const resp = await this.$http.get(`${this.host}/channel/reading/more/${this.lastReadingId}?${this.basicQueryString}`);
      const result = resp.data;
      if (result.res === 0 && result.data && result.data.length > 0) {
        // 更新阅读列表数据
        this.pushReadingList({ readingList: resp.data.data });
        const listLen = this.readingList.length;
        // 记录最后一条阅读数据的ID
        this.updateLastReadingId({ lastReadingId: this.readingList[listLen - 1].id });
      }
    },
    async fetchMusicData() {
      // 获取音乐列表
      const resp = await this.$http.get(`${this.host}/channel/music/more/${this.lastMusicId}?${this.basicQueryString}`);
      const result = resp.data;
      if (result.res === 0 && result.data && result.data.length > 0) {
        // 更新音乐列表数据
        this.pushMusicList({ musicList: result.data });
        const listLen = this.musicList.length;
        // 记录最后一条音乐数据的ID
        this.updateLastMusicId({ lastMusicId: this.musicList[listLen - 1].id });
      }
    },
    async fetchMovieData() {
      // 获取影视列表
      const resp = await this.$http.get(`${this.host}/channel/movie/more/${this.lastMovieId}?${this.basicQueryString}`);
      const result = resp.data;
      if (result.res === 0 && result.data && result.data.length > 0) {
        // 更新影视列表数据
        this.pushMovieList({ movieList: result.data });
        const listLen = this.movieList.length;
        // 记录最后一条影视数据的ID
        this.updateLastMovieId({ lastMovieId: this.movieList[listLen - 1].id });
      }
    },
    updateWrapperHeight() {
      const wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
      this.$refs.wrapper.style.height = `${wrapperHeight}px`;
    },
  },
  mounted() {
    this.updateWrapperHeight();
    window.addEventListener('resize', this.updateWrapperHeight);
  },
  destroyed() {
    window.removeEventListener('resize', this.updateWrapperHeight);
  },
};
</script>

<style lang="scss">
@import '../styles/rem.scss';
html, body {
  height: 100%;
}
#home-container {
  height: 100%;
  overflow: hidden;
  background: #fbfbfb;
  .header {
   img {
    height: 46px;
    width: 46px;
   }
  }
  main {
      height: 100%;
      padding-top: 46px;
      padding-bottom: 50px;

    .loadmore-wrapper {
      height: 100%;
      overflow: scroll;
      // -webkit-overflow-scrolling: auto;
    }
    .loadmore {
      -webkit-overflow-scrolling: auto;
    }
  }
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label span {
  color: hsla(0, 100%, 10%, .7);
}
.vux-x-icon {
  fill: #999999;
}
.weui-bar__item_on .vux-x-icon {
  fill: hsla(0, 100%, 0%, .7);
}
// 过渡样式
.list-enter-active, .list-leave-active {
  transition: all .5s ease;
}
.list-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.list-enter {
  opacity: 0;
  transform: translateY(-30px);
}
// div.weui-tabbar{
//   position: fixed;
// }
// .rotate {
//   transform: rotate(180deg);
//   -webkit-transform: rotate(180deg);
// }
// .pullup-arrow {
//   display: block;
//   transition: all linear 0.2s;
//   -webkit-transition: all linear 0.2s;
//   color: #666;
//   font-size: 25px;
// }
// .scroller-container{
//   height: 100%;
// }
// #vux-scroller-2811y {
//   height: calc(100%-96px);
// }
</style>
