<template>
  <div class="app-btm-bar">
    <ul class="app-btm-list max-width750">
      <li
        :class="{
          // active: $router.currentRoute.name == item.name || item.active,
        }"
        class="btm-item center-center"
        v-for="(item, idx) in list"
        @click="goPage(item)"
        :key="idx"
      >
        <p>
          <img
            :src="
              $router.currentRoute.name == item.name || item.active
                ? item.icon1
                : item.icon
            "
            alt=""
          />
        </p>
        <p class="text">
          {{ item.text }}
        </p>
      </li>
    </ul>
    <RootDialog />
  </div>
</template>

<script>
import i18n from "@/locale";
import RootDialog from "@/views/components/RootDialog.vue";
export default {
  name: "AppBtmBar",
  components: {
    RootDialog,
  },
  props: {},
  data() {
    return {
      list: [
        {
          icon: require("@/assets/img/red/btm.png"),
          icon1: require("@/assets/img/red/app-btm1.webp"),
          text: i18n.t("tabar.home"),
          name: "home",
          active: false,
        },
        {
          icon: require("@/assets/img/red/btm1.png"),
          icon1: require("@/assets/img/red/app-btm3.webp"),
          text: i18n.t("tabar.match"),
          name: "List",
          active: false,
        },
        {
          icon: require("@/assets/img/red/btm2.png"),
          icon1: require("@/assets/img/red/app-btm2.webp"),
          text: i18n.t("home.order.535219-0"),
          name: "order",
          active: false,
        },
        {
          icon: require("@/assets/img/red/btm3.png"),
          icon1: require("@/assets/img/red/app-btm4.png"),
          text: i18n.t("tabar.me"),
          active: false,
          name: "User",
        },
      ],
    };
  },

  watch: {
    $route(to) {
      this.list.forEach((v) => {
        if (v.name == to.name) {
          v.active = true;
        } else {
          v.active = false;
        }
      });
    },
  },
  methods: {
    goPage(v) {
      if (!v.name) return;
      this.$router.push({
        name: v.name,
      });
    },
  },
};
</script>
<style scoped lang="less">
.app-btm-bar {
  &,
  .app-btm-list {
    height: 55px;
  }
  .btm-item {
    flex-direction: column;
  }
  .app-btm-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 998;
    background-color: var(--bg-body);
    font-size: 12px;
    color: var(--primary);
    .text {
      margin-top: 6px;
    }
    li {
      // height: 38px;
      text-align: center;
      border-radius: 19px;
      min-width: 86px;
    }
    img {
      display: block;
      height: 22px;
      margin: 0 auto;
    }
    .active {
      color: var(--active);
    }
  }
}
</style>
