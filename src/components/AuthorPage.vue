<template>
  <div id="author-page">
    <header-bar id="author-page-header" :leftOptions="leftOptions">
      <span id="author-page-title">{{author && author.user_name}}</span>
    </header-bar>
    <div class="author-header">
      <main>
        <img class="avtor" v-lazy="author && author.web_url"></img>
        <p class="nickname"> {{author && author.user_name}}</p>
        <p class="signature">{{author && author.summary}}</p>
        <button class="follow" :class="{'followed': isFollowed}" @click="follow">{{followBtnText}}</button>
        <p class="follow-num">{{author && author.fans_total}}关注</p>
      </main>
    </div>
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10"
    >
      <li v-for="(item,index) in items">
        <card :key="item.id" :cardItem="item"></card>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Card from './Card';
import HeaderBar from './HeaderBar';

export default {
  components: {
    Card,
    HeaderBar,
  },
  data() {
    return {
      items: [],
      leftOptions: {
        showBack: true,
      },
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      followAuthors: state => state.storage.followAuthors,
    }),
    author() {
      const item = this.items[0];
      if (item) {
        return item.author;
      }
    },
    isFollowed() {
      if (this.author) {
        const index = this.followAuthors.indexOf(this.author.user_id);
        if (index > -1) {
          return true;
        }
      }
      return false;
    },
    followBtnText() {
      if (this.isFollowed) {
        return '已关注';
      }
      return '关注';
    },
  },
  methods: {
    ...mapActions(['followAuthor']),
    scrollHandler(e) {
      const header = document.querySelector('#author-page-header');
      const title = document.querySelector('#author-page-title');
      let boxShadow;
      const scrollTop = e.target.scrollTop;
      let opacity;
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
    follow() {
      this.author.fans_total = Number(this.author.fans_total);
      if (this.isFollowed) {
        this.author.fans_total -= 1;
      } else {
        this.author.fans_total += 1;
      }
      this.followAuthor({
        followUserId: this.author.user_id,
      });
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
    const el = document.querySelector('#author-page');
    el.addEventListener('scroll', this.scrollHandler);
    // 获取数据
    this.fetchData(this.$route.params.authorId, 0);
  },
  beforeRouteLeave: (to, from, next) => {
    const el = document.querySelector('#author-page');
    el.removeEventListener('scroll', this.scrollHandler);
    next();
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#author-page {
  height: 100%;
  overflow: scroll;
  background: #fbfbfb;
  .header {
    background-color: transparent;
    box-shadow: none;
  }
  .title {
    color: transparent;
  }
  .author-header {
    padding-top: 46px;
    background-color:white;
    margin-bottom: rem(30);
  }
  ul {
    list-style: none;
  }
  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    p, .follow, .follow-num  {
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
    .follow {
      font-size: 13px;
      height: rem(95);
      width: rem(225);
      line-height: rem(95);
      border-radius: 4px;
      border: 1px solid black;
      background-color: white;
    }
    .followed {
      color: white;
      background-color: #555;
    }
    .follow-num {
      font-size: 12px;
      transform: scale(.77);
      color: gray;
      margin-top: rem(15);
      margin-bottom: rem(50);
    }
  }
}


</style>
