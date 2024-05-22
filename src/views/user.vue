<template>
  <div class="user-page p-x-24 font12">
    <ul class="top-msg" @click="$router.push({ name: 'Message' })">
      <li class="d-block"><img src="@/assets/img/red/msg.webp" /></li>
      <li></li>
    </ul>
    <div class="top-user-msg align-center">
      <div class="avatrt m-r-12">
        <img class="d-block" src="@/assets/img/user@2x.png" alt="" />
      </div>
      <div>
        <ul class="color-primary">
          <li class="m-b-8 user-name">
            <p class="m-b-4 color-fff">{{ user.username }}</p>
            <p class="align-center level font16">
              VIP{{ user.vipLevel }}
              <img class="m-l-4" src="@/assets/img/red/vip.png" alt="" />
            </p>
          </li>
          <li class="user-num">
            <p class="">{{ balanceMoneyNum }}</p>
            <p>{{ $t("home.index.account.balance.text") }}</p>
          </li>
        </ul>
      </div>
    </div>
    <ul class="nav align-center capitalize">
      <li
        class="center-center"
        @click="goTo(item)"
        v-for="(item, idx) in navList"
        :key="idx"
      >
        <p><img :src="item.icon" /></p>
        <p>{{ item.name }}</p>
      </li>
    </ul>
    <div>
      <ul
        class="align-center menu font16"
        v-for="(item, idx) in menu"
        @click="goTo(item)"
        :key="idx"
      >
        <li class="icon m-r-16"><img :src="item.icon" alt="" /></li>
        <li class="flex-1 align-center justify-between">
          {{ item.name }}
          <p class="dec"><img src="@/assets/img/red/usernav6.png" alt="" /></p>
        </li>
      </ul>
    </div>
    <ComfireDialog
      :texts="[$t(`now.exit`)]"
      ref="ComfireDialog"
      @sure="loginOut"
    />
    <van-action-sheet
      class="btm-action-sheet color-fff"
      v-model="show"
      :description="$t(`index.index.lang`)"
    >
      <ul class="content-user-lang">
        <li
          @click="onSelect(item)"
          class="align-center"
          v-for="(item, idx) in langOptions"
          :key="idx"
        >
          <img :src="item.icon" alt="" />
          {{ item.text }}
        </li>
      </ul>
    </van-action-sheet>
  </div>
</template>

