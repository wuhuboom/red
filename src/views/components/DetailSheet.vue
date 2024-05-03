<template>
  <van-action-sheet class="detail-action-sheet color-fff" v-model="show">
    <div class="content font12">
      <ul class="title flex-column center-center px-16">
        <li class="center-center color-primary color-primary p-t-24 p-b-4">
          {{ balanceMoneyNum }}
        </li>
        <li>{{ $t("wallet.Account.Balance") }}</li>
      </ul>
      <div class="defind-form p-l-16 p-r-16">
        <van-form ref="form" @submit="onSubmit">
          <!-- :placeholder="$t('match.order.detail.field.amount.text')" -->
          <van-field
            v-model.trim="amount"
            name="amount"
            :placeholder="$t('match.order.detail.field.amount.text')"
            :rules="[
              {
                validator,
                message: $t(`betRange`, {
                  min: cmopetitionData.minBet,
                  max: cmopetitionData.maxBet,
                }),
              },
            ]"
            type="number"
          >
          </van-field>
        </van-form>
        <ul class="chose-glod color-primary justify-between align-center">
          <li
            v-for="(item, idx) in goldList"
            @click="glod(item)"
            :key="idx"
            class="center-center"
          >
            {{ item.text }}
          </li>
        </ul>
        <ul class="title flex-column center-center px-16 m-b-8">
          <li class="center-center color-primary p-b-4">
            {{ getEstimateProfit }}
          </li>
          <li>{{ $t("match.order.detail.estimate.profit.text") }}</li>
        </ul>
        <ul class="text-center m-b-8">
          <li>{{ $t("Pay.Rate") }}</li>
          <li class="color-primary">x{{ payRate }}%</li>
        </ul>
        <ul class="text-center m-b-8">
          <li>{{ $t("VIP.earnings") }}</li>
          <li class="color-primary">x{{ vipRate }}%</li>
        </ul>
        <ul class="text-center m-b-8">
          <li>{{ $t("match.order.detail.proce.fee.text") }}</li>
          <li class="color-primary">-{{ feeAmount }}%</li>
        </ul>
        <ul class="p-t-24">
          <li class="center-center p-b-40">
            <p class="page-res-btn m-r-24" @click="close">
              {{ $t(`modal.cancel.text`) }}
            </p>
            <p class="page-res-btn" @click="vaidForm">
              {{ $t(`modal.confirm.text`) }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
import { Dialog } from "vant";
import userApi from "@/api/user";
import i18n from "@/locale";
import to from "await-to-js";
export default {
  name: "DetailSheet",
  data() {
    return {
      loading: false,
      show: false,
      cmopetitionData: {},
      score: {},
      fastMoneyArray: [],
      balanceMoneyNum: 0,
      feeAmount: 0,
      payRate: 0,
      vipRate: 0,
      amount: "",
      goldList: [
        {
          text: 100,
          value: 100,
        },
        {
          text: 200,
          value: 200,
        },
        {
          text: i18n.t(`match.all.text`),
          value: "all",
        },
        {
          text: i18n.t(`safe.invite.Customize`),
          value: "Customize",
        },
      ],
    };
  },
  components: {},
  computed: {
    getEstimateProfit() {
      if (this.amount) {
        console.log(this.$globalNum.val);
        return this.numToFixed(
          this.amount * (this.payRate / 100 + this.vipRate / 100) -
            this.feeAmount / this.$globalNum.val,
          this.$globalUnit.val
        );
      } else {
        return "0.00";
      }
    },
  },
  methods: {
    async vaidForm() {
      const [err] = await to(this.$refs.form.validate("amount"));
      console.log(err);
      if (err) return;
      this.onSubmit();
    },
    async onSubmit() {
      let reqParam = {};
      reqParam.gameId = this.cmopetitionData.id;
      reqParam.oddsId = this.score.id;
      reqParam.money = this.amount;
      reqParam.type = this.score.gameType;
      this.loading = true;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err] = await userApi.betOrder(reqParam);
      this.$toast.clear();
      this.loading = false;
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      this.amount = "";

      Dialog.alert({
        message: this.$t(`backapi.success.bet.text`),
        theme: "round-button",
        confirmButtonText: "OK",
        className: "order-finis-button",
      }).then(() => {
        // on close
      });
      this.close();
    },
    validator(val) {
      if (
        +val < this.cmopetitionData.minBet ||
        +val > this.cmopetitionData.maxBet
      ) {
        return false;
      }
      return true;
    },
    minus() {
      if (!this.amount || isNaN(this.amount)) {
        this.amount = this.cmopetitionData.minBet;
        return;
      }
      this.amount--;
      if (this.amount < this.cmopetitionData.minBet) {
        this.amount = this.cmopetitionData.minBet;
        this.$toast(
          this.$t(`betRange`, {
            min: this.cmopetitionData.minBet,
            max: this.cmopetitionData.maxBet,
          })
        );
      }
    },
    plus() {
      if (!this.amount || isNaN(this.amount)) {
        this.amount = this.cmopetitionData.maxBet;
        return;
      }
      this.amount++;
      if (this.amount > this.cmopetitionData.maxBet) {
        this.amount = this.cmopetitionData.maxBet;
        this.$toast(
          this.$t(`betRange`, {
            min: this.cmopetitionData.minBet,
            max: this.cmopetitionData.maxBet,
          })
        );
      }
    },
    async glod(item) {
      if (item.value === "Customize") {
        this.amount = "";
      } else if (item.value === "all") {
        await this.betPre();
        this.amount = this.balanceMoneyNum;
      } else {
        this.amount = item.value;
      }
    },
    async betPre() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err, resR] = await userApi.betPre({
        gameId: this.cmopetitionData.id,
        oddsId: this.score.id,
      });
      this.$toast.clear();
      if (err) return;
      this.cmopetitionData = resR.data.game;
      this.score = resR.data.lossPerCent;
      // 赔率
      this.payRate = resR.data.lossPerCent.antiPerCent;
      // vip收益
      this.vipRate = resR.data.bonus;
      //手续费
      this.feeAmount = resR.data.betHandMoneyRate;
      // 金额相关
      this.balanceMoneyNum =
        this.numToFixed(resR.data.balance, this.$globalUnit.val) /
        this.$globalNum.val;
      // 快捷充值fastMoney
      let fastMoenyArr = resR.data.fastMoney.split("-");
      this.fastMoneyArray = fastMoenyArr;
    },
    async open(obj) {
      console.log(obj);
      this.cmopetitionData = obj.game;
      this.score = obj.curItem;
      await this.betPre();
      this.show = true;
    },
    close() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="less">
