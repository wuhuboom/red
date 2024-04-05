<template>
  <div class="about-us-view font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('user.About.Us')"
    >
    </AppTopBar>
    <ul class="about-nav">
      <li
        class="list"
        v-for="(item, idx) in nav"
        @click="
          $router.push({
            name: item.link,
          })
        "
        :key="idx"
      >
        <p>{{ item.name }}</p>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "AboutUsView",
  data() {
    return {
      nav: [
        {
          name: this.$t("user.help.center.user.notice.text"),
          link: "ArtTpl",
        },
        {
          name: this.$t("user.help.center.privacy.solicy.text"),
          link: "PrivacySolicy",
        },
        {
          name: this.$t("user.help.center.technical.support.text"),
          link: "Technicalsupport",
        },
      ],
    };
  },
};
</script>
<style scoped lang="less">
.about-us-view {
  min-height: 100vh;
  background-color: #f8f8f8;
  color: #242424;
  .about-nav {
    padding: 0 24px;
    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 78px;
    }
    & > li {
      border-bottom: 2px solid #ededed;
    }
  }
}
</style>
