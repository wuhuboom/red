u
<template>
  <div class="wallet-page font12 color-primary font12">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.personal.report')"
    >
    </AppTopBar>
    <div class="tab-list m-l-16 m-r-16">
      <ul class="tab p-b-8 p-t-8">
        <li
          class="m-r-16"
          v-for="(item, idx) in tabSimpleList"
          @click="changFilter(item.id)"
          :class="{ 'color-active': filterTab === item.id }"
          :key="idx"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
    <ul class="drop-list justify-between align-center m-b-12 m-l-16 m-r-16">
      <li class="flex-1">
        <van-form ref="form" class="defind-form" @submit="searchLoad">
          <van-field v-model.trim="username" />
        </van-form>
      </li>
      <li class="page-res-btn center-center" @click="searchLoad">
        {{ $t("backapi.self.bank.search.text") }}
      </li>
    </ul>

    <NoData v-if="notthing" />
    <div v-else>
      <van-grid class="color-primary m-b-8" :border="false" :column-num="4">
        <van-grid-item v-for="value in head" :key="value">
          {{ value }}
        </van-grid-item>
      </van-grid>
      <van-grid
        class="color-primary m-b-8"
        v-for="(item, idx) in curItem.results"
        :key="idx"
        :border="false"
        :column-num="4"
      >
        <van-grid-item class="color-fff">
          {{ item.date }}
        </van-grid-item>
        <van-grid-item class="color-fff">
          {{ numToFixed(item.recharge, $globalUnit.val) / $globalNum.val }}
        </van-grid-item>
        <van-grid-item class="color-fff">
          {{ numToFixed(item.withdrawal, $globalUnit.val) / $globalNum.val }}
        </van-grid-item>
        <van-grid-item class="color-active" @click="getDetail(item)">
          <!-- {{ $t("table.head.detail.text") }} -->
          <i class="el-icon-tickets font14"></i>
        </van-grid-item>
      </van-grid>
    </div>
    <OrderDetail ref="OrderDetail" />
  </div>
</template>

<script>
import OrderDetail from "@/views/components/ReportDetail.vue";

import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "PersonalReportView",
  data() {
    return {
      type: 1,
      filterTab: 1,
      username: "",
      head: [
        i18n.t("bet.index.date.text"),
        i18n.t("personal.report.recharge"),
        i18n.t("personal.report.withdraw"),
        i18n.t("table.head.detail.text"),
      ],
      typeOptions: [
        {
          text: i18n.t("order.search.all.text"),
          type: 1,
        },
        {
          text: i18n.t("order.search.fbd.text"),
          type: 2,
        },
      ],
      tabSimpleList: [
        {
          text: i18n.t("match.records.today.text"),
          id: 1,
        },
        {
          text: i18n.t("match.records.yes.text"),
          id: 2,
        },
        {
          text: i18n.t("match.records.nearly7.text"),
          id: 3,
        },
        {
          text: i18n.t("match.records.nearly10.text"),
          id: 4,
        },
        {
          text: i18n.t("match.records.nearly30.text"),
          id: 5,
        },
      ],
      loading: false,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 50,
        results: [],
        totalCount: null,
        totalPage: null,
      },
    };
  },
  components: {
    OrderDetail,
  },
  computed: {
    choseDoc() {
      return this.typeOptions.find((item) => item.type === this.type);
    },
    notthing() {
      return this.curItem.results.length === 0 && !this.loading;
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
  },
  methods: {
    getDetail(item) {
      this.$refs.OrderDetail.open(item);
    },
    chose(v) {
      this.type = v.type;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      this.onLoad(1);
    },
    async changFilter(v) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      this.filterTab = v;
      await this.onLoad(1);
    },
    async searchLoad() {
      if (!this.username) return;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      await this.onLoad(1);
    },
    async onLoad(num) {
      const time = this.filterTab;
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        time: time,
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      if (this.username) {
        obj.username = this.username;
      }
      const [err, res] = await userApi.reportForm(obj);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }

      let list = pageNo == 1 ? res.data : this.curItem.results.concat(res.data);
      Object.assign(this.curItem, {
        results: list,
        pageNo: this.curItem.pageNo + 1,
      });
      this.$toast.clear();
    },
  },
  created() {
    this.onLoad();
  },
};
</script>
<style scoped lang="less">
.wallet-page {
  .money-str {
    font-size: 26px;
    font-weight: 900;
  }
  .bet-score {
    font-size: 20px;
    font-weight: 900;
  }
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
  .menu {
    height: 65px;
    color: #fff;
    & > li:nth-child(2) {
      border-bottom: 1px solid #484b4c;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .icon {
      img {
        width: 45px;
        display: block;
      }
    }
    .dec {
      img {
        width: 10px;
        display: block;
      }
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
  .drop-list {
    border-top: 1px solid #484b4c;
    .search {
      min-width: 74px;
      height: 18px;
      border-radius: 8px;
      background-color: var(--primary);
      color: #fff;
    }
  }
  ::v-deep {
    .appp-top-bar {
      background-color: var(--bg-body) !important;
    }
    .appp-top-bar-title,
    .icon-button {
      color: var(--primary) !important;
    }
    .van-grid-item__content {
      background-color: transparent;
      padding: 0;
      text-align: center;
    }
  }
}
</style>
