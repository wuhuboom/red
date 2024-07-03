import Vue from "vue";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);
import element from "./plugins/element";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/comm.scss";
Vue.config.productionTip = false;
Vue.use(element);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
