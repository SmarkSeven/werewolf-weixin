<template>
  <div class="movie-header">
    <swiper  class="movie-swiper" height="200px" v-model="swiperItemIndex" :show-dots='false'>
      <swiper-item v-for="(photo, index) in photos" :key="index">
        <img :src="photo">
      </swiper-item>
    </swiper>
    <div class="photo-indicator">{{numberIndicator}}</div>
    <essay-header class="moive-header-title" :title='title' :authorName="authorName"></essay-header>
  </div>
</template>
<script>
import { Swiper, SwiperItem } from 'vux';
import EssayHeader from './EssayHeader';

export default {
  data() {
    return {
      swiperItemIndex: 0,
    };
  },
  components: {
    Swiper,
    SwiperItem,
    EssayHeader,
  },
  props: {
    photos: {
      type: Array,
      default: [],
    },
    title: String,
    authorName: String,
  },
  computed: {
    numberIndicator() {
      return this.photos && `${this.swiperItemIndex + 1}/${this.photos.length}`;
    },
  },
  created() {
    // 处理图片宽度
    function check(delay) {
      const imgs = document.querySelectorAll('.movie-swiper img');
      const timer = setTimeout(check, delay);
      if (imgs.length > 0) {
        clearTimeout(timer);
      }
      imgs.forEach((img) => {
        if (img.getBoundingClientRect().height < window.innerWidth) {
          // img.classList.add('img');
          img.style.width = window.innerWidth;
          img.style.height = 'auto';
        }
      });
    }
    check(200);
  },
};
</script>
<style lang="scss">
  @import '../styles/rem.scss';
  .movie-header {
    position: relative;
    .movie-swiper {
      padding-top: 46px;
      .vux-swiper-item {
        overflow: hidden;
        background-color: black;
      }
      img {
        width: 100%;
        height: auto;
      }
     }
    .photo-indicator {
      position: absolute;
      right: rem(22);
      top: 226px;
      color: white;
      font-size: 12px;
    }
    .moive-header-title {
      .essay-title {
         background-size: rem(230) rem(10.5);
      }
      h1 {
        padding-top: rem(5);
        font-size: 17.5px;
        font-weight: 400;
        line-height: 1.4;
      }
    }
  }
</style>
