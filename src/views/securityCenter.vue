<template>
  <div class="security-center-view font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('me.security.text')"
    >
    </AppTopBar>
    <div class="security-first center-center">
      <img src="@/assets/img/security0.webp" alt="" />
    </div>
    <ul class="nav">
      <li @click="$router.push({ name: 'ChangPassword' })">
        <p class="icon-text">
          <img src="@/assets/img/security1.webp" alt="" />
          {{ $t("security.pass.text") }}
        </p>
        <van-icon name="arrow" />
      </li>
      <li @click="$router.push({ name: 'ChangFundPassword' })">
        <p class="icon-text">
          <img src="@/assets/img/security2.webp" alt="" />
          {{ $t("security.fun.pass.text") }}
        </p>
        <van-icon name="arrow" />
      </li>
      <li @click="$router.push({ name: 'BankAccountList' })">
        <p class="icon-text">
          <img src="@/assets/img/security3.webp" alt="" />
          {{ $t("new.Withdrawallist") }}
        </p>
        <van-icon name="arrow" />
      </li>
      <!-- <li> BankAccountList
        <p class="icon-text">
          <img src="@/assets/img/security4.webp" alt="" />
          {{ $t("security.wallet.text") }}
        </p>
        <van-icon name="arrow" />
      </li> -->
      <li @click="$router.push({ name: 'UpdataPhone' })">
        <p class="icon-text">
          <img src="@/assets/img/security5.webp" alt="" />
          {{ $t("security.phone.text") }}
        </p>
        <van-icon name="arrow" />
      </li>
      <li>
        <p class="icon-text" @click="$router.push({ name: 'UpdataEmail' })">
          <img src="@/assets/img/security6.webp" alt="" />
          {{ $t("security.mail.text") }}
        </p>
        <van-icon name="arrow" />
      </li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "SecurityCenter",
  data() {
    return {};
  },
  methods: {
    loginOut() {
      this.$store.commit("loginOut");
      this.$router.replace({ name: "Login" });
    },
  },
};
</script>
<style scoped lang="less">
.security-center-view {
  color: #242424;
  background-color: #f8f8f8;
  .nav {
    border-radius: 20px;
    padding: 0 24px;
    background-color: #fff;
    & > li {
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #ededed;
    }
    & > li:last-child {
      border-bottom: none;
    }
    p {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
        margin-right: 14px;
        object-fit: cover;
      }
    }
  }
  .red-text {
    color: #ff4c5e;
  }
  .security-first {
    padding: 30px 0 15px;
    img {
      width: 127px;
      height: 136px;
      object-fit: cover;
    }
  }
}
</style>
