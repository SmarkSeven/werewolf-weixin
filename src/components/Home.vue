<template>
  <div id="home-container">
      <header-bar slot="header" title="text">
        <div slot="left" @click="toProfile">GO</div>
        <div slot="right" @click="toSearch">Search</div>
      </header-bar>
      <loadmore id="load-more" style="padding-top: 46px;padding-bottom: 50px;" :auto-fill="false" :bottomAllLoaded="allLoaded" :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore">
      <card v-for="(item,index) in data" :key="item.id" :cardItem="item" @click-share="share" @click-like="like" @on-img-click="showImg" @on-card-click="showPage"></card>
     </loadmore>
      <tabbar>
        <tabbar-item :selected="path === '/'" ref="tab-home" link="/">
          <div slot="icon">
              <x-icon type="android-home" :size="27"></x-icon>
          </div>
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/reading":selected="path === '/reading'" >
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
import { ViewBox, Scroller, ButtonTab, ButtonTabItem, Spinner, Group, Cell, Tabbar, TabbarItem } from 'vux';
import { mapState, mapMutations } from 'vuex';
import { Loadmore } from 'mint-ui';
import HeaderBar from './HeaderBar';
import Card from './Card';

export default {
  components: {
    ViewBox,
    Scroller,
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
  },
  data() {
    return {
      allLoaded: false,
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
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
    }),
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
      if (to.path === '/' && vm.currentIndex === vm.maxIndex) {
        vm.allLoaded = true;
      }
      if (vm.pathDataMap[vm.path].length === 0) {
        vm.getData();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    if (from.path === '/') {
      this.allLoaded = false;
    }
    next();
  },
  watch: {
    maxIndex() {
      if (this.maxIndex === this.currentIndex) {
        this.allLoaded = true;
      } else {
        this.allLoaded = false;
      }
    },
    currentIndex() {
      if (this.currentIndex === this.maxIndex) {
        this.allLoaded = true;
      } else {
        this.allLoaded = false;
      }
    },
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
    ]),
    showPage(opt) {
      if (opt.category === 1) {
        this.$router.push({ path: `/essay/${opt.contentId}` });
      }
    },
    showImg() {
      console.log('show img');
    },
    loadTop() {
      // load more data
      console.log('Top loadMore');
      setTimeout(this.$refs.loadmore.onTopLoaded, 2000);
    },
    loadBottom() {
      this.getData();
      this.$refs.loadmore.onBottomLoaded();
    },
    toProfile() {
      this.$router.push('profile');
    },
    toSearch() {
      this.$router.push('search');
    },
    like() {
      console.log('like');
    },
    share() {
      console.log('I want to share it whith my freinds.');
    },
    getData() {
      // 获取数据
      try {
        if (this.path === '/') {
          this.fetchOneList();
          window.scrollTo(0, 0);
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
      // 获取每日列表
      if (this.currentIndex < 0 || !this.allLoaded) {
        this.updateCurrentIndex({ currentIndex: this.currentIndex + 1 });
      }
      // 获取每日列表的id列表
      let resp = await this.$http.get(`${this.host}/onelist/idlist`);
      const result = resp.data;
      if (result.res === 0) {
        this.updateOneIdList({ oneIdList: result.data });
        this.updateMaxIndex({ maxIndex: result.data.length - 1 });
      }
      const oneListId = this.oneIdList[this.currentIndex];
      // 获取每日列表内容
      resp = await this.$http.get(`${this.host}/onelist/${oneListId}/0?${this.basicQueryString}`);
      if (resp.data.res === 0 && resp.data.data && resp.data.data.content_list.length > 0) {
        this.updateOneList({ oneList: resp.data.data.content_list });
        this.updateWeather({ weather: resp.data.data.weather });
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
        this.updateLastMovieId({ lastMusicId: this.musicList[listLen - 1].id });
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
  },
};
</script>

<style rel="stylesheet/scss">
@import '../styles/rem.scss';
html, body {
  height: 100%;
}
#home-container {
  height: 100%;
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
div.weui-tabbar{
  position: fixed;
}
.rotate {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
}
.pullup-arrow {
  display: block;
  transition: all linear 0.2s;
  -webkit-transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}
.scroller-container{
  height: 100%;
}
#vux-scroller-2811y {
  height: calc(100%-96px);
}
</style>
