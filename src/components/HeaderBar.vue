<template>
  <div class="header">
    <div class="header-left">
      <transition :name="transition">
        <a class="header-back" @click.preventDefault v-show="leftOptions.showBack" @click="onClickBack">{{ leftOptions.backText }}</a>
      </transition>
      <transition :name="transition">
        <div class="left-arrow" @click="onClickBack" v-show="leftOptions.showBack"></div>
      </transition>
      <slot name="left"></slot>
    </div>
    <h1 class="header-title" @click="$emit('on-click-title')">
      <slot>
        <transition :name="transition">
          <span v-show="title">{{title}}</span>
        </transition>
      </slot>
    </h1>
    <div class="header-right">
      <a class="header-more" @click.preventDefault @click="$emit('on-click-more')" v-if="rightOptions.showMore"></a>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    leftOptions: {
      type: Object,
      default() {
        return {
          showBack: false,
          preventGoBack: false,
        };
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    transition: String,
    rightOptions: {
      type: Object,
      default() {
        return {
          showMore: false,
        };
      },
    },
  },
  methods: {
    ...mapMutations(['updateDirection']),
    onClickBack() {
      this.updateDirection({ direction: 'back' });
      if (this.leftOptions.preventGoBack) {
        this.$emit('on-click-back');
      } else if (this.$router) {
        this.$router.back();
      } else {
        window.history.back();
      }
    },
  },
};
</script>
<style lang="scss">
@import '../styles/rem.scss';
.header {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  color: hsla(0, 0%, 10%, .25);
  background-color: white;
  box-shadow: 0 rem(2) rem(1) rem(2) whitesmoke;
  z-index: 99;
}
.header .header-title,.header h1 {
  margin: 0 88px;
  line-height: 46px;
  text-align: center;
  height: 46px;
  font-size: 15px;
  font-weight: 400;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header .header-title > span {
  display: inline-block;
}

.header .header-left,.header .header-right {
  position: absolute;
  display: block;
  font-size: 14px;
  line-height: 21px;
}
.header .header-left a,.header .header-left button,.header .header-right a,.header .header-right button {
  float: left;
  color: black;
}
.header .header-left a:active,.header .header-left button:active,.header .header-right a:active,.header .header-right button:active {
  opacity: .5
}
.header .header-left .header-back {
  padding-left: 16px
}
.header .header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 8px;
  left: 10px;
  &:before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid hsla(0, 0%, 10%, .25);;
  border-width: 1px 0 0 1px;
  transform: rotate(315deg);
  top: 8px;
  left: 7px;
 }
}
.header .header-right {
  position: absolute;
  top: 0;
  right: 10px;
  height: 46px;
  line-height: 46px;
}
.header .header-right a,.header .header-right button {
  margin-left: 8px;
  margin-right: 0
}
.header .header-right .header-more:after {
  content: "\2022\0020\2022\0020\2022\0020";
  font-size: 16px;
}
.header-fade-in-right-enter-active {
  animation: fadeinR .5s;
}
.header-fade-in-left-enter-active {
  animation: fadeinL .5s;
}
@keyframes fadeinR {
  0% {
    opacity: 0;
    transform: translateX(150px);
  }
  100% {
    opacity:1;
    transform:translateX(0);
  }
}
@keyframes fadeinL{
  0% {
    opacity: 0;
    transform: translateX(-150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
