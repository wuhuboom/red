<template>
  <div class="change-password-view font14 pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.pass.text')"
    >
    </AppTopBar>
    <PasswordNav :type="1" />
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          class="res-icon-size chose-verification"
          autocomplete="new-password"
          :label="$t('index.editor.psd.text')"
        >
          <template #input>
            <van-dropdown-menu
              class="drop-menu"
              :overlay="false"
              active-color="#222222"
            >
              <van-dropdown-item
                :disabled="countdown > 0"
                v-model.trim="form.verificationVal"
                :options="verificationOpt"
              />
            </van-dropdown-menu>
          </template>
        </van-field>
        <van-field
          class="res-icon-size"
          v-if="form.verificationVal == 1"
          disabled
          :value="user.email"
          :label="$t('form.email.text')"
        />
        <van-field
          class="res-icon-size"
          v-if="form.verificationVal == 2"
          :value="user.phone"
          disabled
          :label="$t('password.setting.phone.old.phone.text')"
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
const initCountdown = 60;
import userApi from "@/api/user";
import PasswordNav from "@/views/components/PasswordNav.vue";
export default {
  name: "ChangPassword",
  components: {
    PasswordNav,
  },
  data() {
    return {
      countdown: 0,
      loading: false,
      showText: false,
      form: {
        vercode: "",
        verificationVal: 1,
        password: "",
        twoPassword: "",
      },
      verificationOpt: [
        {
          text: "Email",
          value: 1,
        },
        {
          text: "SMS",
          value: 2,
        },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
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
      if (this.form.verificationVal === 1) {
        userApi.emailCodeReq({
          email: this.user.email,
        });
      } else {
        userApi.phoneCodeReq({
          phone: this.user.phone,
        });
      }
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
    validatePassword(password) {
      return /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/.test(password);
    },
    openEye() {
      this.showText = !this.showText;
    },
    async onSubmit() {
      let reqParam = {};

      if (this.form.verificationVal == 1) {
        reqParam.email = this.user.email;
      } else if (this.form.verificationVal == 2) {
        reqParam.phone = this.user.phone;
      }

      reqParam.code = this.form.vercode;
      reqParam.newPwd = this.form.password;
      reqParam.twicePwd = this.form.twoPassword;
      this.loading = true;
      const [err] = await userApi.changePwdOnlineReq(reqParam);
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
