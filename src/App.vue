<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app',
  computed: {
    ...mapState({
      direction: state => state.app.direction,
    }),
    transitionName() {
      if (this.direction === 'begin') {
        return;
      }
      if (this.direction === 'forward') {
        return 'pop-in';
      }
      return 'pop-out';
    }
  }
};
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html, body, #app {
  height: 100%;
}
body {
  background-color: #f5f5f5;
}
.pop-out-enter-active,
.pop-out-leave-active,
.pop-in-enter-active,
.pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
