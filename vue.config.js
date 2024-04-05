const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        // 属性值包裹在lessOptions内
        lessOptions: {
          javascriptEnabled: true,
          globalVars: {
            "bg-color": "#fff",
            navHeight: "74px",
          },
        },
      },
    },
  },
});
