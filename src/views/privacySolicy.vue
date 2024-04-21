<template>
  <div class="art-tpl-view font12 colorfff">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('user.help.center.privacy.solicy.text')"
    >
    </AppTopBar>
    <div class="px-16">
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.ans.normal1.text") }}
      </p>
      <p class="pb-16 cont">
        2.{{ $t("privacy_support_ques.ans.normal2.text") }}
      </p>
      <p class="pb-16 cont">
        3.{{ $t("privacy_support_ques.ans.normal3.text") }}
      </p>

      <p class="title">
        {{ $t("privacy_support_ques.ans.title.center.text") }}
      </p>
      <p class="title">
        {{ $t("privacy_support_ques.introduction.title.text") }}
      </p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.introduction.ans1.text") }}
      </p>

      <p class="title">{{ $t("privacy_support_ques.purpose.title.text") }}</p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.purpose.ans1.text") }}
      </p>

      <p class="title">
        {{ $t("privacy_support_ques.accessinformation.title.text") }}
      </p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.accessinformation.ans1.text") }}
      </p>

      <p class="title">
        {{ $t("privacy_support_ques.confidentiality.title.text") }}
      </p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.confidentiality.ans1.text") }}
      </p>

      <p class="title">
        {{ $t("privacy_support_ques.recipientinformation.title.text") }}
      </p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.recipientinformation.ans1.text") }}
      </p>
      <p class="title">
        {{ $t("privacy_support_ques.monitor.title.text") }}
      </p>
      <p class="pb-16 cont">
        1.{{ $t("privacy_support_ques.monitor.ans1.text") }}
      </p>
      <p class="pb-16 cont">
        2.{{ $t("privacy_support_ques.monitor.ans2.text") }}
      </p>
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
