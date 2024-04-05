<template>
  <div
    class="appp-top-bar align-center justify-between max-width750"
    :style="styleObj"
  >
    <div class="appp-top-cont align-center justify-between">
      <van-button
        @click="goback"
        class="icon-button"
        v-if="showLeft"
        :icon="leftIcon"
        type="primary"
      />
      <div
        class="appp-top-bar-title js-appp-top-bar-title"
        :class="titleClass"
        @click.stop.prevent
      >
        {{ titleSolt ? "" : topBarTitle }}
        <slot name="title"></slot>
      </div>
      <div class="right center-center">
        <slot name="right"></slot>
      </div>
    </div>
    <RootDialog />
  </div>
</template>

<script>
import RootDialog from "@/views/components/RootDialog.vue";
export default {
  name: "AppTopBar",
  components: {
    RootDialog,
  },
  props: {
    titleClass: {
      type: Array,
      default: () => [],
    },
    titleSolt: {
      type: Boolean,
      default: false,
    },
    showLeft: {
      type: Boolean,
      default: true,
    },
    leftIcon: {
      type: String,
      default: "arrow-left",
    },
    styleObj: {
      type: Object,
      default: () => ({
        backgroundColor: "#fff",
      }),
    },
    showMsg: {
      type: Boolean,
      default: false,
    },
    topBarTitle: {
      type: String,
      default: "",
    },
    back: {
      type: Function,
      default: null,
    },
  },
  methods: {
    goback() {
      if (this.back) {
        this.back();
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>
<style scoped lang="less">
.right {
  min-width: 43px;
}
</style>
