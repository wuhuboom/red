<template>
  <div class="change-password-view color-primary font12 pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('security.fun.pass.text')"
    >
    </AppTopBar>
    <HistoryNav
      :type="0"
      :skip1="{
        name: 'ChangFundPassword',
        text: $t(`password.setting.pass.button.text`),
      }"
      :skip2="{
        name: 'FundPasswordSetting',
        text: $t(`index.login.forget.text`),
      }"
    />
    <div class="m-l-24 m-r-24">
      <van-form class="defind-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          v-model.trim="form.loginPass"
          autocomplete="new-password"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('form.pwd2.text')"
          @click-right-icon="openEye"
          :right-icon="`color-fff icon iconfont  ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[
            {
              validator: validatePassword,
              message: $t('ruls.pass.length6'),
            },
          ]"
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
              message: $t('ruls.pass.length6'),
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
              message: $t('ruls.pass.length6'),
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
  computed: {
    user() {
      return this.$store.state.user;
    },
    editImportantLogout() {
      return this.$store.state.config.editImportantLogout || "";
    },
    textContent() {
      return this.$t("edit.tip.text", {
        time: this.editImportantLogout,
        name: this.$t("form.pwd2.text"),
      });
    },
  },
  methods: {
    comfirm() {
      return new Promise((resolve) => {
        this.$dialog
          .confirm({
            message: this.textContent,
            confirmButtonText: this.$t("wallet.index.order.state.text"),
            cancelButtonText: this.$t("wallet.index.order.state.cancel.text"),
          })
          .then(() => {
            resolve(1);
          })
          .catch(() => {
            resolve(0);
          });
      });
    },
    validateTwo(value) {
      return value === this.form.password;
    },
    validatePassword(password) {
      return /^.{6,16}$/.test(password);
    },
    openEye() {
      this.showText = !this.showText;
    },
    async onSubmit() {
      // const status = await this.comfirm();
      // if (!status) return;
      let reqParam = {};
      reqParam.origin = this.form.loginPass;
      reqParam.newPwd = this.form.password;
      reqParam.twicePwd = this.form.twoPassword;
      this.loading = true;
      const [err] = await userApi.editPwdPayReq(reqParam);
      this.loading = false;
      if (err) {
        const currMsgKey = err.data && err.data[0] && err.data[0].msgKey;
        if (currMsgKey) {
          this.$toast(this.$t(`backapi.${currMsgKey}`));
        }
        return;
      }
      this.$toast.success();
      this.$router.back();
    },
  },
  created() {
    // this.$toast.success("");
    this.$store.dispatch("getCodeList");
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
