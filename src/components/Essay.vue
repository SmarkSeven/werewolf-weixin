<template>
<div v-html="content" id='essay-page'>
</div>
</template>
<script>
import { mapState } from 'vuex';

export default{
  data() {
    return {
      essay: null,
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
    }),
    content() {
      return this.essay && this.essay.hp_content.replace(/style="height:\d{3}px; width:\d{3}px"/g, '');
    },
  },
  beforeRouteEnter(to, from, next) {
    // 文章内容ID
    const contentId = to.params.id;
    next((vm) => {
      // 获取essay数据
      vm.getEssayData(contentId);
    });
  },
  methods: {
    async getEssayData(contentId) {
      try {
        const resp = await this.$http.get(`${this.host}/essay/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.essay = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
#essay-page {
  padding: 0 rem(60);
  img {
    display: inline-block;
    padding-top: rem(70);
    width: 100%;
    height: auto;
  }
}


</style>
