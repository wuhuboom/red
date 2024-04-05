<template>
  <div class="safe-recharge-view font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('home.index.recharge.text')"
    >
    </AppTopBar>
    <div class="head center-center">
      <p class="recharge-sign center-center">
        <span class="center-center">{{ $t("home.index.recharge.text") }}</span>
      </p>
    </div>
    <p class="center-center">{{ $t(`rebate.center.list.nav.smount.text`) }}</p>
    <div class="px-16">
      <van-form ref="form" class="safe-fome pt-16" @submit="onSubmit">
        <van-field
          :rules="[
            {
              validator,
              message: this.inputPlace,
            },
          ]"
          type="number"
          v-model="amount"
        />
      </van-form>
      <ul class="justify-between rate">
        <li>{{ $t("recharge.usdt.rate.text") }} {{ chooseRecType.rate }}</li>
        <li>
          {{ $t("recharge.real.amount.text") }} ≈&nbsp;{{ ngnToUsdtMoney }}
        </li>
      </ul>
      <p class="types">{{ $t(`safe.Recharge.types`) }}</p>
      <ul
        v-for="(item, idx) in rechargeList"
        class="justify-between align-center type-list"
        :key="idx"
        :class="{ active: item.id === chooseRecType.id }"
        @click="chose(item)"
      >
        <li class="pic center-center">
          <img v-if="item.img" :src="item.img" alt="" />
          <span v-else>{{ item.name }}</span>
        </li>
        <li v-if="item.img" class="flex-1">{{ item.name }}</li>
        <li>
          <van-checkbox
            checked-color="#0022ff"
            :value="item.chose"
          ></van-checkbox>
        </li>
      </ul>
      <div class="sumit-section py-16">
        <van-button
          class="res-van-button button-blue"
          block
          type="info"
          :loading="loading"
          @click="sumbit"
        >
          {{ $t("confirm.btn.text") }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import to from "await-to-js";
export default {
  name: "TechnicalsupportView",
  data() {
    return {
      loading: false,
      rechargeList: [],
      amount: "",
      chooseRecType: {},
    };
  },
  computed: {
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
    quickAmountList() {
      if (this.chooseRecType.fast) {
        return this.chooseRecType.fast.split("-");
      }
      return [];
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
    chose(item) {
      if (!item) return;
      this.chooseRecType = item;
      this.rechargeList.forEach((v) => {
        v.chose = v.id === item.id;
      });
      if (this.quickAmountList && this.quickAmountList.length > 0) {
        this.amount = this.quickAmountList[0];
        return;
      }
      this.amount = "";
    },
    async sumbit() {
      const [err] = await to(this.$refs.form.validate());
      if (err) {
        return;
      }
      this.onSubmit();
    },
    async onSubmit() {
      this.loading = true;
      const [err, res] = await userApi.safeRecharge({
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
    async getList() {
      const [err, res] = await userApi.rechargePreMult();
      if (err) {
        return;
      }
      this.rechargeList = res.data.map((v) => {
        return {
          ...v,
          chose: false,
        };
      });
      if (this.rechargeList.length) {
        this.rechargeList[0].chose = true;

        this.chose(this.rechargeList[0]);
      }
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped lang="less">
.safe-recharge-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  color: var(--color-text);
  .types {
    font-size: 16px;
    font-weight: bold;
    padding: 30px 0 16px;
  }
  .type-list {
    height: 64px;
    padding-right: 16px;
    .pic {
      height: 42px;
      width: 94px;
      flex-grow: 0;
      flex-shrink: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  .type-list.active {
    background-color: #edefff;
  }
  .rate {
    color: #8a929a;
    padding-top: 8px;
  }
  .head {
    height: 155px;
    background: url("@/assets/img/rechang.webp") no-repeat center top;
    background-size: 100% auto;
  }
  .recharge-sign {
    background: url("@/assets/img/charge.webp") no-repeat center top;
    background-size: cover;
    width: 114px;
    height: 122px;
    & > span {
      padding-top: 16px;
      width: 96px;
      height: 104px;
    }
  }
  ::v-deep {
    .safe-fome {
      .van-cell {
        border: 1px solid var(--primary);
        border-radius: 8px;
        font-size: 21px;
      }
      .van-field__control {
        text-align: center;
      }
    }
  }
}
</style>
