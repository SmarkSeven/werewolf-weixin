<template>
  <transition name="slide">
    <div class="fixed">
      <div class="notification" v-if="show" :style="setStyle">
        <div class="delete" v-if="!options.autoClose" @click="close()"></div>
          <div class="content">{{ options.content }}</div>
      </div>
      <div
        class="countdown"
        v-if="show && options.autoClose && options.countdownBar"
        :style="setTime"
        :class="barControl"
      ></div>
      </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      timers: [],
      barControl: '',
    };
  },
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    setStyle() {
      return {
        color: this.options.textColor || '#fff',
        background: this.options.backgroundColor || '#21e7b6',
      };
    },
    setTime() {
      return {
        transition: `all ${(this.options.showTime / 1000) || 3}s linear`,
        background: this.options.barColor || '#03D6D2',
      };
    },
  },
  methods: {
    countdown() {
      if (this.options.autoClose) {
        if (this.options.countdownBar) {
          setTimeout(() => {
            this.barControl = 'count-leave';
          }, 10);
        }
        const t = setTimeout(() => {
          this.close();
        }, this.options.showTime || 3000);
        this.timers.push(t);
      }
    },
    close() {
      this.$emit('close');
    },
  },
  watch: {
    options() {
      this.barControl = '';
      this.timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
      this.timers = [];
      this.countdown();
    },
  },
};
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active {
    transition: all .3s ease;
    transform: translateZ(0);
  }
  .slide-enter,
  .slide-leave {
    transform: translate3d(0, -100%, 0);
  }
  .delete {
    -moz-appearance: none;
    -webkit-appearance: none;
    background: rgba(51, 51, 51, .2);
    cursor: pointer;
    display: inline-block;
    height: 24px;
    position: relative;
    vertical-align: top;
    width: 24px;
    float: right;
  }
  .delete:after,
  .delete:before {
    background: #fff;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    margin-left: -25%;
    margin-top: -1px;
    position: absolute;
    top: 50%;
    width: 50%;
  }
  .delete:before {
    transform: rotate(45deg);
  }
  .delete:after {
    transform: rotate(-45deg);
  }
  .delete:hover {
    background: rgba(51, 51, 51, .5);
  }
  .fixed {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
  }
  .notification {
    width: 100%;

  }
  .notification .content {
    padding: .75em 2em;
  }
  .countdown {
    width: 100%;
    height: 4px;
    background: #000;
    z-index: 3;
    position: fixed;
    top: 0;
    left: 0;
    transform: translateZ(0);
  }
  .count-leave {
    transform: translate3d(-100%, 0, 0);
  }
</style>
