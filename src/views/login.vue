<template>
  <div class="register-page">
    <div class="register-up flex-column">
      <div class="lang-list d-flex" @click="show = !show">
        <ul class="align-center justify-between flex-1">
          <li class="uppercase align-center">
            <img :src="curLang.icon" alt="" /> {{ lang }}
          </li>
          <li><van-icon name="arrow-down" /></li>
        </ul>
        <ul class="down" v-if="show">
          <li
            class="align-center"
            @click="select(item)"
            :class="{ active: lang === item.value }"
            v-for="(item, idx) in langOptions"
            :key="idx"
          >
            <img :src="item.icon" alt="" />
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          v-model.trim="form.username"
          autocomplete="new-password"
          :label="$t('form.account.text')"
          :placeholder="$t('form.account.text')"
          :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
        />
        <!-- showText -->
        <van-field
          class="res-icon-size"
          v-model.trim="form.password"
          autocomplete="new-password"
          :type="showText ? '' : 'password'"
          :label="$t('form.password.text')"
          :placeholder="$t('form.password.text')"
          @click-right-icon="openEye"
          :right-icon="`icon iconfont ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[{ required: true, message: $t('backapi.passwordIsEmpty') }]"
        />
        <van-field
          v-model.trim="form.code"
          class="res-icon-size"
          :label="$t('form.vercode.text')"
          autocomplete="new-password"
          :placeholder="$t('form.vercode.text')"
          :rules="[{ required: true, message: $t('ruls.vercode.empty') }]"
        >
          <template #right-icon>
            <img
              @click="verifyCodeReq"
              height="30"
              class="d-block"
              :src="src"
              alt=""
            />
          </template>
        </van-field>
        <ul class="justify-between skip-msg">
          <li
            @click="
              $router.push({
                name: 'Register',
                query: {
                  backUrl: $route.query.backUrl,
                },
              })
            "
          >
            {{ $t("reg.btn.text") }}
          </li>
          <li @click="$router.push({ name: 'LoginForget' })">
            {{ $t("index.login.forget.text") }}?
          </li>
        </ul>
        <div class="sumit-section">
          <van-button
            class="res-van-button"
            block
            type="info"
            native-type="submit"
            >{{ $t("login.btn.text") }}</van-button
          >
        </div>
        <ul class="serve-btm center-center" @click="goServe">
          <li>
            <img class="d-block" src="@/assets/img/serve@2x.webp" alt="" />
          </li>
          <li>{{ $t("index.login.service.text") }}</li>
        </ul>
      </van-form>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "LoginView",
  data() {
    return {
      src: "",
      show: false,
      form: {
        username: "",
        password: "",
        code: "", // 验证码
        verifyKey: "", // 验证码key
      },
      radio: [],
      showText: false,
      emailFix: "@gmail.com",
    };
  },
  computed: {
    isFinish() {
      return this.form.username && this.form.password && this.form.code;
    },
    curLang() {
      return this.langOptions.find((item) => item.value === this.lang) || {};
    },
    serveData() {
      return this.$store.state.serveData;
    },
    lang() {
      return this.$store.state.lang;
    },
    langOptions() {
      return this.$store.state.langOpt;
    },
    area_code() {
      return this.$store.state.config.area_code.map((item) => {
        return {
          name: item,
        };
      });
    },
  },
  methods: {
    async onSubmit() {
      const data = Object.assign({}, this.form);
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err, res] = await userApi.login(data);
      this.$toast.clear();
      if (err) {
        if (Array.isArray(err.data) && err.data.length) {
          const msgKey = `backapi.${err.data[0].msgKey}`;
          const countDoc = err.data.find((item) =>
            item.name.includes("failCount")
          );
          if (msgKey.includes("pwdErrorCount")) {
            this.$toast(
              this.$t(msgKey, {
                count: countDoc ? countDoc.value : "",
              })
            );
          } else {
            this.$toast(this.$t(msgKey));
          }
        }
        this.verifyCodeReq();
        return;
      }

      this.$store.commit("setToken", res.data.token);
      this.$store.dispatch("getServeData");
      if (this.$route.query.backUrl) {
        this.$router.push(this.$route.query.backUrl);
        return;
      }
      this.$router.push("/");
    },
    change() {},
    leftFn() {
      this.show = true;
    },
    openEye() {
      this.showText = !this.showText;
    },
    select(v) {
      this.show = false;
      this.$store.commit("setLang", v.value);
    },
    async verifyCodeReq() {
      this.form.code = "";
      const [err, res] = await userApi.verifyCodeReq();
      if (err) return;
      this.src = res.data.img;
      this.form.verifyKey = res.data.verifyKey;
    },
    goServe() {
      this.$store.commit("goServe");
    },
  },
  async created() {
    this.verifyCodeReq();
    this.$store.commit("setPdTop", false);
  },
};
</script>
<style lang="less" scoped>
.register-page {
  font-size: 16px;
  color: var(--color-text);
  background: url("@/assets/img/loginbg.webp") center top no-repeat;
  // background-size: 100% 100%;
  background-size: cover;
  min-height: 100vh;
  color: #fff;
  .res-van-button {
    background-color: #041faf;
    background-image: none;
  }
  .res-van-button.finish {
    background-color: #041faf;
  }
  .sumit-section {
    padding: 16px;
  }
  .serve-btm {
    font-size: 14px;
    img {
      height: 18px;
      margin-right: 4px;
    }
  }
  .radio-list-row {
    padding: 8px 16px;
  }
  [role="radio"] {
    margin-right: 24px;
  }
  .skip-msg {
    padding: 0 16px;
  }
  .area-code {
    padding-right: 8px;
    z-index: 3px;
  }
  .go-login {
    padding: 24px 0;
    & > li:nth-child(2) {
      color: var(--primary);
      margin-left: 4px;
    }
  }
  ::v-deep .register-form {
    .van-field__body {
      background-color: #fff;
      border-color: #fff;
    }
    .van-cell {
      background-color: transparent;
    }
    .van-field__label {
      color: #fff;
    }
    .res-icon-size .van-icon {
      font-size: 24px;
    }
    .left-icon-box {
      position: relative;
      .van-field__left-icon {
        position: absolute;
        top: 54px;
        left: 32px;
        z-index: 2;
      }
      .van-field__control {
        padding-left: 48px;
      }
    }
  }
}
.register-up {
  position: relative;
  padding-left: 24px;
  justify-content: flex-end;
  color: #fff;
  height: 224px;
  background: url("@/assets/img/login-logo.png") center center no-repeat;
  background-size: cover;
  font-size: 26px;
  background-size: 139px 139px;
  .lang-list {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 100px;
    height: 30px;
    border-radius: 3.5px;
    padding: 0 8px;
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 16px;
    img {
      height: 22px;
      width: 22px;
      object-fit: cover;
      margin-right: 6px;
    }
    .down {
      text-align: left;
      position: absolute;
      padding: 0 8px;
      top: 32px;
      left: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      & > li {
        height: 30px;
      }
      .active {
        // color: var(--primary);
      }
    }
  }
  .text {
    margin-bottom: 16px;
    margin-top: 8px;
  }
}
</style>
