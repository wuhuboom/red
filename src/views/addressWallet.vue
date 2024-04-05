<template>
  <div class="address-add font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="
        $t(
          id
            ? $t('Edt.Bank.Wallet')
            : 'backapi.self.whitdraw.type.ewallet.form.wallet.add.center.title.text'
        )
      "
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16">
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          v-model.trim="form.name"
          class="mb-16"
          :label="$t('backapi.self.whitdraw.type.ewallet.form.name.text')"
          :rules="[
            {
              required: true,
              message: $t('backapi.self.whitdraw.type.ewallet.form.name.text'),
            },
          ]"
        />
        <van-field
          class="mb-16"
          :label="$t('backapi.self.safe.bill.data.type.text')"
        >
          <template #input>
            <van-dropdown-menu
              :overlay="false"
              class="drop-menu"
              active-color="#222222"
            >
              <van-dropdown-item
                v-model.trim="form.typeValue"
                :options="usdtTypeOptions"
              />
            </van-dropdown-menu>
          </template>
        </van-field>

        <van-field
          v-model.trim="form.usdtAddress"
          class="mb-16"
          :label="
            $t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text')
          "
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'backapi.self.whitdraw.type.ewallet.form.wallet.addr.text'
                ),
              }),
            },
          ]"
        />
        <van-field class="mb-16" :label="$t('index.editor.psd.text')">
          <template #input>
            <van-dropdown-menu
              :overlay="false"
              class="drop-menu"
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
          class="mb-16"
          :label="$t('form.vercode.text')"
          v-model.trim="form.veriftValue"
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
          class="mb-16"
          v-model.trim="form.payPwd"
          type="password"
          autocomplete="new-password"
          :label="
            $t('user.security.center.bankcard.bankadd.input.pay.pass.text')
          "
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.pay.pass.text'
                ),
              }),
            },
          ]"
        />
        <div class="sumit-section">
          <van-button
            class="res-van-button button-blue"
            block
            type="info"
            :loading="formLoaing"
            native-type="submit"
            >{{ $t("confirm.btn.text") }}</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
const initCountdown = 60;
export default {
  name: "WithdrawView",
  data() {
    return {
      id: this.$route.query.id,
      form: {
        name: "",
        typeValue: "",
        usdtAddress: "",
        verificationVal: 1,
        veriftValue: "",
        payPwd: "",
      },
      formLoaing: false,
      loading: false,
      countdown: 0,
      dataList: "",
      usdtTypeOptions: [],
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
    editImportantLogout() {
      return this.$store.state.config.editImportantLogout || "";
    },
    textContent() {
      return this.$t("edit.tip.text", {
        time: this.editImportantLogout,
        name: this.$t("wallet.list.wallet.text"),
      });
    },
  },
  methods: {
    comfirm() {
      return new Promise((resolve) => {
        if (!this.editImportantLogout) {
          resolve(1);
          return;
        }
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
    async getWalletType() {
      const [err, res] = await userApi.walletTypeReq();
      if (err) return;
      this.usdtTypeOptions = res.data.map((item) => {
        return {
          ...item,
          text: item,
          value: item,
        };
      });
      this.form.typeValue = this.usdtTypeOptions[0].value;
    },
    sendCode() {
      this.$toast(this.$t("form.verift.going.text"));
      // 模拟发送验证码的操作
      if (this.form.verificationVal === 1) {
        userApi.mailCode();
      } else {
        userApi.phoneCode();
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
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.countdown = 0;
    },
    onSubmit() {
      if (this.id) {
        this.editUsdt();
        return;
      }
      this.addUsdt();
    },
    async editUsdt() {
      const state = await this.comfirm();
      if (!state) return;
      let reqParam = {};
      reqParam.id = this.form.id;
      reqParam.type = this.form.typeValue;
      reqParam.account = this.form.name;
      reqParam.address = this.form.usdtAddress;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      this.formLoaing = true;
      const [err] = await userApi.walletEditReq(reqParam);
      this.formLoaing = false;
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      this.$toast.success("");
      this.$router.back();
    },
    async addUsdt() {
      let reqParam = {};
      reqParam.type = this.form.typeValue;
      reqParam.account = this.form.name;
      reqParam.address = this.form.usdtAddress;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      this.formLoaing = true;
      const [err] = await userApi.walletReq(reqParam);
      this.formLoaing = false;
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      this.$toast.success("");
      this.$router.back();
    },
    async getEwalletData() {
      const [err, res] = await userApi.walletInfo();
      if (err) return;
      if (res.data && !res.data.length) {
        // this.$router.push({ name: "AddressWallet" });
        return;
      }
      const bankCardData = res.data.find((item) => +item.id === +this.id);
      if (bankCardData) {
        let form = this.form;
        form.id = bankCardData.id;
        form.typeValue = bankCardData.type;
        form.name = bankCardData.account;
        form.usdtAddress = bankCardData.address;
      }
    },
  },
  async created() {
    await this.getWalletType();
    if (this.id) {
      this.$store.dispatch("getCodeList");
      this.getEwalletData();
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style scoped lang="less">
.address-add {
  min-height: 100vh;
  background-color: #f8f8f8;
  .van-cell {
    padding: 0;
    background-color: transparent;
  }
  ::v-deep {
    .van-field__label {
      color: #9da4b4;
    }
    .van-field__body {
      border-color: #fff;
      background-color: #fff;
      color: #222222;
    }
    .code-btn {
      min-width: 70px;
      padding: 0 4px;
      height: 32px;
      border-radius: 8px;
      background-color: #0025fc;
    }
  }
}
</style>
