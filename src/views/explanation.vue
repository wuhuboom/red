<template>
  <div class="safe-billing font12 color-primary pb-16">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t(`wallet.index.explanation.text`)"
    >
    </AppTopBar>
    <ul class="m-r-24 m-l-24 cont-text p-x-16">
      <li class="m-b-16">{{ $t(`backapi.self.safe.rule.content1.text`) }}</li>
      <li class="m-b-16">{{ $t(`backapi.self.safe.rule.content2.text`) }}</li>
      <li class="m-b-16">{{ $t(`backapi.self.safe.rule.content3.text`) }}</li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import i18n from "@/locale";
export default {
  name: "explanationView",
};
</script>
<style scoped lang="less">
.safe-billing {
  .cont-text {
    border: 1px solid var(--primary);
    border-radius: 20px;
  }
}
</style>
