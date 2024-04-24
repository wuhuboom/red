<template>
  <div class="list-page">
    <div class="search align-center m-l-24 m-r-24 m-t-24" @click.stop.prevent>
      <!-- @submit="handleEnterKey" -->
      <van-form @submit.prevent>
        <van-field
          @click.stop.prevent
          v-model.trim="teamName"
          @input="handleEnterKey"
          @paste="pasteEnterKey"
          class="field-input"
          :placeholder="$t('backapi.self.bank.search.text')"
        />
      </van-form>
    </div>
    <div class="tab-list-section p-l-24 p-r-24 m-t-12 m-b-12">
      <div class="tab-list font12">
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
      finished-text=""
      loading-text="loading"
      @load="onLoad"
    >
      <RowMatch :hotList="curItem.data.results" />
      <NoData v-if="!loading && curItem.data.totalCount === 0" />
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
      this.startTime = 0;
      this.tabsList = initList();
      this.onLoad(1);
    },
    pasteEnterKey() {
      if (!this.teamName) return;
      this.handleEnterKey();
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
  created() {
    this.$store.commit("setPdTop", false);
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
    height: 42;
  }
  .tab-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .list-doc {
      color: var(--primary);
    }
    .active {
      color: var(--active);
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
        color: var(--primary);
      }
      .van-form {
        width: 100%;
      }
      .field-input {
        height: 25px;
        padding-top: 0;
        padding-bottom: 0;
        border-radius: 23px;
        font-size: 12px;
        background: url("@/assets/img/red/search-bg.webp") no-repeat center
          center transparent;
        background-size: 98% 100%;
        padding-left: 38px;
        input::placeholder {
          color: var(--primary);
        }
      }
      .van-field__control {
        color: var(--primary);
      }
      .van-icon-search {
        font-size: 24px;
      }
    }
  }
}
</style>
