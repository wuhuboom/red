<template>
  <div class="win-usdt">
    <p class="icon-back">
      <img src="@/assets/img/back.webp" alt="" />
    </p>
    <p class="num-card">{{ query.amount }}</p>
    <ul class="order-msg">
      <li class="date c-c">{{ formatExpiration(query.expiration) }}</li>
      <li class="c-c rows number">
        <p>order number：</p>
        <p class="c-c">
          {{ query.orderNumber }}
          <span class="copy"><img src="@/assets/img/copy.webp" alt="" /></span>
        </p>
      </li>
      <li class="lock-list c-c">
        <p class="lock"><img src="@/assets/img/lock.webp" alt="" /></p>
        <p class="dack">
          <CountDown :time="count()" />
        </p>
      </li>
    </ul>
    <ul class="order-msg order-btn">
      <li class="c-c rows number d-c m-b-16">
        <p>bank name</p>
        <p class="c-c">
          {{ query.bankname }}
          <span class="copy"><img src="@/assets/img/copy.webp" alt="" /></span>
        </p>
      </li>
      <li class="c-c rows number d-c m-b-16">
        <p>account name</p>
        <p class="c-c">
          {{ query.username }}
          <span class="copy"><img src="@/assets/img/copy.webp" alt="" /></span>
        </p>
      </li>
      <li class="c-c rows number d-c m-b-16">
        <p>account number</p>
        <p class="c-c">
          {{ query.bankCode }}
          <span class="copy"><img src="@/assets/img/copy.webp" alt="" /></span>
        </p>
      </li>
      <li class="desc line1 c-c">
        click here for instuctions
        <span class="tips"><img src="@/assets/img/tips.webp" alt="" /></span>
      </li>
    </ul>
    <p class="line"></p>
    <div class="upload-row c-c">
      <div class="upload">
        <div class="up-in c-c">your receipt will be displayed here</div>
      </div>
      <div>
        <ul>
          <li class="line-btn line1 c-c">upload</li>
          <li class="dack">
            upload the payment receipt here after the transfer is done.
          </li>
        </ul>
        <ul class="service">
          <li class="line-btn line1 c-c">customer service</li>
          <li class="dack">assistance from customer service</li>
        </ul>
      </div>
    </div>
    <p class="c-c minutes dack">
      Expected to receive in <span>10 minutes</span>
    </p>
    <Uploader />
  </div>
</template>

<script>
import { Uploader, CountDown } from "vant";
export default {
  data() {
    return {
      query: {
        ...this.$route.query,
      },
      now: new Date().getTime(),
    };
  },
  components: {
    Uploader,
    CountDown,
  },
  computed: {
    // 计算过期时间
    expiration() {
      return this.formatExpiration(this.query.expiration);
    },
  },
  methods: {
    count() {
      let now = this.query.expiration * 1000 - new Date().getTime();
      return now > 0 ? now : 0;
    },
    formatExpiration(time) {
      // 将时间戳从秒转换为毫秒
      const date = new Date(time * 1000);

      // 获取年、月、日、小时、分钟和秒
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以要加1
      const day = String(date.getDate()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const hours = String(date.getHours()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const minutes = String(date.getMinutes()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const seconds = String(date.getSeconds()).padStart(2, "0");
      // 构建格式化的日期时间字符串  ${hours}:${minutes}:${seconds}
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.line1 {
  line-height: 1;
}
.m-b-16 {
  margin-bottom: 16px;
}
.d-c {
  flex-direction: column;
}
.dack {
  color: #ef7367;
}
.win-usdt {
  padding: 0 18px;
  font-size: 12px;
}
.c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-back {
  padding: 18px 0 0;
  img {
    width: 30px;
    height: 18px;
    display: block;
  }
}
.num-card {
  font-size: 26px;
  font-weight: 900;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-msg {
  min-height: 132px;
  border-radius: 21px;
  border: solid 2px #b31917;
  padding: 16px;
  margin-bottom: 8px;
  position: relative;
}
.date {
  height: 18px;
  font-size: 14px;
  border-top: 1px solid #dc2525;
  border-bottom: 1px solid #dc2525;
}
.rows {
  & > p:nth-child(1) {
    font-size: 12px;
    color: #ef7367;
  }
  .copy {
    margin-left: 8px;
    img {
      width: 8px;
      height: 10px;
      display: block;
    }
  }
}
.number {
  margin: 8px 0 12px;
}
.lock-list {
  flex-direction: column;
}
.lock {
  margin-bottom: 8px;
  img {
    width: 22px;
    height: 25px;
    display: block;
  }
}
.desc {
  width: 264px;
  height: 18px;
  background-color: #dc2525;
  border-radius: 18px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -9px;
  .tips {
    margin-left: 4px;
    img {
      width: 12px;
      height: 12px;
      display: block;
    }
  }
}
.order-btn {
  margin-bottom: 22px;
}
.line {
  height: 3.2px;
  background-image: linear-gradient(
    to right,
    #8a1c1b,
    #f34139 30%,
    #ff928d 38%,
    #fd7361 53%,
    #f4483f 54%,
    #ef3932 64%,
    #fa574c 91%,
    #f03f38
  );
}
.upload-row {
  display: flex;
  margin-top: 8px;
  .upload {
    width: 112px;
    height: 142px;
    padding: 8px;
    border-radius: 21px;
    border: solid 2px #dc2525;
    flex-shrink: 0;
    margin-right: 26px;
    .up-in {
      height: 100%;
      width: 100%;
      border-radius: 21px;
      border: dotted 2px #fff;
      text-align: center;
      padding: 0 10px;
    }
  }
  .line-btn {
    height: 18px;
    border-radius: 8px;
    background-color: #dc2525;
    padding: 0 8px;
    min-width: 80px;
    flex-grow: 0;
    margin-bottom: 5px;
  }
}
.service {
  margin-top: 30px;
}
.minutes {
  padding: 22px 30px;
  span {
    padding-left: 4px;
    color: #fff;
  }
}
:deep() {
  .van-count-down {
    color: #fff;
  }
}
</style>
