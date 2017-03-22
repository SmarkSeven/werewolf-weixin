<template>
<div id='essay-page'>
  <h1>{{title}}</h1>
  <span class="author-label">{{authorName}}</span>
  <div class="ph-content" v-html="content"></div>
  <p class="hp_author_introduce">{{hpAuthorIntroduce}}</p>
  <p class="copyright">{{copyright}}</p>
  <author v-for="(author, index) in authors" :author="author" :key="author.user_id"></author>
</div>
</template>
<script>
import { mapState } from 'vuex';
import Author from './Author';

export default{
  components: {
    Author,
  },
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
    title() {
      return this.essay && this.essay.hp_title;
    },
    authors() {
      return this.essay && this.essay.author;
    },
    content() {
      return this.essay && this.essay.hp_content.replace(/style="height:\d{3}px; width:\d{3}px"/g, '');
    },
    authorName() {
      return this.essay && `文╱${this.essay.hp_author}`;
    },
    copyright() {
      return this.essay && this.essay.copyright;
    },
    hpAuthorIntroduce() {
      return this.essay && `${this.essay.hp_author_introduce}${this.essay.editor_email}`;
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
  padding: rem(70) rem(60);
  h1 {
    padding: 0 0 rem(50) 0;
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
  .ph-content {
    font-size: 12.8px;
    line-height: 1.8;
    color: rgb(51, 51, 51);
    font-weight: 600;
  }
  img {
    display: inline-block;
    padding-top: rem(70);
    width: 100%;
    height: auto;
  }
  .hp_author_introduce, .copyright {
    color: hsla(0, 90%, 0%, .2);
    font-size: 12px;
    -webkit-transform-origin-x: 0;
    -webkit-transform: scale(0.8);
    font-weight: 700;
  }
  .hp_author_introduce {
    padding-top: rem(40);
    padding-bottom: rem(70);
  }
  .copyright {
    padding: 0;
  }
}


</style>
