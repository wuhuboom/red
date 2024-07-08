<template>
  <div class="agency-page font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('Data.Center.Level')"
    >
    </AppTopBar>
    <HistoryNav
      class="m-b-24"
      :skip1="{
        name: 'Agency',
        text: $t('DATE.CENTER.LEVEL1-3'),
      }"
      :skip2="{
        name: 'UserList',
        text: $t('agency.center.user.center.text'),
      }"
    />
    <div class="tab-list m-l-16 m-r-16">
      <ul class="tab p-b-24">
        <li
          class="m-r-16"
          v-for="(item, idx) in tabsList"
          @click="chang(item)"
          :class="{ active: tabCurrent === item.value }"
          :key="idx"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="center-center py-16" v-if="cumulativeActivity === null">
      <van-Loading class="color-primary" />
    </div>
    <div v-else>
      <van-grid
        class="color-primary m-x-16 p-b-16 border-btm"
        :border="false"
        :column-num="3"
      >
        <van-grid-item>
          <div>{{ $t("team.report.teambalance.text") }}</div>
          <div class="m-t-4">
            {{ numToFixed(totalBalance, $globalUnit.val) / $globalNum.val }}
          </div>
        </van-grid-item>
        <van-grid-item>
          <div>{{ $t("agency.center.teamSize.text") }}</div>
          <div class="m-t-4">
            {{ playerCount }}
          </div>
        </van-grid-item>
        <van-grid-item>
          <div>{{ $t("agency.center.newreg.text") }}</div>
          <div class="m-t-4">
            {{ newPlayer }}
          </div>
        </van-grid-item>
      </van-grid>

      <van-grid
        class="color-primary m-x-16 p-b-16 border-btm"
        :border="false"
        :column-num="3"
      >
        <van-grid-item>
          <div>{{ $t("agency.center.numofbets.text") }}</div>
          <div class="m-t-4">
            {{ totalBetPlayer }}
          </div>
        </van-grid-item>
        <van-grid-item>
          <div>{{ $t("agency.center.team.motivation.text") }}</div>
          <div class="m-t-4">
            {{ teamGroupAim }}
          </div>
        </van-grid-item>
        <van-grid-item @click.native="$router.push({ name: 'userUnaim' })">
          <div>{{ $t("agency.center.team.motivation.not.text") }}</div>
          <div class="m-t-4 center-center">
            {{ teamGroupUnAim }}
            <i class="el-icon-arrow-right m-l-4 bold"></i>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import HistoryNav from "@/views/components/HistoryNav.vue";
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "AgencyView",
  components: {
    HistoryNav,
  },
  data() {
    return {
      tabsList: [
        {
          name: i18n.t("match.records.today.text"),
          value: 1,
        },
        {
          name: i18n.t("match.records.yes.text"),
          value: 2,
        },
        {
          name: i18n.t("match.records.nearly7.text"),
          value: 3,
        },
        {
          name: i18n.t("match.records.nearly10.text"),
          value: 4,
        },
        {
          name: i18n.t("match.records.nearly30.text"),
          value: 5,
        },
      ],
      tabCurrent: 1,

      cumulativeActivity: null, //活动奖励
      totalBalance: 0, //团队余额
      playerCount: 0, //团队人数
      newPlayer: 0, //新增注册
      teamGroupAim: 0, //团队激励达标数
      teamGroupUnAim: 0, //团队激励未达标人数
      playerActive: 0, //活跃人数
      totalRecharge: 0, //团队充值
      totalWithdrawal: 0, //团队提现
      netProfit: 0, //净利润
      totalBetBalance: 0, //投注金额
      totalBetPlayer: 0, //投注人数
      cumulativeWinning: 0, //中奖总额

      loadingPage: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async chang(item) {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      this.tabCurrent = item.value;
      await this.getStatissticsData();
      this.$toast.clear();
    },
    async getStatissticsData() {
      const [err1, res1] = await userApi.dataCenter(
        {
          time: this.tabCurrent,
          key: "first",
        },
        1
      );
      if (err1) return;
      this.cumulativeActivity = res1.data.cumulativeActivity;
      this.totalBalance = res1.data.totalBalance;
      this.playerCount = res1.data.playerCount;
      this.newPlayer = res1.data.newPlayer;
      this.teamGroupUnAim = res1.data.groupUnAim;
      this.playerActive = res1.data.playerActive;
      const [err2, res2] = await userApi.dataCenter(
        {
          time: this.tabCurrent,
          key: res1.data.key,
        },
        2
      );
      if (err2) return;
      this.totalRecharge = res2.data.totalRecharge;
      const [err3, res3] = await userApi.dataCenter(
        {
          time: this.tabCurrent,
          key: res2.data.key,
        },
        3
      );
      if (err3) return;
      this.totalWithdrawal = res3.data.totalWithdrawal;
      const [err4, res4] = await userApi.dataCenter(
        {
          time: this.tabCurrent,
          key: res3.data.key,
        },
        4
      );
      if (err4) return;
      this.netProfit = res4.data.netProfit;
      this.totalBetBalance = res4.data.totalBetBalance;
      this.totalBetPlayer = res4.data.totalBetPlayer;
      this.cumulativeWinning = res4.data.cumulativeWinning;
      const [err5, res5] = await userApi.dataCenter(
        {
          time: this.tabCurrent,
          key: res4.data.key,
        },
        5
      );
      if (err5) return;
      this.teamGroupAim = res5.data.groupAim;
    },
  },
  created() {
    this.getStatissticsData();
  },
};
</script>
<style scoped lang="less">
.agency-page {
  ::v-deep {
    .van-grid-item__content {
      background-color: transparent;
      padding: 0;
      text-align: center;
    }
    .van-grid {
      flex-wrap: nowrap;
    }
  }
  .tab-list {
    overflow-x: auto;
    .tab {
      display: flex;
      & > li {
        white-space: nowrap;
      }
    }
  }
  .border-btm {
    border-bottom: solid 1px #484b4c;
  }
  .row-btm-list {
    border: solid 1px #8c8c8c;
    height: 68px;
    border-radius: 10px;
    padding: 10px 0;
    text-align: center;
    margin-bottom: 8px;
    & > li {
      width: 50%;
      & > p:last-child {
        margin-top: 4px;
        font-size: 18px;
        font-weight: 600;
        color: #000;
      }
    }
    & > li:first-child {
      border-right: solid 1px #8c8c8c;
    }
  }
  .head-scroll {
    overflow-x: scroll;
  }
  .head {
    height: 68px;
    padding: 0 8px;
    & > li {
      padding: 0 8px;
    }
    p {
      padding: 0 12px;
      background-color: #e6e6e6;
      white-space: nowrap;
      height: 28px;
      border-radius: 14px;
      color: #707070;
    }
    .active {
      background-color: #02f;
      color: #fff;
    }
  }
  .agency-lst {
    border-radius: 10px;
    background-color: #02f;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    color: #fff;
    & > li {
      width: 50%;
      & > p:nth-child(1) {
        font-size: 12px;
      }
      & > p:nth-child(2) {
        font-weight: bold;
      }
    }
    p {
      padding: 10px 0;
    }
  }
  .agency-lst-white {
    border-radius: 10px;
    background-color: #fff;
    color: #000;
  }
  .row-data {
    border-radius: 10px;
    background-color: #fff;
    height: 49px;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
  }
  .lowerlevel {
    padding: 30px 0;
    color: #02f;
    img {
      height: 16px;
      width: 16px;
      object-fit: cover;
      margin-left: 4px;
    }
  }
}
</style>
