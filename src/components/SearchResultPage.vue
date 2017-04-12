<template>
  <div id="search-reslut-page">
    <div class="header">
      <div class="back" @click="back">
         <x-icon type="ios-arrow-left" size="30"></x-icon>
      </div>
      <input type="text" ref="input" @keyup.13="onInput">
      <div class="search-btn" @click="search">
        <x-icon type="ios-search-strong" size="30"></x-icon>
      </div>
    </div>
    <main>
      <mt-navbar v-model="selected" :fixed="true" @input="change">
        <mt-tab-item id="hp"> 图文 </mt-tab-item>
        <mt-tab-item id="reading"> 阅读 </mt-tab-item>
        <mt-tab-item id="music">音乐</mt-tab-item>
        <mt-tab-item id="movie">影视</mt-tab-item>
        <mt-tab-item id="author">作者/音乐人</mt-tab-item>
      </mt-navbar>
      <mt-tab-container
        id="tabContainer"
        v-model="selected"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
        <mt-tab-container-item v-for="(tab,index) in tabs" :key="index" :id="tab">
            <div v-if="selected === 'hp'">
              <transition-group name="list" tag="div">
                <cell v-for="item in data"
                  :key="item.hpcontent_id"
                  :imgUrl="item.hp_img_url || 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='"
                  :sub="item.hp_title"
                  :content="item.hp_content"
                  :id="item.hpcontent_id"
                  type="hp">
                </cell>
              </transition-group>
            </div>
            <div v-if="selected === 'reading'">
              <transition-group name="list" tag="div">
                <cell v-for="item in data"
                  :sub="item.type | readingType"
                  :content="item.title"
                  :id="item.id"
                  :type="item.type"
                  :key="item.id">
                </cell>
              </transition-group>
            </div>
            <div v-if="selected === 'music'">
              <transition-group name="list" tag="div">
                <cell v-for="item in data"
                  :imgUrl="item.cover || 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='"
                  :sub="item.title"
                  :content="item.author.user_name"
                  :id="item.id"
                  type="music"
                  :key="item.id">
                </cell>
              </transition-group>
            </div>
            <div v-if="selected === 'movie'">
              <transition-group name="list" tag="div">
                <cell v-for="item in data"
                  sub="影视"
                  :content="item.title"
                  :id="item.id"
                  type="movie"
                  :key="item.id">
                </cell>
              </transition-group>
            </div>
            <div v-if="selected === 'author'">
              <transition-group name="list" tag="div">
                <cell v-for="item in data"
                  :imgUrl="item.web_url || 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='"
                  :sub="item.desc"
                  :content="item.user_name"
                  :id="item.user_id"
                  type="author"
                  :key="item.user_id">
                </cell>
              </transition-group>
            </div>
            <div v-if="data.length === 0 && loaded" class="no-search-result">
              <x-icon type="social-buffer-outline" size="40"></x-icon>
            </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </main>
  </div>
</template>
<script>
import { Navbar, TabItem, TabContainer, TabContainerItem, Toast } from 'mint-ui';
import { mapState } from 'vuex';
import Cell from '../components/SearchResultCell';

