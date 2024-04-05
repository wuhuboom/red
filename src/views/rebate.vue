<!-- eslint-disable no-unused-vars -->
<template>
  <div class="agency-page font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.rebate.center')"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="totalNum === null">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else>
      <div class="agency px-16">
        <ul class="agency-lst mb-16">
          <li class="flex-column num-up px-16 py-16">
            <div>
              <p>{{ $t("backapi.self.rebate.top.content.total.text") }}</p>
              <p class="big-num">
                {{ numToFixed(totalNum, $globalUnit.val) / $globalNum.val }}
              </p>
            </div>
            <div class="align-center">
              <p>{{ $t("backapi.self.rebate.top.content.lastweek.text") }}</p>
              <p class="week-num">
                {{ numToFixed(lastWeekNum, $globalUnit.val) / $globalNum.val }}
              </p>
            </div>
          </li>
          <li class="num-btm justify-around align-center">
            <div>
              <p>{{ $t("backapi.self.rebate.top.content.today.text") }}</p>
              <p class="mid-num">
                {{ numToFixed(todayNum, $globalUnit.val) / $globalNum.val }}
              </p>
            </div>
            <div>
              <p>{{ $t("backapi.self.rebate.top.content.week.text") }}</p>
              <p class="mid-num">
                {{ numToFixed(weekNum, $globalUnit.val) / $globalNum.val }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="px-16 mb-16">
        <ul class="type-head justify-between">
          <li>{{ $t("rebate.center.list.nav.type.text") }}</li>
          <li>{{ $t("rebate.center.list.nav.smount.text") }}</li>
        </ul>
      </div>
      <van-list
        v-model="loading"
        :finished="curItem.hasNext === false"
        finished-text=""
        loading-text="loading"
        @load="onLoad"
      >
        <div v-if="nothing">
          <NoData />
        </div>
        <div v-else class="px-16 p-16">
          <ul
            class="d-flex list"
            :class="{ 'list-add': add(item) }"
            v-for="(item, idx) in curItem.results"
            :key="idx"
          >
            <li class="pic center-center">
              <img :src="add(item) ? icon2 : icon1" alt="" />
            </li>
            <li class="txt flex-1">
              <p>{{ getType(item.type) }}</p>
              <p class="font12">
                {{ formatDate(item.ymd, "yyyy-MM-dd") }}
              </p>
            </li>
            <li class="center-center num">
              {{ numToFixed(item.money, $globalUnit.val) / $globalNum.val }}
            </li>
          </ul>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import NoData from "@/components/global/NoData.vue";
export default {
  name: "AebateView",
  data() {
    return {
      icon1: require("@/assets/img/billing1.webp"),
      icon2: require("@/assets/img/billing2.webp"),
      detail: {},
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
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
      // if (list.length === 0) {
      //   list = [
      //     {
      //       money: 0,
      //       type: 1,
      //       ymd: new Date().getTime(),
      //     },
      //   ];
      // }
      this.curItem = {
        ...res.data,
        results: list,
        pageNo: res.data.pageNo + 1,
      };
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
  min-height: 100vh;
  background-color: #f8f8f8;
  color: var(--color-text);

  .agency-lst {
    border-radius: 10px;
    background-image: linear-gradient(to bottom, #0f3aff, #5374f6);
    color: #fff;
    overflow: hidden;
    .num-up {
      padding-bottom: 20px;
    }
    .big-num {
      font-size: 22px;
      font-weight: bold;
      padding: 4px 0 10px;
    }
    .week-num {
      margin-left: 4px;
      color: #adf68d;
    }
    .num-btm {
      height: 68px;
      background-color: #60b33f;
      text-align: center;
      .mid-num {
        font-weight: bold;
        margin-top: 10px;
      }
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
