<template>
  <div class="hp">
    <div class="ph-content" v-html="content"></div>
    <p class="hp_author_introduce">{{hpAuthorIntroduce}}</p>
    <p class="copyright">{{copyright}}</p>
  </div>
</template>
<script>
export default {
  props: ['content', 'hpAuthorIntroduce', 'copyright'],
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.hp {
    padding: 0 rem(60);
    .ph-content {
      img {
        display: inline-block;
        padding-top: rem(70);
        width: 100%;
        height: auto;
      }
    }
    .ph-content {
      font-size: 12.8px;
      line-height: 1.8;
      color: rgb(51, 51, 51);
      font-weight: 600;
    }
    .hp_author_introduce, .copyright {
      color: hsla(0, 90%, 0%, .2);
      font-size: 12px;
      -webkit-transform-origin-x: 0;
      -webkit-transform: scale(0.84);
      font-weight: 600;
    }
    .hp_author_introduce {
      padding-top: rem(40);
      padding-bottom: rem(70);
    }
    .copyright {
      margin-bottom: rem(70);
    }
  }
</style>
