<template>
  <div class="user-page font14">
    <AppTopBar :back="back" :showLeft="false">
      <template #title>
        <div class="align-center">
          <div class="user" v-if="user.id">
            <ImgCom class="pa-0" :src="$userPic" />
          </div>
          <div>
            <p class="username">{{ user.username }}</p>
            <ul class="vip-head" @click="$router.push({ name: 'Vip' })">
              <li class="vip-img">
                <img src="@/assets/img/vipicon.webp" alt="" />
              </li>
              <li>Lv{{ user.vipLevel }}</li>
            </ul>
          </div>
        </div>
      </template>
      <template #right>
        <p class="badge" @click="$router.push({ name: 'Message' })">
          <van-badge :dot="$store.state.fbMsg.hasMsg > 0">
            <i class="icon iconfont icon-lingdang"></i>
          </van-badge>
        </p>
      </template>
    </AppTopBar>
    <div class="mx-16 card font14">
      <p class="balance">{{ $t("home.index.account.balance.text") }}</p>
      <p class="balance-num align-center">
        {{ balanceMoneyNum }}
        <i @click="refresh" class="iconfont icon-shuaxin"></i>
      </p>
      <ul class="justify-between">
        <li
          class="withdrawal center-center"
          @click="$router.push({ name: 'Withdraw' })"
        >
          {{ $t("home.index.withdraw.text") }}
        </li>
        <li
          class="top-up center-center"
          @click="$router.push({ name: 'Recharge' })"
        >
          {{ $t("home.index.recharge.text") }}
        </li>
      </ul>
    </div>
    <p class="all-serve">{{ $t("user.All.Services") }}</p>
    <ul class="nav-list">
      <li v-for="(item, idx) in list" @click="goPage(item)" :key="idx">
        <div class="cont">
          <p class="pic">
            <img :src="item.icon" alt="" />
          </p>
          <div class="center-center">
            <p class="text" :class="{ 'break-all': lang != 'en' }">
              {{ item.text }}
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div class="center-center login-out">
      <p @click="loginOut">{{ $t("fuc.sign.out") }}</p>
    </div>
    <van-action-sheet v-model="show" :description="$t(`index.index.lang`)">
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
export default {
  name: "HomeView",
  data() {
    return { show: false };
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
        // {
        //   icon: require("@/assets/img/user9.webp"),
        //   text: i18n.t("user.special.offer"),
        //   name: "home",
        //   active: false,
        // },
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
  .username {
    font-size: 14px;
    margin-bottom: 8px;
    line-height: 1;
  }
  .vip-head {
    position: relative;
    font-size: 10px;
    color: #fff;
    font-weight: normal;
    .vip-img {
      position: absolute;
      left: -8px;
      top: -2px;
      img {
        display: block;
        width: 22px;
        height: 19px;
      }
    }
    & > li:nth-child(2) {
      display: inline-flex;
      padding-left: 18px;
      padding-right: 8px;
      height: 16px;
      line-height: 16px;
      border-radius: 8px;
      background-image: linear-gradient(to right, #1e60ff, #5ab5fe);
    }
  }
  .login-out {
    width: 217.5px;
    margin: 0 auto;
    height: 32px;
    border-radius: 7.5px;
    border: solid 1px #000;
    color: #050505;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .icon-shuaxin {
    font-size: 18px;
    margin-left: 4px;
  }
  .user {
    height: 42px;
    width: 42px;
    margin-left: 16px;
    margin-right: 13px;
  }
  .username {
    color: #222;
  }
  .icon-lingdang {
    font-size: 26px;
    font-weight: bold;
    color: #222;
  }
  .badge {
    margin-right: 16px;
  }
  .card {
    padding: 16px;
    // height: 152px;
    border-radius: 15px;
    padding-top: 32px;
    background-color: #0025fc;
    color: #fff;
    position: relative;
  }
  .vip-text {
    position: absolute;
    top: 12px;
    right: 18px;
  }
  .balance {
    color: rgba(255, 255, 255, 0.7);
  }
  .vip-text {
    display: flex;
    justify-content: flex-end;
  }
  .vip {
    min-width: 58px;
    height: 26px;
    border-radius: 12px;
    background-color: #2e4bd3;
    padding: 0 8px;
    img {
      width: 18px;
      height: 18px;
      object-fit: cover;
      margin-right: 4px;
    }
  }
  .balance-num {
    font-size: 24px;
    margin-top: 4px;
    margin-bottom: 16px;
  }
  .withdrawal {
    width: 142.5px;
    height: 43px;
    border-radius: 7.5px;
    border: solid 1px #839bff;
    background-color: rgba(255, 255, 255, 0);
  }
  .top-up {
    width: 143.5px;
    height: 44px;
    border-radius: 8px;
    background-color: #99e86c;
  }
  .all-serve {
    padding: 20px 23px 16px;
    font-size: 18px;
    color: #222;
    font-weight: bold;
  }
  .nav-list {
    display: flex;
    font-size: 14px;
    flex-wrap: wrap;
    color: #53668e;
    padding: 0 8px;
    .break-all {
      word-break: break-all;
    }
    .text {
      line-height: 22px;
      min-height: 44px;
      width: 100%;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;

      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
    }
    & > li {
      width: 25%;
      padding: 4px;
      margin-bottom: 8px;
    }
    .cont {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    }
    .pic {
      width: 24px;
      height: 24px;
      margin-bottom: 8px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }
  }
}
</style>
