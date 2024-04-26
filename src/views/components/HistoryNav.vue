<template>
  <ul class="order-nav color-fff">
    <li
      :class="{ active: type === 0 }"
      @click="$router.replace({ name: skip1.name })"
    >
      <p>{{ skip1.text }}</p>
    </li>
    <li
      :class="{ active: type === 1 }"
      @click="$router.replace({ name: skip2.name })"
    >
      <p>{{ skip2.text }}</p>
    </li>
  </ul>
</template>

<script>
import i18n from "@/locale";
export default {
  name: "HistoryNav",
  data() {
    return {};
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
    skip1: {
      type: Object,
      default: () => {
        return {
          name: "FinancialPecords",
          text: i18n.t("me.recharge.text"),
        };
      },
    },
    skip2: {
      type: Object,
      default: () => {
        return {
          name: "WithdrawRecord",
          text: i18n.t("me.withdraw.text"),
        };
      },
    },
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
};
</script>
<style scoped lang="less">
.order-nav {
  display: flex;
  justify-content: space-between;
  height: 77px;
  padding: 8px 0;
  background: url("@/assets/img/red/rechargeHistory.webp") no-repeat center
    center;
  background-size: 100% 100%;
  li {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-direction: column;
    position: relative;
    & > p:nth-child(2) {
      margin-top: 2px;
    }
    img {
      display: block;
      object-fit: cover;
      height: 24px;
      width: 24px;
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.active {
      color: var(--active);
    }
  }
}
</style>