<script>
import i18n from "@/locale";
import nav2 from "@/assets/img/red/group-19@2x.png";
import nav3 from "@/assets/img/red/group-20@2x.png";
import nav4 from "@/assets/img/red/history.png";
export default {
  name: "HomeView",
  data() {
    return {
      show: false,
      navList: [
        {
          name: i18n.t("home.index.recharge.text"),
          link: "Recharge",
          icon: nav2,
        },
        {
          name: i18n.t("home.index.withdraw.text"),
          link: "Withdraw",
          icon: nav3,
        },
        {
          name: i18n.t("Today.History"),
          link: "FinancialPecords",
          icon: nav4,
        },
      ],
      menu: [
        {
          icon: require("@/assets/img/red/usernav2.png"),
          name: i18n.t("deal_my_orders"),
          link: "orderCenter",
        },
        {
          icon: require("@/assets/img/red/usernav1.png"),
          name: i18n.t("fuc.safe.text"),
          link: "Wallet",
        },

        {
          icon: require("@/assets/img/red/usernav3.png"),
          name: i18n.t("user.Report.Management"),
          link: "ReportManagement",
        },
        {
          icon: require("@/assets/img/red/er-icon.webp"),
          name: i18n.t("me.my.qr.code.text"),
          link: "Share",
        },
        {
          icon: require("@/assets/img/red/usernav4.png"),
          name: i18n.t("me.security.text"),
          link: "SecurityCenter",
        },
        {
          icon: require("@/assets/img/red/usernav5.png"),
          name: i18n.t("help_center"),
          link: "HelpCenter",
        },
        {
          icon: require("@/assets/img/red/user9.png"),
          name: i18n.t("index.index.lang"),
          link: "lang",
        },
        {
          icon: require("@/assets/img/red/user8.png"),
          name: i18n.t("fuc.sign.out"),
          link: "out",
        },
      ],
    };
  },
  components: {},
  computed: {
    langOptions() {
      return this.$store.state.langOpt;
    },
    serveData() {
      return this.$store.state.serveData;
    },
    user() {
      return this.$store.state.user;
    },
    balanceMoneyNum() {
      return (
        this.numToFixed(this.user.balance, this.$globalUnit.val) /
        this.$globalNum.val
      );
    },
    safeConfig() {
      return this.$store.state.safeConfig;
    },
    list() {
      const safeBox = {
        icon: require("@/assets/img/user1.webp"),
        text: i18n.t("fuc.safe.text"),
        name: "Wallet",
        active: false,
      };
      const arr = [
        {
          icon: require("@/assets/img/user2.webp"),
          text: i18n.t("user.financial.records"),
          name: "FinancialPecords",
          active: false,
        },
        {
          icon: require("@/assets/img/user3.webp"),
          text: i18n.t("fuc.rebate.center"),
          name: "Rebate",
          active: false,
        },
        {
          icon: require("@/assets/img/user4.webp"),
          text: i18n.t("fuc.agency.center"),
          name: "Agency",
          active: false,
        },
        {
          icon: require("@/assets/img/user5.webp"),
          text: i18n.t("me.my.qr.code.text"),
          name: "Share",
          active: false,
        },
        {
          icon: require("@/assets/img/user6.webp"),
          text: i18n.t("fuc.app.download"),
          name: "Download",
          active: false,
        },
        {
          icon: require("@/assets/img/user7.webp"),
          text: i18n.t("me.security.text"),
          name: "SecurityCenter",
          active: false,
        },
        {
          icon: require("@/assets/img/user8.webp"),
          text: i18n.t("user.About.Us"),
          name: "AboutUs",
          active: false,
        },
        {
          icon: require("@/assets/img/user10.webp"),
          text: i18n.t("index.login.service.text"),
          name: "service",
          active: false,
        },
        {
          icon: require("@/assets/img/user11.webp"),
          text: i18n.t("index.index.lang"),
          name: "lang",
          active: false,
        },
      ];
      if (this.safeConfig.showH5 === 1) {
        arr.unshift(safeBox);
      }
      return arr;
    },
    lang() {
      return this.$store.state.lang;
    },
  },
  methods: {
    goTo(item) {
      const link = item.link;
      if (link) {
        if (link === "service") {
          this.$store.commit("goServe");
          return;
        }
        if (link === "out") {
          // this.loginOut();
          this.$refs.ComfireDialog.open();
          return;
        }
        if (link === "lang") {
          this.show = true;
          return;
        }
        this.$router.push({ name: item.link });
      }
    },
    onSelect(e) {
      this.show = false;
      this.$store.commit("setLang", e.value);
    },
    loginOut() {
      this.$store.commit("loginOut");
      this.$router.replace({ name: "Login" });
    },
    async refresh() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.$store.dispatch("getInfo");
      this.$toast.clear();
    },
    async goPage(v) {
      if (!v.name) return;
      if (v.name === "Download") {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
        });
        await this.$store.dispatch("appDownload");
        this.$toast.clear();
        return;
      }
      if (v.name === "service") {
        this.$store.commit("goServe");
        return;
      }
      if (v.name === "lang") {
        this.show = true;
        return;
      }
      this.$router.push({
        name: v.name,
      });
    },
    back() {
      this.$router.push({
        name: "home",
      });
    },
  },
  created() {
    this.$store.commit("setPdTop", false);
    this.$store.dispatch("getServeData");
    this.$store.dispatch("getHasMsg");
    this.$store.dispatch("getInfo");
    this.$store.dispatch("setSafeConfig");
  },
};
</script>
<style scoped lang="less">
@shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
.user-page {
  position: relative;
  .btm-action-sheet {
    background-color: var(--bg-body);
    ::v-deep {
      .van-action-sheet__item {
        background-color: var(--bg-body);
      }
      .van-action-sheet__description {
        color: var(--primary);
        &::after {
          border-color: var(--main);
        }
      }
      .van-action-sheet__item {
        text-align: left;
      }
      .van-action-sheet__content {
        padding: 0 16px;
      }
      .van-action-sheet__content {
        max-height: 258px;
      }
    }
  }
  .content-user-lang {
    & > li {
      height: 40px;
      padding: 0 30px;
      img {
        width: 22px;
        height: 22px;
        margin-right: 8px;
      }
    }
  }
  .top-msg {
    position: absolute;
    right: 16px;
    top: 16px;
    img {
      width: 21px;
      height: 16px;
    }
  }
  .top-user-msg {
    .avatrt {
      img {
        //width: 128px;
        height: 106px;
      }
    }
    .level {
      img {
        width: 14px;
        height: 12px;
        object-fit: cover;
      }
    }
    .user-name {
      p:nth-child(1) {
        font-size: 16px;
      }
    }
    .user-num {
      p:nth-child(1) {
        font-size: 26px;
      }
    }
  }
  .nav {
    justify-content: space-between;
    font-size: 12px;
    color: var(--primary);
    margin-top: 24px;
    margin-bottom: 8px;
    & > li {
      flex-direction: column;
      height: 67px;
      min-width: 72px;
      border-radius: 15px;
      border: solid 1px #ef7367;
      padding: 6px 0;
    }
    & > li {
      p:last-child {
        margin-top: 2px;
      }
    }
    img {
      display: block;
      height: 34px;
    }
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
