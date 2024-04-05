<template>
  <div class="agency-page font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.agency.center')"
    >
    </AppTopBar>

    <div class="center-center py-16" v-if="cumulativeActivity === null">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else>
      <div class="new-head">
        <div class="new-head-up">
          <div class="name-user-list align-center">
            <p class="user-pic"><ImgCom class="pa-0" :src="$userPic" /></p>
            <ul class="user-rit flex-1 justify-between">
              <li>
                <p>Hi～</p>
                <p class="font16">{{ user.username }}</p>
              </li>
              <li
                class="align-center user-link"
                @click="$router.push({ name: 'UserList' })"
              >
                <img src="@/assets/img/userlist.webp" alt="" />
                {{ $t("agency.center.user.center.text") }}
              </li>
            </ul>
          </div>
          <ul class="netprofit">
            <li>{{ $t(`team.report.netprofit.text`) }}</li>
            <li>
              {{ numToFixed(netProfit, $globalUnit.val) / $globalNum.val }}
            </li>
          </ul>
          <ul class="amounto-win">
            <li class="justify-between">
              <p><i></i> {{ $t("agency.center.amountofwin.text") }}</p>
              <p>
                {{
                  numToFixed(cumulativeWinning, $globalUnit.val) /
                  $globalNum.val
                }}
              </p>
            </li>
            <li class="justify-between">
              <p><i></i> {{ $t("agency.center.team.motivation.text") }}</p>
              <p>
                {{ teamGroupAim }}
              </p>
            </li>
            <li class="justify-between">
              <p><i></i> {{ $t("agency.center.team.motivation.not.text") }}</p>
              <p>
                {{ teamGroupUnAim }}
              </p>
            </li>
          </ul>
        </div>
        <ul class="new-head-tabs align-center justify-around font12">
          <li
            :class="{ active: item.value === tabCurrent }"
            @click="chang(item)"
            v-for="(item, idx) in tabsList"
            :key="idx"
            class="center-center"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="px-16 pt-16">
        <ul class="row-btm-list align-center">
          <li>
            <p>{{ $t("agency.center.teambalance.text") }}</p>
            <p>
              {{ numToFixed(totalBalance, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
          <li>
            <p>{{ $t("team.report.teamrecharge.text") }}</p>
            <p>
              {{ numToFixed(totalRecharge, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
        </ul>
        <ul class="row-btm-list align-center">
          <li>
            <p>{{ $t("team.report.teamwithdraw.text") }}</p>
            <p>
              {{
                numToFixed(totalWithdrawal, $globalUnit.val) / $globalNum.val
              }}
            </p>
          </li>
          <li>
            <p>{{ $t("agency.center.amountofwin.text") }}</p>
            <p>
              {{
                numToFixed(cumulativeWinning, $globalUnit.val) / $globalNum.val
              }}
            </p>
          </li>
        </ul>
        <ul class="row-btm-list align-center">
          <li>
            <p>{{ $t("agency.center.teamSize.text") }}</p>
            <p>
              {{ playerCount }}
            </p>
          </li>
          <li>
            <p>{{ $t("agency.center.newreg.text") }}</p>
            <p>
              {{ newPlayer }}
            </p>
          </li>
        </ul>
        <ul class="row-btm-list align-center">
          <li>
            <p>{{ $t("bet.index.stake.text") }}</p>
            <p>
              {{
                numToFixed(totalBetBalance, $globalUnit.val) / $globalNum.val
              }}
            </p>
          </li>
          <li>
            <p>{{ $t("agency.center.numofbets.text") }}</p>
            <p>
              {{ totalBetPlayer }}
            </p>
          </li>
        </ul>
        <ul class="row-btm-list align-center">
          <li>
            <p>{{ $t("agency.center.team.motivation.not.text") }}</p>
            <p>
              {{ teamGroupUnAim }}
            </p>
          </li>
          <li>
            <p>{{ $t("agency.center.team.motivation.text") }}</p>
            <p>
              {{ teamGroupAim }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "AgencyView",
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
        // {
        //   name: i18n.t("match.records.nearly10.text"),
        //   value: 4,
        // },
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
  min-height: 100vh;
  background-color: #f8f8f8;
  color: var(--color-text);
  .new-head {
    background-color: var(--primary);
    overflow: hidden;
    color: #fff;
    .new-head-up {
      margin: 16px 16px 0;
      background: url("@/assets/img/monti.webp") center top no-repeat;
      background-size: cover;
      padding: 12px 12px 0;
    }
    .name-user-list {
      .user-pic {
        height: 65px;
        width: 65px;
      }
    }
    .user-rit {
      padding-left: 8px;
    }
    .user-link {
      img {
        height: 21px;
        width: 21px;
        margin-right: 4px;
        object-fit: cover;
      }
    }
    .netprofit {
      padding: 10px 0 22px;
      & > li:last-child {
        font-size: 22px;
        font-weight: bold;
      }
    }
    .amounto-win {
      & > li {
        padding-bottom: 14px;
        & > p:last-child {
          font-weight: 600;
        }
      }
      p {
        display: flex;
        align-items: center;
        i {
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: rgba(255, 255, 255, 0.5);
          margin: 0 10px 0 0;
        }
      }
    }
    .new-head-tabs {
      font-weight: bold;
      height: 53px;
      border-radius: 20px 20px 0 0;
      border: solid 1px rgba(255, 255, 255, 0.11);
      background-image: linear-gradient(to bottom, #0f3aff, #5374f6);
      & > li {
        height: 25px;
        padding: 0 8px;
      }
      .active {
        color: #02f;
        border-radius: 6px;
        background-color: #fff;
      }
    }
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
