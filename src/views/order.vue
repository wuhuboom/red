<template>
  <div class="list-page">
    <AppTopBar>
      <template #title>
        <ul class="head-tile align-center">
          <li>ABC</li>
          <li>.HN</li>
        </ul>
      </template>
      <template #right>
        <div class="user" v-if="user.id">
          <ImgCom class="pa-0" :src="$userPic" />
        </div>
      </template>
    </AppTopBar>
    <AppBackTop />
    <OrderNav />
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
      :finished-text="nothing ? '' : ''"
      loading-text="loading"
      @load="onLoad"
    >
      <div class="order-list px-16">
        <div
          v-for="(item, idx) in curItem.data.results"
          :key="idx"
          class="order-doc mb-16 font14"
        >
          <ul class="justify-between order-head">
            <li>{{ item.gameInfo | removeEsports }}</li>
            <li class="font12 align-center">
              {{ formatDate(item.createdAt, "yyyy-MM-dd") }}
            </li>
          </ul>
          <div class="trade-rit justify-between align-center">
            <ul class="trade-num">
              <li>
                {{ $t("table.head.bet.text") }}：{{
                  numToFixed(item.betMoney, $globalUnit.val) / $globalNum.val
                }}
              </li>
              <li>
                {{ $t("table.head.loss.text") }}：<span class="">{{
                  numToFixed(statusToStr(item), $globalUnit.val) /
                  $globalNum.val
                }}</span>
              </li>
            </ul>
            <ul class="trade-left">
              <li>
                <p v-if="item.status == 1 && item.statusOpen == 1" class="red">
                  {{ $t("order.win") }}
                </p>
                <p
                  v-if="item.status == 1 && item.statusOpen == 2"
                  class="green"
                >
                  {{ $t("order.lose") }}
                </p>
                <p v-if="item.status == 3 && item.statusOpen == 0">
                  {{ $t("order.canceled") }}
                </p>
                <p
                  v-if="wait(item)"
                  class="canle center-center"
                  @click="canleFn(item)"
                >
                  {{ $t("modal.cancel.text") }}
                </p>
              </li>
            </ul>
          </div>
          <ul
            class="trade-bottom align-center justify-between"
            :class="[wait(item) ? 'blue' : 'gray']"
          >
            <li>NO.{{ item.orderNo }}</li>
            <li>
              <!-- <p v-if="wait(item)" class="align-center">
                <span class="min-doc"></span><span>{{ $t("order.wait") }}</span>
              </p> -->
              <p class="detal-btm center-center" @click="getDetail(item)">
                {{ $t("table.head.detail.text") }}
                <van-icon name="arrow" />
              </p>
            </li>
          </ul>
        </div>
      </div>
      <p class="center-center nothing" v-if="nothing">
        <img src="@/assets/img/noting.webp" alt="" />
        <span class="center-center">{{ $t("order.nothing") }}</span>
      </p>
    </van-list>
    <OrderDetail ref="OrderDetail" />
    <van-dialog
      v-model="show"
      :showConfirmButton="false"
      :showCancelButton="false"
      :closeOnClickOverlay="true"
    >
      <ul class="center-center flex-column cancle-dialog">
        <li class="cancel-img">
          <img src="@/assets/img/canclered.webp" alt="" />
        </li>
        <li class="sure-game">{{ $t("You.sure.cancel.game") }}</li>
        <li class="cancle-btns center-center">
          <p class="center-center" @click="show = false">
            {{ $t("modal.cancel.text") }}
          </p>
          <p class="center-center" @click="sure">
            {{ $t("modal.confirm.text") }}
          </p>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import userApi from "@/api/user";
import staticData from "@/data/hot.json";
import i18n from "@/locale";
import OrderNav from "@/views/components/OrderNav.vue";
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
    OrderNav,
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
      this.show = true;
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
      height: 30px;
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
    .cancle-dialog {
      padding-top: 22px;
      font-size: 15px;
    }
    .cancel-img {
      width: 59px;
      height: 59px;
      margin-bottom: 12px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .cancle-btns {
      width: 100%;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
      margin: 10px 0;
      p:nth-child(1) {
        border-right: 1px solid #eee;
        color: #1677ff;
      }
      p:nth-child(2) {
        color: #ff3141;
      }
      P {
        flex: 1;
        height: 45px;
        font-size: 18px;
      }
    }
  }
}
</style>
