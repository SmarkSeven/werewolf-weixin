<template>
  <div class="activity-form">
    <section class="cover-section">
      <img class="cover" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493988139353&di=7a07f8b1c46d54edd051220909e5f169&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2Fa780b5ca875ae7d8b1729aa784c6b498c3eb7d0b.jpg" alt="cover">
      <span class="cover-label">活动封面</span>
      <div class="cover-edit-icon">
        <x-icon type="edit" size="16"></x-icon>
      </div>
    </section>
    <section class="form-section">
      <flexbox :gutter="0">
        <flexbox-item :span="1/3">
          <div class="icon">
            <x-icon type="ios-paper" size="18"></x-icon>
          </div>
          <label for="activity-name" class="label">活动名称</label>
        </flexbox-item>
        <flexbox-item>
          <input type="text" maxlength="12" v-model="title" placeholder="请输入活动名称">
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" ref="datebox" id="datebox">
        <flexbox-item :span="1/3">
          <div class="icon">
            <x-icon type="ios-calendar" size="18"></x-icon>
          </div>
          <label for="activity-name" class="label">日期</label>
        </flexbox-item>
        <flexbox-item class="item-right" >
          <span>{{showDate=== false ? '请完善日期' : date}}</span>
          <div class="chevron-right">
            <x-icon type="chevron-right" size="14"></x-icon>
          </div>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" id="timebox">
        <flexbox-item :span="1/3">
          <div class="icon">
            <x-icon type="android-time" size="18"></x-icon>
          </div>
          <label for="activity-name" class="label">时间</label>
        </flexbox-item>
        <flexbox-item class="item-right">
          <span>{{showTime === false ? '请完善时间' : time}}</span>
          <div class="chevron-right" >
            <x-icon type="chevron-right" size="14"></x-icon>
          </div>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0">
        <flexbox-item :span="1/3">
          <div class="icon">
            <x-icon type="ios-location" size="20"></x-icon>
          </div>
          <label for="activity-name" class="label">地址</label>
        </flexbox-item>
        <flexbox-item>
          <input type="text" maxlength="20" v-model="address" placeholder="请输入地址">
        </flexbox-item>
      </flexbox>
      <div class="activity-information-box">
        <textarea name="" id="activity-information" v-model="information" placeholder="活动介绍 (选填 200字限制)"></textarea>
      </div>
    </section>
      <datetime-picker
        ref="datePicker"
        type="date"
        v-model="datePickerValue"
        :startDate="startDate"
        @confirm="handleDateChange">
      </datetime-picker>
      <datetime-picker
        ref="timePicker"
        type="time"
        v-model="timePickerValue"
        @confirm="handleTimeChange">
      </datetime-picker>
    <div id="submit" @click="submit">确认发布</div>
  </div>
</template>
<script>
import { Flexbox, FlexboxItem, dateFormat } from 'vux';
import { DatetimePicker } from 'mint-ui';
import { mapState } from 'vuex';

