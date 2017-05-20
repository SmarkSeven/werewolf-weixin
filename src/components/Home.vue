<template>
  <div id="home">
    <header ref="header">
      <flexbox class="tab-box" :gutter="0">
        <flexbox-item :span="selecte === 'tab-left' ? 3/4 : 1/4" class="tab-item"><div class="tab tab-left" :class="{'selected': selecte === 'tab-left'}" @click="clickLeftTab">发布</div></flexbox-item>
        <flexbox-item class="tab-item"><div class="tab tab-lef" :class="{'selected': selecte === 'tab-right'}" @click="clickRightTab">参与</div></flexbox-item>
      </flexbox>
    </header>
    <main ref="main">
      <ul v-if="listData.length !== 0" class="activity-list">
        <li v-for="data in listData" :key="'li' + data.id" @click="onCardlick(data.id)">
          <card :data="data" :key="data.id" :data-id="data.id"></card>
        </li>
      </ul>
      <div v-if="listData.length === 0 && loaded" class="notice">{{noticeText}}</div>
    </main>
    <div class="new-btn" @click="toMakeActivity"></div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { Flexbox, FlexboxItem } from 'vux';
import Card from './ActivityCard';

export default {
  data() {
    return {
      selecte: 'tab-left',
      makedActivitys: [],
      joinedActivitys: [],
      loaded: false,
    }
  },
  components: {
    Flexbox,
    FlexboxItem,
    Card,
  },
  computed: {
    ...mapState({
      currentUser: state => state.app.currentUser,
    }),
    listData() {
      if (this.selecte === 'tab-left') {
        return this.makedActivitys;
      }
      return this.joinedActivitys;
    },
    noticeText() {
      if (this.selecte === 'tab-left') {
        return '快来发起你的第一个活动吧:-D';
      }
      return '你还未参与任何活动:-D';
    },
  },
  methods: {
    clickLeftTab() {
      if (this.selecte === 'tab-right') {
        this.selecte = 'tab-left';
      }
    },
    clickRightTab() {
      if (this.selecte === 'tab-left') {
        this.selecte = 'tab-right';
      }
    },
    onCardlick(acId) {
      this.$router.push({ name: 'activitydetail', params: { id: acId } });
    },
    toMakeActivity() {
      this.$router.push('makeactivity');
    },
    fetchData() {
      // 获取用户发起的活动
      const query = new this.$AV.Query('Activity');
      query.equalTo('owner', this.currentUser);
      query.addDescending('createdAt');
      query.find().then((activitys) => {
        activitys.forEach((activity) => {
          const ac = activity.attributes;
          ac.id = activity.id;
          ac.createdAt = activity.createdAt;
          this.makedActivitys.push(ac);
        });
        this.datas = this.makedActivitys;
        this.$vux.loading.hide();
        this.loaded = true;
      }, (err) => {
        // 异常处理
        this.$vux.loading.hide();
        console.log(err);
      });
      // 获取用户参与的活动
      const mapQuery = new this.$AV.Query('UserActivityMap');
      mapQuery.equalTo('user', this.currentUser);
      query.addDescending('createdAt');
      mapQuery.include('activity');
      mapQuery.find().then((uams) => {
        uams.forEach((uam) => {
          const activity = uam.get('activity');
          const ac = activity.attributes;
          ac.id = activity.id;
          ac.createdAt = activity.createdAt;
          this.joinedActivitys.push(ac);
        });
      }, (err) => {
        // 异常处理
        console.log(err);
      });
    }
  },
  created() {
    this.$vux.loading.show({
      text: '数据加载中'
    });
    const selt = this;
    function timer() {
      if (selt.currentUser) {
        selt.fetchData();
      } else {
        setTimeout(timer, 50);
      }
    }
    timer();
  },
  mounted() {
    const headerHeight = this.$refs.header.getBoundingClientRect().height;
    this.$refs.main.style.paddingTop = `${headerHeight + 15}px`;
    this.$wechat.ready(() => {
      // 注册微信分享按钮
      this.$wechat.onMenuShareAppMessage({
        title: '狼人组局工具',
        desc: '来自于饥饿狼人',
        link: 'http://www.supersheep.cn/',
        imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
      });
      this.$wechat.onMenuShareTimeline({
        title: '狼人组局工具',
        link: 'http://www.supersheep.cn/',
        imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
      });
    });
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color.scss';
#home {
  width: 100%;
  height: 100vh;
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
    .tab-box {
      .tab-item {
        transition: flex .5s ease-out;
      }
      .tab {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        padding: 8px 0;
        color: #464c5b;
        background-color: white;
        transition: background-color 1s ease .3s, color 1.3s ease-out, box-shadow 1.3s;
        &.tab-left {
          color: white;
          background-color: $btn-bgcolor;
        }
        &.selected {
          box-shadow: 0px 1px 2px rgba(0, 0, 0, .5);
        }
      }
    }
  }
  main {
    padding-left: 3vw;
    padding-right: 3vw;
    height: 100%;
    overflow: scroll;
    .activity-list {
      list-style: none;
    }
    .notice {
      line-height: 85vh;
      text-align: center;
      color: $sub-color;
      font-size: 14px;
    }
  }
  .new-btn {
      position: fixed;
      height: 54px;
      width: 54px;
      bottom: 40px;
      right: 20px;
      background: $btn-bgcolor;
      border-radius: 50%;
      border: none;
      outline: none;
      box-shadow: 0 4px 10px rgba(0, 0, 0, .3);
      &:active {
        filter: grayscale(20%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, .6);
      }
      &::before {
        content: "";
        position: absolute;
        top: 25px;
        left: 15px;
        width: 24px;
        height: 4px;
        background-color: #fff;
      }
      &::after {
        content: "";
        position: absolute;
        top: 15px;
        left: 25px;
        width: 4px;
        height: 24px;
        background-color: #fff;
      }
    }
}
</style>
