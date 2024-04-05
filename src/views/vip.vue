<template>
  <div class="vip-page font14">
    <AppTopBar :titleClass="['app-top-black-title']" topBarTitle="VIP">
    </AppTopBar>
    <div class="center-center py-16" v-if="!dataList.length">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16">
      <ul class="vip-head px-16 py-16">
        <li>{{ $t(`vip.current.level`) }}：Vip{{ vipLevel }}</li>
        <li>
          <van-progress
            :data-num="preVip"
            track-color=" #6e8cf9"
            color="#FFF"
            :show-pivot="false"
            :percentage="preVip"
            stroke-width="8"
          />
        </li>
        <li v-html="$t('vip_tip', { num: calculateDaysFromTimestamp })"></li>
      </ul>
      <div class="py-16">
        <div class="table">
          <van-grid class="tab-head capitalize" :column-num="3" :border="false">
            <van-grid-item v-for="value in head" :key="value" :text="value" />
          </van-grid>
          <van-grid class="tab-cont" :column-num="3" :border="false">
            <van-grid-item v-for="value in list" :key="value" :text="value" />
          </van-grid>
        </div>
      </div>
      <p class="title pb-16">{{ $t("vip.Rank.Description") }}</p>
      <ul class="text-list">
        <li class="pb-16">
          {{ $t("vip.Rank.Description1") }}
        </li>
        <li class="pb-16">
          {{ $t("vip.Rank.Description2") }}
        </li>
        <li class="pb-16">
          {{ $t("vip.Rank.Description3") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "WithdrawView",
  data() {
    return {
      loading: false,
      dataList: "",
    };
  },
  computed: {
    list() {
      const arr = [];
      if (!Array.isArray(this.dataList)) return arr;
      this.dataList.forEach((item) => {
        if (item.level > 0) {
          arr.push(`Vip${item.level}`);
          if (this.vipModel === 0) {
            arr.push(`${item.upTotal}`);
          } else {
            arr.push(`${item.upBetDays}${this.$t("safe.invite.days")}`);
          }
          // * 100
          arr.push(`${item.dayReward}%`);
        }
      });
      return arr;
    },
    head() {
      if (this.vipModel === 0) {
        return [
          i18n.t(`safe.invite.level`),
          i18n.t(`rebate.center.list.nav.smount.text`),
          i18n.t(`new.Add.rebate`),
        ];
      }
      return [
        i18n.t(`safe.invite.level`),
        i18n.t(`new.Add.betting`),
        i18n.t(`new.Add.rebate`),
      ];
    },
    vipModel() {
      return this.$store.state.config.vipModel;
    },
    preVip() {
      if (!Array.isArray(this.dataList)) return 0;
      return (
        (this.dataList.filter((item) => item.level <= this.vipLevel).length /
          this.dataList.length) *
        100
      );
    },
    vipLevel() {
      return this.$store.state.user.vipLevel;
    },
    createdAt() {
      return this.$store.state.user.createdAt;
    },
    balanceMoneyNum() {
      return this.$store.state.user.balance;
    },
    frozenBet() {
      return this.$store.state.user.frozenBet;
    },
    calculateDaysFromTimestamp() {
      // 获取当前时间的时间戳（单位：毫秒）
      const currentTime = Date.now();

      // 计算给定时间戳距离当前时间的毫秒数差值
      const timeDiff = currentTime - this.createdAt;

      // // 将毫秒数差值转换为天数
      // const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      // 将毫秒数差值转换为天数，并向上取整
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return daysDiff;
    },
  },
  methods: {
    getProgress() {
      if (!Array.isArray(this.dataList)) return 0;
      const nextVip = this.dataList.find((item) => {
        if (item.level == this.vipLevel + 1) {
          return true;
        } else {
          return false;
        }
      });
      if (nextVip) {
        return this.numToFixed(
          (this.balanceMoneyNum / this.$globalNum.val +
            this.frozenBet / this.$globalNum.val) /
            nextVip.balance,
          this.$globalUnit.val
        );
      }
      return 100;
    },
    async homeVip() {
      const [err, res] = await userApi.homeVip();
      if (err) return;
      this.dataList = res.data;
    },
  },
  created() {
    this.homeVip();
  },
};
</script>
<style scoped lang="less">
.vip-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .vip-head {
    color: #fff;
    height: 99px;
    border-radius: 12px;
    background-color: #02f;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    & > li:nth-child(1) {
      color: #f8f8f8;
    }
    & > li:nth-child(3) {
      font-size: 12px;
      color: #b2c6fe;
    }
  }
  .title {
    font-weight: bold;
    color: #061941;
  }
  .text-list {
    padding: 12px;
    background-color: #fff;
    color: #222;
    border-radius: 8px;
  }
  ::v-deep {
    .table {
      border-radius: 12px;

      overflow: hidden;
    }
    .tab-head {
      height: 40px;
      .van-grid-item__text {
        color: #fff;
      }
      .van-grid-item__content {
        padding: 0;
        background-color: #0025fc;
      }
    }
    .tab-cont {
      .van-grid-item__text {
        color: #333;
      }
      .van-grid-item {
        height: 60px;
        padding: 0;
        height: 60px;
      }
    }
  }
}
</style>
