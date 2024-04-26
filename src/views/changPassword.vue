<template>
  <div class="change-password-view font12 color-primary">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.pass.text')"
    >
    </AppTopBar>
    <HistoryNav
      :type="0"
      :skip1="{
        name: 'ChangPassword',
        text: $t(`password.setting.pass.button.text`),
      }"
      :skip2="{ name: 'ForgetPassword', text: $t(`index.login.forget.text`) }"
    />
    <div class="m-l-24 m-r-24">
      <van-form class="defind-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          v-model.trim="form.loginPass"
          autocomplete="new-password"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('password.setting.login.pass.button.text')"
          @click-right-icon="openEye"
          :right-icon="`color-fff icon iconfont ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[{ required: true, message: $t('backapi.passwordIsEmpty') }]"
        />
        <van-field
          class="res-icon-size"
          v-model.trim="form.password"
          autocomplete="new-password"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('form.new.password.text')"
          @click-right-icon="openEye"
          :right-icon="`color-fff icon iconfont ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[
            {
              validator: validatePassword,
              message: $t('backapi.passwordEasy'),
            },
          ]"
        />
        <van-field
          class="res-icon-size"
          v-model.trim="form.twoPassword"
          autocomplete="new-password"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('form.confirm.password.text')"
          @click-right-icon="openEye"
          :right-icon="`color-fff icon iconfont ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[
            {
              validator: validatePassword,
              message: $t('backapi.passwordEasy'),
            },
            {
              validator: validateTwo,
              message: this.$t('ruls.passtwo.unequal'),
            },
          ]"
        />
        <div class="sumit-section center-center pt-16 px-16">
          <van-button
            class="page-res-btn"
            :loading="loading"
            block
            type="info"
            native-type="submit"
            >{{ $t("modal.confirm.text") }}</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import HistoryNav from "@/views/components/HistoryNav.vue";
export default {
  name: "ChangPassword",
  components: {
    HistoryNav,
  },
  data() {
    return {
      loading: false,
      showText: false,
      form: {
        loginPass: "",
        password: "",
        twoPassword: "",
      },
    };
  },
  methods: {
    validateTwo(value) {
      return value === this.form.password;
    },
    validatePassword(password) {
      return /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/.test(password);
    },
    openEye() {
      this.showText = !this.showText;
    },
    async onSubmit() {
      let reqParam = {};
      reqParam.origin = this.form.loginPass;
      reqParam.newpwd = this.form.password;
      reqParam.confirmed = this.form.twoPassword;
      this.loading = true;
      const [err] = await userApi.authEditPwd(reqParam);
      this.loading = false;
      if (err) {
        const currMsgKey = err.data && err.data[0] && err.data[0].msgKey;
        if (currMsgKey) {
          this.$toast(this.$t(`backapi.${currMsgKey}`));
        }
        return;
      }
      this.$store.commit("loginOut");
      this.$toast.success();
      this.$router.replace({ name: "Login" });
    },
  },
  created() {
    // this.$toast.success("");
  },
};
</script>
<style scoped lang="less">
.change-password-view {
  ::v-deep {
    .iconfont {
      color: var(--primary);
    }
  }
}
</style>
