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
        return 'H';
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
    onClickBack() {
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
  padding: 3px 0;
  box-sizing: border-box;
  background-color: floralwhite;
  width: 100%;
  z-index: 99;
}
.header .header-title,.header h1 {
  margin: 0 88px;
  line-height: 40px;
  text-align: center;
  height: 40px;
  font-size: 18px;
  font-weight: 400;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999999;
}
.header .header-title > span {
  display: inline-block;
}

.header .header-left,.header .header-right {
  position: absolute;
  top: 14px;
  display: block;
  font-size: 14px;
  line-height: 21px;
  color: #999999;
}
.header .header-left a,.header .header-left button,.header .header-right a,.header .header-right button {
  float: left;
  margin-right: 16px;
  color: black;
}
.header .header-left a:active,.header .header-left button:active,.header .header-right a:active,.header .header-right button:active {
  opacity: .5
}
.header .header-left {
  left: 12px
}
.header .header-left .header-back {
  padding-left: 16px
}
.header .header-left .left-arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -5px;
  left: -5px;
  &:before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid black;
  border-width: 1px 0 0 1px;
  transform: rotate(315deg);
  top: 8px;
  left: 7px;
 }
}
.header .header-right {
  right: 10px
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
