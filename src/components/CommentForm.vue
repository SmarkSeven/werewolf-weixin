<template>
  <div id="comment-form" @click.self="cancel">
    <main>
      <button class="submit" @click.stop="submit">{{operation === 'publish' ? '发表' : '回复'}}</button>
       <p class="user-name">{{username}}</p>
       <p class="comment-content">{{content}}</p>
       <textarea
        class="input"
        :class="{'large-input': operation === 'publish'}"
        @keyup="onChange"
        @keyup.13="submit"
        maxlength="1000"
        ref="input"
        placeholder="在这里写下你想说的"
       >
       </textarea>
      <div class="word-counter">{{wordNum}}</div>
    </main>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { mapState } from 'vuex';

export default{
  components: {
    Toast,
  },
  props: ['operation', 'cmtid', 'type', 'username', 'content', 'itemid'],
  data() {
    return {
      wordNum: 1000,
    };
  },
  computed: {
    ...mapState({
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      jwt: state => state.one.jwt,
      userId: state => state.one.userId,
    }),
  },
  methods: {
    onChange() {
      this.wordNum = 1000 - this.$refs.input.value.length;
    },
    cancel() {
      this.$emit('cancel');
    },
    async submit() {
      const input = this.$refs.input.value.trim();
      if (input.length === 0) {
        Toast({
          message: '写点什么吧:-D',
          position: 'center',
          duration: 1400,
        });
      } else {
        this.$emit('cancel');
        const form = {
          itemid: this.itemid,
          cmtid: this.cmtid,
          jwt: this.jwt,
          type: this.type,
          content: input,
        };
        try {
          const resp = await this.$http.post(`/comment/add?${this.basicQueryString}`, form);
          const result = resp.data;
          if (result.res === 0) {
            Toast({
              message: `${this.operation === 'publish' ? '发表' : '回复'}成功:-D`,
              position: 'bottom',
              duration: 1400,
            });
          } else {
            Toast({
              message: result.msg,
              position: 'bottom',
              duration: 1400,
            });
          }
        } catch (err) {
          Toast({
            message: '服繁忙器',
            position: 'bottom',
            duration: 1400,
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/rem.scss';
#comment-form {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(top, rgba(0,0,0,.02), rgba(0,0,0,.7));
  z-index: 9999;
  main {
    position: absolute;
    padding: 0 rem(30);
    padding-top: rem(120);
    bottom: rem(35);
    left: rem(30);
    width: rem(1020);
    color: #ababab;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 1px #ababab;
  }
  .submit {
    position: absolute;
    top: rem(25);
    right: rem(25);
    padding: rem(15) rem(40);
    border: none;
    border-radius: 6px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    line-height: rem(40);
    transform: scale(.95);
    background-color: #555;
    outline: none;
  }
  p {
    padding: 0 rem(20);
    padding-bottom: rem(7);
    width: 100%;
    font-size: 12.9px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  textarea {
    margin-top: rem(5);
    padding: rem(32) rem(25);
    height: rem(350);
    width: 100%;
    color: black;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    font-size: 12.2px;
    outline: none;
    resize : none;
    &::-webkit-input-placeholder {
      color: #b2b2b2;
    }
  }
  .large-input {
    margin-top: 0;
    height: rem(480);
  }
  .word-counter {
    position: absolute;
    font-size: 12px;
    transform: scale(.8);
    bottom: rem(20);
    right: rem(45);
  }
}
</style>
