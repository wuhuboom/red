<template>
  <div class="list-page">
    <ul class="user-money p-l-24 p-r-24 font12 p-t-32 m-b-24">
      <li class="text-center">{{ curItem.data.totalCount }}</li>
      <li class="center-center m-t-1 m-b-8">
        {{ $t(`Today.s.Orders`) }}
      </li>
      <li></li>
    </ul>
    <van-list
      v-model="loading"
      :finished="curItem.data.hasNext === false"
      :finished-text="nothing ? '' : ''"
      loading-text="loading"
      @load="onLoad"
    >
      <div class="order-list p-l-24 p-r-24">
        <div
          v-for="(item, idx) in curItem.data.results"
          :key="idx"
          class="order-new color-primary font12 m-b-16"
        >
          <ul class="text-center p-l-8 p-r-8 m-b-8">
            <li class="alliance-name font14 m-t-4 p-x-4">
              {{ item.allianceName | removeEsports }}
            </li>
            <li class="m-t-8">
              <p>{{ item.mainName | removeEsports }}</p>
              <p class="pic">
                <img src="@/assets/img/red/vs.webp" alt="" class="d-block" />
              </p>
              <p>{{ item.guestName | removeEsports }}</p>
            </li>
          </ul>
          <ul class="m-b-8 p-l-8 p-r-8 btm-text">
            <li class="justify-between m-b-4">
              <p>{{ $t(`bet.detail.score.text`) }}</p>
              <p>{{ $t("bet.detail.bet.num.text") }}</p>
            </li>
            <li class="justify-between">
              <p class="color-fff">{{ item.betScore }} @ {{ item.betOdds }}%</p>
              <p class="color-fff">
                {{
                  numToFixed(item.betMoney, $globalUnit.val) / $globalNum.val
                }}
              </p>
            </li>
          </ul>
          <ul class="m-b-8 p-l-8 p-r-8 btm-text">
            <li class="justify-between m-b-4">
              <p>{{ $t(`table.head.date.text`) }}</p>
              <p>{{ $t("deal.createOrderMer.354499-3") }}</p>
            </li>
            <li class="justify-between">
              <p class="color-fff">{{ item.createdAt | timestampStr }}</p>
              <p class="color-fff">
                {{ item.orderNo }}
              </p>
            </li>
          </ul>
          <ul class="justify-between p-l-8 p-r-8 align-center btm-text">
            <li class="m-b-4">
              <p>{{ $t(`bet.index.estimated.profit.text`) }}</p>
              <p class="color-fff">
                {{
                  numToFixed(
                    statusToStr(item) / $globalNum.val,
                    $globalUnit.val
                  )
                }}
              </p>
            </li>
            <li class="center-center">
              <p v-if="item.status == 3 && item.statusOpen == 0">
                {{ $t("order.canceled") }}
              </p>
              <p
                v-if="wait(item)"
                class="page-res-btn m-l-4"
                @click="canleFn(item)"
              >
                {{ $t("modal.cancel.text") }}
              </p>
              <p
                class="page-res-btn m-l-4"
                @click="$refs.OrderDetail.open(item)"
              >
                {{ $t("backapi.self.safe.bill.detail.text") }}
              </p>
            </li>
          </ul>
          <p
            class="black-line m-t-8"
            v-if="idx != curItem.data.results.length - 1"
          ></p>
        </div>
      </div>
      <NoData v-if="nothing" />
    </van-list>
    <OrderDetail @onLoad="onLoad(1)" ref="OrderDetail" />
    <ComfireDialog @sure="sure" ref="ComfireDialog" />
    <!-- <van-dialog
      v-model="show"
      :showConfirmButton="false"
      :showCancelButton="false"
      :closeOnClickOverlay="true"
      class="cancel-dialog-parent font12"
    >
      <ul class="flex-column cancle-dialog">
        <li class="sure-game center-center p-l-16 p-r-16">
          {{ $t("You.sure.cancel.game") }}
        </li>
        <li class="cancle-btns center-center p-l-24 p-r-24">
          <p class="page-res-btn" @click="show = false">
            {{ $t("modal.cancel.text") }}
          </p>
          <p class="page-res-btn" @click="sure">
            {{ $t("modal.confirm.text") }}
          </p>
        </li>
      </ul>
    </van-dialog> -->
  </div>
</template>

