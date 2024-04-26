<template>
  <div class="root-dialog">
    <van-dialog
      class="app-root-upload-dialog color-primary"
      :showConfirmButton="false"
      v-model="show"
      @confirm="confirm"
    >
      <ul class="upload-cont">
        <li class="center-center">
          <!-- <img src="@/assets/img/setPay.webp" alt="" /> -->
        </li>
        <li class="py-16">{{ $t(`user.payment.password`) }}</li>
      </ul>
      <van-form class="defind-form" @submit="onSubmit">
        <van-field
          v-model.trim="form.payPwd"
          :right-icon="`color-fff icon iconfont color-active ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :type="showText ? 'text' : 'password'"
          @click-right-icon="openEye"
          :placeholder="$t(`form.password.place`)"
          autocomplete="new-password"
          :rules="[
            {
              validator: validatePassword,
              message: $t('ruls.pass.length6'),
            },
          ]"
        />
        <van-field
          v-model.trim="form.payPwdAgain"
          :type="showText ? 'text' : 'password'"
          @click-right-icon="openEye"
          :right-icon="`color-fff icon iconfont color-active ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          autocomplete="new-password"
          :placeholder="$t(`form.twoPassword.text`)"
          :rules="[
            {
              validator: validatePassword,
              message: $t('ruls.passtwo.length6'),
            },
            {
              validator: validateTwo,
              message: this.$t('ruls.passtwo.unequal'),
            },
          ]"
        />
        <div class="pt-16 center-center">
          <van-button
            :loading="loading"
            class="page-res-btn"
            round
            block
            type="info"
            native-type="submit"
            >{{ $t(`modal.confirm.text`) }}</van-button
          >
        </div>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "RootDialog",
  data() {
    return {
      loading: false,
      show: false,
      form: {
        payPwd: "",
        payPwdAgain: "",
      },
      showText: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    paySet() {
      return this.$store.state.paySet;
    },
  },
  methods: {
    validatePassword(password) {
      return /^.{6,16}$/.test(password);
    },
    validateTwo(value) {
      return value === this.form.payPwd;
    },
    openEye() {
      this.showText = !this.showText;
    },
    async onSubmit() {
      this.loading = true;
      const [err] = await userApi.setPwdPay(this.form);
      this.loading = false;
      if (err) {
        return;
      }
      this.show = false;
      this.$toast(this.$t("backapi.setPaySuccess"));
      this.$store.commit("changepaySet", 1);
    },
    confirm() {
      this.$emit("confirm");
    },
  },
  async created() {
    if (!this.user.id || this.paySet) return;
    const [err, res] = await userApi.getPwdPay();
    if (err) {
      return;
    }
    if (res.data.paySet === 2) {
      this.show = true;
    } else {
      this.$store.commit("changepaySet", 1);
    }
  },
};
</script>
<style scoped lang="less">
.root-dialog {
  ::v-deep {
    .app-root-upload-dialog {
      padding: 20px 30px 30px;
      background: url("@/assets/img/red/paybg.webp") no-repeat center bottom
        transparent;
      background-size: 100% 100%;
      .van-hairline--top::after {
        display: none;
      }
      .upload-cont {
        & > li:nth-child(1) {
          img {
            width: 70px;
            height: 70px;
            object-fit: contain;
            display: block;
          }
        }

        & > li:nth-child(2) {
          font-size: 14px;
          line-height: 1.8;
        }
      }
    }
  }
}
</style>
