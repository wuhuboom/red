<template>
  <div class="safe-billing font12 color-primary pb-16">
    <AppTopBar
      class="app-top-bar-black"
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('backapi.self.safe.bill.data.text')"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="">
      <ul class="drop-list justify-between align-center m-b-12 m-l-16 m-r-16">
        <li>
          <el-select v-model="tabCurrent" @change="changTab">
            <el-option
              v-for="item in tabsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </li>
      </ul>
      <van-list
        v-model="loading"
        :finished="curItem.data.hasNext === false"
        loading-text="loading"
        @load="onLoad"
      >
        <div class="p-l-16 p-r-16">
          <van-grid class="color-primary m-b-8" :border="false" :column-num="3">
            <van-grid-item v-for="value in head" :key="value">
              {{ value }}
            </van-grid-item>
          </van-grid>
          <van-grid
            class="color-primary m-b-8"
            v-for="(item, idx) in curItem.data.results"
            :key="idx"
            :border="false"
            :column-num="3"
          >
            <van-grid-item class="color-fff">
              {{ item.createdAt | timestampStr }}
            </van-grid-item>
            <van-grid-item class="color-fff">
              {{ dataTxt(item) }}
            </van-grid-item>
            <van-grid-item class="color-fff">
              {{
                numToFixed(item.changeMoney, $globalUnit.val) / $globalNum.val
              }}
            </van-grid-item>
          </van-grid>
        </div>
      </van-list>

      <NoData v-if="nothing" />
    </div>
  </div>
</template>

<script>
const initData = () => {
  return {
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
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "SafeBillingView",
  data() {
    return {
      head: [
        i18n.t("bet.index.date.text"),
        i18n.t("rebate.center.list.nav.type.text"),
        i18n.t("rebate.center.list.nav.smount.text"),
      ],
      loading: false,
      icon1: require("@/assets/img/billing1.webp"),
      icon2: require("@/assets/img/billing2.webp"),
      tabsList: [
        {
          value: 0,
          label: i18n.t("backapi.self.safe.bill.data.choose.type.all.text"),
          ...initData(),
        },
        {
          value: 1,
          label: i18n.t("backapi.self.safe.recharge.text"),
          ...initData(),
        },
        {
          value: 2,
          label: i18n.t("backapi.self.safe.transfer.text"),
          ...initData(),
        },
        {
          value: 3,
          label: i18n.t(
            "backapi.self.safe.account.change.type.recharge.offer.text"
          ),
          ...initData(),
        },
        {
          value: 4,
          label: i18n.t("backapi.self.safe.huaz.transfer.text"),
          ...initData(),
        },
        {
          value: 5,
          label: i18n.t("safe.recharge.compensation"),
          ...initData(),
        },
        {
          value: 6,
          label: i18n.t("safe.billing.manual"),
          ...initData(),
        },
      ],
      tabCurrent: 0,
    };
  },
  computed: {
    curItem() {
      return this.tabsList.find((v) => v.value === this.tabCurrent);
    },
    nothing() {
      return !this.loading && this.curItem.data.totalCount === 0;
    },
  },
  methods: {
    add(item) {
      return !`${item.changeMoney}`.includes("-");
    },
    dataTxt(item) {
      const doc = this.tabsList.find((v) => v.value === item.changeType);
      if (!doc) return "--";
      return doc.label;
    },
    changTab(item) {
      console.log(item);
      // //this.tabCurrent = item.value;
      // if (this.curItem.data.totalPage !== null) return;
      this.onLoad(1);
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
    },
    async onLoad(num) {
      const changeType = this.curItem.value;
      const pageNo = !isNaN(num) ? num : this.curItem.data.pageNo;
      const obj = {
        changeType: changeType,
        pageNo: pageNo,
        pageSize: this.curItem.data.pageSize,
      };
      if (changeType == 0) {
        delete obj.changeType;
      }
      const [err, res] = await userApi.safeChangeLog(obj);
      this.loading = false;
      this.$toast.clear();
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.tabsList.forEach((item) => {
          if (item.value === changeType) {
            item.data.hasNext = false;
          }
        });
        return;
      }
      if (res.data.pageNo == 1) {
        this.tabsList.forEach((item) => {
          if (item.value === changeType) {
            item.data = res.data;
            item.data.pageNo = res.data.pageNo + 1;
          }
        });
        return;
      }
      const list = this.curItem.data.results.concat(res.data.results);
      this.tabsList.forEach((item) => {
        if (item.value === changeType) {
          item.data = {
            ...res.data,
            results: list,
            pageNo: res.data.pageNo + 1,
          };
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.safe-billing {
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

  .drop-list {
    height: 32px;
    border-bottom: 1px solid #484b4c;
    border-top: 1px solid #484b4c;
    .search {
      min-width: 74px;
      height: 18px;
      border-radius: 8px;
      background-color: var(--primary);
      color: #fff;
    }
  }
  .billing-head {
    margin-left: 16px;
    display: flex;
    flex-wrap: wrap;
    color: #707070;
    & > li {
      margin: 0 16px 16px 0;
    }
    .cont {
      height: 28px;
      padding: 0 12px;
      background-color: #e6e6e6;
      border-radius: 14px;
    }
    .active {
      background-color: #0022ff;
      color: #fff;
    }
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
</style>
