 <template>
  <div id="question-header">
    <h1 class="question-title">{{title}}</h1>
    <p class="question-content">{{content}}</p>
    <div class="question-asker">——{{asker}}</div>
    <h2 class="question-answerer">{{answerer}}</h2>
  </div>
 </template>
<script>
  export default{
    props: ['title', 'content', 'asker', 'answerer'],
  };
</script>
<style lang="scss">
@import '../styles/rem.scss';
  #question-header {
    padding: 0 rem(60);
    padding-top: 46px;
    .question-title {
      padding-top: rem(60);
      padding-bottom: rem(40);
      font-size: 22px;
      font-weight: 500;
    }
    .question-content, .question-asker {
      font-size: 12.7px;
      line-height: 1.98;
      font-weight: 600;
    }
    .question-asker {
      position: relative;
      padding-top: rem(25);
      padding-bottom: rem(70);
      border-bottom: rem(6) solid #f0f0f0;
      &:after {
        content: '';
        position: absolute;
        bottom: rem(-28);
        left: 50%;
        margin-left: rem(-22);
        height: rem(18);
        width: rem(18);
        background-color: #f0f0f0;
        border: rem(16) solid  white;
        border-radius: 50%;
      }
    }
    .question-answerer {
      margin-top: rem(95);
      margin-bottom: rem(80);
      font-size: 18px;
      font-weight: 600;
    }
  }
</style>
