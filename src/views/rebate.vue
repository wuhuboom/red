<!-- eslint-disable no-unused-vars -->
<template>
  <div class="agency-page font14 color-primary p-t-24">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('fuc.rebate.center')"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="totalNum === null">
      <van-Loading class="color-primary" />
    </div>
    <div v-else>
      <div class="agency px-16 m-b-24">
        <ul class="agency-lst d-flex flex-wrap p-x-16">
          <li class="m-b-16 p-b-8 border-active">
            <p>{{ $t("backapi.self.rebate.top.content.total.text") }}</p>
            <p class="">
              {{ numToFixed(totalNum, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
          <li class="m-b-16 p-b-8 border-active">
            <p>{{ $t("backapi.self.rebate.top.content.lastweek.text") }}</p>
            <p class="">
              {{ numToFixed(lastWeekNum, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
          <li>
            <p>{{ $t("backapi.self.rebate.top.content.today.text") }}</p>
            <p class="">
              {{ numToFixed(todayNum, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
          <li>
            <p>{{ $t("backapi.self.rebate.top.content.week.text") }}</p>
            <p class="">
              {{ numToFixed(weekNum, $globalUnit.val) / $globalNum.val }}
            </p>
          </li>
        </ul>
      </div>
      <van-list
        class="p-t-8"
        v-model="loading"
        :finished="curItem.hasNext === false"
        finished-text=""
        loading-text="loading"
        @load="onLoad"
      >
        <div class="px-16 p-16 font16">
          <van-grid
            class="color-primary m-b-32"
            :border="false"
            :column-num="3"
          >
            <van-grid-item v-for="value in head" :key="value">
              {{ value }}
            </van-grid-item>
          </van-grid>
          <div v-if="nothing">
            <NoData />
          </div>
          <van-grid
            v-show="!nothing"
            class="color-primary m-b-32 font16"
            v-for="(item, idx) in curItem.results"
            :key="idx"
            :border="false"
            :column-num="3"
          >
            <van-grid-item class="color-fff">
              {{ item.ymd }}
            </van-grid-item>
            <van-grid-item class="color-fff">
              {{ getType(item.type) }}
            </van-grid-item>
            <van-grid-item class="color-fff">
              {{ numToFixed(item.money, $globalUnit.val) / $globalNum.val }}
            </van-grid-item>
          </van-grid>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import i18n from "@/locale";
import userApi from "@/api/user";
import NoData from "@/components/global/NoData.vue";
export default {
  name: "AebateView",
  data() {
    return {
      head: [
        i18n.t("bet.index.date.text"),
        i18n.t("rebate.center.list.nav.type.text"),
        i18n.t("rebate.center.list.nav.smount.text"),
      ],
      icon1: require("@/assets/img/billing1.webp"),
      icon2: require("@/assets/img/billing2.webp"),
      detail: {},
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 5,
        results: [],
        totalCount: null,
        totalPage: null,
      },
      loading: false,
      totalNum: null,
      weekNum: null,
      todayNum: null,
      lastWeekNum: null,
    };
  },
  computed: {
    nothing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
  },
  methods: {
    getType(type) {
      if (type === 1) {
        return this.$t("rebate.center.list.cell.bet.text");
      } else if (type === 2) {
        return this.$t("rebate.center.list.cell.profit.text");
      } else if (type === 3) {
        return this.$t("rebate.center.list.cell.recharge.text");
      }
      return "";
    },
    add() {
      return true;
    },
    async getStatissticsData() {
      const [err, resR] = await userApi.rebateStatisReq();
      if (err) return;
      this.totalNum = resR.data.total;
      this.weekNum = resR.data.week;
      this.todayNum = resR.data.today;
      this.lastWeekNum = resR.data.lastWeek;
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      const [err, res] = await userApi.rebateListReq(obj);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }
      let list = this.curItem.results.concat(res.data.results);
      // for (let i = 0; i < 7; i++) {
      //   list.push(list[0]);
      // }
      this.curItem = {
        ...res.data,
        results: list,
        pageNo: res.data.pageNo + 1,
      };
      this.curItem.hasNext = false;
    },
  },
  created() {
    this.getStatissticsData();
  },
  components: { NoData },
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
  .agency-lst {
    border-radius: 10px;
    border: 1px solid var(--main);
    text-align: center;
    & > li {
      width: 50%;
    }
    .border-active {
      border-bottom: 1px solid var(--main);
    }
  }
  .type-head {
    padding: 24px 20px 4px;
    border-bottom: 1px solid #dadada;
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
      font-size: 16px;
    }
  }
  .list-add {
    .num {
      color: #73c74e;
    }
  }
}
</style>
