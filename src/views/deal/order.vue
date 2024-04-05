<template>
  <div class="deal-order-view font14">
    <AppTopBar
      :styleObj="{
        backgroundColor: '',
      }"
      :titleClass="['app-top-black-title']"
      topBarTitle="Trading Records"
    />
    <div class="order-up">
      <div class="tab-list-section">
        <div class="tab-list">
          <div
            class="center-center list-doc"
            v-for="(item, idx) in nav"
            :key="`nav-${idx}`"
            @click="chose(item)"
          >
            <span
              class="status-icon"
              :class="{ active: status === item.status }"
              @click="curTab = item.status"
            ></span
            >{{ item.lable }}
          </div>
        </div>
      </div>
    </div>
    <div class="order-content">
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
        <ul v-else class="order-list px-16">
          <!-- <li class="space-between completed">
            <div class="flex-column left-side">
              <div class="align-center">
                <img src="@/assets/img/sell.webp" alt="" />
                <span>Sell</span>
              </div>
              <p>07/16 2023 16:46:36</p>
            </div>
            <div class="flex-column right-side">
              <b>100</b>
              <p>commission+5.0</p>
            </div>
          </li> -->
          <li
            class="space-between"
            :class="{ completed: item.status === 3 }"
            v-for="(item, idx) in curItem.results"
            :key="idx"
            @click="
              $router.push({ name: 'createOrder', query: { id: item.id } })
            "
          >
            <div class="flex-column left-side">
              <div class="align-center">
                <img src="@/assets/img/sell.webp" alt="" />
                <span>{{ $t("deal.order.535219-1") }}</span>
              </div>
              <p>{{ formatDate(item.createdAt, "MM/dd/yyyy hh:mm") }}</p>
            </div>
            <div class="flex-column right-side">
              <b
                >{{ item.money / $globalNum.val }}
                {{ confOpt.currencySymbol || "" }}</b
              >
              <p>{{ statusObj[item.status] }}</p>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "DealOrder",
  data() {
    return {
      nav: [
        {
          time: 5,
          lable: i18n.t(`match.all.text`),
          status: 0,
        },
        {
          time: 5,
          lable: i18n.t(`recharge.record.status.scored.text`),
          status: 1,
        },
        {
          time: 5,
          lable: i18n.t(`order.canceled`),
          status: 4,
        },
      ],
      status: 0,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
      loading: false,
      confOpt: {},
    };
  },
  computed: {
    curTabDoc() {
      return this.nav.find((item) => item.status === this.status) || {};
    },
    // 1.已下单 2.已付款 3.已出款 4. 交易取消
    statusObj() {
      return {
        1: this.$t("deal.order.535219-5"),
        2: this.$t("deal.order.535219-6"),
        3: this.$t("deal.order.535219-7"),
        4: this.$t("deal.order.535219-8"),
        5: this.$t("deal.buy.957990-6"),
      };
    },
    nothing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
  },
  methods: {
    async chose(item) {
      this.status = item.status;
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.onLoad(1);
    },
    async fbConfReqApi() {
      const [err, res] = await userApi.palyerConfig();
      if (err) return;
      this.orderTimeout = res.data.orderTimeout;
      this.confOpt = res.data;
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
        status: this.curTabDoc.status,
        time: this.curTabDoc.time,
      };
      if (obj.status === 0) {
        delete obj.status;
      }
      const [err, res] = await userApi.fbSalePlayerOrderReq(obj);
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
  },
  async created() {
    this.$store.commit("setPdTop", false);
    this.fbConfReqApi();
  },
};
</script>
<style scoped lang="less">
.deal-order-view {
  min-height: 100vh;
  .order-up {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 197px;
    background: url("@/assets/img/orderup.png") no-repeat;
    background-size: cover;
  }
  ::v-deep {
    .appp-top-bar {
      background-color: transparent !important;
      color: #fff !important;
      .icon-button,
      .appp-top-bar-title {
        color: #fff !important;
      }
    }
  }
  .tab-list-section {
    height: 64px;
    margin-bottom: 52px;
  }
  .tab-list {
    display: flex;
    align-items: center;
    height: 64px;
    .list-doc {
      height: 64px;
      font-size: 14px;
      padding: 0 14px;
      color: #fff;
    }
    .status-icon {
      display: block;
      width: 19px;
      height: 19px;
      margin-right: 2px;
      background: url("@/assets/img/canceled.webp") center top no-repeat;
      background-size: cover;
      &.active {
        background: url("@/assets/img/completed.webp") center top no-repeat;
        background-size: cover;
      }
    }
  }
  .order-content {
    margin-top: -56px;
    padding: 20px 0;
    background: #fff;
    border-radius: 20px 20px 0 0;
    .nothing {
      flex-direction: column;
      font-size: 12px;
      color: #9a9a9a;
      padding-top: 96px;
      span {
        padding-top: 22px;
      }
      img {
        width: 160px;
        height: 126px;
        object-fit: cover;
      }
    }
    .order-list {
      li {
        height: 75px;
        margin-bottom: 8px;
        padding: 0 13px;
        color: #222;
        border-radius: 10px;
        background-color: #ededed;
        &.completed {
          background-color: #e7f7ef;
        }
        p {
          margin-top: 4px;
        }
        img {
          width: 21px;
          height: 21px;
          margin-right: 4px;
        }
        span {
          color: #10ab61;
        }
      }
      .left-side {
        justify-content: center;
      }
      .right-side {
        justify-content: center;
        align-items: flex-end;
      }
    }
  }
}
</style>
