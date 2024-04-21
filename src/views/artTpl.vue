<template>
  <div class="art-tpl-view font12 colorfff">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('help_notice_title.text')"
    >
    </AppTopBar>
    <div class="px-16">
      <p class="title">{{ $t("help_notice_ques.use.title.text") }}</p>
      <p class="pb-16 cont">1.{{ $t("help_notice_ques.use.ans1.text") }}</p>
      <p class="pb-16 cont">2.{{ $t("help_notice_ques.use.ans2.text") }}</p>

      <p class="title">{{ $t("help_notice_ques.bet.title.text") }}</p>
      <p class="pb-16 cont">1.{{ $t("help_notice_ques.bet.ans1.text") }}</p>
      <p class="pb-16 cont">2.{{ $t("help_notice_ques.bet.ans2.text") }}</p>
      <p class="pb-16 cont">3.{{ $t("help_notice_ques.bet.ans11.text") }}</p>
      <p class="pb-16 cont">4.{{ $t("help_notice_ques.bet.ans12.text") }}</p>

      <p class="title">{{ $t("help_notice_ques.disclaimer.title.text") }}</p>
      <p class="pb-16 cont">
        1.{{ $t("help_notice_ques.disclaimer.ans1.text") }}
      </p>
      <p class="pb-16 cont">
        2.{{ $t("help_notice_ques.disclaimer.ans2.text") }}
      </p>
      <p class="pb-16 cont">
        3.{{ $t("help_notice_ques.disclaimer.ans3.text") }}
      </p>
      <p class="pb-16 cont">
        4.{{ $t("help_notice_ques.disclaimer.ans4.text") }}
      </p>

      <p class="title">{{ $t("help_notice_ques.general.title.text") }}</p>
      <p class="pb-16 cont">1.{{ $t("help_notice_ques.general.ans1.text") }}</p>
      <p class="pb-16 cont">2.{{ $t("help_notice_ques.general.ans2.text") }}</p>
      <p class="pb-16 cont">3.{{ $t("help_notice_ques.general.ans3.text") }}</p>
      <p class="pb-16 cont">4.{{ $t("help_notice_ques.general.ans4.text") }}</p>
      <p class="pb-16 cont">5.{{ $t("help_notice_ques.general.ans5.text") }}</p>
      <p class="pb-16 cont">6.{{ $t("help_notice_ques.general.ans6.text") }}</p>
      <p class="pb-16 cont">7.{{ $t("help_notice_ques.general.ans7.text") }}</p>
      <p class="pb-16 cont">8.{{ $t("help_notice_ques.general.ans8.text") }}</p>
      <p class="pb-16 cont">9.{{ $t("help_notice_ques.general.ans9.text") }}</p>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "ArtTplView",
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
