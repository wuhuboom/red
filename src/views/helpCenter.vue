<template>
  <div class="wallet-page font12 p-l-24 p-r-24">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('help_center')"
    >
    </AppTopBar>
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
          icon: require("@/assets/img/red/help1.png"),
          text: i18n.t("user.help.center.contact.us.text"),
          name: "service",
          active: false,
        },
        {
          icon: require("@/assets/img/red/help2.png"),
          text: `${i18n.t("user.help.center.user.notice.text")}`,
          name: "ArtTpl",
          active: false,
        },
        {
          icon: require("@/assets/img/red/help3.png"),
          text: `${i18n.t("user.help.center.privacy.solicy.text")}`,
          name: "PrivacySolicy",
          active: false,
        },
        {
          icon: require("@/assets/img/red/help4.png"),
          text: `${i18n.t("user.help.center.technical.support.text")}`,
          name: "Technicalsupport",
          active: false,
        },
      ];
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
      if (name === "service") {
        this.$store.dispatch("getServeData", 1);
        return;
      }
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
  ::v-deep {
    .appp-top-bar {
      background-color: var(--bg-body) !important;
    }
    .appp-top-bar-title,
    .icon-button {
      color: var(--primary) !important;
    }
  }
}
</style>
