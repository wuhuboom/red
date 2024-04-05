<template>
  <RecordsLayout
    @changFilter="changFilter"
    :title="$t('me.withdraw.text')"
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
            <p class="font12" :class="{ red: item.status == 3 }">
              {{ getState(item.status) }}
            </p>
          </li>
          <li
            v-if="item.status === 3"
            class="pl-16 pt-16 red"
            style="width: 100%"
          >
            {{ $t("withdraw.record.status.fail.text") }}：{{ item.remark }}
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
          nameStr: this.$t("withdraw.record.center.show.detail.type.bank.text"),
          valueNum: 1,
        },
        {
          nameStr: this.$t("withdraw.record.center.show.detail.usdt.bank.text"),
          valueNum: 2,
        },
        {
          nameStr: this.$t(
            "backapi.self.whitdraw.type.ewallet.form.wallet.addr.text"
          ),
          valueNum: 4,
        },
      ],
      statusList: [
        {
          nameStr: this.$t("withdraw.record.status.need.audit.text"),
          valueNum: 1,
        },
        {
          nameStr: this.$t("withdraw.record.status.already.audit.text"),
          valueNum: 2,
        },
        {
          nameStr: this.$t("withdraw.failed"),
          valueNum: 3,
        },
        {
          nameStr: this.$t("withdraw.record.status.withdraw.success.text"),
          valueNum: 4,
        },
        {
          nameStr: this.$t("withdraw.record.status.paid.in.text"),
          valueNum: 5,
        },
        {
          nameStr: this.$t("backapi.self.pay.failed.text"),
          valueNum: 6,
        },
        {
          nameStr: this.$t("withdraw.record.status.operation.in.text"),
          valueNum: 7,
        },
        {
          nameStr: this.$t("withdraw.record.status.redo.in.text"),
          valueNum: 8,
        },
        {
          nameStr: this.$t("backapi.self.pay.failed.text"),
          valueNum: 9,
        },
      ],
      typeOptions: [
        {
          label: this.$t("dropdown.billing.all.title.text"),
          value: 0,
        },
        {
          label: this.$t("withdraw.record.status.need.audit.text"),
          value: 1,
        },
        {
          label: this.$t("withdraw.record.status.already.audit.text"),
          value: 2,
        },
        {
          label: this.$t("withdraw.record.status.fail.text"),
          value: 3,
        },
        {
          label: this.$t("withdraw.record.status.withdraw.success.text"),
          value: 4,
        },
        {
          label: this.$t("withdraw.record.status.paid.in.text"),
          value: 5,
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
      const res = this.statusList.find((item) => item.valueNum === value);
      if (res) {
        return res.nameStr;
      }
      return "--";
    },
    getType(value) {
      if (value) {
        let res = this.typeList.find((item) => item.valueNum === value);
        return res.nameStr;
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
      const [err, res] = await userApi.withdrawLogReq(obj);
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
    flex-wrap: wrap;
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
  .red {
    color: #ff7866 !important;
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
