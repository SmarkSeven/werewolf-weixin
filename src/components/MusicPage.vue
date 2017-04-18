<template>
  <div id="music-page" v-show="show">
    <header-bar :leftOptions="leftOptions" title="一个音乐"></header-bar>
    <music-header :data="headerData" @on-click-play="play"></music-header>
    <hp :content="content" :hpAuthorIntroduce="chargeEdt" :copyright="copyright"></hp>
    <author v-for="(author, index) in authors" :author="author" @on-click-item="toAuthor" :key="author.user_id"></author>
    <related-label v-if="related.length > 0"></related-label>
    <related v-for="(item,index) in related" :related="item" tag="音乐" @on-clicke-item="toRelated" :key="item.id"></related>
    <comment-label></comment-label>
    <comment-list :contentId="itemid" type="music" @clickComment="replay"></comment-list>
      <transition name="one-fade-in">
        <comment-form
          v-if="showCommentForm"
          :operation="commentOperation"
          :cmtid="cmtid"
          :itemid="itemid"
          :username="commentUsername"
          :content="commentContent"
          type="music"
          @cancel="showCommentForm = false"
        />
      </transition>
    <footer-bar :data="footerData" @comment="publish" wrapper="music-page"></footer-bar>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Author from './Author';
import CommentLabel from './CommentLabel';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import RelatedLabel from './RelatedLabel';
import Related from './Related';
import FooterBar from './FooterBar';
import HeaderBar from './HeaderBar';
import MusicHeader from './MusicHeader';
import Hp from './Hp';

