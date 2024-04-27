import Vue from "vue";
import VueRouter from "vue-router";
import auth from "@/plugins/auth";
//import app from "@/main";
Vue.use(VueRouter);
import store from "@/store";
import Nprogress from "nprogress";
//import AppTopBar from "@/components/global/AppTopBar";
import AppBtmBar from "@/components/global/AppBtmBar";
const routes = [
  {
    path: "/",
    name: "home",
    components: {
      default: () => import("@/views/HomeView.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/safe/recharge",
    name: "SafeRecharge",
    components: {
      default: () => import("@/views/safeRecharge.vue"),
    },
  },
  {
    path: "/safe/explanation",
    name: "Explanation",
    components: {
      default: () => import("@/views/explanation.vue"),
    },
  },
  {
    path: "/pages/securityCenter/bankAccountList",
    name: "BankAccountList",
    components: {
      default: () => import("@/views/bankAccountList.vue"),
    },
  },
  {
    path: "/pages/securityCenter/updataPhone",
    name: "UpdataPhone",
    components: {
      default: () => import("@/views/UpdataPhone.vue"),
    },
  },
  {
    path: "/pages/securityCenter/updataEmail",
    name: "UpdataEmail",
    components: {
      default: () => import("@/views/UpdataEmail.vue"),
    },
  },
  {
    path: "/forget/password",
    name: "ForgetPassword",
    components: {
      default: () => import("@/views/PasswordSetting.vue"),
    },
  },
  {
    path: "/chang/password",
    name: "ChangPassword",
    components: {
      default: () => import("@/views/changPassword.vue"),
    },
  },
  {
    path: "/chang/fundPasswordSetting",
    name: "ChangFundPassword",
    components: {
      default: () => import("@/views/changFundPassword.vue"),
    },
  },
  {
    path: "/forgot/fundPasswordSetting",
    name: "FundPasswordSetting",
    components: {
      default: () => import("@/views/fundPasswordSetting.vue"),
    },
  },
  {
    path: "/pages/securityCenter/index",
    name: "SecurityCenter",
    components: {
      default: () => import("@/views/securityCenter.vue"),
    },
  },
  {
    path: "/pages/user/help/help",
    name: "HelpCenter",
    components: {
      default: () => import("@/views/helpCenter.vue"),
    },
  },
  {
    path: "/technicalsupport",
    name: "Technicalsupport",
    components: {
      default: () => import("@/views/technicalsupport.vue"),
    },
  },
  {
    path: "/privacySolicy",
    name: "PrivacySolicy",
    components: {
      default: () => import("@/views/privacySolicy.vue"),
    },
  },
  {
    path: "/artTpl",
    name: "ArtTpl",
    components: {
      default: () => import("@/views/artTpl.vue"),
    },
  },
  {
    path: "/aboutUs",
    name: "AboutUs",
    components: {
      default: () => import("@/views/aboutUs.vue"),
    },
  },
  {
    path: "/pages/function/userList",
    name: "UserList",
    components: {
      default: () => import("@/views/userList.vue"),
    },
  },
  {
    path: "/pages/function/groupUnAimList",
    name: "userUnaim",
    components: {
      default: () => import("@/views/userUnaim.vue"),
    },
  },
  {
    path: "/pages/wallet/minsUploadIdCard",
    name: "MinsUploadIdCard",
    components: {
      default: () => import("@/views/uploadIdCard.vue"),
    },
  },
  {
    path: "/pages/wallet/uploadIdCard",
    name: "UploadIdCard",
    components: {
      default: () => import("@/views/uploadIdCard.vue"),
    },
  },
  {
    path: "/pages/wallet/safeBilling",
    name: "SafeBilling",
    components: {
      default: () => import("@/views/safeBilling.vue"),
    },
  },
  {
    path: "/pages/wallet/transferSelf",
    name: "TransferSelf",
    components: {
      default: () => import("@/views/transferSelf.vue"),
    },
  },
  {
    path: "/pages/wallet/transferSub",
    name: "TransferSub",
    components: {
      default: () => import("@/views/transferSub.vue"),
    },
  },
  {
    path: "/pages/securityCenter/addBankCard",
    name: "AddBankCard",
    components: {
      default: () => import("@/views/addressBank.vue"),
    },
  },
  {
    path: "/pages/securityCenter/addUsdt",
    name: "AddressUsdt",
    components: {
      default: () => import("@/views/addressUsdt.vue"),
    },
  },
  {
    path: "/pages/securityCenter/simAdd",
    name: "AddressSim",
    components: {
      default: () => import("@/views/addressUsdt.vue"),
    },
  },
  {
    path: "/pages/securityCenter/addWallet",
    name: "AddressWallet",
    components: {
      default: () => import("@/views/addressWallet.vue"),
    },
  },
  {
    path: "/pages/address/list",
    name: "AddressList",
    components: {
      default: () => import("@/views/addressList.vue"),
    },
  },
  {
    path: "/pages/home/vip",
    name: "Vip",
    components: {
      default: () => import("@/views/vip.vue"),
    },
  },
  {
    path: "/pages/wallet/withdraw",
    name: "Withdraw",
    components: {
      default: () => import("@/views/withdraw.vue"),
    },
  },
  {
    path: "/pages/wallet/onlineRecharge",
    name: "Recharge",
    components: {
      default: () => import("@/views/recharge.vue"),
    },
  },
  {
    path: "/pages/function/messageCenter",
    name: "Message",
    components: {
      default: () => import("@/views/message.vue"),
    },
  },
  {
    path: "/pages/Download",
    name: "Download",
    components: {
      default: () => import("@/views/user.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/pages/me/share",
    name: "Share",
    components: {
      default: () => import("@/views/share.vue"),
    },
  },
  {
    path: "/pages/function/rebate_center",
    name: "Rebate",
    components: {
      default: () => import("@/views/rebate.vue"),
    },
  },
  {
    path: "/pages/function/agency_center",
    name: "Agency",
    components: {
      default: () => import("@/views/agency.vue"),
    },
  },
  {
    path: "/pages/wallet/index",
    name: "Wallet",
    components: {
      default: () => import("@/views/wallet.vue"),
    },
  },
  {
    path: "/pages/user/report_management",
    name: "ReportManagement",
    components: {
      default: () => import("@/views/reportManagement.vue"),
    },
  },

  {
    path: "/pages/user/orderCenter",
    name: "orderCenter",
    components: {
      default: () => import("@/views/orderCenter.vue"),
    },
  },
  {
    path: "/pages/user/Report/personalReport",
    name: "PersonalReport",
    components: {
      default: () => import("@/views/personalReport.vue"),
    },
  },
  {
    path: "/pages/function/billing_details",
    name: "BalanceDetails",
    components: {
      default: () => import("@/views/balanceDetails.vue"),
    },
  },
  {
    path: "/pages/user/withdrawRecord",
    name: "WithdrawRecord",
    components: {
      default: () => import("@/views/withdrawRecord.vue"),
    },
  },
  {
    path: "/pages/function/rechargeHistory",
    name: "FinancialPecords",
    components: {
      //RechargeHistory
      default: () => import("@/views/RechargeHistory.vue"),
    },
  },
  {
    path: "/pages/function/withdrawHistory",
    name: "WithdrawHistory",
    components: {
      default: () => import("@/views/withdrawHistory.vue"),
    },
  },
  {
    path: "/page/user",
    name: "User",
    components: {
      default: () => import("@/views/user.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/page/list",
    name: "List",
    components: {
      default: () => import("@/views/list.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/page/order",
    name: "order",
    components: {
      default: () => import("@/views/order.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/page/trade",
    name: "trade",
    components: {
      default: () => import("@/views/trade.vue"),
      AppBtmBar,
    },
  },
  {
    path: "/page/detail",
    name: "Detail",
    components: {
      default: () => import("@/views/detail.vue"),
    },
  },
  {
    path: "/login/forget",
    name: "LoginForget",
    components: {
      default: () => import("@/views/loginForget.vue"),
    },
  },
  {
    path: "/login/SignIn",
    name: "Login",
    components: {
      default: () => import("@/views/login.vue"),
    },
  },
  {
    path: "/login/register",
    name: "Register",
    components: {
      default: () => import("@/views/register.vue"),
    },
  },
  {
    path: "/pages/deal/userProfile",
    name: "UserProfile",
    components: {
      default: () => import("@/views/userProfile.vue"),
    },
  },
  {
    path: "/pages/deal/bankAccountList",
    name: "DealBankAccountList",
    components: {
      default: () => import("@/views/deal/bankAccountList.vue"),
    },
  },
  {
    path: "/pages/deal/buyDetail",
    name: "BuyDetail",
    components: {
      default: () => import("@/views/deal/buyDetail.vue"),
    },
  },
  {
    path: "/pages/deal/createOrder",
    name: "createOrder",
    components: {
      default: () => import("@/views/deal/createOrder.vue"),
    },
  },
  {
    path: "/pages/deal/order",
    name: "DealOrder",
    components: {
      default: () => import("@/views/deal/order.vue"),
    },
  },
  {
    path: "/pages/deal/createMerchant",
    name: "CreateMerchant",
    components: {
      default: () => import("@/views/deal/createMerchant.vue"),
    },
  },
  {
    path: "/pages/deal/canleOrder",
    name: "CanleOrder",
    components: {
      default: () => import("@/views/deal/canleOrder.vue"),
    },
  },
  {
    path: "/pages/deal/bellCenterMer",
    name: "DealMessage",
    components: {
      default: () => import("@/views/deal/message.vue"),
    },
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});
router.beforeEach(async (to, from, next) => {
  Nprogress.start();
  const ajaxs = [];
  if (!store.state.serveData.serviceAddr) {
    store.dispatch("getServeData");
  }
  if (!store.state.config.area_code.length) {
    ajaxs.push(store.dispatch("getCodeList"));
  }
  await Promise.all(ajaxs);
  if (auth.getToken() && !store.state.user.id) {
    const [error] = await store.dispatch("getInfo");
    if (error && auth.getToken("userInfo")) {
      store.commit("setUser", JSON.parse(auth.getToken("userInfo")));
      // store.commit("loginOut");
      // next({
      //   name: "Login",
      //   backUrl: app.$router.currentRoute.fullPath,
      // });
      // return;
    }
  }
  if (auth.getToken()) {
    // toLowerCase 浏览器将大写字母改成小写
    if (to.path.includes("/login")) {
      Nprogress.done();
      next("/");
    } else {
      next();
    }
  } else {
    // || to.path === "/"
    if (to.path.includes("/login")) {
      next();
    } else {
      Nprogress.done();
      next("/login/SignIn");
    }
  }
  next();
});
router.afterEach(() => {
  store.commit("setPdTop", true);
  Nprogress.done();
});
export default router;
