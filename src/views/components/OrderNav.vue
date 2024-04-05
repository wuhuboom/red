<template>
  <ul class="order-nav">
    <li
      :class="{ active: type === 0 }"
      @click="$router.replace({ name: 'order' })"
    >
      <p><img src="@/assets/img/order@2x.webp" alt="" /></p>
      <p>{{ $t("deal_my_orders") }}</p>
    </li>
    <li
      :class="{ active: type === 1 }"
      @click="$router.replace({ name: 'trade' })"
    >
      <p><img src="@/assets/img/orderres.webp" alt="" /></p>
      <p>{{ $t("bet.detail.lottey.status.text") }}</p>
    </li>
  </ul>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "OrderNav",
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
  border-bottom: 1px solid var(--primary);
  height: 55px;
  padding: 8px 0;
  li {
    cursor: pointer;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #333;
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
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: var(--primary);
        position: absolute;
        bottom: -8px;
      }
    }
  }
}
</style>
