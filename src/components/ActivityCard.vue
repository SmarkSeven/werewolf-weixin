<template>
  <flexbox class="activity-card" :gutter="0" align="flex-start">
    <flexbox-item :span="0.21" class="date-box">
      <div><span>{{day}}</span> {{month}}月</div>
    </flexbox-item>
    <flexbox-item class="activity-content">
      <img class="cover" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493988139353&di=7a07f8b1c46d54edd051220909e5f169&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farchive%2Fa780b5ca875ae7d8b1729aa784c6b498c3eb7d0b.jpg" alt="cover">
      <span class="activity-name">{{data.title}}</span>
      <flexbox :gutter="0" class="address-box">
        <flexbox-item class="address">
          <div class="icon">
            <x-icon type="ios-location" size="16"></x-icon>
          </div>
          <span>{{data.address}}</span>
        </flexbox-item>
       <!-- <flexbox-item class="time">
          <div class="icon">
            <x-icon type="android-time" size="16"></x-icon>
          </div>
         <span>19:00</span>
        </flexbox-item> !-->
      </flexbox>
      <div class="user-num">
        <div class="icon">
          <x-icon type="android-contact" size="16"></x-icon>
        </div>
        <span>{{data.participants}}人</span>
      </div>
    </flexbox-item>
  </flexbox>
</template>
<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    Flexbox,
    FlexboxItem,  //ion-android-time  ion-ios-location-outline ion-android-contact
  },
  props: {
    data: Object,
  },
  computed: {
    month() {
      return new Date(this.data.createdAt).getMonth() + 1;
    },
    day() {
      return new Date(this.data.createdAt).getDate() + 1;
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../style/color.scss';
  .activity-card {
    width: 100%;
    .date-box {
      font-weight: bold;
      span {
        font-size: 26px;
        font-weight: bold;
      }
    }
   .activity-content {
     position: relative;
     height: 50vw;
     border-top-left-radius: 4px;
     box-shadow: 0px 2px 2px lightgray;
     overflow: hidden;
     .cover {
       display: block;
       width: 100%;
       height: 35vw;
     }
     .icon {
       display: inline-block;
       vertical-align: middle;
       line-height: 100%;
       fill: #464c5b;
     }
     .activity-name {
       position: absolute;
       left: 3vw;
       bottom: 16vw;
       font-size: 15px;
       color: white;
     }
     .address-box {
       height: 7vw;
       margin-top: 4px;
       line-height: 7vw;
       background-image: linear-gradient(#e9e9e9,#e9e9e9);
       background-repeat: no-repeat;
       background-size: 95% 1px;
       background-position: bottom;
       .address {
         padding-left: 2.5%;
         font-size: 13px;
         overflow: hidden;  //隐藏多余的内容
         white-space: nowrap; //文本不换行
         text-overflow: ellipsis; //显示省略号
       }
       .time {
         font-size: 13px;
         font-weight: 500;
         text-align: center;
       }
       span {
         color: $content-color;
         font-size: 12px;
       }
     }
     .user-num {
       height: 7vw;
       line-height: 7vw;
       font-size: 13px;
       padding-left: 2.5%;
       background-image: linear-gradient(#e9e9e9,#e9e9e9);
       background-repeat: no-repeat;
       background-size: 95% 1px;
       background-position: bottom;
       span {
         font-weight: bold;
         color: $content-color;
         font-size: 12px;
       }
     }
   }
   padding-bottom: 30px;
  }
</style>
