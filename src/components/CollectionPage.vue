<template>
  <div id="collection-page">
    <header-bar :leftOptions="leftOptions" title="一个阅读"></header-bar>
    <main ref="main">
      <mt-navbar v-if="path === '/collection/reading'" v-model="selected" :fixed="true" @input="change">
        <mt-tab-item id="essay">阅读</mt-tab-item>
        <mt-tab-item id="serail">连载</mt-tab-item>
        <mt-tab-item id="question">问答</mt-tab-item>
      </mt-navbar>
      <transition-group name="list" tag="ul" >
        <li v-for="item in items" :key="item">
          <cell v-if="type === 'author'"
            :imgUrl="item.web_url"
            :sub="item.summary"
            :content="item.user_name"
            :id="item.user_id"
            :type="type"
            :key="item.user_id"
          ></cell>
          <cell v-else-if="type === 'music'"
            :imgUrl='item.cover'
            :sub='item.title'
            :content="item.author.user_name"
            :id="item.id"
            :musicId="item.music_id"
            :platform="item.platform"
            :type="type"
            :key="item.id"
          ></cell>
          <cell v-else-if="type === 'movie'"
            sub='影视'
            :content="item.title"
            :id="item.id"
            :type="type"
            :key="item.id"
          ></cell>
          <cell v-else-if="type === 'essay'"
            sub="阅读"
            :content="item.hp_title"
            :id="item.content_id"
            :type="type"
            :key="item.content_id"
          ></cell>
          <cell v-else-if="type === 'question'"
            sub='问答'
            :content="item.question_title"
            :id="item.question_id"
            :type="type"
            :key="item.question_id"
          ></cell>
        </li>
      </transition-group>
    </main>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { Navbar, TabItem } from 'mint-ui';
import HeaderBar from './HeaderBar';
import Cell from './SearchResultCell';

export default{
  components: {
    HeaderBar,
    [Navbar.name]: Navbar,
    [TabItem.name]: TabItem,
    Cell,
  },
  data() {
    return {
      leftOptions: {
        showBack: true,
      },
      selected: 'essay',
      items: [],
      essay: [],
      serail: [],
      question: [],
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      jwt: state => state.one.jwt,
    }),
    type() {
      if (this.path === '/follow') {
        return 'author';
      }
      if (this.path === '/collection/reading') {
        if (this.selected === 'essay') {
          return 'essay';
        }
        if (this.selected === 'question') {
          return 'question';
        }
        return 'serail';
      }
      if (this.path === '/collection/movie') {
        return 'movie';
      }
      if (this.path === '/collection/music') {
        return 'music';
      }
    },
  },
  methods: {
    change() {
      this.items.splice(0, this.items.length);
      if (this.selected === 'essay') {
        this.items.push(...this.essay);
      } else if (this.selected === 'question') {
        this.items.push(...this.question);
      } else {
        this.items.push(...this.serail);
      }
    },
    async fetchFollow() {
      const params = new URLSearchParams(this.basicQueryString);
      params.set('uid', 5105554);
      params.set('last_id', 0);
      const resp = await this.$http.get(`${this.host}/user/follow_list/?${params.toString()}`);
      const result = resp.data;
      if (resp.status === 200 && result.res === 0) {
        this.items = result.data;
      }
    },
    async fetchCollection(type) {
      const params = new URLSearchParams(this.basicQueryString);
      params.set('jwt', this.jwt);
      const resp = await this.$http.get(`${this.host}/collection/more/${type}/0?${params.toString()}`);
      const result = resp.data;
      if (resp.status === 200 && result.res === 0) {
        if (type === 1) {
          this.essay = result.data;
          this.items.push(...result.data);
        } else if (type === 2) {
          this.question = result.data;
        } else {
          this.items = result.data;
        }
      }
    },
  },
  mounted() {
    if (this.path === '/collection/reading') {
      this.$refs.main.style.paddingTop = '86px';
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      if (vm.type === 'author') {
        vm.fetchFollow();
      } else if (vm.type === 'music') {
        vm.fetchCollection(4);
      } else if (vm.type === 'movie') {
        vm.fetchCollection(5);
      } else {
        vm.fetchCollection(1);
        vm.fetchCollection(2);
      }
    });
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
@import '../styles/transition.css';
#collection-page {
  height: 100%;
  width: 100%;
  main {
    padding: 0 rem(90);
    padding-top: 46px;
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
    ul {
      list-style: none;
    }
  }
}
</style>
