<template>
 <div id="video-page">
  <video id="video" controls="" preload="none" poster="http://media.w3.org/2010/05/sintel/poster.png" ref="video">
    <source id="mp4" src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4">
    <p>Your user agent does not support the HTML5 Video element.</p>
  </video>
 </div>
</template>
<script>
export default {
  props: ['scr'],
  beforeCreate() {
    console.log('video');
  },
  methods: {
    play() {
      this.video.paly();
    },
    pause() {
      this.video.pause();
    },
  },
};
</script>
<style lang="scss">
#video-page {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: black;
  z-index: 9999;
  #video {
    width: 100%;
  }
}
</style>
