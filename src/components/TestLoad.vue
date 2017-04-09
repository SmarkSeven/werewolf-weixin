<template>
  <div class="loadmore">
    <div class="wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
      <div :bottom-method="loadBottom" class="mint-loadmore" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul class="list">
          <li v-for="item in list" class="listitem">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Loadmore, Spinner } from 'mint-ui';

export default {
  components: {
    Loadmore,
    Spinner,
  },
  data() {
    return {
      list: [],
      allLoaded: false,
      bottomStatus: '',
      wrapperHeight: 0,
    };
  },
  methods: {
    loadBottom() {
      setTimeout(() => {
        const lastValue = this.list[this.list.length - 1];
        if (lastValue < 400) {
          for (let i = 1; i <= 50; i += 1) {
            this.list.push(lastValue + i);
          }
        } else {
          this.allLoaded = true;
        }
        this.$refs.loadmore.onBottomLoaded();
      }, 1500);
    },
    handleBottomChange() {
      console.log('状态改变');
    },
  },
  created() {
    for (let i = 1; i <= 600; i += 1) {
      this.list.push(i);
    }
  },
  mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
  },
};
</script>
<style lang="scss">
  .listitem {
        height: 50px;
        line-height: 50px;
        border-bottom: solid 1px #eee;
        text-align: center;
        &:first-child {
          border-top: solid 1px #eee;
        }
      }
      // .loadmore {
      //   text-align: center;
      //   background-color: white;
      // }
       .desc {
        text-align: center;
        color: #666;
        padding-bottom: 5px;
        &:last-of-type {
          border-bottom: solid 1px #eee;
        }
      }
      .mint-spinner {
        display: inline-block;
        vertical-align: middle;
      }
      span {
      display: inline-block;
      transition: .2s linear;
      vertical-align: middle;}
      .is-rotate {
        transform: rotate(180deg);
      }
  .wrapper {
    overflow: auto;
    background-color: black;
  }
  .mint-loadmore {
    // overflow: hidden;
    text-align: center;
    -webkit-overflow-scrolling: touch;
      // -webkit-overflow-scrolling: auto;
  }
  ul {
    height: 100%;
    background-color: white;
  }
</style>
