<template>
  <div class="loadmore">
    <div class="wrapper" ref="loadmore-wrapper" :style="{ height: wrapperHeight + 'px' }">
      <loadmore :bottom-method="loadBottom" class="mint-loadmore" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul class="list">
          <li v-for="item in list" class="listitem">{{ item }}</li>
        </ul>

      </loadmore>
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
        if (lastValue < 40) {
          for (let i = 1; i <= 10; i += 1) {
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
    for (let i = 1; i <= 20; i += 1) {
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
      .loadmore {
        text-align: center;
      }
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
    overflow: scroll;
  }
  .mint-loadmore {
    overflow: hidden;
  }
</style>
