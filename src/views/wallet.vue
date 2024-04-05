<template>
  <div class="wallet-page font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.safe.text')"
    >
      <template #right>
        <img
          @click="$router.push({ name: 'SafeBilling' })"
          class="detail-icon"
          src="@/assets/img/safebox.webp"
          alt=""
        />
      </template>
    </AppTopBar>
    <div class="center-center py-16" v-if="loading">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16">
      <div class="wallet-head">
        <ul class="wallet-up">
          <!-- <li v-show="false">{{ $t("wallet.Main.Wallet") }}</li> -->
          <li class="color-blue">{{ $t("wallet.Account.Balance") }}</li>
          <li class="num">
            <span> {{ numToFixed(moneyStr, $globalUnit.val) }}</span>
            <span class="color-blue"> {{ symbolStr }}</span>
          </li>
        </ul>
        <!-- <ul class="wallet-btm font12">
          <li class="color-blue">
            <p class="">{{ $t("wallet.index.yesterday.reward.text") }}</p>
            <p class="font14">
              {{ numToFixed(todayIncomeStr, $globalUnit.val) }} {{ symbolStr }}
            </p>
          </li>
          <li class="color-blue">
            <p>{{ $t("wallet.index.cumulative.reward.text") }}</p>
            <p class="font14">
              {{ numToFixed(totalIncomeStr, $globalUnit.val) }} {{ symbolStr }}
            </p>
          </li>
        </ul> -->
      </div>
      <ul class="handle-glod mb-16 font12 justify-between align-center">
        <li
          class="flex-column glod-cont"
          :key="idx"
          v-for="(item, idx) in list"
          @click="goTo(item.name)"
        >
          <p class="pic center-center"><img :src="item.icon" alt="" /></p>
          <p class="text-center center-center" v-html="item.text"></p>
        </li>
      </ul>
      <ul class="px-16 py-16 btm-text">
        <li class="tips">{{ $t("backapi.self.safe.rule.desc.text") }}</li>
        <li class="desc">{{ $t("backapi.self.safe.rule.content1.text") }}</li>
        <li class="desc">{{ $t("backapi.self.safe.rule.content2.text") }}</li>
        <li class="desc">{{ $t("backapi.self.safe.rule.content3.text") }}</li>
        <li class="desc">{{ $t("backapi.self.safe.rule.content4.text") }}</li>
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
          icon: require("@/assets/img/wallet1.webp"),
          text: i18n.t("home.index.recharge.text"),
          name: "SafeRecharge",
          active: false,
        },
        {
          icon: require("@/assets/img/wallet2.webp"),
          text: `${i18n.t("wallet.index.transfer.text")}<br />${i18n.t(
            "wallet.index.for.subordinate.text"
          )}`,
          name: "TransferSub",
          active: false,
        },
        {
          icon: require("@/assets/img/wallet3.webp"),
          text: `${i18n.t("wallet.index.transfer.text")}<br />${i18n.t(
            "wallet.index.for.self.text"
          )}`,
          name: "TransferSelf",
          active: false,
        },
      ];
      if (this.playerConfig.showH5 === 1) {
        arr.push({
          icon: require("@/assets/img/wallet4.webp"),
          text: "C2C",
          name: "UserProfile",
          active: false,
        });
      }
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
      if (!name) return;
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
  },
  created() {
    this.safeInfo();
    this.getConfig();
  },
};
</script>
<style scoped lang="less">
.wallet-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .detail-icon {
    width: 24px;
    height: 24px;
    object-fit: cover;
  }
  .wallet-head {
    border-radius: 16px;
    overflow: hidden;
  }
  .color-blue {
    color: rgba(255, 255, 255, 0.7);
  }
  .wallet-up {
    background: url("@/assets/img/walletbg.webp") no-repeat right top;
    background-color: #0025fc;
    background-size: 125px auto;
    padding: 16px;
    color: #fff;
    & > li:nth-child(2) {
      margin: 8px 0;
    }
    .num {
      & > span:nth-child(1) {
        font-size: 24px;
      }
    }
  }
  .wallet-btm {
    padding: 16px;
    background-color: #232323;
    display: flex;
    justify-content: space-between;
    & > li {
      & > p:nth-child(1) {
        margin-bottom: 4px;
      }
    }
  }
  .handle-glod {
    padding: 16px 4px;
    margin-top: 16px;
    color: #232323;
    border-radius: 8px;
    border: solid 1px #d5d5d5;
    background-color: #fff;
    & > li {
      width: 25%;
    }
    .glod-cont {
      align-items: center;
      justify-content: space-between;
      & > p:nth-child(2) {
        height: 32px;
        overflow: hidden;
      }
    }
    .pic {
      margin-bottom: 8px;
      img {
        object-fit: cover;
        width: 24px;
        height: 24px;
      }
    }
  }

  .btm-text {
    font-size: 18px;
    color: #222;
    margin-bottom: 12px;
    .desc {
      margin-top: 8px;
      color: #707070;
      font-size: 12px;
    }
  }
}
</style>
