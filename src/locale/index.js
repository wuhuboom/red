import Vue from "vue";
import VueI18n from "vue-i18n";
// 导入语言包信息
import en from "./en.json";
import zh from "./zh.json";
import deal from "./deal.json";
import dz from "./dz.json";
import de from "./de.json";
import ru from "./ru.json";
import fr from "./fr.json";
import pt from "./pt.json";
import es from "./es.json";
import ind from "./in.json";
import np from "./np.json";
import store from "@/store";
// 注册i18n
Vue.use(VueI18n);
// 语言包根据语言环境分类
export const messages = {
  en: { ...en, ...deal.en },
  zh: { ...zh, ...deal.zh },
  dz: { ...dz },
  de: { ...de },
  ru: { ...ru },
  fr: { ...fr },
  pt: { ...pt },
  es: { ...es },
  in: { ...ind },
  np: { ...np },
};
// 通过选项创建 VueI18n 实例并导出
export default new VueI18n({
  locale: store.state.lang, // 设置地区
  messages, // 设置语言环境对应信息
});
