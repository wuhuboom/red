<template>
  <van-action-sheet class="detail-action-sheet" v-model="show">
    <div class="content font14">
      <ul class="title justify-between align-center px-16">
        <li>{{ $t("home.bet.slip") }}</li>
        <li class="center-center">
          <van-button
            icon="plus"
            type="primary"
            size="small"
            @click="$router.push({ name: 'Recharge' })"
          ></van-button>
          {{ balanceMoneyNum }}
        </li>
      </ul>
      <div class="cont-btm pt-16 px-16">
        <ul class="name-list pb-16">
          <li class="font12">{{ cmopetitionData.allianceName }}</li>
          <li class="align-center">
            <p class="pic"><ImgCom :src="cmopetitionData.mainLogo" /></p>
            {{ cmopetitionData.mainName | removeEsports }}
          </li>
          <li class="align-center">
            <p class="pic"><ImgCom :src="cmopetitionData.guestLogo" /></p>
            {{ cmopetitionData.guestName | removeEsports }}
          </li>
        </ul>
        <ul class="odds mb-16">
          <li class="align-center justify-between">
            <p class="txt">{{ $t("detail.action.Events") }}</p>
            <p class="num">{{ score.scoreHome }}-{{ score.scoreAway }}</p>
          </li>
          <li class="align-center justify-between">
            <p class="txt">{{ $t("detail.action.Odds") }}</p>
            <p class="num anti">{{ score.antiPerCent }}%</p>
          </li>
        </ul>
        <ul class="win">
          <li>
            {{ $t("match.order.detail.estimate.profit.text") }}:
            <span class="win-num">{{ getEstimateProfit }}</span>
          </li>
          <li>
            {{
              $t(`betRange`, {
                min: cmopetitionData.minBet,
                max: cmopetitionData.maxBet,
              })
            }}
          </li>
        </ul>
        <div class="enter-form">
          <van-form @submit="onSubmit">
            <!-- :placeholder="$t('match.order.detail.field.amount.text')" -->
            <van-field
              v-model.trim="amount"
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
              ><template #button>
                <ul class="count">
                  <li><van-icon name="minus" @click="minus" /></li>
                  <li><van-icon name="plus" @click="plus" /></li>
                </ul>
                <van-button
                  size="small"
                  :loading="loading"
                  native-type="submit"
                  class="comfire"
                  type="primary"
                  >{{ $t("modal.confirm.text") }}</van-button
                >
              </template>
            </van-field>
          </van-form>
        </div>
        <p class="fee-amount">
          <span>{{ $t("match.order.detail.proce.fee.text") }}:</span
          ><span>-{{ feeAmount }}(%)</span>
        </p>
        <p>{{ $t("detail.Quick.bets") }}</p>
        <ul class="chose-glod justify-between align-center">
          <li
            v-for="(item, idx) in goldList"
            @click="glod(item)"
            :key="idx"
            class="center-center"
          >
            {{ item.text }}
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
    // getEstimateProfit() {
    //   return this.amount * this.score.antiPerCent;
    // },
    getEstimateProfit() {
      if (this.amount) {
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
    async onSubmit() {
      let reqParam = {};
      reqParam.gameId = this.cmopetitionData.id;
      reqParam.oddsId = this.score.id;
      reqParam.money = this.amount;
      reqParam.type = this.score.gameType;
      this.loading = true;
      const [err] = await userApi.betOrder(reqParam);
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
        confirmButtonColor: "#051da0",
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
  ::v-deep {
    .title {
      height: 56px;
      text-transform: capitalize;
      border-bottom: 1px solid #f7f7f8;
      > li:last-child {
        color: #222222;
        padding: 0 6px;
        height: 32px;
        line-height: 32px;
        border-radius: 16px;
        background-color: #eaeaea;
        border-color: #eaeaea;
        font-size: 12px;
        font-weight: bold;
      }
      .van-button {
        color: #222222;
        padding: 0;
        height: 24px;
        border-radius: 16px;
        background-color: #eaeaea;
        border-color: #eaeaea;

        .van-icon {
          width: 24px;
          height: 24px;
          margin-right: 2px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0025fc;
          color: #fff;
        }
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
      color: #fff;
      margin: 0 -4px;
      & > li {
        margin: 0 4px;
        width: 80px;
        height: 36px;
        border-radius: 8px;
        background-color: #222;
        padding: 4px;
      }
    }
  }
}
</style>
