<template>
  <RecordsLayout
    :title="$t('me.recharge.text')"
    @changFilter="changFilter"
    :filterTab="filterTab"
  >
    <van-list
      v-model="loading"
      :finished="curItem.hasNext === false"
      finished-text=""
      loading-text="loading"
      @load="onLoad"
    >
      <NoData v-if="notthing" />
      <div v-else class="px-16 p-16">
        <ul
          class="d-flex list"
          :class="{ 'list-add': add(item) }"
          v-for="(item, idx) in curItem.results"
          :key="idx"
        >
          <li class="pic center-center">
            <img src="@/assets/img/record.webp" alt="" />
          </li>
          <li class="txt flex-1">
            <p>{{ getType(item.type) }}</p>
            <p class="font12">
              {{ formatDate(item.createdAt, "yyyy-MM-dd hh:mm:ss") }}
            </p>
          </li>
          <li class="txt text-right">
            <p class="num">
              {{ numToFixed(item.money, $globalUnit.val) / $globalNum.val }}
            </p>
            <p class="font12">
              {{ getState(item.status) }}
            </p>
          </li>
        </ul>
      </div>
    </van-list>
  </RecordsLayout>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import RecordsLayout from "@/views/components/RecordsLayout.vue";
export default {
  name: "FinancialPecordsView",
  components: {
    RecordsLayout,
  },
  data() {
    return {
      filterTab: 1,
      loading: false,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
      typeList: [
        {
          label: this.$t("order.search.all.text"),
          active: true,
        },
        {
          label: this.$t("dropdown.billing.income.online.recharge.text"),
          active: false,
        },
        {
          label: this.$t("dropdown.billing.income.offline.recharge.text"),
          active: false,
        },
      ],
      statusList: [
        {
          label: this.$t("order.search.all.text"),
          active: true,
        },
        {
          label: this.$t("recharge.record.status.pendding.text"),
          active: false,
        },
        {
          label: this.$t("recharge.record.status.paid.text"),
          active: false,
        },
        {
          label: this.$t("recharge.record.status.scored.text"),
          active: false,
        },
        {
          label: this.$t("recharge.record.status.pay.timeout.text"),
          active: false,
        },
      ],
    };
  },
  computed: {
    notthing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
  },
  methods: {
    getState(value) {
      if (this.statusList[value]) {
        return this.statusList[value].label;
      }
      return "--";
    },
    getType(value) {
      if (this.typeList[value]) {
        return this.typeList[value].label;
      }
      return "--";
    },
    async onLoad(num) {
      const time = this.filterTab;
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        time: time,
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      const [err, res] = await userApi.rechargeLogReq(obj);
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
    async changFilter(v) {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      this.filterTab = v;
      await this.onLoad(1);
    },
    add(item) {
      return !`${item.money}`.includes("-");
    },
  },
};
</script>
<style scoped lang="less">
.agency-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .tabs-list {
    background-color: #fff;
    color: #939598;
    & > li {
      margin-right: 40px;
      height: 45px;
      position: relative;
    }
    & > li:last-child {
      margin-right: 0;
    }
    .active {
      color: #135ef2;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 2px solid #135ef2;
        display: block;
        width: 100%;
      }
    }
  }
  .filter-nav {
    overflow-x: auto;
  }
  .tabs-filter {
    height: 56px;
    white-space: nowrap;
    & > li {
      padding: 0 12px;
      height: 28px;
    }
    .active {
      border-radius: 14px;
      background-color: #135ef2;
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
      // font-size: 16px;
    }
  }
  .list-add {
    .num {
      color: #73c74e !important;
    }
  }
  .text-right {
    text-align: right;
  }
}
</style>
