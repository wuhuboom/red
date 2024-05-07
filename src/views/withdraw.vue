<template>
  <div class="message-page font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('home.index.withdraw.text')"
    >
    </AppTopBar>
    <div class="center-center py-16" v-if="!withdrawList.length">
      <van-Loading class="color-primary" />
    </div>
    <div v-else class="">
      <ul class="type-list p-l-12 p-r-12 m-b-8">
        <li
          v-for="(item, index) in withdrawList"
          @click="chose(item)"
          :class="{ 'color-active': item.type === chooseRecType.type }"
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
      <div class="p-x-24 p-r-24">
        <p>{{ getWithdrawChooseName }}</p>
        <div class="justify-between align-center list-doc m-b-4">
          <div>
            <el-select
              v-if="typeOptions.length"
              :placeholder="getWithdrawChooseName"
              v-model="typeValue"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div @click="getWithdrawRoutingJump">{{ getWithdrawBindName }}</div>
        </div>
        <p>{{ $t("deal.buyDetail.387081-3") }}</p>
        <div ref="align" class="justify-between align-center list-doc">
          <div class="flex-1">
            <div class="black-form">
              <van-field
                ref="amount"
                :placeholder="`${$t('deal.buyDetail.387081-5')} ${
                  chooseRecType.withdrawMin
                }-${chooseRecType.withdrawMax}`"
                v-model.trim="amount"
                type="number"
              >
              </van-field>
            </div>
          </div>
          <div @click="setAll">
            {{ $t(`order.search.all.text`) }}
          </div>
        </div>
        <van-form ref="form" class="black-form withdraw-form">
          <el-select
            style="width: 100%"
            v-if="msg"
            class="bg-select"
            :placeholder="$t('index.editor.psd.text')"
            v-model="form.verificationVal"
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

          <van-field
            :placeholder="$t('form.vercode.text')"
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
                class="page-res-btn center-center"
                color="#0025fc"
                >{{ $t("deal.chat.921073-7")
                }}{{ countdown ? `(${countdown})` : "" }}</van-button
              >
            </template>
          </van-field>
          <van-field
            type="password"
            :placeholder="
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
        <div class="count-col p-t-16">
          <div class="justify-between count-col-up align-center">
            <div>
              <p class="font12 flex-column center-center">
                <span>{{ $t("recharge.usdt.rate.text") }}</span
                ><span class="color-active">{{ chooseRecType.rate }}</span>
              </p>
              <p class="font12 flex-column center-center">
                <span>{{ $t("wallet.index.balance.text") }}</span
                ><span class="color-active">{{ balanceMoneyNum }}</span>
              </p>
            </div>

            <div>
              <p class="font12 flex-column center-center">
                <span>{{ $t("Withdrawal.risk.fee") }}</span
                ><span class="color-active"
                  >{{ withdrawNumRate }}
                  {{ chooseRecType.currencySymbol }}</span
                >
              </p>
              <p class="font12 flex-column center-center">
                <span>{{ $t("recharge.real.amount.text") }}</span
                ><span class="color-active"
                  >{{ actualAmountTran }}
                  {{ chooseRecType.currencySymbol }}</span
                >
              </p>
            </div>
          </div>
          <div class="sumit-section center-center">
            <van-button
              class="page-res-btn"
              block
              type="info"
              :loading="loading"
              @click="sumitData"
            >
              {{ $t("confirm.btn.text") }}</van-button
            >
          </div>
        </div>
        <ul class="m-t-16">
          <li>{{ $t(`recharge.tip.title.text`) }}</li>
          <li class="m-b-16">
            1、{{ $t("withdraw.desc.list1") }}
            {{ chooseRecType.everydayWithdrawFree }}
          </li>
          <li class="m-b-16">
            2、{{ $t("withdraw.desc.list2") }}
            {{ chooseRecType.everydayWithdrawTimes }}
          </li>
          <li class="m-b-16">
            3、{{ $t("withdraw.desc.list3") }}
            {{ chooseRecType.withdrawalRate }}%
          </li>
          <li class="m-b-16">
            4、{{ $t("withdraw.desc.list4") }}
            {{ chooseRecType.withdrawMax }},{{ $t("withdraw.desc.list5") }}
            {{ chooseRecType.withdrawMin }}
          </li>
          <li class="m-b-16">
            5、{{ $t("withdraw.desc.list6") }}
            {{ chooseRecType.withdrawalToday }}
          </li>
          <li class="m-b-16">
            6、{{ $t("withdraw.desc.list7") }}
            {{ chooseRecType.withdrawalRateMin }},{{
              $t("withdraw.desc.list8")
            }}
            {{ chooseRecType.withdrawalRateMax }}
          </li>
          <li class="m-b-16">
            7、{{ $t("withdraw.desc.list9") }}
            {{ chooseRecType.rate }}
          </li>
        </ul>
      </div>
      <WithdrawFree
        :obj="{
          vip: user.vipLevel,
          num: chooseRecType.wiClearVipCount - 1,
        }"
        @confirm="sumitData(false)"
        ref="WithdrawFree"
      />
      <WithdrawClearVip @confirm="sumitData(false)" ref="WithdrawClearVip" />
      <ComfireDialog
        :texts="[
          $t(`Submitted.successfully`),
          $t(`Submitted.submitted.arrive`),
        ]"
        ref="ComfireDialog"
      />
      <ComfireDialog
        :texts="[$t(`withdraw.risk.warning`), $t(`withdraw.risk.content`)]"
        ref="riskCode"
        @sure="confirm"
      />
    </div>
  </div>
</template>

<script>
const initCountdown = 60;
import userApi from "@/api/user";
import i18n from "@/locale";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import WithdrawClearVip from "@/views/components/WithdrawClearVip.vue";
import WithdrawFree from "@/views/components/WithdrawFree.vue";
import to from "await-to-js";
export default {
  name: "WithdrawView",
  components: {
    WithdrawClearVip,
    WithdrawFree,
  },
  data() {
    return {
      countdown: 0,
      fingerprint: "",
      successDialog: false,
      riskCode: "",
      show: true,
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
      let num =
        (this.amount / this.chooseRecType.rate) *
        (this.chooseRecType.withdrawalRate / 100);
      return this.numToFixed(num, this.$globalUnit.val);
    },
    actualAmountTran() {
      //实际到账金额
      let num =
        (this.amount / this.chooseRecType.rate) * 1 - this.withdrawNumRate * 1;
      return this.numToFixed(num, this.$globalUnit.val);
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
      if (set) {
        if (this.chooseRecType.wiClearVipCount > 0) {
          this.$refs.WithdrawFree.show();
          return false;
        }
        if (this.chooseRecType.wiClearVip === 1) {
          this.$refs.WithdrawClearVip.show();
          return;
        }
      }

      this.loading = true;
      const [err] = await userApi.withdrawalReq(reqParam);
      this.loading = false;
      if (err) {
        if (err.data && err.data[0]) {
          const riskCode = err.data[0].data;
          const msgKey = `backapi.${err.data[0].msgKey}`;
          //风控逻辑处理
          if (err.data[0]?.submitted === 1) {
            this.$toast(this.$t("withdraw.risk.waitAudit"));
            return;
          }
          if ([2, 3, 4].includes(riskCode)) {
            this.riskCode = riskCode;
            // this.show = true;
            this.$refs.riskCode.open();
            return;
          }
          if (msgKey === "backapi.withdrawalLimit") {
            this.$toast(err.data[0].withdrawalLimitMsg);
            return;
          }
          this.$toast(this.$t(msgKey));
        }
        return;
      }
      this.openSucceessDialog();
      this.amount = "";
      this.$store.dispatch("getInfo");
      this.withdrawalPre(false);
    },
    openSucceessDialog() {
      this.$refs.ComfireDialog.open();
      this.$refs.ComfireDialog.cancelBtnShow(false);
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
    async setAll() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.$store.dispatch("getInfo");
      this.amount = this.balanceMoneyNum;
      this.$toast.clear();
    },
  },
  async created() {
    this.$store.dispatch("getInfo");
    this.getFingrtPrint();
    await this.withdrawalPre();
    this.$nextTick(() => {
      this.$refs.amount && this.$refs.amount.focus();
    });
  },
  beforeDestroy() {
    this.clearTimer();
  },
};
</script>
<style scoped lang="less">
.message-page {
  .type-text {
    font-size: 18px;
    font-weight: bold;
    color: #222;
  }
  .list-doc {
    min-height: 40px;
  }
  ::v-deep {
    .list-doc,
    .bg-select .el-input__inner {
      background: url("@/assets/img/red/inputborder.webp") no-repeat center
        bottom !important;
      background-size: 100% auto !important;
      // padding-bottom: 12px;
    }
  }

  .type-list {
    display: flex;
    flex-wrap: wrap;
    & > li {
      width: 33.33%;
      .cont {
        height: 84px;
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
    & > li:nth-child(3n + 2) {
      border-right: 1px solid var(--primary);
      border-left: 1px solid var(--primary);
    }
    & > li.active {
      .cont {
      }
    }
  }
  .count-col {
    background: url("@/assets/img/red/witbg.webp") no-repeat center bottom;
    background-size: 100% 100%;
    height: 116px;
    .count-col-up {
      & > div {
        width: 50%;
        text-align: center;
      }
    }
  }
  .count {
    padding: 8px;
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
      .van-field__body {
        background: url("@/assets/img/red/inputborder.webp") no-repeat center
          bottom;
        background-size: 100% auto;
        padding-bottom: 12px;
        border: none;
        padding-left: 0;
        padding-right: 0;
      }
      .van-cell {
        margin: 0;
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
