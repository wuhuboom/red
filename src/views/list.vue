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
    <div class="tab-list-section">
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
      <RowList :hotList="curItem.data.results" />
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
const initData = (startTime = 0) => {
  return {
    startTime,
    status: 0,
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
      name: i18n.t("match.all.text"),
      ...initData(0),
    },
    {
      ...initData(1),
      name: i18n.t("match.today.text"),
    },
    {
      ...initData(2),
      name: i18n.t("match.tomorrow.text"),
    },
  ];
};
export default {
  name: "HomeView",
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
  components: {},
  computed: {
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
      const [err, res] = await userApi.playerGame({
        startTime,
        status: this.curItem.status,
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
    //justify-content: space-between;
    position: fixed;
    background-color: #fff;
    z-index: 10;
    top: 74px;
    left: 0;
    right: 0;
    .list-doc {
      flex-basis: 80px;
      font-size: 14px;
      height: 32px;
      padding: 0 14px;
      color: #707070;
      border-radius: 16px;
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.09);
      border: solid 1px rgba(0, 0, 0, 0.02);
      background-color: #fff;
      margin-right: 12px;
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
  }
}
</style>
