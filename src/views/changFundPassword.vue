<template>
  <div class="change-password-view font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.fun.pass.text')"
    >
    </AppTopBar>
    <FunNav />
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          v-model.trim="form.loginPass"
          autocomplete="new-password"
          :type="showText ? '' : 'password'"
          :label="$t('form.pwd2.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
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
          :type="showText ? '' : 'password'"
          :label="$t('form.new.password.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
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
          :type="showText ? '' : 'password'"
          :label="$t('form.confirm.password.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
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
import FunNav from "@/views/components/FunNav.vue";
export default {
  name: "ChangPassword",
  components: {
    FunNav,
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
  color: #242424;
  background-color: #f8f8f8;
  ::v-deep {
    .van-cell {
      background-color: transparent;
    }
  }
}
</style>
