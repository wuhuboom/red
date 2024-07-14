<template>
  <div class="win-usdt">
    <p class="icon-back">
      <img src="@/assets/img/back.webp" alt="" />
    </p>
    <p class="num-card">{{ query.amount }}</p>
    <ul class="order-msg">
      <li class="date c-c">{{ query.expiration }}</li>
      <li class="c-c rows number">
        <p>order number：</p>
        <p class="c-c">
          {{ query.orderNumber }}
          <span class="copy"><img src="@/assets/img/copy.webp" alt="" /></span>
        </p>
      </li>
      <li class="lock-list c-c">
        <p class="lock"><img src="@/assets/img/lock.webp" alt="" /></p>
        <p class="dack">02. 36</p>
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
      <li class="desc c-c">
        click here for instuctions
        <span class="tips"><img src="@/assets/img/tips.webp" alt="" /></span>
      </li>
    </ul>
    <p class="line"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        ...this.$route.query,
      },
    };
  },
  computed: {
    // 计算过期时间
    expiration() {
      return this.formatExpiration(this.query.expiration);
    },
  },
  methods: {
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
</style>
