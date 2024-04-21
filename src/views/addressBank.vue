<template>
  <div class="address-add font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="
        id ? $t('Edt.Bank.Card') : $t('bankcard.bankadd.title.text')
      "
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading class="color-primary" />
    </div>
    <div v-else class="m-l-24 m-r-24 m-b-24">
      <van-form class="defind-form defind-form-row" @submit="onSubmit">
        <van-field
          :label="
            $t('user.security.center.bankcard.bankadd.input.address.text')
          "
        >
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
          v-model.trim="form.provinceStr"
          :label="
            $t('user.security.center.bankcard.bankadd.input.province.text') +
            '(' +
            $t('selectable.text') +
            ')'
          "
          :rules="[
            {
              required: withDrawAreaStatus,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.province.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.cityStr"
          :label="
            $t('user.security.center.bankcard.bankadd.input.city.text') +
            '(' +
            $t('selectable.text') +
            ')'
          "
          :rules="[
            {
              required: withDrawAreaStatus,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.city.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.branchStr"
          :label="$t('user.security.center.bankcard.bankadd.input.branch.text')"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.branch.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.accountNameStr"
          :label="
            $t('user.security.center.bankcard.bankadd.input.account.name.text')
          "
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.account.name.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.cardIDStr"
          v-if="withDrawAreaStatus"
          :label="$t('backapi.self.add.bank.cardID.text')"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t('backapi.self.add.bank.cardID.input.text'),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.cardPhoneStr"
          v-if="withDrawAreaStatus"
          :label="$t('backapi.self.add.bank.phone.text')"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t('backapi.self.add.bank.phone.input.text'),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.cardNumStr"
          :label="
            $t('user.security.center.bankcard.bankadd.input.card.number.text')
          "
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.card.number.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.cardConfirmNumStr"
          :label="
            $t('user.security.center.bankcard.bankadd.input.confirm.text')
          "
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  'user.security.center.bankcard.bankadd.input.confirm.text'
                ),
              }),
            },
          ]"
        />
        <van-field
          v-model.trim="form.backCode"
          label="IFSC"
          v-if="indian"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: 'IFSC',
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
      areaId: "",
      form: {
        typeValue: "",
        provinceStr: "",
        cityStr: "",
        branchStr: "",
        accountNameStr: "",
        cardIDStr: "",
        cardPhoneStr: "",
        cardNumStr: "",
        cardConfirmNumStr: "",
        usdtAddress: "",
        verificationVal: 1,
        veriftValue: "",
        payPwd: "",
        backCode: "",
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
    indian() {
      return +this.$store.state.user.areaCode === 91;
    },
    withDrawAreaStatus() {
      //2 加纳 provinceStr cityStr 必填
      return this.areaId === 2;
    },
    editImportantLogout() {
      return this.$store.state.config.editImportantLogout || "";
    },
    textContent() {
      return this.$t("edit.tip.text", {
        time: this.editImportantLogout,
        name: this.$t(
          "user.security.center.bankcard.bankadd.input.card.number.text"
        ),
      });
    },
  },
  methods: {
    async getWalletType() {
      const [err, res] = await userApi.banks();
      if (err) return;
      this.areaId = res.data.areaId;
      this.usdtTypeOptions = res.data.banks.map((item) => {
        return {
          ...item,
          text: item.bankCname,
          value: item.id,
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
    async editUsdt() {
      const state = await this.comfirm();
      if (!state) return;
      let reqParam = {};
      if (this.form.provinceStr) {
        reqParam.province = this.form.provinceStr;
      }
      if (this.form.cityStr) {
        reqParam.city = this.form.cityStr;
      }
      if (this.withDrawAreaStatus) {
        reqParam.identityCard = this.form.cardIDStr;
        reqParam.phone = this.form.cardPhoneStr;
      }
      reqParam.bankId = this.form.typeValue;
      reqParam.subBranch = this.form.branchStr;
      reqParam.cardName = this.form.accountNameStr;
      reqParam.cardNumber = this.form.cardNumStr;
      reqParam.cardNumberTwice = this.form.cardConfirmNumStr;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      if (this.indian) {
        reqParam.backCode = this.form.backCode;
      }
      this.formLoaing = true;
      const [err] = await userApi.bindBankCardEditReq(reqParam);
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
      if (this.form.provinceStr) {
        reqParam.province = this.form.provinceStr;
      }
      if (this.form.cityStr) {
        reqParam.city = this.form.cityStr;
      }
      if (this.withDrawAreaStatus) {
        reqParam.identityCard = this.form.cardIDStr;
        reqParam.phone = this.form.cardPhoneStr;
      }
      reqParam.bankId = this.form.typeValue;
      reqParam.subBranch = this.form.branchStr;
      reqParam.cardName = this.form.accountNameStr;
      reqParam.cardNumber = this.form.cardNumStr;
      reqParam.cardNumberTwice = this.form.cardConfirmNumStr;
      reqParam.payPwd = this.form.payPwd;
      reqParam.code = this.form.veriftValue;
      if (this.indian) {
        reqParam.backCode = this.form.backCode;
      }
      this.formLoaing = true;
      const [err] = await userApi.bindBank(reqParam);
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
    async getBankList() {
      const [err, res] = await userApi.bankCardinfo();
      if (err) {
        return;
      }
      if (res.data) {
        let form = this.form;
        const bankCardData = res.data;
        form.provinceStr = bankCardData.province;
        form.cityStr = bankCardData.city;
        form.cardIDStr = bankCardData.identityCard;
        form.cardPhoneStr = bankCardData.phone;
        form.branchStr = bankCardData.subBranch;
        form.accountNameStr = bankCardData.cardName;
        form.cardNumStr = bankCardData.cardNumber;
        form.cardNumSelect = bankCardData.bankName;
        const item = this.usdtTypeOptions.find(
          (item) => item.text === bankCardData.bankName
        );
        if (item) {
          form.typeValue = item.value;
        }
      }
    },
  },
  async created() {
    await this.getWalletType();
    if (this.id) {
      this.$store.dispatch("getCodeList");
      this.getBankList();
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
