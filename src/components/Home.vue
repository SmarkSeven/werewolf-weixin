<template>
  <div>
      <header-bar slot="header" title="text">
        <div slot="left" @click="toProfile">GO</div>
        <div slot="right" @click="toSearch">Search</div>
      </header-bar>
      <loadmore id="load-more" style="padding-top: 46px;padding-bottom: 50px;" :bottomAllLoaded="allLoaded" :top-method="loadTop" :bottom-method="loadBottom" ref="loadmore">
      <card v-for="(item,index) in oneList" :key="item.id" :cardItem="item" @click-share="share" @click-like="like" @on-img-click="showImg" @on-card-click="showPage"></card>
     </loadmore>
      <tabbar>
        <tabbar-item selected ref="tab-home" link="/" :class="{'selected-tabbar':true}">
          <div slot="icon">
              <x-icon type="android-home" :size="27"></x-icon>
          </div>
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/read">
          <div slot="icon">
              <x-icon type="ios-paper" :size="27"></x-icon>
          </div>
          <span slot="label">阅读</span>
        </tabbar-item>
        <tabbar-item  link="/music">
          <div slot="icon" >
              <x-icon type="ios-musical-note" :size="27"></x-icon>
          </div>
          <span slot="label">音乐</span>
        </tabbar-item>
        <tabbar-item link="/movie">
          <div slot="icon">
              <x-icon type="ios-film" :size="27"></x-icon>
          </div>
          <span slot="label">影视</span>
        </tabbar-item>
      </tabbar>
  </div>
</template>

<script>
import {
  ViewBox,
  Scroller,
  ButtonTab,
  ButtonTabItem,
  Spinner,
  Group,
  Cell,
  Tabbar,
  TabbarItem } from 'vux';
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
      n: 10,
      allLoaded: false,
      loadStatus: {
        pullupStatus: 'default',
      },
      msg: 'Hello World!',
      cardItem: {
        type: '影视',
        title: '摄影',
        author: '文╱李诞',
        // imgUrl: 'http://image.wufazhuce.com/FpR4H4UoNGDbXM5saEGKNW6tqpPS',
        imgUrl: 'http://image.wufazhuce.com/FuWNIGRgvvbHTanCDqKr0VGoqOcP',
        forward: '这年头，看片请多留个心眼。我们每周都会选出一个主题，由七位作者绘制不同风格的短篇漫画。',
        time: '1天前',
        likeNum: 239,
        subtitle: '你妈妈也一样',
        category: 0,
        tagList: [],
        climate: '对流层',
        city_name: '地球',
        pic_info: '高旋',
        words_info: '囧叔',
      },
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      weather: state => state.one.weather,
      currentIndex: state => state.one.currentIndex,
      oneIdList: state => state.one.oneIdList,
      oneList: state => state.one.oneList,
      readingList: state => state.one.readingList,
      musicList: state => state.one.musicList,
      movieList: state => state.one.movieList,
    }),
  },
  async created() {
    // let self = this;
    try {
      const resp = await this.$http.get(`${this.host}/onelist/idlist?${this.basicQueryString}`);
      if (resp.data.res === 0 && resp.data.data.length > 0) {
        this.updateOneIdList({ oneIdList: resp.data.data });
        this.updateCurrentIndex({ currentIndex: 0 });
      }
      this.fetchOneList();
    } catch (err) {
      console.log(err);
    }

    // .then((resp) => {
    //   if (resp.data.res === 0 && resp.data.data.length > 0) {
    //     this.updateOneIdList({ oneIdList: resp.data.data });
    //   }
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log('离开');
    next();
  },
  methods: {
    ...mapMutations([
      'updateWeather',
      'updateOneIdList',
      'updateCurrentIndex',
      'updateOneList',
      'pushReadingList',
      'pushMusicList',
      'pushMovieList',
    ]),
    showPage() {
      console.log('show page');
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
      // load more data
      if (this.path === '/') {
        if (this.currentIndex < 7) {
          this.updateCurrentIndex({ currentIndex: this.currentIndex + 1 });
        }
        try {
          this.fetchOneList();
        } catch (err) {
          console.log(err);
        }
      }
      this.$refs.loadmore.onBottomLoaded();
    },
    toProfile() {
      this.$router.push('profile');
    },
    toSearch() {
      this.$router.push('search');
    },
    like() {
      this.$http.get('http://v3.wufazhuce.com:8000/api/onelist/idlist')
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((error) => {
        console.log(error);
      });
    },
    share() {
      console.log('I want to share it whith my freinds.');
    },
    async fetchOneList() {
      const oneListId = this.oneIdList[this.currentIndex];
      const resp = await this.$http.get(`${this.host}/onelist/${oneListId}/0?${this.basicQueryString}`);
      if (resp.data.res === 0 && resp.data.data && resp.data.data.content_list.length > 0) {
        this.updateOneList({ oneList: resp.data.data.content_list });
        this.updateWeather({ weather: resp.data.data.weather });
      }
    },
  },
};
</script>

<style rel="stylesheet/scss">
@import '../styles/rem.scss';
html,body {
  height: 100%;
}
#load-more {
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
