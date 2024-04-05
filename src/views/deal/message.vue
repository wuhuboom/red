<template>
  <div class="message-page">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('fuc.message.center')"
    >
    </AppTopBar>
    <div class="tab-list-section">
      <div class="px-16 tab-list max-width750">
        <div
          class="center-center list-doc"
          v-for="(item, idx) in tabsList"
          @click.stop.prevent="changTab(item)"
          :class="{ active: curId === item.id }"
          :key="idx"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="curItem.hasNext === false"
      finished-text=""
      loading-text="loading"
      @load="onLoad"
    >
      <div class="px-16 pb-16">
        <div v-if="nothing">
          <NoData />
        </div>
        <ul
          class="msg-list"
          v-for="(item, index) in curItem.results"
          :key="index"
        >
          <li
            class=""
            @click="
              $router.push({ name: 'createOrder', query: { id: item.orderId } })
            "
          >
            {{ statusObj2[item.msgType] }}
          </li>
          <li
            class="cont"
            v-clipboard:copy="getCopyValue(item)"
            v-clipboard:success="handleCopySuccess"
          >
            {{ $t("deal.orderDetail.197148-8") }}:{{ item.orderNo }}
            <i class="el-icon-document-copy"></i>
          </li>
          <li class="time font12">
            {{ formatDate(item.createdAt, "yyyy-MM-dd hh:mm:ss") }}
          </li>
        </ul>
      </div>
    </van-list>
  </div>
</template>

<script>
import i18n from "@/locale";
import userApi from "@/api/user";
export default {
  name: "MessageView",
  data() {
    return {
      statusObj2: {
        // 1.下单(买家下单) 2.下单(商家收款账号) 3.已付款 4.已放款
        1: this.$t("deal.userProfile3"),
        2: this.$t("deal.userProfile6"),
        3: this.$t("deal.userProfile4"),
        4: this.$t("deal.userProfile5"),
      },
      curId: 0,
      noticeList: null,
      tabsList: [
        { name: i18n.t("notice.unread.text"), id: 0 },
        { name: i18n.t("notice.read.text"), id: 1 },
      ],
      loading: false,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
    };
  },
  computed: {
    nothing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
  },
  methods: {
    getCopyValue(item) {
      return `${item.orderNo}`;
    },
    handleCopySuccess() {
      this.$toast(this.$t(`copy.success.text`));
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        unread: this.curId,
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      const [err, res] = await userApi.fbMsgSalerReq(obj);
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
    changTab(item) {
      this.curId = item.id;
      this.onLoad(1);
    },
    async getMsgList() {
      const params = {
        lang: this.$store.state.lang,
      };
      const [err, res] = await userApi.notice(params);
      if (err) return;
      this.noticeList = res.data;
    },
  },
  created() {
    this.getMsgList();
  },
};
</script>
<style scoped lang="less">
.message-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  .tab-list {
    display: flex;
    align-items: center;
    //border-bottom: 1px solid #707070;
    height: 66px;
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
  .msg-list {
    background-color: #fff;
    margin-bottom: 4px;
    padding: 20px 16px 16px;
    font-size: 14px;
    color: #222741;
  }
  .cont {
    margin: 8px 0;
  }
  .time {
    color: #acaebe;
  }
}
</style>
