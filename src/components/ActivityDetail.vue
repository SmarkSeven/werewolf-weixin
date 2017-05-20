<template>
  <div id="activity-detail">
    <section class="activity-box">
      <img class="activity-cover" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493988139353&di=7a07f8b1c46d54edd051220909e5f169&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2Fa780b5ca875ae7d8b1729aa784c6b498c3eb7d0b.jpg"  alt="">
      <div class="sponsor">
        <img class="sponsor-avtor" :src="ownerHeadimgurl" alt="">
        <span class="sponsor-name">{{ownername}} 发起</span>
      </div>
      <div class="activity-information">
        <div>
          <span class="label">活动名称</span>
          <span class="content">{{title}}</span>
        </div>
        <div>
          <span class="label">时间</span>
          <span class="content">{{datetime}}</span>
        </div>
        <div>
          <span class="label">地址</span>
          <span class="content">{{address}}</span>
        </div>
      </div>
    </section>
    <section v-if="information" class="extra-information-box">
      <span class="extra-information-label">活动介绍</span>
      <div class="extra-information" v-html="information"></div>
    </section>
    <section class="participator-section">
      <span class="participator-list-label">参与者</span>
      <ul v-if="participators.length !== 0">
        <li v-for="user in participators">
          <div class="participator">
            <img  class="participator-avtor" :src="user.attributes.headimgurl" alt="avtor">
            <span class="participator-username">{{user.attributes.username}}</span>
            <span class="participator-jointime">{{user.jointime}}</span>
          </div>
        </li>
      </ul>
      <div v-if="participators.length === 0" class="notice">快来报名参与吧:-D</div>
    </section>
    <footer class="join-btn" @click="join">{{btnText}}</footer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import dateFormat from '../js/date.js';

