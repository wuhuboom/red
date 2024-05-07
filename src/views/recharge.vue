<template>
  <div class="message-page font12 color-primary">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('deal.recharge.354498-0')"
    >
    </AppTopBar>
    <div class="center-center py-16" v-if="!rechargeList.length">
      <van-Loading class="color-primary" />
    </div>
    <div v-else class="">
      <ul class="type-list p-l-12 p-r-12 m-b-8">
        <li
          v-for="(item, index) in rechargeList"
          class="p-x-4"
          @click="chose(item)"
          :class="{ 'color-active': item.id === chooseRecType.id }"
          :key="index"
        >
          <div class="cont">
            <p class="pic center-center">
              <img v-if="item.img" :src="item.img" alt="" />
            </p>
            <p class="center-center">{{ item.name }}</p>
          </div>
        </li>
      </ul>
      <div class="enter-form p-l-24 p-r-24 m-b-16">
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
            <template #button>
              <span class="color-fff">{{ chooseRecType.currencySymbol }}</span>
            </template>
          </van-field>
          <p class="limit">
            {{ $t(`deal.buyDetail.387081-5`) }}:{{ chooseRecType.minMax }}
          </p>
        </van-form>
      </div>
      <ul class="pre-amount p-l-24 p-r-24 m-b-16">
        <li
          class="m-b-8"
          v-for="(item, idx) in quickAmountList"
          @click="amount = item"
          :key="idx"
        >
          <div class="num center-center" :class="{ active: item == amount }">
            {{ item }}
          </div>
        </li>
      </ul>
      <div class="mx-16">
        <div class="count text-center p-t-16">
          <div class="justify-between">
            <p class="flex-1 flex-column center-center">
              <span class="m-b-4">{{ $t("recharge.usdt.rate.text") }}</span
              ><span>
                <!-- {{ chooseRecType.type == 1 ? "USDT" : ""
              }} -->
                {{ chooseRecType.rate }}</span
              >
            </p>
            <p class="flex-1 flex-column center-center">
              <span class="m-b-4">{{ $t("recharge.real.amount.text") }}</span
              ><span
                >{{ ngnToUsdtMoney }}
                <!-- {{ chooseRecType.currencySymbol }} -->
              </span>
            </p>
          </div>
          <div class="center-center m-t-8">
            <van-button
              block
              class="p-l-4 p-r-4 font12 page-res-btn"
              type="info"
              :loading="loading"
              @click="$refs.form.submit()"
            >
              {{ $t("recharge.button.now.text") }}</van-button
            >
          </div>
        </div>
      </div>
      <ul class="p-x-24">
        <li>{{ $t(`recharge.tip.title.text`) }}</li>
        <li class="m-b-16">
          {{ $t(`backapi.self.recharge.tip.content1.text`) }}
        </li>
        <li class="m-b-16">
          {{ $t(`backapi.self.recharge.tip.content2.text`) }}
        </li>
        <li class="m-b-16">
          {{ $t(`backapi.self.recharge.tip.content3.text`) }}
        </li>
      </ul>
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
      // if (this.quickAmountList && this.quickAmountList.length > 0) {
      //   this.amount = this.quickAmountList[0];
      //   return;
      // }
      this.amount = this.chooseRecType.def;
    },
  },
  created() {
    this.recharge();
  },
};
</script>
<style scoped lang="less">
.message-page {
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
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 15px;
        border: solid 1px #9d9d9d;
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
    & > li:nth-child(3n + 2) {
      // border-right: 1px solid var(--primary);
      // border-left: 1px solid var(--primary);
    }
    & > li.color-active {
      .cont {
        border-color: var(--main) !important;
      }
    }
  }
  .count {
    height: 99px;
    background: url("@/assets/img/red/reghar.webp") no-repeat center center;
    background-size: 100% 100%;
  }
  .enter-form {
    ::v-deep {
      .van-cell {
        background-color: transparent;
        padding-left: 0;
        padding-right: 0;
        &::after {
          display: none;
        }
      }
      .van-field__control {
        color: var(--primary);
      }
      .van-field__body {
        background: url("@/assets/img/red/inputborder.webp") no-repeat 0 12px;
        padding-bottom: 4px;
        background-size: 100% auto;
        text-align: right;
      }
      .limit,
      [type="text"],
      .van-field__error-message {
        text-align: right;
      }
    }
  }
  .pre-amount {
    display: flex;
    flex-wrap: wrap;
    & > li {
      width: 25%;
      height: 24px;
      line-height: 21px;
      text-align: center;
      padding: 4px;
    }
    .num {
      border: solid 1px #9d9d9d;
      border-radius: 8px;
    }
    .active {
      background-color: var(--main);
      border-color: var(--main);
      color: #fff !important;
    }
  }
  .sumit-section {
    .van-button {
      height: 20px;
      border-radius: 8px;
      background-color: var(--primary);
      border: none;
      flex-basis: 100px;
      white-space: nowrap;
    }
  }
}
</style>