<script>
import userApi from "@/api/user";
import staticData from "@/data/hot.json";
import i18n from "@/locale";
import OrderDetail from "@/views/components/OrderDetail.vue";
import { Dialog } from "vant";
import userPic from "@/assets/img/user@2x.png";
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
      ...initData(1),
      name: i18n.t("match.records.today.text"),
    },
    {
      ...initData(2),
      name: i18n.t("match.records.yes.text"),
    },
    {
      ...initData(3),
      name: i18n.t("match.records.nearly7.text"),
    },
  ];
};
export default {
  name: "OrderView",
  data() {
    return {
      userPic,
      item: {},
      show: false,
      text: "",
      teamName: "",
      loading: false,
      swiperList: [],
      hotList: [],
      allList: [],
      startTime: 1,
      tabsList: initList(),
    };
  },
  components: {
    OrderDetail,
  },
  computed: {
    nothing() {
      return !this.loading && this.curItem.data.results.length === 0;
    },
    statusToStr() {
      return (value) => {
        if (
          (value.status === 1 && value.statusSettlement === 0) ||
          (value.status === 3 && value.statusSettlement === 0)
        ) {
          //未结算/已撤销
          return this.numToFixed(
            value.betMoney * (value.betOdds / 100),
            this.$globalUnit.val
          );
        } else if (value.status === 1 && value.statusSettlement === 1) {
          //已结算
          if (value.statusOpen === 1) {
            //赢的情况(已中奖)
            return value.winningAmount - value.betMoney;
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
    sleep(time) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    wait(item) {
      return item.status == 1 && item.statusOpen == 0;
    },
    async sure() {
      this.show = false;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err] = await userApi.unbet({ betId: this.item.id });
      if (err) {
        if (Array.isArray(err.data) && err.data.length) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }

      await this.sleep(1000);
      this.$toast(this.$t("wallet.index.cancel.bet.success.desc"));

      this.onLoad(1);
    },
    canleFn(item) {
      //this.show = true;
      this.$refs.ComfireDialog.open();
      this.item = item;
    },
    comfire() {
      Dialog.confirm({
        message: this.$t("order.cancel.game"),
        confirmButtonText: this.$t("index.editor.psd.modal.cancel.btn"),
        cancelButtonText: this.$t("index.editor.psd.modal.confirm.btn"),
        confirmButtonColor: "#ff3141",
        cancelButtonColor: "#1677ff",
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    getDetail(item) {
      this.$refs.OrderDetail.open(item);
    },
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
      //this.onLoad();
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
    },
    async searchLoad() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      await this.onLoad();
    },
    async onLoad(num) {
      const startTime = this.curItem.startTime;
      const pageNo = !isNaN(num) ? num : this.curItem.data.pageNo;
      const currentApi =
        startTime === 1 ? userApi.listBetsToday : userApi.listBets;
      const [err, res] = await currentApi({
        time: startTime,
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
  created() {
    this.$store.commit("setPdTop", false);
  },
};
</script>
<style scoped lang="less">
@navHeight: 74px;
.list-page {
  .user {
    height: 40px;
    width: 40px;
    margin-right: 16px;
  }
  .head-tile {
    display: flex;
    li {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }
    & > li:nth-child(2) {
      //color: var(--primary);
    }
  }
  .user-money {
    & > li:nth-child(1) {
      font-size: 26px;
      font-weight: 900;
      color: var(--active);
    }
    & > li:nth-child(2) {
      color: var(--primary);
    }
    & > li:nth-child(3) {
      height: 3px;
      background-image: linear-gradient(
        to right,
        #8a1c1b,
        #f34139 30%,
        #ff928d 38%,
        #fd7361 53%,
        #f4483f 54%,
        #ef3932 64%,
        #fa574c 91%,
        #f03f38
      );
    }
  }
  .order-new {
    .black-line {
      height: 5px;
      background-image: linear-gradient(
        to right,
        #af1816,
        #af1816 5%,
        #0c0c0c 5%,
        #0c0c0c
      );
    }
    .alliance-name {
      color: #fff;
      border-bottom: 1px solid var(--main);
      border-top: 1px solid var(--main);
    }
    .btm-text {
      & > li:nth-child(2) {
        color: var(--active);
      }
    }
    .pic {
      width: 24px;
      height: 42px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .tab-list-section,
  .tab-list {
    height: 66px;
  }
  .sure-game {
    width: 190px;
    text-align: center;
  }
  .tab-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #707070;
    .list-doc {
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
        flex-shrink: 0;
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
    .blue {
      background-color: #0022ff;
      color: #fff;
      .detal-btm {
        background-color: transparent;
      }
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
      height: 18px;
      border-radius: 8px;
      background-color: #e5142e;
      color: #fff;
    }
    .nothing {
      flex-direction: column;
      font-size: 12px;
      color: #9a9a9a;
      padding-top: 66px;
      span {
        padding-top: 22px;
      }
      img {
        width: 98px;
        height: 70px;
        object-fit: cover;
      }
    }
  }
}
</style>
