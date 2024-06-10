<template>
  <div class="change-password-view color-primary font12 pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('security.pass.text')"
    >
    </AppTopBar>
    <div class="p-x-24">
      <van-form ref="form" class="defind-form" @submit="onSubmit">
        <p>{{ $t("index.editor.psd.text") }}</p>
        <van-field>
          <template #input>
            <el-select
              v-model="form.verificationVal"
              :disabled="countdown > 0"
              class="full100"
              :placeholder="$t('index.editor.psd.text')"
            >
              <el-option
                v-for="item in verificationOpt"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </van-field>

        <van-field
          v-model.trim="form.email"
          name="email"
          :placeholder="$t('form.email.text')"
          v-if="form.verificationVal == 1"
          class="res-icon-size"
          autocomplete="new-password"
          :rules="[
            { required: true, message: $t('ruls.accout.empty') },
            {
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: this.$t('ruls.email.length'),
            },
          ]"
        >
        </van-field>
        <van-field
          v-model.trim="form.phone"
          name="phone"
          v-if="form.verificationVal == 2"
          :placeholder="$t('password.setting.phone.old.phone.text')"
          autocomplete="new-password"
          type="digit"
          class="left-icon-box res-icon-size"
          :rules="[{ required: true, message: $t('ruls.phone.empty') }]"
        >
          <template #left-icon>
            <p @click="leftFn" class="align-center area-code color-primary">
              <span>+{{ form.areaCode }}</span> <van-icon name="arrow-down" />
            </p>
          </template>
        </van-field>
        <van-field
          v-model.trim="form.account"
          autocomplete="new-password"
          name="account"
          :placeholder="$t('form.account.text')"
          :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
        />
        <van-field
          :placeholder="$t('form.vercode.text')"
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
              native-type="button"
              size="small"
              @click="sendCode"
              :disabled="countdown > 0"
              class="page-res-btn"
              >{{ $t("deal.chat.921073-7")
              }}{{ countdown ? `(${countdown})` : "" }}</van-button
            >
          </template>
        </van-field>
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
      <BtmActionSheet
        :text="`+${form.areaCode}`"
        ref="BtmActionSheet"
        :actions="area_code"
        fix="+"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script>
const initCountdown = 60;
import userApi from "@/api/user";
import to from "await-to-js";
export default {
  name: "ChangPassword",
  data() {
    return {
      emailFix: "",
      countdown: 0,
      loading: false,
      showText: false,
      form: {
        account: "",
        email: "",
        phone: "",
        areaCode: "",
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
    area_code() {
      return this.$store.state.config.area_code;
    },
  },
  methods: {
    onSelect(item) {
      this.form.areaCode = item.name;
    },
    leftFn() {
      this.$refs.BtmActionSheet.open();
    },
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.countdown = 0;
    },
    async sendCode() {
      const [accountErr] = await to(this.$refs.form.validate("account"));
      if (accountErr) return;
      const username = this.form.account;
      if (this.form.verificationVal === 1) {
        const [emailErr] = await to(this.$refs.form.validate("email"));
        if (emailErr) return;
        const [err1] = await userApi.notLoginEmailChangePwd({
          username,
          email: this.form.email + this.emailFix,
        });
        if (err1) {
          if (err1.data && err1.data[0]) {
            this.$toast(this.$t(`backapi.${err1.data[0].msgKey}`));
          }
          return;
        }
      } else {
        const [phoneErr] = await to(this.$refs.form.validate("phone"));
        if (phoneErr) return;
        const [err2] = await userApi.notLoginchangePwd({
          username,
          phone: this.form.areaCode + this.form.phone,
        });
        if (err2) {
          if (err2.data && err2.data[0]) {
            this.$toast(this.$t(`backapi.${err2.data[0].msgKey}`));
          }
          return;
        }
      }
      this.$toast(this.$t("form.verift.going.text"));
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
      let reqData = {
        username: this.form.account,
        newPwd: this.form.password,
        twicePwd: this.form.twoPassword,
        code: this.form.vercode,
      };
      this.loading = true;
      const [err] = await userApi.phoneChangePwdReq(reqData);
      this.loading = false;
      if (err) {
        const currMsgKey = err.data && err.data[0] && err.data[0].msgKey;
        if (currMsgKey) {
          this.$toast(this.$t(`backapi.${currMsgKey}`));
        }
        return;
      }
      this.$toast.success();
      this.$router.push({ name: "Login" });
    },
  },
  async created() {
    await this.$store.dispatch("getCodeList");
    this.form.areaCode = this.area_code[0];
  },
  beforeDestroy() {
    this.clearTimer();
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