export default {
  components: {
  },
  data() {
    return {
      activity: null,
      owner: null,
      participators: [],
      ac: null,
      uamId: null,
      participatorIndex: -1,
    };
  },
  computed: {
    ...mapState({
      params: state => state.route.params,
      currentUser: state => state.app.currentUser,
    }),
    ownername() {
      return this.owner && this.owner.username;
    },
    ownerHeadimgurl() {
      return this.owner && this.owner.headimgurl;
    },
    title() {
      if (this.activity) {
        return this.activity.title;
      }
      return '-';
    },
    datetime() {
      return this.activity && `${this.activity.date} ${this.activity.time}`;
    },
    address() {
      return this.activity && this.activity.address;
    },
    cover() {
      return this.activity && this.activity.cover;
    },
    information() {
      return this.activity && this.activity.information.replace(/[\r\n]/g, '<br>');
    },
    // 用户是否已报名参加活动
    joined() {
      return this.currentUser && this.participators.some((user, i) => {
        this.participatorIndex = i;
        this.uamId = user.uamId;
        return user.id === this.currentUser.id;
      });
    },
    // 是否已过活动时间
    isValidity() {
      if (this.datetime) {
        return new Date(...this.datetime.split(/[-:\s]/g)).getTime() > new Date().getTime();
      }
    },
    // 视图底部文本
    btnText() {
      if (!this.isValidity) {
        return '活动时间已过';
      }
      if (this.joined) {
        return '取消报名';
      }
      return '我要报名';
    }
  },
  methods: {
    fetchData() {
      this.ac = this.$AV.Object.createWithoutData('Activity', this.params.id);
      this.ac.fetch({ include: ['owner'] }).then(() => {
        this.activity = this.ac.attributes;
        this.owner = this.ac.attributes.owner.attributes;
        // 注册分享按钮
        this.$wechat.ready(() => {
          this.$wechat.onMenuShareAppMessage({
            title: this.activity.title,
            desc: '活动详情',
            link: `http://www.supersheep.cn/#/activitydetail/${this.params.id}`,
            imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
          });
          this.$wechat.onMenuShareTimeline({
            title: this.activity.title,
            link: `http://www.supersheep.cn/#/activitydetail/${this.params.id}`,
            imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
          });
        });
      }, (err) => {
        // 异常处理
        console.log(err);
      });
      const query = new this.$AV.Query('UserActivityMap');
      query.equalTo('activity', this.ac);
      query.include('user');
      query.find().then((uams) => {
        this.$vux.loading.hide();
        uams.forEach((uam) => {
          const user = uam.get('user');
          user.uamId = uam.id;
          user.jointime = dateFormat(+new Date(uam.get('createdAt')));
          this.participators.push(user);
        });
      }, (err) => {
        // 异常处理
        this.$vux.loading.hide();
        console.log(err);
      });
    },
    join() {
      if (!this.isValidity) {
        return;
      }
      if (this.joined) {
        const userActivityMap = this.$AV.Object.createWithoutData('UserActivityMap', this.uamId);
        userActivityMap.destroy().then(() => {
          // 删除成功
          this.participators.splice(this.participatorIndex, 1);
          this.$vux.toast.show({
            type: 'text',
            text: '取消成功',
            position: 'bottom',
            time: 1500
          });
          // 参与者人数减1
          this.ac.increment('participants', -1);
          this.ac.fetchWhenSave(true);
          this.ac.save();
        }, (err) => {
          // 删除失败
          console.log(err);
          this.$vux.toast.show({
            type: 'text',
            text: '取消失败',
            position: 'bottom',
            time: 1500
          });
        });
      } else if (this.ac) {
        const userActivityMap = new this.$AV.Object('UserActivityMap');
        userActivityMap.set('activity', this.ac);
        userActivityMap.set('user', this.currentUser);
        userActivityMap.save().then((uam) => {
          const user = uam.get('user');
          user.uamId = uam.id;
          // 报名参与时间
          user.jointime = dateFormat(+new Date(uam.get('createdAt')));
          this.participators.push(user);
          this.$vux.toast.show({
            type: 'text',
            text: '报名成功',
            position: 'bottom',
            time: 1500
          });
          // 参与者人数加1
          this.ac.increment('participants', 1);
          this.ac.fetchWhenSave(true);
          this.ac.save();
        }, (err) => {
          console.log(err);
        });
      }
    }
  },
  created() {
    window.document.title = '活动详情';
    const selt = this;
    this.$vux.loading.show({
      text: '数据加载中'
    })
    function timer() {
      if (selt.currentUser) {
        selt.fetchData();
      } else {
        setTimeout(timer, 50);
      }
    }
    timer();
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color.scss';

#activity-detail {
  position: relative;
  height: 100%;
  overflow: scroll;
  background-color: #fff;
  .activity-box {
    padding-bottom: 40px;
    .activity-cover {
      display: block;
      width: 100%;
      height: 45vw;
    }
    .sponsor {
      position: absolute;
      top: 30vw;
      height: 34px;
      width: 100%;
      .sponsor-avtor {
        display: inline-block;
        margin-left: 12px;
        height: 32px;
        width: 32px;
        border-radius: 50%;
        border: 1px solid $border-color;
      }
      .sponsor-name {
        position: absolute;
        left: 52px;
        color: #fff;
        line-height: 38px;
        font-size: 12px;
      }
    }
    .activity-information {
      box-sizing: border-box;
      margin: 1px;
      border: 1px solid $border-color;
      div {
        box-sizing: content-box;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid $border-color;
        &:last-of-type {
          border: none;
        }
        span {
          position: relative;
          top: -2px;
          display: inline-block;
          box-sizing: border-box;
        }
        .label {
          width: 28%;
          padding-left: 10px;
          color: $title-color;
          font-size: 13px;
          border-right: 1px solid $border-color;
        }
        .content {
          width: 70%;
          padding-left: 15px;
          color: $content-color;
          font-size: 12px;
        }
      }
    }
  }
  .extra-information-box {
    position: relative;
    box-sizing: border-box;
    padding-left: 1px;
    padding-right: 1px;
    padding-top: 20px;
    padding-bottom: 40px;
    .extra-information-label {
      position: absolute;
      top: -12px;
      left: 0;
      padding: 0 14px;
      color: #fff;
      letter-spacing: 1px;
      line-height: 22px;
      font-size: 12px;
      background: $label-bgcolor;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .extra-information {
      padding: 5px 4px;
      color: $content-color;
      font-size: 12px;
      border: 1px solid $border-color;
    }
  }
  .participator-section {
    position: relative;
    box-sizing: content-box;
    min-height: 60px;
    padding-top: 20px;
    ul {
      margin-bottom: 40px;
    }
    .participator-list-label {
      position: absolute;
      top: -12px;
      left: 0;
      padding: 0 20px;
      color: #fff;
      letter-spacing: 1px;
      line-height: 22px;
      font-size: 12px;
      background: $label-bgcolor;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .participator {
      box-sizing: border-box;
      padding: 2vw 4vw;
      height: calc(17vw + 1px);
      border-top: 1px solid $line-color;
      overflow: hidden;
      .participator-avtor {
        display: inline-block;
        margin-right: 3vw;
        height: 13vw;
        width: 13vw;
        border: 1px solid $border-color;
      }
      .participator-username, .participator-jointime {
        display: inline-block;
        box-sizing: border-box;
        padding-top: 2vw;
        height: 13vw;
      }
      .participator-username {
        vertical-align: top;
        color: $content-color;
        font-size: 14px;
      }
      .participator-jointime {
        float: right;
        color: $sub-color;
        font-size: 12px;
        font-size: 10px;
      }
    }
    .notice {
      line-height: 60px;
      text-align: center;
      color: $sub-color;
      font-size: 14px;
    }
  }
  .join-btn {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 40px;
    letter-spacing: 1px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background-color: $btn-bgcolor;
  }
}
</style>
