<template>
  <ul class="order-nav">
    <li
      :class="{ active: type === 0 }"
      @click="$router.replace({ name: 'FinancialPecords' })"
    >
      <p>{{ $t("me.recharge.text") }}</p>
    </li>
    <li
      :class="{ active: type === 1 }"
      @click="$router.replace({ name: 'WithdrawRecord' })"
    >
      <p>{{ $t("me.withdraw.text") }}</p>
    </li>
  </ul>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
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
  color: var(--primary);
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