export default{
  components: {
    [Navbar.name]: Navbar,
    [TabItem.name]: TabItem,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem,
    Cell,
  },
  data() {
    return {
      savedPostion: {},
      loading: false,
      loaded: false,
      selected: 'hp',
      data: [],
      tempData: [],
      hp: [],
      reading: [],
      music: [],
      movie: [],
      author: [],
      tabs: ['hp', 'reading', 'music', 'movie', 'author'],
    };
  },
  computed: {
    ...mapState({
      params: state => state.route.params,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
  },
  filters: {
    readingType(type) {
      if (type === 'essay') {
        return '阅读';
      }
      if (type === 'question') {
        return '问答';
      }
      if (type === 'serialcontent') {
        return '连载';
      }
    },
  },
  methods: {
    async fetchData(keyword, path) {
      const resp = await this.$http.get(`${this.host}/search/${path}/${keyword}`);
      const result = resp.data;
      if (resp.status === 200 && result.res === 0) {
        switch (path) {
          case 'hp': {
            this.loaded = true;
            this.selected = 'hp';
            this.hp.splice(0, this.hp.length);
            this.data.splice(0, this.data.length);
            this.tempData.splice(0, this.tempData.length);
            this.hp.push(...result.data);
            this.tempData = this.hp;
            this.data.push(...this.tempData.slice(0, 20));
            const container = document.querySelector('.mint-tab-container');
            container.scrollTop = 0;
            break;
          }
          case 'reading':
            this.reading.splice(0, this.reading.length);
            this.reading.push(...result.data);
            break;
          case 'music':
            this.music.splice(0, this.music.length);
            this.music.push(...result.data);
            break;
          case 'movie':
            this.movie.splice(0, this.movie.length);
            this.movie.push(...result.data);
            break;
          case 'author':
            this.author.splice(0, this.author.length);
            this.author.push(...result.data);
            break;
          default:
            Toast({
              message: 'something error',
              position: 'bottom',
              duration: 1000,
            });
        }
      }
    },
    change() {
      switch (this.selected) {
        case 'hp':
          this.tempData = this.hp;
          break;
        case 'reading':
          this.tempData = this.reading;
          break;
        case 'movie':
          this.tempData = this.movie;
          break;
        case 'music':
          this.tempData = this.music;
          break;
        case 'author':
          this.tempData = this.author;
          break;
        default:
      }
      this.data = [];
      this.data.push(...this.tempData.slice(0, 20));
      if (this.data.length >= this.tempData.length) {
        this.loading = true;
      }
    },
    loadMore() {
      this.loading = true;
      this.data.push(...this.tempData.slice(this.data.length, this.data.length + 10));
      this.loading = false;
    },
    setContainerHieght() {
      const tabContainer = document.querySelector('#tabContainer');
      const height = document.documentElement.clientHeight - tabContainer.getBoundingClientRect().top;
      tabContainer.style.height = `${height}px`;
    },
    back() {
      this.$router.go(-1);
    },
    onInput() {
      this.$refs.input.blur();
      this.search();
    },
    search() {
      const keyword = this.$refs.input.value.trim();
      if (keyword === '') {
        return;
      }
      this.$router.push({ path: `/search/${keyword}` });
    },
  },
  created() {
    this.fetchData(this.params.key, 'hp');
    this.fetchData(this.params.key, 'reading');
    this.fetchData(this.params.key, 'music');
    this.fetchData(this.params.key, 'movie');
    this.fetchData(this.params.key, 'author');
  },
  beforeRouteUpdate(to, from, next) {
    this.savedPostion = {};
    this.fetchData(to.params.key, 'hp');
    this.fetchData(to.params.key, 'reading');
    this.fetchData(to.params.key, 'music');
    this.fetchData(to.params.key, 'movie');
    this.fetchData(to.params.key, 'author');
    next();
  },
  watch: {
    selected(val, oldVal) {
      // 记录每个列表滑动位置
      const container = document.querySelector('.mint-tab-container');
      this.savedPostion[oldVal] = container.scrollTop;
      container.scrollTop = this.savedPostion[val];
    },
  },
  mounted() {
    this.setContainerHieght();
    window.addEventListener('resize', this.setContainerHieght);
  },
  destroyed() {
    window.removeEventListener('resize', this.setContainerHieght);
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#search-reslut-page {
  height: 100%;
  width: 100%;
}
.header {
  display: flex;
  height: 42px;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  div {
    display: inline-block;
    padding-top: 6px;
    height: 100%;
    width: rem(140);
    text-align: center;
    .vux-x-icon {
      fill: #a0a0a0;
    }
  }
  input[type=text] {
    width: rem(800);
    height: 65%;
    font-size: 15px;
    padding-left: 6px;
    color: #9c9c9c;
    outline: none;
    border: none;
    background: rgba(255,255,255,1);
  }
}
main {
  padding-top: 42px;
}
.mint-navbar {
  padding: 0 rem(25);
}
.mint-navbar.is-fixed {
  top: 42px;
  .mint-tab-item {
    color: #b2b2b2;
    white-space: nowrap;
  }
  .mint-tab-item.is-selected {
    color: black;
    border-bottom: none;
  }
}
.mint-tab-container {
  margin-top: 45px;
  padding: 0 rem(90);
  overflow: scroll;
}
.no-search-result {
  display: flex;
  height: rem(1200);
  justify-content: center;
  align-items: center;
}
// 过渡样式
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(50px);
}
</style>
