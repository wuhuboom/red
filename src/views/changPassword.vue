<template>
  <div class="change-password-view font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.pass.text')"
    >
    </AppTopBar>
    <PasswordNav />
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          v-model.trim="form.loginPass"
          autocomplete="new-password"
          :type="showText ? '' : 'password'"
          :label="$t('password.setting.login.pass.button.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[{ required: true, message: $t('backapi.passwordIsEmpty') }]"
        />
        <van-field
          class="res-icon-size"
          v-model.trim="form.password"
          autocomplete="new-password"
          :type="showText ? '' : 'password'"
          :label="$t('form.new.password.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
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
          :type="showText ? '' : 'password'"
          :label="$t('form.confirm.password.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
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
        <div class="sumit-section pt-16 px-16">
          <van-button
            class="res-van-button button-blue"
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
import PasswordNav from "@/views/components/PasswordNav.vue";
export default {
  name: "ChangPassword",
  components: {
    PasswordNav,
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
  color: #242424;
  background-color: #f8f8f8;
  ::v-deep {
    .van-cell {
      background-color: transparent;
    }
  }
}
</style>
