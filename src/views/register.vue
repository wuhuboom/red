<template>
  <div class="register-page">
    <div>
      <div class="center-center register-title">
        <p>
          <img
            class="d-block"
            src="@/assets/img/red/register-title.webp"
            alt=""
          />
        </p>
      </div>
      <van-form class="register-form column-form" ref="form" @submit="onSubmit">
        <van-field
          class="username"
          v-model.trim="form.username"
          autocomplete="new-password"
          name="username"
          :placeholder="$t('form.account.text')"
          :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
        />
        <!-- showText -->
        <van-field
          class="res-icon-size password"
          v-model.trim="form.password"
          autocomplete="new-password"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('form.password.text')"
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
          v-model.trim="form.twoPassword"
          autocomplete="new-password"
          class="res-icon-size password"
          @click-right-icon="openEye"
          :type="showText ? 'text' : 'password'"
          :placeholder="$t('form.twoPassword.text')"
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
        <van-field
          v-model.trim="form.invitationCode"
          class="res-icon-size login-ceode"
          autocomplete="new-password"
          :placeholder="$t('form.invitecode.text')"
          :rules="[
            { required: true, message: $t('backapi.invitationCodeIsEmpty') },
          ]"
        />
        <van-field
          v-model.trim="form.email"
          :placeholder="$t('form.email.text')"
          class="email res-icon-size"
          autocomplete="new-password"
          name="email"
          :rules="[{ required: true, message: $t('ruls.email.empty') }]"
        >
        </van-field>
        <van-field
          class="login-ceode"
          :placeholder="$t('Submitted.email.code')"
          v-if="authConfig.mailCodeRequired === 1"
          v-model.trim="form.emailCode"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t('Submitted.email.code'),
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
              native-type="button"
              color="#0025fc"
              >{{ $t("deal.chat.921073-7")
              }}{{ countdown ? `(${countdown})` : "" }}</van-button
            >
          </template>
        </van-field>
        <van-field
          v-model.trim="form.phone"
          :placeholder="$t('form.phoneNum.text')"
          type="digit"
          autocomplete="new-password"
          class="left-icon-box res-icon-size login-phone"
          :rules="[{ required: true, message: $t('ruls.phone.empty') }]"
        >
          <template #left-icon>
            <p @click="leftFn" class="align-center area-code">
              <span>+{{ form.areaCode }}</span> <van-icon name="arrow-down" />
            </p>
          </template>
        </van-field>
        <van-field
          v-model.trim="form.code"
          class="res-icon-size login-ceode"
          autocomplete="new-password"
          :placeholder="$t('form.vercode.text')"
          :rules="[{ required: true, message: $t('ruls.vercode.empty') }]"
        >
          <template #right-icon>
            <img
              @click="verifyCodeReq"
              width="68"
              class="d-block"
              :src="src"
              alt=""
            />
          </template>
        </van-field>
        <div class="sumit-section">
          <van-button
            class="res-van-button"
            block
            type="info"
            native-type="submit"
            >{{ $t("reg.btn.text") }}</van-button
          >
          <van-button
            class="res-van-button"
            block
            type="info"
            native-type="button"
            @click="$router.push({ name: 'Login' })"
            >{{ $t("login.btn.text") }}</van-button
          >
        </div>
      </van-form>
    </div>
    <BtmActionSheet
      :text="`+${form.areaCode}`"
      ref="BtmActionSheet"
      :actions="area_code"
      fix="+"
      @select="onSelect"
    />
    <!-- <van-action-sheet v-model="show" :actions="area_code" @select="onSelect" /> -->
  </div>
</template>

