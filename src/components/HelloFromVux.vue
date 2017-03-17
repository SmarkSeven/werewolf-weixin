<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png">
      <h1> </h1>
    </div>
    <group title="cell demo" @click="load">
      <cell title="Vux" value="Call" ></cell>
    </group>
    <button-tab style="margin:20px 40px;">
        <button-tab-item selected>Articles</button-tab-item>
        <button-tab-item @on-item-click="load">Products</button-tab-item>
     </button-tab>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem, Group, Cell } from 'vux';

export default {
  components: {
    Group,
    Cell,
    ButtonTab,
    ButtonTabItem,
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
</style>
