<template>
  <div>
    <music-player></music-player>
  </div>
</template>

<script>
import QuestionHeader from './QuestionHeader';
import MusicPlayer from './MusicPlayer';

export default{
  data() {
    return {
      potos: ['http://image.wufazhuce.com/FjnDyvX2BbN7jMVPMRcg1Cp8udTn', 'http://image.wufazhuce.com/FrHhJdgy0-jhzIQGDj2ISEMiaYhl'],
    };
  },
  components: {
    QuestionHeader,
    MusicPlayer,
  },
};
</script>
<style lang="scss">

</style>
