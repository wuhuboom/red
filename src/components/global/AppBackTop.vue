<template>
  <div class="app-back-bar" @click="backTop">
    <img src="@/assets/img/top.webp" alt="" />
  </div>
</template>

<script>
export default {
  name: "AppBackTop",
  props: {},
  methods: {
    backTop() {
      if (window.scrollTo) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        // 对于不支持 smooth 滚动的浏览器，使用基本的滚动方式
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    },
  },
};
</script>
<style scoped lang="less">
.app-back-bar {
  width: 42px;
  height: 42px;
  position: fixed;
  right: 16px;
  bottom: 81px;
  z-index: 4;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
