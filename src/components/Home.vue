<template>
  <div>
    <m-header :title="text" :leftOptions="{showBack:true}" :rightOptions="{showMore:true}"></m-header>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png">
      <h1> </h1>
    </div>
    <group v-for="i in 14" title="cell demo" @click="load">
      <cell title="Vux" value="Call" ></cell>
    </group>
    <button-tab style="margin:20px 40px;">
        <button-tab-item selected>Articles</button-tab-item>
        <button-tab-item @on-item-click="load">Products</button-tab-item>
    </button-tab>
    <tabbar>
      <tabbar-item selected ref="tab-home" :class="{'selected-tabbar':true}">
        <div slot="icon" >
             <x-icon type="android-home" :size="27"></x-icon>
        </div>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item >
        <div slot="icon" >
             <x-icon type="ios-paper" :size="27"></x-icon>
        </div>
        <span slot="label">阅读</span>
      </tabbar-item>
      <tabbar-item  link="/component/demo">
        <div slot="icon" >
             <x-icon type="ios-musical-note" :size="27"></x-icon>
        </div>
        <span slot="label">音乐</span>
      </tabbar-item>
      <tabbar-item >
        <div slot="icon" >
             <x-icon type="ios-film" :size="27"></x-icon>
        </div>
        <span slot="label">影视</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import {
  ButtonTab,
  ButtonTabItem,
  Group,
  Cell,
  Tabbar,
  TabbarItem } from 'vux';
import MHeader from './MHeader.vue';

export default {
  components: {
    Group,
    Cell,
    ButtonTab,
    ButtonTabItem,
    Tabbar,
    TabbarItem,
    MHeader,
  },
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
    };
  },
  methods: {
    load() {
      const self = this;
      self.$vux.loading.show({
        text: 'Loading',
      });
      self.$http.get('/hello')
      .then((resp) => {
        self.$vux.loading.hide();
        console.log(resp.data);
      })
      .catch((error) => {
        self.$vux.loading.hide();
        console.log(error);
      });
    },
  },
};
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label span {
  color: hsla(0, 100%, 10%, .7);
}
.vux-x-icon {
  fill: #999999;
}
.weui-bar__item_on .vux-x-icon {
  fill: hsla(0, 100%, 0%, .7);
}
div.weui-tabbar{
  position: fixed;
}
</style>
