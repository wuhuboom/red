<template>
  <div class="change-password-view font14 pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.mail.text')"
    >
    </AppTopBar>
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          disabled
          :value="user.email"
          :label="$t('updata.email.success.text')"
        />
        <van-field
          class="mb-16"
          :label="$t('form.vercode.text')"
          v-model.trim="form.vercode"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t('form.vercode.text'),
              }),
            },
          ]"
        >
          <template #button>
            <van-button
              size="small"
              @click="sendCode"
              :disabled="countdown > 0"
              class="code-btn center-center"
              color="#0025fc"
              >{{ $t("deal.chat.921073-7")
              }}{{ countdown ? `(${countdown})` : "" }}</van-button
            >
          </template>
        </van-field>
        <van-field
          v-model.trim="form.email"
          :label="$t('form.email.text')"
          :placeholder="$t('form.email.text')"
          class="left-icon-box res-icon-size"
          autocomplete="new-password"
          :rules="[{ required: true, message: $t('ruls.email.empty') }]"
        >
          <template #button>
            <span class="emial-fix">{{ emailFix }}</span>
          </template>
        </van-field>

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
const initCountdown = 60;
import userApi from "@/api/user";
export default {
  name: "ChangPassword",
  data() {
    return {
      emailFix: "@gmail.com",
      countdown: 0,
      loading: false,
      showText: false,
      form: {
        vercode: "",
        email: "",
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
        name: this.$t("form.email.text"),
      });
    },
  },
  methods: {
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.countdown = 0;
    },
    sendCode() {
      this.$toast(this.$t("form.verift.going.text"));
      // 模拟发送验证码的操作
      userApi.emailCodeReq({
        email: this.user.email,
      });
      this.clearTimer();
      // 开始倒计时
      this.countdown = initCountdown; // 设置倒计时时长

      // 启动定时器，每秒减少倒计时时间
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.clearTimer(); // 倒计时结束时清除定时器
        }
      }, 1000);
    },
    validateTwo(value) {
      return value === this.form.password;
    },
    openEye() {
      this.showText = !this.showText;
    },
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
    async onSubmit() {
      const status = await this.comfirm();
      if (!status) return;
      let reqParam = {
        email: this.form.email + this.emailFix,
        code: this.form.vercode,
      };
      this.loading = true;
      const [err] = await userApi.emailBindReq(reqParam);
      this.loading = false;
      if (err) {
        const currMsgKey = err.data && err.data[0] && err.data[0].msgKey;
        if (currMsgKey) {
          this.$toast(this.$t(`backapi.${currMsgKey}`));
        }
        return;
      }
      //this.$store.commit("loginOut");
      this.$toast.success();
      this.$store.dispatch("getInfo");
      this.$router.back();
      //this.$router.replace({ name: "Login" });
    },
  },
  created() {
    this.$store.dispatch("getCodeList");
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style scoped lang="less">
.change-password-view {
  color: #242424;
  background-color: #f8f8f8;
  .code-btn {
    min-width: 70px;
    padding: 0 4px;
    height: 32px;
    border-radius: 8px;
    background-color: #0025fc;
  }
  ::v-deep {
    .van-cell {
      background-color: transparent;
    }
    .van-field__body {
      background-color: #fff;
      border-color: #fff;
    }
    .chose-verification {
      .van-field__body {
        padding: 0;
        border: none;
      }
      .van-dropdown-menu__bar {
        border-radius: 10px;
      }
    }
    .van-field--disabled {
      .van-field__label {
        color: #646566;
      }
    }
  }
}
</style>
