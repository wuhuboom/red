<template>
  <div class="change-password-view font12 color-primary pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('security.phone.text')"
    >
    </AppTopBar>
    <div class="m-l-24 m-r-24">
      <van-form class="defind-form" @submit="onSubmit">
        <van-field
          class="res-icon-size"
          disabled
          :value="user.phone"
          :placeholder="$t('password.setting.phone.old.phone.text')"
        />
        <van-field
          class="mb-16"
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
          v-model.trim="form.phone"
          :placeholder="$t('form.phoneNum.text')"
          autocomplete="new-password"
          type="digit"
          class="left-icon-box res-icon-size"
          :rules="[{ required: true, message: $t('ruls.phone.empty') }]"
        >
          <template #left-icon>
            <!-- <el-select
              v-model="form.areaCode"
              class="full100"
              :placeholder="$t('index.editor.psd.text')"
            >
              <el-option
                v-for="item in area_code"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select> -->
            <p @click="leftFn" class="align-center area-code color-primary">
              <span>+{{ form.areaCode }}</span> <van-icon name="arrow-down" />
            </p>
          </template>
        </van-field>

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
        phone: "",
        areaCode: "",
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
        name: this.$t("form.phoneNum.text"),
      });
      //this.$t('edit.tip.text', { time: this.$editImportantLogout.val, name: this.$t('form.phoneNum.text') }),
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
    sendCode() {
      this.$toast(this.$t("form.verift.going.text"));
      // 模拟发送验证码的操作
      userApi.phoneCode();
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
      if (!this.form.areaCode) {
        this.$toast(this.$t("backapi.areaCodeIsEmpty"));
        if (!this.area_code.length) {
          this.$store.dispatch("getCodeList");
        }
        return;
      }
      let reqParam = {
        phone: this.form.areaCode + this.form.phone,
        code: this.form.vercode,
        areaCode: this.form.areaCode,
      };
      this.loading = true;
      const [err] = await userApi.phoneBindReq(reqParam);
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
  // ::v-deep {
  //   .chose-verification {
  //     .van-field__body {
  //       padding: 0;
  //       border: none;
  //     }
  //     .van-dropdown-menu__bar {
  //       border-radius: 10px;
  //     }
  //   }
  //   .van-field--disabled {
  //     .van-field__label {
  //       color: #646566;
  //     }
  //   }
  //   .area-code {
  //     padding-right: 8px;
  //   }
  //   .left-icon-box {
  //     position: relative;
  //     @wid: 60px;
  //     .van-field__left-icon {
  //       position: absolute;
  //       top: 54px;
  //       left: 32px;
  //       z-index: 2;
  //       width: @wid;
  //     }
  //     .van-field__control {
  //       padding-left: @wid;
  //     }
  //   }
  // }
}
</style>
