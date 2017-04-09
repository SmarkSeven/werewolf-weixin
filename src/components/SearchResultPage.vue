<template>
  <div class="search-reslut-page">
    <div class="header">
      <div class="back"></div>
      <input type="text">
      <div class="search-btn"></div>
    </div>
    <main>
      <mt-navbar v-model="selected" :fixed="true" @input="change">
        <mt-tab-item id="hp"> 图文 </mt-tab-item>
        <mt-tab-item id="reading"> 阅读 </mt-tab-item>
        <mt-tab-item id="music">音乐</mt-tab-item>
        <mt-tab-item id="movie">影视</mt-tab-item>
        <mt-tab-item id="author">作者/音乐人</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item v-for="(tab,index) in tabs"
          :key="index"
          :id="tab"
          v-infinite-scroll="loadMore">
          <div v-if="selected === 'hp'">
            <cell v-for="item in data" :imgUrl="item.hp_img_url" :sub="item.hp_title" :content="item.hp_content" :id="item.id" type="hp" :key="/>
          </div>
          <div v-if="selected === 'reading'">
            <cell v-for="item in data" sub="阅读" :content="item.title" :id="item.id" :type="item.type"/>
          </div>
          <div v-if="selected === 'music'">
            <cell v-for="item in data" :imgUrl="item.cover" :sub="item.title" :content="item.author.user_name" :id="item.id" type="music"/>
          </div>
          <div v-if="selected === 'movie'">
            <cell v-for="item in data" sub="影视" :content="item.title" :id="item.id" tpe="movie"/>
          </div>
          <div v-if="selected === 'author'">
            <cell v-for="item in data" :imgUrl="item.web_url" :sub="item.desc" :content="item.user_name" :id="item.id" type="author"/>
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
      num: 20,
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
  methods: {
    async fetchData(keyword, path) {
      const resp = await this.$http.get(`${this.host}/search/${path}/${keyword}`);
      const result = resp.data;
      if (resp.status === 200 && result.res === 0) {
        switch (path) {
          case 'hp':
            this.hp.push(...result.data);
            this.tempData = this.hp;
            this.data.push(...this.tempData.slice(0, 20));
            break;
          case 'reading':
            this.reading.push(...result.data);
            break;
          case 'music':
            this.music.push(...result.data);
            break;
          case 'movie':
            this.movie.push(...result.data);
            break;
          case 'author':
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
      setTimeout(() => {
        this.data.push(...this.tempData.slice(this.data.length, this.data.length + 10));
        this.loading = false;
      }, 400);
    },
  },
  created() {
    this.fetchData(this.params.key, 'hp');
    this.fetchData(this.params.key, 'reading');
    this.fetchData(this.params.key, 'music');
    this.fetchData(this.params.key, 'movie');
    this.fetchData(this.params.key, 'author');
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
.header {
  display: flex;
  height: 42px;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
  div {
    height: 100%;
    width: 40px;
    display: inline-block
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
}
.no-result-notice {
  height: rem(100);
  width: rem(100);
  background: black;
}
</style>
