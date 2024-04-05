<template>
  <div class="safe-billing font14 pb-16">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('backapi.self.safe.bill.data.text')"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="">
      <ul class="billing-head pt-16">
        <li class="capitalize" v-for="(item, idx) in tabsList" :key="idx">
          <div
            @click="changTab(item)"
            :class="{ active: item.value == tabCurrent }"
            class="cont center-center"
          >
            {{ item.label }}
          </div>
        </li>
      </ul>
      <van-list
        v-model="loading"
        :finished="curItem.data.hasNext === false"
        :finished-text="nothing ? '' : 'No More'"
        loading-text="loading"
        @load="onLoad"
      >
        <div class="px-16 p-16">
          <ul
            class="d-flex list"
            :class="{ 'list-add': add(item) }"
            v-for="(item, idx) in curItem.data.results"
            :key="idx"
          >
            <li class="pic center-center">
              <img :src="add(item) ? icon2 : icon1" alt="" />
            </li>
            <li class="txt flex-1">
              <p class="capitalize">{{ dataTxt(item) }}</p>
              <p class="font12">
                {{ formatDate(item.createdAt, "yyyy-MM-dd hh:mm:ss") }}
              </p>
            </li>
            <li class="center-center num">
              {{
                numToFixed(item.changeMoney, $globalUnit.val) / $globalNum.val
              }}
            </li>
          </ul>
        </div>
      </van-list>
      <p class="center-center nothing" v-if="nothing">
        <img src="@/assets/img/noting.webp" alt="" />
        <span class="center-center">No Data</span>
      </p>
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
      this.tabCurrent = item.value;
      if (this.curItem.data.totalPage !== null) return;
      this.onLoad();
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
  background-color: #f8f8f8;
  min-height: 100vh;
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
