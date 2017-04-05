<template>
  <div>
    <test-load></test-load>
  </div>
</template>

<script>
import TestLoad from './TestLoad';

export default{
  data() {
    return {
      potos: ['http://image.wufazhuce.com/FjnDyvX2BbN7jMVPMRcg1Cp8udTn', 'http://image.wufazhuce.com/FrHhJdgy0-jhzIQGDj2ISEMiaYhl'],
    };
  },
  components: {
    TestLoad,
  },
};
</script>
<style lang="scss">

</style>
