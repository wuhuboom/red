import Vue from "vue";
import Vuex from "vuex";
import userApi from "@/api/user";
import auth from "@/plugins/auth";
import util from "@/plugins/util";
import enlang from "@/assets/img/en-lang.webp";
import delang from "@/assets/img/de-lang.webp";
import dzlang from "@/assets/img/dz-lang.webp";
import inlang from "@/assets/img/in-lang.webp";
import frlang from "@/assets/img/fr-lang.webp";
import app from "@/main";
Vue.use(Vuex);
const lang = location.href.includes("zmkm") ? "zh" : "";
export default new Vuex.Store({
  state: {
    showMain: {
      show: false,
      msg: "",
    },
    topBar: {
      height: 0,
    },
    setPdTop: true,
    config: {
      area_code: [],
    },
    user: {},
    lang: lang || localStorage.getItem("lang") || "en",
    // 令牌  初始化从本地获取 English  Germany Algeria India France
    token: auth.getToken(),
    langOpt: [
      {
        label: "EN",
        text: "English",
        value: "en",
        icon: enlang,
      },
      {
        label: "DE",
        text: "Germany",
        icon: delang,
        value: "de",
      },
      {
        label: "DZ",
        icon: dzlang,
        text: "Algeria",
        value: "dz",
      },
      {
        label: "IN",
        icon: inlang,
        text: "India",
        value: "ind",
      },
      {
        label: "FR",
        icon: frlang,
        text: "France",
        value: "fr",
      },
      //TODO 注释掉埃及语言
      // {
      // 	label: 'EG',
      // 	value: 'eg',
      // },
      // {
      //     label: 'CN',
      //     value: 'zh',
      // }
    ],
    serveData: {},
    fbMsg: {
      hasMsg: 0,
    },
    paySet: null,
    safeConfig: {},
  },
  getters: {
    defaultCode(state) {
      if (!state.config.area_code.length) return "";
      return state.config.area_code[0];
    },
  },
  mutations: {
    setMainShow(state, data) {
      Object.assign(state.showMain, data);
    },
    setSafeConfig(state, data) {
      state.safeConfig = data;
    },
    changepaySet(state, data) {
      state.paySet = data;
    },
    setFbMsg(state, data) {
      state.fbMsg = data;
    },
    setServeData(state, data) {
      state.serveData = data;
    },
    setPdTop(state, data) {
      state.setPdTop = data;
    },
    setLang(state, lang) {
      state.lang = lang;
      localStorage.setItem("lang", lang);
      location.reload();
    },
    setToken(state, token) {
      state.token = token;
      auth.setToken(token);
    },
    setUser(state, data) {
      auth.setToken(JSON.stringify(data), "userInfo");
      state.user = data;
    },
    loginOut(state) {
      state.paySet = null;
      state.user = {};
      auth.clearToken();
    },
    setCodeList(state, data) {
      state.config = data;
    },
    goServe(state) {
      if (!state.serveData.serviceAddr) return;
      location.href = state.serveData.serviceAddr;
      //window.open(state.serveData.serviceAddr);
    },
  },
  actions: {
    async appDownload() {
      const appType = util.detectDevice();
      const [err, res] = await userApi.appUrl({ appType });
      if (err) return;
      const item = res.data.find((v) => v.appType === appType);
      if (!item) return;
      await userApi.appCount({ id: item.id });
      window.location.href = item.appUrl;
    },
    async getCodeList({ commit }, params) {
      const [err, result] = await userApi.authSysconfig();
      if (err) return;
      commit("setCodeList", result.data);
      console.log(params);
      commit("setMainShow", {
        show: false,
        msg: "",
      });
    },
    async getInfo({ commit }) {
      const [err, result] = await userApi.userInfo();
      if (err) return [err];
      commit("setUser", result.data);
      return [null, result];
    },
    async setSafeConfig({ commit }) {
      const [err, result] = await userApi.fbConf();
      if (err) return [err];
      commit("setSafeConfig", result.data);
      return [null, result];
    },
    async getServeData({ commit }) {
      const token = auth.getToken();
      const [err, result] = await userApi[
        `${token ? "servReq" : "servTmpReq"}`
      ]();
      if (err) {
        if (Array.isArray(err.data) && err.data.length) {
          app.$toast(err.data[0].msg);
        }
        return [err];
      }
      commit("setServeData", result.data);
      return [null, result];
    },
    async getHasMsg({ commit }) {
      const [err, result] = await userApi.hasMsg();
      if (err) return [err];
      commit("setFbMsg", result.data);
      return [null, result];
    },
  },
  modules: {},
});
