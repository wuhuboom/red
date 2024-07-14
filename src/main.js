import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/comm.scss";
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
