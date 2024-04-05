// postcss.config.js
// eslint-disable-next-line no-undef
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5, // 设计稿宽度的 1/10，例如 375 设计稿则为 37.5
      propList: ["*"],
      selectorBlackList: [],
    },
  },
};
