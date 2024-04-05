<template>
  <div class="list-page">
    <AppTopBar>
      <template #title>
        <div class="search align-center" @click.stop.prevent>
          <!-- @submit="handleEnterKey" -->
          <van-form @submit.prevent>
            <van-field
              @click.stop.prevent
              v-model.trim="teamName"
              @input="handleEnterKey"
              @paste="handleEnterKey"
              left-icon="search"
              class="field-input"
              :placeholder="$t('backapi.self.bank.search.text')"
            />
          </van-form>
        </div>
      </template>
    </AppTopBar>
    <AppBackTop />
    <OrderNav :type="1" />
    <div class="tab-list-section mb-16">
      <div class="px-16 tab-list max-width750">
        <div
          class="center-center list-doc"
          v-for="(item, idx) in tabsList"
          @click.stop.prevent="changTab(item)"
          :class="{ active: startTime === item.startTime }"
          :key="idx"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="curItem.data.hasNext === false"
      finished-text="No More"
      loading-text="loading"
      @load="onLoad"
    >
      <div class="order-list px-16">
        <div
          v-for="(item, idx) in curItem.data.results"
          :key="idx"
          class="order-doc mb-16 font14"
        >
          <ul class="justify-around order-head align-center">
            <li class="flex-column cont-slide">
              <p class="pic center-center">
                <img class="d-block" :src="item.mainLogo" />
              </p>
              <p class="app-ellipsis main-name">
                {{ item.mainName | removeEsports }}
              </p>
            </li>
            <!-- homeFull guestFull homeHalf  homeHalf -->
            <li class="flex-column desc flex-1">
              <P class="center-center"
                >{{ item.homeFull }}-{{ item.guestFull }}</P
              >
              <P class="pd-8 app-ellipsis">
                {{ item.homeHalf }}:{{ item.guestHalf }}
                <span class="px-4">-</span>
                {{ $t("order.half") }}
              </P>
            </li>
            <li class="flex-column cont-slide">
              <p class="pic center-center">
                <img class="d-block" :src="item.guestLogo" />
              </p>
              <p class="app-ellipsis main-name">
                {{ item.guestName | removeEsports }}
              </p>
            </li>
          </ul>
          <ul class="trade-btm center-center font12">
            <li class="trade-btm-img trade-btm-left center-center">
              <img src="@/assets/img/result1.webp" alt="" />
            </li>
            <li class="alle-name flex-1 app-ellipsis">
              <p class="app-ellipsis">
                {{ item.allianceName | removeEsports }}
              </p>
              <p class="app-ellipsis">{{ item.startTimeStr }}</p>
            </li>
            <li class="trade-btm-rit center-center">
              <img src="@/assets/img/result2.webp" alt="" />
            </li>
          </ul>
        </div>
      </div>
      <p
        class="center-center py-16"
        v-if="!loading && curItem.data.totalCount === 0"
      >
        No More
      </p>
    </van-list>
  </div>
</template>

