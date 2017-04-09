<template>
  <div class="author-page">
    <div class="header-bar">
      <div class="header" ref='header'>
        <div class="back" @click="back"></div>
        <p class="title" ref='title'>{{author && author.user_name}}</p>
      </div>
      <main>
        <img class="avtor" v-lazy="author && author.web_url"></img>
        <p class="nickname"> {{author && author.user_name}}</p>
        <p class="signature">{{author && author.summary}}</p>
        <button class="fork">关注</button>
        <p class="fork-num">{{author && author.fans_total}}关注</p>
      </main>
    </div>
    <ul v-infinite-scroll="loadMore"
    infinite-scroll-disabled="loading"
    infinite-scroll-distance="10">
      <li v-for="(item,index) in items">
        <card :key="item.id" :cardItem="item"></card>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Card from './Card';

export default {
  components: {
    Card,
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
    author() {
      const item = this.items[0];
      if (item) {
        return item.author;
      }
    },
  },
  methods: {
    scrollHandler(e) {
      const scrollTop = e.target.body.scrollTop;
      let opacity;
      if (scrollTop <= 46) {
        opacity = scrollTop / 46;
      } else {
        opacity = 1;
      }
      this.$refs.header.style.backgroundColor = `rgba(255,255,255,${opacity})`;
      this.$refs.title.style.color = `rgba(0,0,0,${opacity * 0.8})`;
    },
    back() {
      this.$router.go(-1);
    },
    async fetchData(authorId, pageNum) {
      const params = new URLSearchParams(this.basicQueryString);
      params.set('author_id', authorId);
      params.set('page_num', pageNum);
      try {
        const resp = await this.$http.get(`${this.host}/author/works?${params.toString()}`);
        const result = resp.data;
        if (result.res === 0 && result.data.length > 0) {
          this.items.push(...result.data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    loadMore() {
      const lastItem = this.items[this.items.length - 1];
      if (lastItem) {
        this.fetchData(this.$route.params.authorId, lastItem.id);
      }
    },
  },
  mounted() {
    const body = document.querySelector('body');
    body.onscroll = this.scrollHandler;
    // 获取数据
    this.fetchData(this.$route.params.authorId, 0);
  },
  beforeRouteLeave: (to, from, next) => {
    const body = document.querySelector('body');
    body.onscroll = null;
    next();
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
.author-page {
  margin-top: 46px;
  background: #fbfbfb;
  .header-bar {
    background-color: white;
    border-bottom: rem(30) solid #fbfbfb;
  }
  ul {
    list-style: none;
  }
  .header {
    position: fixed;
    top: 0;
    height: 46px;
    background: transparent;
    color: black;
    box-shadow: none;
    .back {
      float: left;
      position: relative;
      height: 46px;
      width: 80px;
      &:after {
        content: '';
        position: absolute;
        top: 16px;
        left: 15px;
        height: 10px;
        width: 10px;
        border: 2px solid transparent;
        border-left-color: gray;
        border-bottom-color: gray;
        transform: rotate(45deg);
      }
      &:before {
        content: '';
        position: absolute;
        top: 22px;
        left: 14px;
        height: 2px;
        width: 20px;
        background: gray;
      }
    }
    .title {
      margin: 0 80px;
      text-align: center;
      line-height: 46px;
      color: transparent;
      font-size: 17px;
    }
  }
  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    p, .fork, .fork-num  {
      text-align: center;
      color: black;
    }
    .avtor {
      height: rem(180);
      width: rem(180);
      border-radius: 50%;
      margin-bottom: rem(40);
    }
    .nickname {
      font-size: 16px;
    }
    .signature {
      font-size: 12px;
      margin-top: rem(40);
      margin-bottom: rem(45);
    }
    .fork {
      font-size: 13px;
      height: rem(95);
      width: rem(225);
      line-height: rem(95);
      border-radius: 4px;
      border: 1px solid black;
    }
    .fork-num {
      font-size: 12px;
      transform: scale(.77);
      color: gray;
      margin-top: rem(15);
      margin-bottom: rem(50);
    }
  }
}


</style>
