<template>
  <RecordsLayout
    :title="$t('me.recharge.text')"
    @changFilter="changFilter"
    :filterTab="filterTab"
    :tabs="tabsList"
  >
    <van-list
      v-model="loading"
      :finished="curItem.hasNext === false"
      finished-text=""
      loading-text="loading"
      @load="onLoad"
    >
      <NoData v-if="notthing" />
      <div v-else class="px-16 p-16">
        <ul
          class="d-flex list"
          :class="{ 'list-add': add(item) }"
          v-for="(item, idx) in curItem.results"
          :key="idx"
        >
          <li class="pic center-center">
            <img src="@/assets/img/record.webp" alt="" />
          </li>
          <li class="txt flex-1">
            <p>{{ getTabName(item.balanceChangeType) }}</p>
            <p class="font12">
              {{ formatDate(item.createdAt, "yyyy-MM-dd hh:mm:ss") }}
            </p>
          </li>
          <li class="txt text-right">
            <p class="num">
              {{
                numToFixed(item.changeMoney, $globalUnit.val) / $globalNum.val
              }}
            </p>
            <p class="font12">
              {{ $t("wallet.index.balance.text") }}:
              {{ numToFixed(item.dnedMoney, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
        </ul>
      </div>
    </van-list>
  </RecordsLayout>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import RecordsLayout from "@/views/components/RecordsLayout.vue";
export default {
  name: "BalanceDetailsView",
  components: {
    RecordsLayout,
  },
  data() {
    return {
      filterTab: 0,
      loading: false,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
      // 1线上充值 2提现 3投注 4投注盈利 5下级盈利返利
      // 6人工加款 7投注撤消
      // 8人工减款 9投注返奖扣除 10 充值撤消 11线下充值
      // 12提现退回 13投注退回 14投注回滚 15注册赠送
      // 16奖金 17 VIP礼金 18 活动礼金 19充值赠送
      // 20手续费 21下级充值返利 22下级投注返利
      // 23邀请奖励 24首充奖励 25活动 26次充奖励 27固定日
      // 28邀请首充奖励 29幸运转盘抽奖 30幸运转盘中奖
      // 31.线下活动 32 报单上分 33冲正 34划转
      // 35.团队激励 36.充值补偿
      // 1线上充值 2提现 3投注 4投注盈利 5下级盈利返利
      // 6人工加款 7投注撤消
      // 8人工减款 9投注返奖扣除 10 充值撤消 11线下充值
      // 12提现退回 13投注退回 14投注回滚 15注册赠送
      // 16奖金 17 VIP礼金 18 活动礼金 19充值赠送
      // 20手续费 21下级充值返利 22下级投注返利
      // 23邀请奖励 24首充奖励 25活动 26次充奖励 27固定日
      // 28邀请首充奖励 29幸运转盘抽奖 30幸运转盘中奖
      // 31.线下活动 32 报单上分 33冲正 34划转
      // 35.团队激励 36.充值补偿，37.报单上分
      tabsList: [
        {
          label: this.$t("dropdown.billing.all.title.text"),
          value: 0,
        },
        {
          label: this.$t("dropdown.billing.income.online.recharge.text"),
          value: 1,
        },
        {
          label: this.$t("dropdown.billing.income.withdraw.text"),
          value: 2,
        },
        {
          label: this.$t("dropdown.billing.expenditure.bet.text"),
          value: 3,
        },
        {
          label: this.$t("dropdown.billing.income.bet.rebate.text"),
          value: 4,
        },
        {
          label: this.$t("dropdown.billing.income.lower.level.rebate.text"),
          value: 5,
        },
        {
          label: this.$t("dropdown.billing.income.manually.add.money.text"),
          value: 6,
        },
        {
          label: this.$t("dropdown.billing.income.bet.cancel.text"),
          value: 7,
        },
        {
          label: this.$t("dropdown.billing.expenditure.manual.reduction.text"),
          value: 8,
        },
        {
          label: this.$t("dropdown.billing.expenditure.rebate.deduction.text"),
          value: 9,
        },
        {
          label: this.$t("dropdown.billing.expenditure.online.cancel.text"),
          value: 10,
        },
        {
          label: this.$t("dropdown.billing.income.offline.recharge.text"),
          value: 11,
        },
        {
          label: this.$t("dropdown.billing.income.withdraw.return.text"),
          value: 12,
        },
        {
          label: this.$t("dropdown.billing.income.bets.return.text"),
          value: 13,
        },
        {
          label: this.$t("dropdown.billing.income.bet.back.text"),
          value: 14,
        },
        {
          label: this.$t("dropdown.billing.income.register.gift.text"),
          value: 15,
        },
        {
          label: this.$t("dropdown.billing.bonus.text"),
          value: 16,
        },
        {
          label: this.$t("dropdown.billing.income.vip.cash.text"),
          value: 17,
        },
        {
          label: this.$t("dropdown.billing.income.activity.cash.text"),
          value: 18,
        },
        {
          label: this.$t("dropdown.billing.income.recharge.gift.text"),
          value: 19,
        },
        {
          label: this.$t("dropdown.billing.transaction.fee.text"),
          value: 20,
        },
        {
          label: this.$t(
            "dropdown.billing.income.lower.level.recharge.rebate.text"
          ),
          value: 21,
        },
        {
          label: this.$t("dropdown.billing.income.lower.level.bet.rebate.text"),
          value: 22,
        },
        {
          label: this.$t("dropdown.billing.income.invite.rewards.text"),
          value: 23,
        },
        {
          label: this.$t("dropdown.billing.income.first.charge.text"),
          value: 24,
        },
        {
          label: this.$t("dropdown.billing.income.active.profit.text"),
          value: 25,
        },
        {
          label: this.$t("dropdown.billing.income.sufficient.reward.text"),
          value: 26,
        },
        {
          label: this.$t("dropdown.billing.income.fixed.day.text"),
          value: 27,
        },
        {
          label: this.$t("dropdown.billing.invite.first.charge.text"),
          value: 28,
        },
        // {
        //     label: this.$t("backapi.report.account.change.query.type.turntable.lottery.text"),
        //     value: 29,
        // },
        // {
        //     label: this.$t("backapi.report.account.change.query.type.turntable.jackpot.text"),
        //     value: 30,
        // },
        {
          label: this.$t("dropdown.billing.offline.activity.text"),
          value: 31,
        },
        {
          label: this.$t("dropdown.billing.report.score.text"),
          value: 32,
        },
        {
          label: this.$t("dropdown.billing.redo.text"),
          value: 33,
        },
        {
          label: this.$t("backapi.self.safe.huaz.transfer.text"),
          value: 34,
        },
        {
          label: this.$t(
            "backapi.report.account.change.query.type.team.motivation.text"
          ),
          value: 35,
        },
        {
          label: this.$t("dropdown.billing.recharge.compensation.text"),
          value: 36,
        },
        {
          label: this.$t("dropdown.billing.report.score.text"),
          value: 37,
        },
      ],
      tabCurrent: 0,
      tabsNavList: [
        {
          name: this.$t("match.records.today.text"),
        },
        {
          name: this.$t("match.records.yes.text"),
        },
        {
          name: this.$t("match.records.nearly7.text"),
        },
      ],
    };
  },
  computed: {
    notthing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
  },
  methods: {
    getState(value) {
      if (this.statusList[value]) {
        return this.statusList[value].label;
      }
      return "--";
    },
    getTabName(type) {
      if (type) {
        let typeItem = this.tabsList.filter((item) => item.value == type);
        return typeItem[0].label || "";
      }
      return "";
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      let reqParam = { pageNo, pageSize: this.curItem.pageSize };
      if (this.filterTab != 0) {
        reqParam.type = this.filterTab;
      }
      reqParam.typeb = [10, 8, 2, 3, 9].includes(this.filterTab) ? 2 : 1;
      reqParam.time = 3;
      const [err, res] = await userApi.balanceChangeReq(reqParam);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }
      let list =
        res.data.pageNo == 1
          ? res.data.results
          : this.curItem.results.concat(res.data.results);
      this.curItem = {
        ...res.data,
        results: list,
        pageNo: res.data.pageNo + 1,
      };
      this.$toast.clear();
    },
    async changFilter(v) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      this.filterTab = v;
      await this.onLoad(1);
    },
    add(item) {
      return !`${item.changeMoney}`.includes("-");
    },
  },
};
</script>
<style scoped lang="less">
.agency-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .tabs-list {
    background-color: #fff;
    color: #939598;
    & > li {
      margin-right: 40px;
      height: 45px;
      position: relative;
    }
    & > li:last-child {
      margin-right: 0;
    }
    .active {
      color: #135ef2;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 2px solid #135ef2;
        display: block;
        width: 100%;
      }
    }
  }
  .filter-nav {
    overflow-x: auto;
  }
  .tabs-filter {
    height: 56px;
    white-space: nowrap;
    & > li {
      padding: 0 12px;
      height: 28px;
    }
    .active {
      border-radius: 14px;
      background-color: #135ef2;
      color: #fff;
    }
  }
  .list {
    padding: 20px 20px 20px 0;
    background-color: #fff;
    border-bottom: 2px solid #efefef;
    margin-bottom: 4px;
    .pic {
      width: 72px;
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
      }
    }
    .txt {
      & > p:nth-child(1) {
        color: #222741;
        margin-bottom: 10px;
      }
      & > p:nth-child(2) {
        color: #acaebe;
      }
    }
    .num {
      color: #75788d;
      // font-size: 16px;
    }
  }
  .list-add {
    .num {
      color: #73c74e !important;
    }
  }
  .text-right {
    text-align: right;
  }
}
</style>
