<template>
  <ul class="order-nav">
    <li
      :class="{ active: type === 0 }"
      @click="$router.replace({ name: 'ChangFundPassword' })"
      class="center-center"
    >
      {{ $t("password.setting.pass.button.text") }}
    </li>
    <li
      :class="{ active: type === 1 }"
      @click="$router.replace({ name: 'FundPasswordSetting' })"
      class="center-center"
    >
      {{ $t("index.login.forget.text") }}
    </li>
  </ul>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "PasswordNav",
  data() {
    return {};
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  components: {},
};
</script>
<style scoped lang="less">
.order-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  margin: 0 16px;

  & > li {
    width: 50%;
    height: 32px;
    border-radius: 10px;
    background-color: #fff;
  }
  .active {
    background-color: #02f;
    color: #fff;
  }
}
</style>
