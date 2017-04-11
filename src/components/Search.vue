<template>
  <div id="search-page">
    <h2 class="title">一个搜索</h2>
    <p class="slogan">搜索引擎就是把字典塞到硅片里</p>
    <input type="text" class="input" ref="input" @keyup.13="search">
  </div>
</template>

<script>

export default{
  data() {
    return {
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
  text-align: center;
  padding: rem(190) rem(90);
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