export default {
  components: {
    Flexbox,
    FlexboxItem,
    DatetimePicker,
    Range,
  },
  data() {
    return {
      showDate: false,
      showTime: false,
      title: null,
      datePickerValu: new Date(),
      timePickerValue: '12:00',
      rangeValue: 19,
      address: null,
      information: '',
      cover: 'cover',
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.app.currentUser,
    }),
    date() {
      if (this.showDate) {
        return dateFormat(this.datePickerValue, 'YYYY-MM-DD');
      }
    },
    startDate() {
      return new Date();
    },
    time() {
      const num = Number(this.timePickerValue.substring(0, 2));
      let label;
      if (num <= 6 && num >= 0) {
        label = '凌晨';
      } else if (num >= 7 && num <= 12) {
        label = '上午';
      } else if (num >= 13 && num <= 18) {
        label = '下午';
      } else {
        label = '晚上';
      }
      return `${label} ${this.timePickerValue}`;
    }
  },
  methods: {
    openDatePicker() {
      this.$refs.datePicker.open();
    },
    openTimePicker() {
      this.$refs.timePicker.open();
    },
    handleDateChange() {
      this.showDate = true;
    },
    handleTimeChange() {
      this.showTime = true;
    },
    submit() {
      // 检查用户是否已近填写必要信息
      if (!(this.showTime && this.showDate && this.title && this.address)) {
        this.$vux.toast.show({
          type: 'text',
          text: '请完善活动信息',
          position: 'bottom',
          time: 1500
        });
        return;
      }
      // 显示
      this.$vux.loading.show({
        text: '活动创建中'
      });
      // 创建活动
      const Activity = this.$AV.Object.extend('Activity');
      const activity = new Activity();
      activity.set('title', this.title);
      activity.set('information', this.information);
      activity.set('date', this.date);
      activity.set('time', this.timePickerValue);
      activity.set('address', this.address);
      activity.set('cover', this.addrecoverss);
      activity.set('owner', this.currentUser);
      activity.set('participants', 0);
      const self = this
      activity.save()
      .then(() => {
        // 成功保存之后，执行其他逻辑.
        self.$vux.loading.hide();
        self.$vux.toast.show({
          type: 'text',
          text: '创建成功',
          position: 'bottom',
          time: 1500
        });
        // 进入活动详情视图
        self.$router.replace({ name: 'activitydetail', params: { id: activity.id } });
      }, (error) => {
        self.$vux.loading.hide();
        // 异常处理
        console.error(`Failed to create new object, with error message: ${error.message}`);
      });
    }
  },
  mounted() {
    window.document.title = '创建活动';
    document.querySelector('#datebox').onclick = () => {
      this.openDatePicker();
    };
    document.querySelector('#timebox').onclick = () => {
      this.openTimePicker();
    };
  }
}
</script>
<style lang="scss" scoped>
@import '../style/color.scss';

.activity-form {
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  .cover-section {
    position: relative;
    display: block;
    margin: 0 5vw;
    margin-top: 10px;
    height: 40vw;
    width: 90vw;
    border: 1px solid #e3e3e3;
    filter: grayscale(20%);
    .cover {
      height: 100%;
      width: 100%;
    }
    .cover-label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 6px;
      color: #fff;
      font-size: 12px;
      background: $label-bgcolor;
    }
    .cover-edit-icon {
      position: absolute;
      top: calc(40vw - 11px);
      right: calc(50% - 13px);
      height: 22px;
      width: 22px;
      line-height: 27px;
      text-align: center;
      border-radius: 50%;
      border: 1.5px solid #e3e3e3;
      background: #fff;
    }
  }
  .form-section {
    margin: 30px 5vw;
    margin-bottom: 50px;
    border: 1px solid #bdbdbd;
    .vux-flexbox {
      border-bottom: 1px solid #bdbdbd;
    }
    .vux-flex-row {
      padding: 8px 0;
      border-bottom: 1px solid #bdbdbd;
      .icon {
        display: inline-block;
        padding-left: 8px;
        vertical-align: middle;
        line-height: 100%;
        fill: #464c5b;
      }
      .label {
        padding-left: 2px;
        color: $title-color;
        font-size: 12px;
        font-weight: bold;
      }
      span {
        font-size: 12px;
        color: $input-color;
      }
      input {
        width: 100%;
        color: $input-color;
        font-size: 12px;
        border: none;
        outline: none;
        background-color: transparent;
      }
      .item-right {
        .chevron-right {
          position: relative;
          float: right;
          top: 4px;
          padding-right: 4px;
          fill: #454545;
        }
      }
    }
    .activity-information-box {
        width: 100%;
        height: 160px;
        box-sizing: border-box;
        padding-top: 6px;
        padding-left: 10px;
        #activity-information {
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          color: $sub-color;
          padding-right: 10px;
          font-size: 12px;
          background: transparent;
          border: none;
          outline: none;
        }
      }
  }
  #submit {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 40px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 40px;
    background-color: $btn-bgcolor;
  }
}
</style>
