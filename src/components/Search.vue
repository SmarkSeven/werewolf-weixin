<template>
  <div>
    <question-header ></question-header>
  </div>
</template>

<script>
import QuestionHeader from './QuestionHeader';

export default{
  data() {
    return {
      potos: ['http://image.wufazhuce.com/FjnDyvX2BbN7jMVPMRcg1Cp8udTn', 'http://image.wufazhuce.com/FrHhJdgy0-jhzIQGDj2ISEMiaYhl'],
    };
  },
  components: {
    QuestionHeader,
  },
};
</script>
