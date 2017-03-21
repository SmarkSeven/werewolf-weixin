<template>
  <div>
    <span @click="goC">A</span>
    <router-view name='c'></router-view>
  </div>
</template>
<script>
export default{
  data() {
    return {};
  },
  methods: {
    goC() {
      this.$router.push('/profile/ablsum');
    },
  },
};
</script>
<style>

</style>