.detail-action-sheet {
  background-color: var(--bg-body);
  ::v-deep {
    .title {
      text-transform: capitalize;
      & > li:nth-child(1) {
        font-size: 26px;
        font-weight: 900;
      }
    }
    .enter-form {
      .van-field__body {
        position: relative;
        .count {
          display: flex;
          justify-content: space-between;
          position: absolute;
          left: 156px;
          top: 6px;
          li {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            background-color: #222;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          & > li:last-child {
            margin-left: 12px;
          }
        }
      }
      .van-field {
        padding: 0;
      }
      .comfire {
        background-color: #0025fc;
        border-radius: 8px;
        border-color: #0025fc;
        min-width: 110px;
      }
      .van-field__control {
        border-radius: 8px;
        background-color: #eaeaea;
        height: 34px;
        padding: 0 8px;
      }
    }
    .name-list {
      & > li:nth-child(1) {
        color: #707070;
        padding-bottom: 12px;
      }
      & > li:nth-child(3) {
        padding-top: 6px;
      }
    }

    .pic {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    .odds {
      border-radius: 8px;
      background-color: #eaeaea;
      padding: 8px;
      .txt {
        color: #707070;
      }
      .num {
        font-weight: bold;
      }
      & > li:nth-child(1) {
        margin-bottom: 6px;
      }
      .anti {
        color: var(--primary);
      }
    }
    .win {
      color: #707070;
      & > li:last-child {
        padding-top: 8px;
        padding-bottom: 12px;
      }
      .win-num {
        color: var(--primary);
        font-weight: bold;
      }
    }
    .fee-amount {
      color: #475467;
      margin-top: 6px;
      margin-bottom: 12px;
      & > span:last-child {
        margin-left: 4px;
      }
    }
    .chose-glod {
      padding: 6px 0 32px;

      margin: 0 -4px;
      & > li {
        margin: 0 4px;
        width: 80px;
        height: 36px;
        padding: 4px;
        border-right: 1px solid var(--main);
      }
      & > li:last-child {
        border-right: none;
      }
    }
  }
}
</style>
<style lang="less">
.order-finis-button {
  background-color: var(--bg-body);
  color: var(--primary);
  .van-dialog__message {
    color: var(--primary);
  }
  .van-dialog__footer {
    background-color: transparent;
  }
}
</style>
