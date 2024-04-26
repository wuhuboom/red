<template>
  <div class="register-page">
    <div class="register-up d-flex">
      <div class="center-center register-up-desc">
        <p class="logo m-r-8">
          <img class="d-block" src="@/assets/img/red/zeplogo@2x.png" alt="" />
        </p>
        <p class="color-primary title-logo">
          <img class="d-block" src="@/assets/img/red/login-logo.webp" alt="" />
        </p>
        <div class="lang-list d-flex" @click="show = !show">
          <ul class="align-center justify-between flex-1">
            <li class="uppercase align-center">
              {{ lang == "ind" ? "in" : lang }}
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
              <!-- <img :src="item.icon" alt="" /> -->
              {{ item.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          v-model.trim="form.username"
          autocomplete="new-password"
          :placeholder="$t('form.account.text')"
          class="username"
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
          :right-icon="`color-fff icon iconfont color-active ${
            showText ? 'icon-yanjing_xianshi_o' : 'icon-yanjing_yincang_o'
          }`"
          :rules="[{ required: true, message: $t('backapi.passwordIsEmpty') }]"
        />
        <van-field
          v-model.trim="form.code"
          class="res-icon-size login-ceode"
          :maxlength="4"
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

        <div class="sumit-section font14">
          <van-button
            class="res-van-button"
            block
            type="info"
            native-type="submit"
            >{{ $t("login.btn.text") }}</van-button
          >
          <van-button
            class="res-van-button"
            block
            type="info"
            native-type="button"
            @click="
              $router.push({
                name: 'Register',
                query: {
                  backUrl: $route.query.backUrl,
                },
              })
            "
          >
            {{ $t("reg.btn.text") }}</van-button
          >
        </div>
        <ul class="serve-btm center-center text-center">
          <li
            class="flex-column center-center"
            @click="$router.push({ name: 'LoginForget' })"
          >
            <p>
              <img
                class="d-block"
                src="@/assets/img/red/login-btm1.webp"
                alt=""
              />
            </p>
            {{ $t("index.login.forget.text") }}
          </li>
          <li class="flex-column center-center" @click="goServe">
            <p>
              <img
                class="d-block"
                src="@/assets/img/red/login-btm2.webp"
                alt=""
              />
            </p>
            {{ $t("index.login.service.text") }}
          </li>
          <li class="flex-column center-center" @click="download">
            <p>
              <img
                class="d-block"
                src="@/assets/img/red/login-btm3.webp"
                alt=""
              />
            </p>
            {{ $t("fuc.app.download") }}
          </li>
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
    async download() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.$store.dispatch("appDownload");
      this.$toast.clear();
    },
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
      console.log("res", err);
      if (err) {
        if (+err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }

        return;
      }
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
  min-height: 100vh;
  color: #fff;
  background: url("@/assets/img/red/lognbg.png") top center no-repeat;
  background-size: 100% auto;
  .logo {
    img {
      width: 42px;
      height: 43px;
    }
  }
  .title-logo {
    img {
      height: 36px;
    }
  }
  .res-van-button {
    background-color: #041faf;
    background-image: none;
  }
  .res-van-button.finish {
    background-color: #041faf;
  }
  .sumit-section {
    padding: 24px 0 30px;
    display: flex;
    justify-content: space-around;
    button {
      width: auto;
      height: auto;
      padding: 0;
      background-color: transparent;
      color: var(--primary);
    }
  }
  .serve-btm {
    font-size: 14px;
    color: var(--primary);
    padding-bottom: 20px;
    img {
      height: 16px;
    }
    p {
      padding-bottom: 8px;
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
    width: 283px;
    margin: 0 auto;
    .van-cell {
      // padding: 0;
      padding-left: 0;
      padding-right: 0;
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
    input[type="password"] {
      &,
      &::placeholder {
        color: var(--primary);
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
    .van-cell {
      background-color: transparent;
    }
    .van-field__label {
      color: #fff;
    }
    .res-icon-size .van-icon {
      font-size: 20px;
      // color: var(--primary);
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
  align-items: flex-end;
  justify-content: center;
  color: #fff;
  height: 352px;

  background-size: 100% 348px;
  .register-up-desc {
    //margin-bottom: 16px;
    & > p {
      margin-right: 10px;
    }
  }
  .lang-list {
    position: relative;
    height: 16px;
    border-radius: 3.5px;
    padding: 0 8px;
    border: 1px solid var(--primary);
    color: #fff;
    font-size: 12px;
    z-index: 3;
    color: var(--primary);
    img {
      height: 22px;
      width: 22px;
      object-fit: cover;
      margin-right: 6px;
    }
    .van-icon-arrow-down {
      margin-left: 4px;
    }
    .down {
      text-align: left;
      position: absolute;
      padding: 0 8px;
      top: 16px;
      left: 0;
      width: 100%;
      background-color: var(--bg-body);

      border: 1px solid var(--primary);
      & > li {
        height: 24px;
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
