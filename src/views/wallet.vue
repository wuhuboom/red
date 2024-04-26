<template>
  <div class="wallet-page font12 p-l-24 p-r-24">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.safe.text')"
    >
    </AppTopBar>
    <ul class="text-center color-primary m-b-24">
      <li class="m-b-8">
        <p class="money-str m-b-4">
          {{ numToFixed(moneyStr, $globalUnit.val) }}
        </p>
        <p class="m-b-4">{{ $t("wallet.Account.Balance") }}</p>
        <p>
          <i @click="refresh" class="iconfont font14 icon-shuaxin active"></i>
        </p>
      </li>
      <!-- <li class="m-b-8">
        <p class="m-b-4">
          {{ $t(`backapi.self.safe.today.cumulative .text`) }}
        </p>
        <p class="color-fff">
          {{ numToFixed(todayIncomeStr, $globalUnit.val) }}
        </p>
      </li>
      <li>
        <p class="m-b-4">{{ $t(`backapi.self.safe.all.cumulative.text`) }}</p>
        <p class="color-fff">
          {{ numToFixed(totalIncomeStr, $globalUnit.val) }}
        </p>
      </li> -->
    </ul>
    <p class="black-line m-t-16 m-b-24"></p>
    <div>
      <ul
        class="align-center menu font16"
        :key="idx"
        v-for="(item, idx) in list"
        @click="goTo(item.name)"
      >
        <li class="icon m-r-16"><img :src="item.icon" alt="" /></li>
        <li class="flex-1 align-center justify-between">
          {{ item.text }}
          <p class="dec"><img src="@/assets/img/red/usernav6.png" alt="" /></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "WithdrawView",
  data() {
    return {
      loading: false,
      data: {},
      playerConfig: {},
    };
  },
  computed: {
    list() {
      const arr = [
        {
          icon: require("@/assets/img/red/safe1.png"),
          text: i18n.t("home.index.recharge.text"),
          name: "SafeRecharge",
          active: false,
        },
        {
          icon: require("@/assets/img/red/safe2.png"),
          text: `${i18n.t("wallet.index.transfer.text")}(${i18n.t(
            "wallet.index.for.subordinate.text"
          )})`,
          name: "TransferSub",
          active: false,
        },
        {
          icon: require("@/assets/img/red/safe3.png"),
          text: `${i18n.t("wallet.index.transfer.text")}(${i18n.t(
            "wallet.index.for.self.text"
          )})`,
          name: "TransferSelf",
          active: false,
        },
        {
          icon: require("@/assets/img/red/safe4.png"),
          text: `${i18n.t("wallet.index.explanation.text")}`,
          name: "Explanation",
          active: false,
        },
        {
          icon: require("@/assets/img/red/safe5.png"),
          text: `${i18n.t("wallet.index.billing.details.text")}`,
          name: "SafeBilling",
          active: false,
        },
      ];
      // if (this.playerConfig.showH5 === 1) {
      //   arr.push({
      //     icon: require("@/assets/img/wallet4.webp"),
      //     text: "C2C",
      //     name: "UserProfile",
      //     active: false,
      //   });
      // }
      return arr;
    },
    moneyStr() {
      return this.data.money / this.$globalNum.val;
    },
    todayIncomeStr() {
      return this.data.todayIncome / this.$globalNum.val;
    },
    totalIncomeStr() {
      return this.data.totalIncome / this.$globalNum.val;
    },
    symbolStr() {
      return this.data.symbol;
    },
  },
  methods: {
    goTo(name) {
      this.$router.push({ name });
    },
    async safeInfo() {
      this.loading = true;
      const [err, res] = await userApi.safeInfo();
      this.loading = false;
      if (err) return;
      this.data = res.data;
    },
    async getConfig() {
      const [err, res] = await userApi.palyerConfig();
      if (err) return;
      this.playerConfig = res.data;
      console.log(this.playerConfig);
    },
    async refresh() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.safeInfo();
      this.$toast.clear();
    },
  },
  created() {
    this.safeInfo();
    this.getConfig();
  },
};
</script>
<style scoped lang="less">
.wallet-page {
  .money-str {
    font-size: 26px;
    font-weight: 900;
  }
  .black-line {
    height: 5px;
    background-image: linear-gradient(
      to right,
      #af1816,
      #af1816 5%,
      #0c0c0c 5%,
      #0c0c0c
    );
  }
  .menu {
    height: 65px;
    color: #fff;
    & > li:nth-child(2) {
      border-bottom: 1px solid #484b4c;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .icon {
      img {
        width: 45px;
        display: block;
      }
    }
    .dec {
      img {
        width: 10px;
        display: block;
      }
    }
  }
}
</style>
