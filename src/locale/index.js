import Vue from "vue";
import VueI18n from "vue-i18n";
// 导入语言包信息
import en from "./en.json";
// import eg from "./eg.json";
import zh from "./zh.json";
import de from "./de.json";
import dz from "./dz.json";
import ind from "./in.json";
import fr from "./fr.json";
import deal from "./deal.json";
import store from "@/store";
// 注册i18n
Vue.use(VueI18n);
// 语言包根据语言环境分类
export const messages = {
  en: { ...en, ...deal.en },
  zh: { ...zh, ...deal.zh },
  de: { ...de, ...deal.de },
  dz: { ...dz, ...deal.dz },
  ind: { ...ind, ...deal.in },
  fr: { ...fr, ...deal.fr },
};
// 通过选项创建 VueI18n 实例并导出
export default new VueI18n({
  locale: store.state.lang, // 设置地区
  messages, // 设置语言环境对应信息
});
