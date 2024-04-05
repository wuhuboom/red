<template>
  <div class="app-btm-bar">
    <ul class="app-btm-list max-width750">
      <li
        :class="{
          active: $router.currentRoute.name == item.name || item.active,
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
        <p
          class="text"
          v-if="$router.currentRoute.name == item.name || item.active"
        >
          {{ item.text }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import i18n from "@/locale";
export default {
  name: "AppBtmBar",
  props: {},
  data() {
    return {
      list: [
        {
          icon: require("@/assets/img/btm.png"),
          icon1: require("@/assets/img/btmv.png"),
          text: i18n.t("tabar.home"),
          name: "home",
          active: false,
        },
        {
          icon: require("@/assets/img/btm1.png"),
          icon1: require("@/assets/img/btm1v.png"),
          text: i18n.t("tabar.match"),
          name: "List",
          active: false,
        },
        {
          icon: require("@/assets/img/btm2.png"),
          icon1: require("@/assets/img/btm2v.png"),
          text: i18n.t("tabar.bet"),
          name: "order",
          active: false,
        },
        {
          icon: require("@/assets/img/btm3.png"),
          icon1: require("@/assets/img/btm3v.png"),
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
  .app-btm-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 998;
    background-color: #fff;
    font-size: 12px;
    .text {
      margin-left: 6px;
    }
    li {
      height: 38px;
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
      background-color: var(--primary);
      color: #fff;
    }
  }
}
</style>