<script>
const initCountdown = 60;
import userApi from "@/api/user";
import to from "await-to-js";
export default {
  name: "RegisterView",
  data() {
    return {
      countdown: 0,
      src: "",
      show: false,
      form: {
        username: "",
        password: "",
        twoPassword: "",
        email: "", // 邮箱
        invitationCode: "", // 邀请码
        code: "", // 验证码
        phone: "", // 手机号
        areaCode: "", // 区号,
        verifyKey: "", // 验证码key
        emailCode: "", // 邮箱验证码
      },
      radio: [],
      showText: false,
      emailFix: "", //@gmail.com
    };
  },
  computed: {
    authConfig() {
      return this.$store.state.config;
    },
    area_code() {
      return this.$store.state.config.area_code;
    },
  },
  methods: {
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.countdown = 0;
    },
    scrollToTop() {
      if ("scrollTo" in window) {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // 平滑滚动到顶部
        });
      } else {
        // 兼容旧版浏览器，使用 document.documentElement.scrollTop 或 document.body.scrollTop
        (document.documentElement || document.body).scrollTop = 0; // 适用于 Chrome、Firefox、IE、Edge 等现代浏览器
      }
    },
    async sendCode() {
      const [accountErr] = await to(this.$refs.form.validate("username"));
      if (accountErr) {
        //回到顶部
        this.scrollToTop();
        return;
      }
      const [emailErr] = await to(this.$refs.form.validate("email"));
      if (emailErr) return;
      this.$toast(this.$t("form.verift.going.text"));
      // 模拟发送验证码的操作
      userApi.mailCodeRegReq({
        email: this.form.email + this.emailFix,
        username: this.form.username,
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
    async authSysconfig() {
      const [err, res] = await userApi.withdrawalReq();
      if (err) return;
      this.authConfig = res.data;
    },
    validatePassword(password) {
      return /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/.test(password);
    },
    validateTwo(value) {
      return value === this.form.password;
    },
    async onSubmit() {
      const data = Object.assign({}, this.form);
      data.phone = data.areaCode + data.phone;
      data.email = data.email + this.emailFix;
      if (this.authConfig.mailCodeRequired !== 1) {
        delete data.emailCode;
      }
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err] = await userApi.register(data);
      this.$toast.clear();
      if (err) {
        if (Array.isArray(err.data) && err.data.length) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        this.verifyCodeReq();
        return;
      }
      this.$toast(
        `${this.$t("index.editor.psd.modal.success.text2")},${this.$t(
          "index.editor.psd.modal.success.text3"
        )}`
      );
      this.$router.push({ name: "Login" });
      // this.$store.commit("setUser", res.data);
    },
    change() {},
    onSelect(item) {
      this.form.areaCode = item.name;
    },
    leftFn() {
      this.$refs.BtmActionSheet.open();
    },
    openEye() {
      this.showText = !this.showText;
    },
    async verifyCodeReq() {
      this.form.code = "";
      const [err, res] = await userApi.verifyCodeReq();
      if (err) return;
      this.src = res.data.img;
      this.form.verifyKey = res.data.verifyKey;
    },
  },
  created() {
    this.$store.commit("setPdTop", false);
    this.verifyCodeReq();
    this.form.areaCode = this.area_code[0];

    if (this.$route.query.code) {
      this.form.invitationCode = this.$route.query.code;
    }
  },
};
</script>
<style lang="less" scoped>
.register-page {
  font-size: 16px;
  color: var(--color-text);
  .code-btn {
    height: 18px;
    border-radius: 9px;
    padding: 0 8px;
    min-width: 54px;
    background-color: #dc2525 !important;
    border-color: #dc2525 !important;
    color: #fff;
  }
  .radio-list-row {
    padding: 8px 16px;
  }
  [role="radio"] {
    margin-right: 24px;
  }
  .area-code {
    padding-right: 8px;
  }
  .go-login {
    padding: 24px 0;
    & > li:nth-child(2) {
      color: var(--primary);
      margin-left: 4px;
    }
  }
  .register-title {
    padding: 64px 0 30px;
    img {
      height: 36px;
    }
  }
  ::v-deep div.appp-top-bar {
    .icon-button {
      background-color: rgba(0, 0, 0, 0.16) !important;
      color: #fff !important;
      border-radius: 8px;
      margin-left: 24px;
      margin-top: 24px;
    }
  }
  ::v-deep .register-form {
    width: 283px;
    margin: 0 auto;
    .sumit-section {
      padding: 38px 0;
      display: flex;
      justify-content: space-around;
      button {
        width: auto;
        height: auto;
        padding: 0;
        background-color: transparent;
        color: #ef7367;
        background-image: none;
      }
    }
    .van-cell {
      // padding: 0;
      padding-left: 0;
      padding-right: 0;
      background-color: transparent;
    }
    .van-field__body {
      background-color: transparent;
      border-color: transparent;
      height: 34px;
      background-position: left center;
      background-repeat: no-repeat;
      background-size: cover;
      padding-left: 39px;
      padding-right: 0;
      font-size: 12px;
    }
    input[type="text"],
    input[type="password"],
    input[type="tel"] {
      &,
      &::placeholder {
        color: #c72826;
      }
    }
    .username {
      .van-field__body {
        background-image: url("@/assets/img/red/login-user.webp");
      }
    }
    .password {
      .van-field__body {
        background-image: url("@/assets/img/red/login-password.webp");
      }
    }
    .login-ceode {
      .van-field__body {
        background-image: url("@/assets/img/red/login-cod.webp");
      }
    }
    .email {
      .van-field__body {
        background-image: url("@/assets/img/red/login-email.webp");
      }
    }
    .login-phone {
      position: relative;
      color: var(--primary);
      .van-field__body {
        background-image: url("@/assets/img/red/login-phone.webp");
      }
    }
    .res-icon-size .van-icon {
      font-size: 20px;
      color: var(--primary);
    }
    .left-icon-box {
      position: relative;
      @wid: 60px;
      .van-field__left-icon {
        position: absolute;
        top: 16px;
        left: 32px;
        z-index: 2;
        width: @wid;
      }
      .van-field__control {
        padding-left: @wid;
      }
    }
  }
}
.register-up {
  .car {
    height: 44px;
  }

  padding-left: 24px;
  justify-content: flex-end;
  color: #fff;
  height: 265px;
  background: url("@/assets/img/loginbg@2x.png") no-repeat;
  background-size: cover;
  font-size: 26px;
  .text {
    margin-bottom: 16px;
    margin-top: 8px;
  }
}
</style>
