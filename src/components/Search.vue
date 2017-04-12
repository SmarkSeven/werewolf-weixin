<template>
  <div id="search-page">
    <header-bar :leftOptions="leftOptions"></header-bar>
    <main>
      <h2 class="title">一个搜索</h2>
      <p class="slogan">搜索引擎就是把字典塞到硅片里</p>
      <input type="text" class="input" ref="input" @keyup.13="search">
    </main>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar';

export default{
  components: {
    HeaderBar,
  },
  data() {
    return {
      leftOptions: {
        showBack: true,
      },
    };
  },
  methods: {
    search(event) {
      const searchString = event.target.value;
      this.$router.push({ path: `/search/${searchString}` });
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#search-page {
  height: 100%;
  width: 100%;
  main {
    padding: rem(250) rem(90);
    width: 100%;
    text-align: center;
  }
  .title {
    font-size: 21px;
    font-weight: 400;
    color: rgba(0,0,0,.68);
  }
  .slogan {
    padding-top: rem(5);
    font-size: 12px;
    transform: scale(0.85);
    color: rgba(0,0,0,.60);
  }
  .input {
    position: relative;
    width: 100%;
    padding: rem(20) rem(50);
    margin-top: rem(440);
    text-align: center;
    font-size: 16px;
    color: rgba(0,0,0,.5);
    outline: none;
    border: none;
    border-bottom: 2px solid black;
  }
}
</style>