export default{
  components: {
    HeaderBar,
    MusicHeader,
    Hp,
    Author,
    CommentLabel,
    CommentForm,
    CommentList,
    RelatedLabel,
    Related,
    FooterBar,
  },
  data() {
    return {
      detail: null,
      music: null,
      authors: null,
      comments: [],
      related: [],
      show: false,
      leftOptions: {
        showBack: true,
      },
      update: {
        praisenum: 0,
        sharenum: 0,
        commentnum: 0,
      },
      showCommentForm: false,
      commentOperation: 'publish',
      cmtid: 0,
      commentUsername: null,
      commentContent: null,
    };
  },
  computed: {
    ...mapState({
      path: state => state.route.path,
      params: state => state.route.params,
      itemid: state => state.route.params.id,
      host: state => state.one.host,
      basicQueryString: state => state.one.basicQueryString,
      // musicId: state => state.music.musicId,
      // author: state => state.music.author,
      playId: state => state.music.playId,
      playState: state => state.music.playState,
      // audioAuthor: state => state.music.audioAuthor,
      // musicName: state => state.music.musicName,
    }),
    title() {
      return this.detail && this.detail.title;
    },
    cover() {
      return this.detail && this.detail.cover;
    },
    album() {
      return this.detail && this.detail.album;
    },
    singer() {
      let regexp = /(主播：).*(?=\r\n策划)/;
      if (this.params.musicId === 'one') {
        return this.detail && this.detail.info.match(regexp, '')[0].replace('演唱者：', '');
      }
      regexp = /(演唱者：).*(?=\r\n作词)/;
      return this.detail && this.detail.info.match(regexp, '')[0].replace('演唱者：', '');
    },
    authorName() {
      if (this.authors && this.authors.length) {
        return `文╱${this.authors[0].user_name}`;
      }
    },
    content() {
      if (this.params.musicId === 'one') {
        return this.detail && this.detail.story;
      }
      return this.music && this.music.story.replace(/style="height:\d+px; width:\d+px"/g, '');
    },
    // authorName() {
    //   return `文╱${this.music.hp_author}`;
    // },
    chargeEdt() {
      return this.detail && this.detail.charge_edt;
    },
    copyright() {
      return this.detail && this.detail.copyright; // '责任编辑：十三妹 shisanmei@wufazhuce.com';
    },
    // 当前音乐是否正在播放
    isPlaying() {
      return String(this.detail.music_id) === this.playId && this.playState === 'playing';
    },
    headerData() {
      return this.detail && {
        cover: this.detail.cover,
        playing: this.isPlaying,
        musicTitle: this.detail.title,
        storyTitle: this.detail.story_title,
        author: this.authorName,
        album: this.album,
        singer: this.singer,
      };
    },
    footerData() {
      return this.detail && this.update && {
        contentId: this.detail.id,
        category: 4,
        praisenum: this.update.praisenum,
        commentnum: this.update.commentnum,
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 获取music数据
      vm.getData(vm.params.id, vm.params.musicId);
    });
  },
  beforeRouteUpdate(to, from, next) {
    const contentId = to.params.musicId;
    const musicId = to.params.id;
    this.getData(contentId, musicId);
    next();
  },
  methods: {
    ...mapMutations([
      'updatePlayState',
      'updatePlayList',
      'updatePlayIndex',
      'updatePlayId']),
    ...mapActions(['fetchAudioFromXiami']),
    getData(contentId, musicId) {
      if (musicId !== 'one') {
        this.getMusicData(musicId);
      }
      this.getMusicDetail(contentId);
      this.getCommentData(contentId);
      this.getRelated(contentId);
      this.getUpdate(contentId);
    },
    async getMusicData(musicId) {
      try {
        const resp = await this.$http.get(`/xiami/${musicId}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.music = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getMusicDetail(id) {
      try {
        const resp = await this.$http.get(`/music/detail/${id}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.detail = result.data;
          this.authors = this.detail.author_list;
          const page = document.querySelector('#music-page');
          page.scrollTop = '0';
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCommentData(contentId) {
      try {
        const resp = await this.$http.get(`/comment/praiseandtime/music/${contentId}/0?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.comments = result.data.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getRelated(contentId) {
      try {
        const resp = await this.$http.get(`/related/music/${contentId}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.related = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getUpdate(contentId) {
      const dateString = new Date().toLocaleString().replace(/[\u4e00-\u9fa5]/g, '').replace(/\//g, '-');
      try {
        const resp = await this.$http.get(`/music/update/${contentId}/${dateString}?${this.basicQueryString}`);
        const result = resp.data;
        if (result.res === 0 && result.data) {
          this.update = result.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    play() {
      // 正在播放当前音乐则暂停
      if (this.detail.music_id === this.playId && this.playState === 'playing') {
        this.updatePlayState({ playState: 'pause' });
        return;
      }
      // 当前音乐处于暂停状态则播放
      if (this.detail.music_id === this.playId && this.playState === 'pause') {
        this.updatePlayState({ playState: 'playing' });
        return;
      }
      const playload = {
        musicId: String(this.detail.music_id),
        singer: this.singer,
        musicTitle: this.title,
        audioUrl: this.detail.music_id,
      };
      // 当前音乐不处于就绪状态
      if (this.params.musicId === 'one') {
        this.updatePlayList({ playList: [playload] });
        this.updatePlayIndex({ playIndex: 0 });
      } else {
        // 音频来多米音乐
        this.fetchAudioFromXiami(playload);
      }
    },
    toAuthor() {
    },
    toRelated(relatedId, musicId) {
      // 跳转推荐页面
      this.$router.push({ path: `/music/${relatedId}/${musicId}` });
    },
    replay(comment) {
      this.showCommentForm = true;
      this.commentOperation = 'replay';
      this.cmtid = comment.id;
      this.commentUsername = comment.username;
      this.commentContent = comment.content;
    },
    publish() {
      this.showCommentForm = true;
      this.commentOperation = 'publish';
      this.cmtid = 0;
      this.commentUsername = null;
      this.commentContent = null;
    },
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.show = true;
    }, 200);
  },
};
</script>
<style lang="scss">
 @import '../styles/rem.scss';
#music-page {
    padding-bottom: rem(135);
    height: 100%;
    width: 100%;
    overflow: scroll;
}
</style>
