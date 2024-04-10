<template>
  <div class="message-page font12 color-primary">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('deal.recharge.354498-0')"
    >
    </AppTopBar>
    <div class="center-center py-16" v-if="!rechargeList.length">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="">
      <p class="type-text py-16 px-16">{{ $t("recharge.type.text") }}</p>
      <ul class="type-list p-l-12 p-r-12">
        <li
          v-for="(item, index) in rechargeList"
          class="p-x-12"
          @click="chose(item)"
          :class="{ active: item.id === chooseRecType.id }"
          :key="index"
        >
          <div class="cont">
            <p class="pic center-center" v-if="item.img">
              <img :src="item.img" alt="" />
            </p>
            <p class="center-center">{{ item.name }}</p>
          </div>
        </li>
      </ul>
      <p class="type-text py-16 px-16">{{ $t("recharge.amount.text") }}</p>
      <div class="mx-16">
        <div class="justify-between count">
          <p class="font12">
            <span>{{ $t("recharge.usdt.rate.text") }}&nbsp;</span
            ><span>
              <!-- {{ chooseRecType.type == 1 ? "USDT" : ""
              }} -->
              {{ chooseRecType.rate }}</span
            >
          </p>
          <p class="font12">
            <span>{{ $t("recharge.real.amount.text") }}</span
            ><span
              >≈&nbsp;{{ ngnToUsdtMoney }}
              <!-- {{ chooseRecType.currencySymbol }} -->
            </span>
          </p>
        </div>
        <div class="enter-form">
          <van-form ref="form" @submit="onSubmit">
            <!-- :placeholder="inputPlace" -->
            <van-field
              v-model.trim="amount"
              :rules="[
                {
                  validator,
                  message: this.inputPlace,
                },
              ]"
              type="number"
            >
            </van-field>
          </van-form>
        </div>
      </div>
      <ul class="pre-amount font14">
        <li
          v-for="(item, idx) in quickAmountList"
          @click="amount = item"
          :key="idx"
        >
          <div class="num center-center" :class="{ active: item == amount }">
            {{ item }}
          </div>
        </li>
      </ul>
      <div class="sumit-section px-16 py-16">
        <van-button
          class="res-van-button"
          block
          type="info"
          :loading="loading"
          @click="$refs.form.submit()"
        >
          {{ $t("recharge.button.now.text") }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "RechargeView",
  data() {
    return {
      loading: false,
      rechargeList: [],
      chooseRecType: {},
      amount: "",
      rechargeTipLists: [
        i18n.t("backapi.self.recharge.tip.content1.text"),
        i18n.t("backapi.self.recharge.tip.content2.text"),
        i18n.t("backapi.self.recharge.tip.content3.text"),
      ],
    };
  },
  computed: {
    quickAmountList() {
      if (this.chooseRecType.fast) {
        return this.chooseRecType.fast.split("-");
      }
      return [];
    },
    minMax() {
      if (!this.chooseRecType.minMax) return "";
      return this.chooseRecType.minMax.split("-").map((v) => +v);
    },
    inputPlace() {
      if (!this.chooseRecType.minMax) return "";
      return `${this.$t("recharge.single.amount.text")}:${
        this.chooseRecType.minMax
      }`;
    },
    ngnToUsdtMoney() {
      if (this.amount) {
        let returnAmountStr = "";
        let reAmountStr = (this.amount * this.chooseRecType.rate).toString();
        reAmountStr = reAmountStr.split(".");
        let leftAmount = reAmountStr[0];
        if (reAmountStr[1]) {
          let saveToStr = reAmountStr[1].substring(0, 2);
          returnAmountStr = leftAmount + "." + saveToStr;
        } else {
          returnAmountStr = reAmountStr[0];
        }
        return returnAmountStr;
      } else {
        return 0.0;
      }
    },
  },
  methods: {
    validator(val) {
      if (Array.isArray(this.minMax)) {
        if (+val < this.minMax[0] || +val > this.minMax[1]) {
          return false;
        }
      }
      return true;
    },
    async onSubmit() {
      this.loading = true;
      const [err, res] = await userApi.rechargeOrder({
        payId: this.chooseRecType.id,
        money: this.amount * 1,
      });
      this.loading = false;
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      if (res.data.UrlAddress) {
        window.location.href = res.data.UrlAddress;
      }
    },
    async recharge() {
      const params = {
        lang: this.$store.state.lang,
      };
      const [err, res] = await userApi.recharge(params);
      if (err) return;
      this.rechargeList = res.data;
      this.chose(this.rechargeList[0]);
    },
    chose(item) {
      if (!item) return;
      this.chooseRecType = item;
      if (this.quickAmountList && this.quickAmountList.length > 0) {
        this.amount = this.quickAmountList[0];
        return;
      }
      this.amount = "";
    },
  },
  created() {
    this.recharge();
  },
};
</script>
<style scoped lang="less">
.message-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .type-text {
    text-align: center;
  }
  .type-list {
    display: flex;
    flex-wrap: wrap;
    & > li {
      width: 33.33%;
      .cont {
        height: 84px;
        border-radius: 15px;
        border: solid 1px #fff;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
      .pic {
        height: 42px;
        width: 94px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    & > li.active {
      .cont {
        border-color: #02f;
        background: url("~@/assets/img/chosebg.webp") no-repeat right -2px;
        background-size: 32px 32px;
      }
    }
  }
  .count {
    padding: 8px;
    border-radius: 15px;
    background-color: #fff;
  }
  .enter-form {
    font-size: 24px;
    font-weight: bold;
    color: #222;
  }
  .pre-amount {
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    & > li {
      width: 33.33%;
      padding: 8px;
    }
    .num {
      height: 42px;
      border-radius: 12px;
      background-color: #fff;
      font-weight: bold;
      color: #222;
    }
    .active {
      background-color: #10ab61;
      color: #fff;
    }
  }
}
</style>
