<template>
  <div class="art-tpl-view font12 colorfff">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('user.help.center.privacy.solicy.text')"
    >
    </AppTopBar>
    <div class="px-16">
      <p class="title">
        {{ $t("tec_support_hack.text") }}
      </p>

      <p class="pb-16 cont">1.{{ $t("tec_support_ans.down.text") }}</p>
      <p class="pb-16 cont">2.{{ $t("tec_support_ans.user.text") }}</p>
      <p class="pb-16 cont">3.{{ $t("tec_support_ans.protect.text") }}</p>
      <p class="pb-16 cont">4.{{ $t("tec_support_ans.often.text") }}</p>

      <p class="title">{{ $t("tec_support_protect.text") }}</p>
      <p class="pb-16 cont">1.{{ $t("tec_support_protect.ans1.text") }}</p>
      <p class="pb-16 cont">2.{{ $t("tec_support_protect.ans2.text") }}</p>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "TechnicalsupportView",
  data() {
    return {};
  },
};
</script>
<style scoped lang="less">
.art-tpl-view {
  .title {
    padding: 0 0 16px;
    font-size: 18px;
  }
  .cont {
    line-height: 1.8;
  }
}
</style>
