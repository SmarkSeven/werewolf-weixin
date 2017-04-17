<template>
  <div class="essay-header">
    <h1 class="essay-title">{{title}}</h1>
    <span class="author-label">{{authorName}}</span>
  </div>
</template>
<script>
export default {
  props: ['title', 'authorName'],
};
</script>
<style lang="scss">
  @import '../styles/rem.scss';
  .essay-header {
    padding: 0 rem(60);
    width: 100%;
    .essay-title {
      padding-bottom: rem(50);
      padding-top: rem(200);
      font-weight: normal;
      font-size: 22px;
      line-height: 1.4;
      background: linear-gradient(black, black) no-repeat;
      background-size: rem(230) rem(15);
      background-position: 0% 100%;
    }
    .author-label {
      display: inline-block;
      height: rem(61);
      margin: rem(70) 0;
      line-height: rem(61);
      font-size: 13.2px;
      font-weight: 500;
    }
  }
</style>
