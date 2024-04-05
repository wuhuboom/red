<template>
  <div class="message-page">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('home.index.withdraw.text')"
    >
    </AppTopBar>
    <div class="center-center py-16" v-if="!withdrawList.length">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="">
      <p class="type-text py-16 px-16">{{ $t("withdray.type") }}</p>
      <ul class="type-list">
        <li
          v-for="(item, index) in withdrawList"
          @click="chose(item)"
          :class="{ active: item.type === chooseRecType.type }"
          :key="index"
        >
          <div class="cont">
            <p class="pic center-center" v-if="item.img">
              <img :src="item.img" alt="" />
            </p>
            <p class="center-center">{{ item.name }}</p>
          </div>
        </li>
      </ul>
      <ul class="py-16 px-16 justify-between align-center">
        <li class="type-text">{{ getWithdrawChooseName }}</li>
        <li class="go-bind" @click="getWithdrawRoutingJump">
          {{ getWithdrawBindName }}
        </li>
      </ul>

      <div class="px-16 mb-16 menu-inpu">
        <van-field class="">
          <template #input>
            <van-dropdown-menu
              :overlay="false"
              class="drop-menu"
              active-color="#222222"
            >
              <van-dropdown-item
                @open="open"
                v-model="typeValue"
                :options="typeOptions"
              />
            </van-dropdown-menu>
          </template>
        </van-field>
      </div>
      <p class="type-text pb-16 px-16">{{ $t("deal.buyDetail.387081-3") }}</p>
      <div class="mx-16 count-col">
        <div class="justify-between align-center count">
          <div>
            <p class="font12">
              <span>{{ $t("recharge.usdt.rate.text") }}&nbsp;</span
              ><span>{{ chooseRecType.rate }}</span>
            </p>
            <p class="font12">
              <span>{{ $t("wallet.index.balance.text") }}&nbsp;</span
              ><span>{{ balanceMoneyNum }}</span>
            </p>
          </div>

          <div>
            <p class="font12 rate-money">
              <span>{{ $t("Withdrawal.risk.fee") }}</span
              ><span
                >≈&nbsp;{{ withdrawNumRate }}
                {{ chooseRecType.currencySymbol }}</span
              >
            </p>
            <p class="font12 rate-money blue">
              <span>{{ $t("recharge.real.amount.text") }}</span
              ><span
                >≈&nbsp;{{ actualAmountTran }}
                {{ chooseRecType.currencySymbol }}</span
              >
            </p>
          </div>
        </div>
        <div class="enter-form">
          <van-field
            :placeholder="`${$t('deal.buyDetail.387081-5')} ${
              chooseRecType.withdrawMin
            }-${chooseRecType.withdrawMax}`"
            v-model.trim="amount"
            type="number"
          >
          </van-field>
        </div>
      </div>

      <van-form ref="form" class="register-form column-form withdraw-form">
        <van-field
          class="res-icon-size chose-verification"
          autocomplete="new-password"
          :label="$t('index.editor.psd.text')"
          v-if="msg"
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
          class="verification-input"
          :label="$t('form.vercode.text')"
          v-model.trim="form.vercode"
          v-if="msg"
          name="vercode"
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
          class="verification-input"
          type="password"
          :label="
            $t(`user.security.center.bankcard.bankadd.input.pay.pass.text`)
          "
          autocomplete="new-password"
          v-model.trim="form.password"
          name="password"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t(
                  `user.security.center.bankcard.bankadd.input.pay.pass.text`
                ),
              }),
            },
          ]"
        />
      </van-form>
      <div class="sumit-section px-16 py-16">
        <van-button
          class="res-van-button button-blue"
          block
          type="info"
          :loading="loading"
          @click="sumitData"
        >
          {{ $t("confirm.btn.text") }}</van-button
        >
      </div>
      <van-dialog
        class="upload-dialog"
        :confirmButtonText="$t(`withdraw.risk.uploadTitle`)"
        v-model="show"
        @confirm="confirm"
      >
        <ul class="upload-cont">
          <li class="center-center">
            <img src="@/assets/img/upload-face.webp" alt="" />
          </li>
          <li class="center-center">{{ $t(`withdraw.risk.warning`) }}</li>
          <li>{{ $t(`withdraw.risk.content`) }}</li>
        </ul>
      </van-dialog>
      <van-dialog
        class="success-upload-dialog"
        :showConfirmButton="false"
        v-model="successDialog"
        :close-on-click-overlay="true"
      >
        <ul class="success-cont font14">
          <li class="center-center">
            <img src="@/assets/img/withdraw.png" alt="" />
          </li>

          <li class="center-center font16">
            {{ $t(`Submitted.successfully`) }}
          </li>
          <li class="center-center">
            {{ $t(`Submitted.submitted.arrive`) }}
          </li>
        </ul>
        <div>
          <van-button
            class="res-van-button button-blue"
            :loading="loading"
            block
            type="info"
            @click="successDialog = false"
            >{{ $t("modal.confirm.text") }}</van-button
          >
        </div>
      </van-dialog>
      <WithdrawClearVip @confirm="sumitData(false)" ref="WithdrawClearVip" />
    </div>
  </div>
</template>

<script>
const initCountdown = 60;
import userApi from "@/api/user";
import i18n from "@/locale";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import WithdrawClearVip from "@/views/components/WithdrawClearVip.vue";
import to from "await-to-js";
export default {
  name: "WithdrawView",
  components: {
    WithdrawClearVip,
  },
  data() {
    return {
      countdown: 0,
      fingerprint: "",
      successDialog: false,
      riskCode: "",
      show: false,
      loading: false,
      withdrawList: [],
      chooseRecType: {},
      typeOptions: [],
      typeValue: "",
      cardNumSelect: "",
      amount: "",

      veriftValue: "",
      rechargeTipLists: [
        i18n.t("backapi.self.recharge.tip.content1.text"),
        i18n.t("backapi.self.recharge.tip.content2.text"),
        i18n.t("backapi.self.recharge.tip.content3.text"),
      ],
      form: {
        vercode: "",
        password: "",
        verificationVal: 2,
      },
      msg: 0,

      verificationOpt: [
        {
          text: "SMS",
          value: 1,
        },
        {
          text: "Email",
          value: 2,
        },
      ],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    balanceMoneyNum() {
      return (
        this.numToFixed(this.user.balance, this.$globalUnit.val) /
        this.$globalNum.val
      );
    },
    withdrawNumRate() {
      //提现费用。计算出提现手续费用
      return (
        (this.amount / this.chooseRecType.rate) *
        (this.chooseRecType.withdrawalRate / 100)
      );
    },
    actualAmountTran() {
      //实际到账金额
      return (
        (this.amount / this.chooseRecType.rate) * 1 - this.withdrawNumRate * 1
      );
    },
    getWithdrawChooseName() {
      // 4钱包 1银行卡 2虚拟币 3sim
      if (this.chooseRecType.type === 1) {
        return this.$t("withdraw.select.card.text");
      } else if (this.chooseRecType.type === 2) {
        return this.$t("choose_usdt.text");
      } else if (this.chooseRecType.type === 3) {
        return this.$t("choose_sim.text");
      } else if (this.chooseRecType.type === 4) {
        return this.$t("choose_wallet.text");
      }
      return "";
    },
    getWithdrawBindName() {
      if (this.chooseRecType.type === 1) {
        return this.$t("withdraw.bind.card.text");
      } else if (this.chooseRecType.type === 2) {
        return this.$t("bind_usdt.text");
      } else if (this.chooseRecType.type === 3) {
        return this.$t("bind_sim.text");
      } else if (this.chooseRecType.type === 4) {
        return this.$t("bind_wallet.text");
      }
      return "";
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
      if (this.form.verificationVal === 2) {
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
    validator(val) {
      if (Array.isArray(this.minMax)) {
        if (+val < this.minMax[0] || +val > this.minMax[1]) {
          return false;
        }
      }
      return true;
    },
    open() {
      if (!this.typeOptions.length) {
        this.$toast(this.getWithdrawBindName);
        this.getWithdrawRoutingJump();
      }
    },
    confirm() {
      const riskCode = this.riskCode;
      if (riskCode === 2) {
        //身份证件
        this.$router.push({ name: "UploadIdCard" });
      } else if (riskCode === 3) {
        //阿里
        this.initFaceRecognition();
      } else if (riskCode === 4) {
        //自制
        this.$router.push({ name: "MinsUploadIdCard" });
      }
      this.riskCode = "";
    },
    getDevice() {
      // 获取屏幕宽度和高度
      const deviceWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const deviceHeigth =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      // 获取语言
      const deviceLang = navigator.language || navigator.userLanguage;

      // 获取用户代理信息
      const deviceUa = navigator.userAgent;
      return {
        deviceWidth,
        deviceHeigth,
        deviceLang,
        deviceUa,
      };
    },
    getFingrtPrint() {
      FingerprintJS.load().then((fp) => {
        fp.get().then((result) => {
          this.fingerprint = result.visitorId;
        });
      });
    },
    async sumitData(set = true) {
      const reqParam = {
        usdtId: this.typeValue,
        type: this.chooseRecType.type,
        money: +this.amount,
        payPwd: this.form.password,
        code: this.form.vercode,
        ...this.getDevice(),
        deviceId: this.fingerprint,
      };

      if (!reqParam.money) {
        this.$toast(
          this.$t("ruls.xxx.please", {
            name: this.$t(`deal.buyDetail.387081-3`),
          })
        );
        return;
      }
      if (!reqParam.usdtId) {
        return this.$toast(this.getWithdrawChooseName);
      }
      const [errVaild] = await to(this.$refs.form.validate());
      if (errVaild) return;
      if (this.chooseRecType.wiClearVip === 1 && set) {
        this.$refs.WithdrawClearVip.show();
        return;
      }
      this.loading = true;
      const [err] = await userApi.withdrawalReq(reqParam);
      this.loading = false;
      if (err) {
        if (err.data && err.data[0]) {
          const riskCode = err.data[0].data;
          //风控逻辑处理
          if (err.data[0]?.submitted === 1) {
            this.$toast(this.$t("withdraw.risk.waitAudit"));
            return;
          }
          if ([2, 3, 4].includes(riskCode)) {
            this.riskCode = riskCode;
            this.show = true;
            return;
          }
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      this.successDialog = true;
      this.amount = "";
      this.$store.dispatch("getInfo");
      this.withdrawalPre(false);
    },
    async initFaceRecognition() {
      // 在调用服务端初始化请求时需要传入该MetaInfo值
      var MetaInfo = window.getMetaInfo();

      let data = {
        info: JSON.stringify(MetaInfo),
        // playerId: uni.getStorageSync('userInfoFootball').id,
        returnUrl: location.href,
      };
      try {
        const [err, res] = await userApi.getFaceRecognition(data);
        if (err) return;

        let { url } = res.data;
        // 接下来您进行调用服务端初始化请求获取TransactionUrl
        var TransactionUrl = url; // 此处值应为调用服务端初始化接口返回的TransactionUrl
        // 接下来直接跳转TransactionUrl即可开始服务
        this.timer && clearInterval(this.timer);
        this.timer = setTimeout(() => {
          window.location.href = TransactionUrl;
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
    async withdrawalPre(set = true) {
      const [err, res] = await userApi.withdrawalPre();
      if (err) return;
      this.withdrawList = res.data;
      if (set) {
        this.chose(this.withdrawList[0]);
      }
      this.msg = +res.msg;
      if (this.msg !== 3) {
        this.verificationOpt = this.verificationOpt.filter((item) => {
          return item.value === this.msg;
        });
      }

      const doc = this.verificationOpt.find((item) => item.value === this.msg);
      if (doc) {
        this.form.verificationVal = this.msg;
      }
    },
    async chose(item) {
      if (!item) return;
      this.amount = "";
      this.typeOptions = [];
      this.typeValue = "";
      this.chooseRecType = item;
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      // 根据选择不同的提现方式,进行不通的方法获取对应的数据
      if (item.type === 2) {
        //usdt 货币
        await this.getUsdtListData();
      } else if (item.type === 1) {
        //银行卡
        await this.getCardListData(1);
      } else if (item.type === 3) {
        await this.getSimListData();
        this.showUsdtBool = false;
      } else if (item.type === 4) {
        //数字钱包
        await this.getEwalletData();
      }
      this.$toast.clear();
    },
    async getSimListData() {},
    getWithdrawRoutingJump() {
      if (this.chooseRecType.type === 1) {
        //银行卡
        this.$router.push({ name: "AddBankCard" });
      } else if (this.chooseRecType.type === 2) {
        this.$router.push({ name: "AddressUsdt" });
        //usdt 货币
      } else if (this.chooseRecType.type === 3) {
        this.$router.push({ name: "AddressSim" });
      } else if (this.chooseRecType.type === 4) {
        //数字钱包
        this.$router.push({ name: "AddressWallet" });
      }
    },
    async getCardListData() {
      const [err, res] = await userApi.bankCardinfo();
      if (err) return;
      if (!res.data) {
        // this.$router.push({ name: "AddressWallet" });
        return;
      }
      this.typeOptions = [res.data].map((item) => {
        return {
          text: item.cardNumber,
          value: item.id,
          ...item,
        };
      });
      this.typeValue = this.typeOptions[0].id;
    },
    async getEwalletData() {
      const [err, res] = await userApi.walletInfo();
      if (err) return;
      if (res.data && !res.data.length) {
        // this.$router.push({ name: "AddressWallet" });
        return;
      }
      this.typeOptions = res.data.map((item) => {
        return {
          text: item.address,
          value: item.id,
          ...item,
        };
      });
      this.typeValue = this.typeOptions[0].id;
    },
    async getUsdtListData() {
      const [err, res] = await userApi.usdtListReq();
      if (err) return;
      if (res.data && !res.data.length) {
        // this.$router.push({ name: "AddressUsdt" });
        return;
      }
      this.typeOptions = res.data.map((item) => {
        return {
          text: item.addr,
          value: item.id,
          ...item,
        };
      });
      this.typeValue = this.typeOptions[0].id;
    },
  },
  created() {
    this.$store.dispatch("getInfo");
    this.getFingrtPrint();
    this.withdrawalPre();
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style scoped lang="less">
.message-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .type-text {
    font-size: 18px;
    font-weight: bold;
    color: #222;
  }
  .type-list {
    padding: 0 8px;
    display: flex;
    flex-wrap: wrap;
    & > li {
      padding: 8px;
      width: 50%;
      font-size: 16px;
      color: #53668e;
      .cont {
        height: 84px;
        border-radius: 15px;
        border: solid 1px #fff;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
      .pic {
        height: 42px;
        width: 94px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    & > li.active {
      .cont {
        border-color: #02f;
        background: url("~@/assets/img/chosebg.webp") no-repeat right -2px;
        background-size: 32px 32px;
      }
    }
  }
  .count-col {
    border-radius: 15px;
    background-color: #fff;
    overflow: hidden;
  }
  .count {
    padding: 8px;
  }
  .enter-form {
    font-size: 24px;
    //font-weight: bold;
    color: #222;
  }
  .pre-amount {
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    & > li {
      width: 33.33%;
      padding: 8px;
    }
    .num {
      height: 42px;
      border-radius: 12px;
      background-color: #fff;
      font-weight: bold;
      color: #222;
    }
    .active {
      background-color: #10ab61;
      color: #fff;
    }
  }
  .blue {
    color: #0025fc;
  }
  .go-bind {
    font-size: 12px;
    color: #0025fc;
  }
  .rate-money {
    text-align: right;
  }

  ::v-deep {
    .withdraw-form {
      .chose-verification {
        background-color: transparent;
        .van-field__body {
          padding-left: 0;
          padding-right: 0;
        }
      }

      .van-field__body {
        border-color: transparent;
      }
      .verification-input {
        background-color: transparent;
        .van-field__body {
          background-color: #fff;
        }
      }
      .van-field__label {
        font-size: 18px;
        font-weight: bold;
        color: #222;
      }
    }
    .menu-inpu {
      .van-field {
        padding: 0;
      }
      .van-field__body {
        height: 48px;
        padding: 8px;
        border-radius: 10px;
        border-color: #fff;
      }
    }
    .upload-dialog {
      padding: 20px 30px 30px;
      .van-hairline--top::after {
        display: none;
      }
      .upload-cont {
        & > li:nth-child(1) {
          img {
            width: 73px;
            height: 86px;
            object-fit: contain;
            display: block;
          }
        }
        & > li:nth-child(2) {
          font-size: 21px;
          font-weight: bold;
          color: #222;
          padding: 20px 0 10px;
        }
        & > li:nth-child(3) {
          font-size: 14px;
          color: #474747;
          line-height: 1.8;
        }
      }
      .van-dialog__confirm {
        height: 41px;
        border-radius: 7px;
        background-color: #0025fc;
        font-size: 14px;
        color: #fff;
        margin-top: 20px;
      }
    }
  }
  .success-upload-dialog {
    padding: 16px 24px;
    .success-cont {
      margin-bottom: 6px;
      & > li:nth-child(2) {
        font-weight: bold;
        margin: 10px 0;
      }
    }
  }
}
</style>
