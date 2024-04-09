<template>
  <div id="app" :style="topBar">
    <router-view name="AppTopBar"></router-view>
    <router-view :key="$router.currentRoute.fullPath" />
    <router-view name="AppBtmBar"></router-view>
    <MaintainDialog />
  </div>
</template>
<script>
import MaintainDialog from "@/views/components/MaintainDialog.vue";
export default {
  name: "App",
  components: {
    MaintainDialog,
  },
  data() {
    return {};
  },
  computed: {
    topBar() {
      if (!this.$store.state.setPdTop) {
        return {
          paddingTop: 0,
        };
      }
      return {};
    },
  },
  created() {},
};
</script>
<style lang="less">
#app {
  padding-top: @navHeight;
  .appp-top-bar {
    position: fixed;
    height: @navHeight;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    .appp-top-cont {
      height: 44px;
      width: 100%;
    }
    .appp-top-bar-title {
      font-size: 14px;
      // font-weight: bold;
      color: #191919;
    }
    .icon-button {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-text);
      .van-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
