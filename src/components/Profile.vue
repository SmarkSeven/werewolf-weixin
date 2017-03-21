<template>
  <div class="profile">
    <div class="left">
      <button @click="goRight">right</button>
    </div>
    <div class="right">
      <router-view class="right-a"></router-view>
    </div>
  </div>
</template>
<script>
export default{
  data() {
    return {};
  },
  methods: {
    goRight() {
      console.log('goRight');
      this.$router.push('/profile/ablsum');
    },
  },
};
</script>
<style lang="scss">
.profile {
  display: flex;
  height: 100%;
  width: 100%;
  .left {
    background: black;
    width: 100%;
    height: 600px;
    text-align: center;
    button {
      display: inline-block;
      margin-top: 100%;
      padding: .5em .8em;
      background-color: black;
      border: 1px solid white;
      color: white;
    }
  }
  .right {
    background: lightseagreen;
    height: 600px;
    width: 100%;
    .right-a, .right-b {
      height: 50%;
      width: 100%;
      text-align: center;
      color: white;
      font-size: 59px;
    }
  }

}
</style>
