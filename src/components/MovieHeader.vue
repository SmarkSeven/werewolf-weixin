<template>
  <div class="movie-header">
    <swiper  class="movie-swiper" height="220px" v-model="swiperItemIndex" :show-dots='false'>
      <swiper-item  v-for="(photo, index) in photos" :key="index">
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
    // swiperItemIndex() {
    //   // if (this.photos) {
    //   //   return this.photos.length - 1;
    //   // }
    //   return 0;
    // },
    numberIndicator() {
      return this.photos && `${this.swiperItemIndex + 1}/${this.photos.length}`;
    },
  },
};
</script>
<style lang="scss">
  @import '../styles/rem.scss';
  .movie-header {
    position: relative;
    .movie-swiper {
      padding-top: 46px;
      img {
        position: relative;
        max-height: 220px;
      }
     }
    .photo-indicator {
      position: absolute;
      right: rem(22);
      top: 246px;
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
