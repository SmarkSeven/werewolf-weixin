<template>
<div class="related" @click="onClick">
  <div class="related-content">
    <div class="related-tag">{{tag}}</div>
    <div class="related-title">{{related.hp_title}}</div>
  </div>
  <p class="related-author">{{author}}</p>
</div>
</template>
<script>
export default {
  props: {
    tag: String,
    related: Object,
  },
  computed: {
    author() {
      return `文╱${this.related.author[0].user_name}`;
    },
  },
  methods: {
    onClick() {
      this.$emit('on-clicke-item', this.related.content_id);
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.related {
  padding:0 rem(65);
  .related-content {
    div {
      display: inline-block;
      font-size: 12.4px;
      line-height: 1.1;
      font-weight: 500;
    }
    .related-tag {
      width: rem(100);
      max-height: rem(50);
      color: hsla(0, 90%, 0%, .2);
    }
    .related-title {
      max-width: rem(700);
    }
  }
  .related-author {
    margin-left: rem(108);
    margin-bottom: rem(48);
    font-size: 12px;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.84);
    color: hsla(0, 90%, 0%, .35);
  }
}
</style>
