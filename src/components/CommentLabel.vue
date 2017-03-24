<template>
<div>
  <p class="commit-label">评论</p>
</div>
</template>
<script>
export default {};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.commit-label {
    height: rem(75);
    width: 100%;
    padding: 0 rem(63) rem(65) rem(65);
    margin-bottom: rem(50);
    font-size: 12.8px;
    font-weight: 500;
    background: linear-gradient(black,black) no-repeat;
    background-size: rem(210) rem(9);
    background-position: rem(65) 100%;
  }
</style>
