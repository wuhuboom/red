import axios from "axios";
import app from "@/main";
import to from "await-to-js";
const baseURL =
  process.env.NODE_ENV === "production"
    ? window.BASEPATH
    : process.env.VUE_APP_API;
const instance = axios.create({
  baseURL: `${baseURL}/player`,
  timeout: 20 * 1000,
  responseType: "json", // Add this line to set the default responseType
});
instance.interceptors.request.use(
  (config) => {
    const token = app.$store.state.token;
    if (token) config.headers.Token = token;
    if (config.data && typeof config.data === "object") {
      // 创建一个 FormData 实例
      const formData = new FormData();

      // 遍历请求参数对象，将每个参数添加到 FormData 中
      for (let key in config.data) {
        formData.append(key, config.data[key]);
      }

      // 将 FormData 设置为请求的参数
      config.data = formData;
    }
    config.params = Object.assign({}, config.params || {}, {
      // reqConfig: process.env.VUE_APP_FIX,
    });

    return config;
  },
  (err) => Promise.reject(err)
);
const specialCode = [];
instance.interceptors.response.use(
  (res) => {
    const result = res.data || {};
    let { code, msg } = result;
    if ([500].includes(code)) {
      msg = "system  fail";
    }
    if (code === 402) {
      app.$toast.clear();
      app.$store.commit("loginOut");
      app.$router.push({
        name: "Login",
        backUrl: app.$router.currentRoute.fullPath,
      });
      return Promise.reject({ code });
    }
    if (code !== 200) {
      if (!specialCode.includes(code) && msg) {
        if (code === 188) {
          //188 系统维护中
          app.$store.commit("setMainShow", {
            show: true,
            msg,
          });
        } else {
          app.$toast(msg);
        }
      }
      return Promise.reject(result);
    }
    return result;
  },
  async (err) => {
    //app.$message.error("网络错误，请稍后重试");
    return Promise.reject(err);
  }
);

// 2. 导出一个通过新axios实例调用接口的函数
export default ({
  url,
  method = "get",
  params,
  data,
  headers,
  responseType,
  noAutoFormData = true,
}) => {
  const promise = instance({
    url,
    method,
    params,
    data,
    responseType,
    headers,
    noAutoFormData,
  });
  return to(promise);
};