<script>
import userApi from "@/api/user";
import staticData from "@/data/hot.json";
import i18n from "@/locale";
import OrderNav from "@/views/components/OrderNav.vue";
const initData = (startTime = "") => {
  return {
    startTime: startTime,
    type: 1,
    data: {
      hasNext: true,
      pageNo: 1,
      pageSize: 10,
      results: [],
      totalCount: null,
      totalPage: null,
    },
  };
};
const initList = () => {
  return [
    {
      name: i18n.t("match.records.today.text"),
      ...initData(0),
    },
    {
      ...initData(1),
      name: i18n.t("match.records.yes.text"),
    },
    {
      ...initData(2),
      name: i18n.t("match.records.nearly7.text"),
    },
  ];
};
export default {
  name: "TradeView",
  data() {
    return {
      text: "",
      teamName: "",
      loading: false,
      swiperList: [],
      hotList: [],
      allList: [],
      startTime: 0,
      tabsList: initList(),
    };
  },
  components: {
    OrderNav,
  },
  computed: {
    statusToStr() {
      return (value) => {
        if (
          (value.status === 1 && value.statusSettlement === 0) ||
          (value.status === 3 && value.statusSettlement === 0)
        ) {
          //未结算/已撤销
          return 0;
        } else if (value.status === 1 && value.statusSettlement === 1) {
          //已结算
          if (value.statusOpen === 1) {
            //赢的情况(已中奖)
            return value.winningAmount;
          } else if (value.statusOpen === 2) {
            //输的情况
            return value.winningAmount * 1 - value.betMoney;
          }
        }
      };
    },
    curItem() {
      return this.tabsList.find((item) => item.startTime === this.startTime);
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    handleEnterKey() {
      // this.$toast.loading({
      //   forbidClick: true,
      //   duration: 0,
      //   message: "search...",
      // });
      this.tabsList = initList();
      this.onLoad(1);
    },
    changTab(item) {
      this.startTime = item.startTime;
      if (this.curItem.data.totalPage !== null) return;
      this.onLoad();
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
    },
    async onLoad(num) {
      const startTime = this.curItem.startTime;
      const pageNo = !isNaN(num) ? num : this.curItem.data.pageNo;
      const [err, res] = await userApi.gameFinished({
        startTime: startTime,
        type: this.curItem.type,
        pageNo: pageNo,
        pageSize: this.curItem.data.pageSize,
        teamName: this.teamName,
      });
      this.loading = false;
      this.$toast.clear();
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.tabsList.forEach((item) => {
          if (item.startTime === startTime) {
            item.data.hasNext = false;
          }
        });
        return;
      }
      if (res.data.pageNo == 1) {
        this.tabsList.forEach((item) => {
          if (item.startTime === startTime) {
            item.data = res.data;
            item.data.pageNo = res.data.pageNo + 1;
          }
        });
        return;
      }
      const list = this.curItem.data.results.concat(res.data.results);
      this.tabsList.forEach((item) => {
        if (item.startTime === startTime) {
          item.data = {
            ...res.data,
            results: list,
            pageNo: res.data.pageNo + 1,
          };
        }
      });
    },
    back() {},
    loginOut() {
      this.$store.commit("loginOut");
      this.$router.push({ name: "Login" });
    },
    async getslider() {
      const [err, res] = await userApi.homeswiper({
        lang: this.$store.state.lang,
      });
      if (err) return;
      this.swiperList = res.data;
    },
    async gethot() {
      const [err, res] = await userApi.homehot({
        lang: this.$store.state.lang,
      });
      if (err) return;
      this.hotList = res.data;
    },
    noUseR() {
      this.hotList = staticData.filter((item, idx) => idx < 4);
      this.allList = staticData.filter((item, idx) => idx >= 4);
    },
    haveUser() {
      this.gethot();
      this.getslider();
    },
  },
};
</script>
<style scoped lang="less">
@navHeight: 74px;
.list-page {
  .head-tile {
    display: flex;
    li {
      font-size: 20px;
      font-weight: bold;
      color: #191919;
    }
    & > li:nth-child(2) {
      color: var(--primary);
    }
  }
  .tab-list-section,
  .tab-list {
    height: 66px;
  }
  .tab-list {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #707070;
    .list-doc {
      margin-right: 12px;
      font-size: 14px;
      height: 32px;
      padding: 0 14px;
      color: #707070;
      border-radius: 16px;
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.09);
      border: solid 1px rgba(0, 0, 0, 0.02);
      background-color: #fff;
    }
    .active {
      color: #fff;
      background-color: var(--primary);
    }
  }
  ::v-deep {
    .van-button__icon {
      color: #fff;
    }
    .appp-top-bar {
      background-color: var(--primary) !important;
    }
    .appp-top-bar-title {
      flex: 1;
      margin-right: 16px;
    }
    .search {
      &,
      .van-icon-search {
        color: #fff;
      }
      .van-form {
        width: 100%;
      }
      .field-input {
        height: 46px;
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 23px;
      }
      .van-field__control {
        color: #fff;
      }
      .van-icon-search {
        font-size: 24px;
      }
    }
    .order-doc {
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.09);
      padding: 0 12px 0;
      border-radius: 15px;
      overflow: hidden;
    }
    .order-head {
      padding: 12px 0 16px;
      & > li:nth-child(1) {
        color: #707070;
      }
      & > li:nth-child(2) {
        color: #8d8d8d;
      }
    }
    .trade-num {
      color: #222;
      & > li:last-child {
        padding: 8px 0;
      }
    }
    .green {
      color: #10ab61;
    }
    .red {
      color: #e5142e;
    }
    .trade-bottom {
      height: 48px;
      padding: 0 12px;

      margin: 0 -12px;
    }
    .bule {
      background-color: #0022ff;
      color: #fff;
    }
    .gray {
      background-color: #f5f6f7;
      color: #707070;
    }
    .detal-btm {
      min-width: 73px;
      height: 24px;
      border-radius: 8px;
      background-color: rgba(93, 86, 105, 0.48);
      padding: 0 4px;
      color: #fff;
      .van-icon {
        margin-top: 2px;
        margin-left: 2px;
      }
    }
    .min-doc {
      width: 9px;
      height: 9px;
      border-radius: 9px;
      background-color: #fff;
      margin-right: 4px;
    }
    .canle {
      min-width: 74px;
      padding: 0 4px;
      height: 30px;
      border-radius: 8px;
      background-color: #e5142e;
      color: #fff;
    }
    .pic {
      height: 28px;
      width: 28px;
      margin: 0 auto;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    .desc {
      text-align: center;
      overflow: hidden;
      & > p:nth-child(1) {
        font-size: 30px;
        color: #00197d;
        margin-bottom: 2px;
      }
    }
    .main-name {
      text-align: center;
      margin-top: 6px;
    }
    .cont-slide,
    .trade-btm-left,
    .trade-btm-rit {
      width: 80px;
    }
    .trade-btm-rit {
      // padding-right: 12px;
      img {
        width: 23px;
        object-fit: cover;
      }
    }
    .trade-btm-left {
      //  padding-left: 12px;
      img {
        width: 23px;
        object-fit: cover;
      }
    }

    .main-name {
      color: #050505;
    }
    .trade-btm {
      margin: 0 -12px;
      height: 50px;
      text-align: center;
      background-color: #02f;
    }
    .alle-name {
      color: #fff;
      & > p:nth-child(2) {
        color: rgba(255, 255, 255, 0.7);
        margin-top: 4px;
      }
    }
  }
}
</style>
