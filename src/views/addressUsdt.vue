<template>
  <div class="address-add font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="id ? $t('Edit.USDT.Address') : $t('Add.USDT.Address')"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading class="color-primary" />
    </div>
    <div v-else class="m-l-24 m-r-24">
      <van-form class="defind-form defind-form-row" @submit="onSubmit">
        <van-field
          v-model.trim="form.currency"
          :label="$t(`withdraw.add.with.currency.text`)"
          :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
        />
        <van-field :label="$t('backapi.self.safe.bill.data.type.text')">
          <template #input>
            <el-select
              v-model="form.typeValue"
              class="full100"
              :placeholder="$t('index.editor.psd.text')"
            >
              <el-option
                v-for="item in usdtTypeOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </van-field>
        <van-field
          v-model.trim="form.usdtAddress"
          :label="$t('user.security.center.bankcard.useradd.usdt.address.text')"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.useradd.usdt.address.text'
                ),
              }),
            },
          ]"
        />
        <van-field :label="$t('index.editor.psd.text')">
          <template #input>
            <el-select
              v-model="form.verificationVal"
              class="full100"
              :placeholder="$t('index.editor.psd.text')"
              :disabled="countdown > 0"
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
              class="page-res-btn"
              color="#0025fc"
              >{{ $t("deal.chat.921073-7")
              }}{{ countdown ? `(${countdown})` : "" }}</van-button
            >
          </template>
        </van-field>

        <van-field
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
        <div class="sumit-section center-center">
          <van-button
            class="page-res-btn"
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
        currency: "USDT",
        typeValue: 1,
        usdtAddress: "",
        verificationVal: 1,
        veriftValue: "",
        payPwd: "",
      },
      formLoaing: false,
      loading: false,
      countdown: 0,
      dataList: "",
      usdtTypeOptions: [{ text: "TRC20", value: 1 }],
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
        name: this.$t(
          "user.security.center.bankcard.useradd.usdt.address.text"
        ),
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
      reqParam.id = this.id;
      reqParam.addr = this.form.usdtAddress;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      this.formLoaing = true;
      const [err] = await userApi.usdtEditReq(reqParam);
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
      reqParam.type = "1";
      reqParam.subType = "11";
      reqParam.addr = this.form.usdtAddress;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      this.formLoaing = true;
      const [err] = await userApi.virtualCurrencyAdd(reqParam);
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
    async getUsdtList() {
      const [err, res] = await userApi.usdtListReq();
      if (err) {
        return;
      }
      if (Array.isArray(res.data) && res.data.length > 0) {
        const doc = res.data.find((item) => +item.id === +this.id);
        if (doc) {
          this.form.usdtAddress = doc.addr;
        }
      }
    },
  },
  created() {
    if (this.id) {
      this.$store.dispatch("getCodeList");
      this.getUsdtList();
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style scoped lang="less">
.address-add {
}
</style>
