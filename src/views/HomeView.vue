<template>
  <div class="home">
    <div class="m-l-24 m-r-24 m-t-32 m-b-16 search p-x-8">
      <van-field
        @click="goList"
        left-icon="search"
        class="field-input d-flex align-center"
        :placeholder="$t('backapi.self.bank.search.text')"
      />
    </div>

    <div class="swiper m-l-24 m-r-24 m-b-24" v-if="swiperList.length">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in swiperList" :key="index">
          <img v-lazy="item.imageUrl" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <ul class="user-money p-l-24 p-r-24 font12">
      <li class="text-center">{{ balanceMoneyNum }}</li>
      <li class="center-center m-t-1 m-b-8">
        {{ $t("home.index.account.balance.text") }}
        <i @click="refresh" class="iconfont font14 icon-shuaxin"></i>
      </li>
      <li></li>
    </ul>
    <ul class="nav m-t-12 p-l-24 p-r-24 align-center capitalize m-b-16">
      <li
        class="center-center"
        @click="goTo(item)"
        v-for="(item, idx) in navList"
        :key="idx"
      >
        <p><img :src="item.icon" /></p>
        <p>{{ item.name }}</p>
      </li>
    </ul>
    <RowMatch :hotList="hotList" />
    <VersionDilalog ref="VersionDilalog" />
  </div>
</template>

<script>
import VersionDilalog from "@/views/components/VersionDilalog.vue";
import userApi from "@/api/user";
import staticData from "@/data/hot.json";
//import slide from "@/data/slide.json";
import nav1 from "@/assets/img/red/path-52@3x.png";
import nav2 from "@/assets/img/red/group-19@2x.png";
import nav3 from "@/assets/img/red/group-20@2x.png";
import nav4 from "@/assets/img/red/path-57@2x.png";
import i18n from "@/locale";
import userPic from "@/assets/img/user@2x.png";
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
      userPic,
      navList: [],
      swiperList: [],
      hotList: [],
      allList: [],
      startTime: 0,
      loading: false,
      tabsList: initList(),
    };
  },
  components: { VersionDilalog },
  computed: {
    user() {
      return this.$store.state.user;
    },
    curItem() {
      return this.tabsList.find((item) => item.startTime === this.startTime);
    },
    balanceMoneyNum() {
      return (
        this.numToFixed(this.user.balance, this.$globalUnit.val) /
        this.$globalNum.val
      );
    },
  },
  methods: {
    async refresh() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.$store.dispatch("getInfo");
      this.$toast.clear();
    },
    goTo(item) {
      const link = item.link;
      if (link) {
        if (link === "service") {
          this.$store.commit("goServe");
          return;
        }
        this.$router.push({ name: item.link });
      }
    },
    async onLoad(num) {
      const startTime = this.curItem.startTime;
      const pageNo = !isNaN(num) ? num : this.curItem.data.pageNo;
      const [err, res] = await userApi.playerGame({
        startTime,
        status: this.curItem.status,
        pageNo: pageNo,
        pageSize: this.curItem.data.pageSize,
      });

      this.loading = false;
      this.$toast.clear();

      if (err) return;
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
    goList() {
      this.$router.push({ name: "List" });
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
    turnSecond(arr) {
      return arr.map((item) => {
        let sencond = parseInt(item.remainingTime / 1000);
        if (sencond) {
          return {
            ...item,
            remainingTime: sencond,
          };
        } else {
          return item;
        }
      });
    },
    async gethot() {
      const [err, res] = await userApi.homehot({
        lang: this.$store.state.lang,
      });
      if (err) return;
      const { data } = res;
      this.hotList = data;
      //this.allList = this.turnSecond(data.filter((item, idx) => idx >= 4));
    },
    noUseR() {
      this.hotList = this.turnSecond(staticData.filter((item, idx) => idx < 4));
      this.allList = this.turnSecond(
        staticData.filter((item, idx) => idx >= 4)
      );
      this.swiperList =
        typeof window.appBanner !== "undefined" ? window.appBanner : [];
    },
    haveUser() {
      this.gethot();
      this.getslider();
    },
  },
  created() {
    this.$store.commit("setPdTop", false);
    this.$store.dispatch("getServeData");
    this.navList = [
      {
        name: this.$t("backapi.self.safe.text"),
        link: "Wallet",
        icon: nav1,
      },
      {
        name: this.$t("home.index.recharge.text"),
        link: "Recharge",
        icon: nav2,
      },
      {
        name: this.$t("home.index.withdraw.text"),
        link: "Withdraw",
        icon: nav3,
      },
      {
        name: this.$t("backapi.self.home.tool.online.ser.text"),
        link: "service",
        icon: nav4,
      },
    ];
    if (this.$store.state.token) {
      this.haveUser();
    } else {
      this.noUseR();
    }
  },
};
</script>
<style scoped lang="less">
@shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
.home {
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
      color: #191919;
    }
    & > li:nth-child(2) {
      color: var(--primary);
    }
  }
  .user-money {
    & > li:nth-child(1) {
      font-size: 26px;
      font-weight: 900;
      color: #ef7367;
    }
    & > li:nth-child(2) {
      color: var(--primary);
    }
    & > li:nth-child(3) {
      height: 3px;
      background-image: linear-gradient(
        to right,
        #8a1c1b,
        #f34139 30%,
        #ff928d 38%,
        #fd7361 53%,
        #f4483f 54%,
        #ef3932 64%,
        #fa574c 91%,
        #f03f38
      );
    }
  }
  .nav {
    justify-content: space-between;
    font-size: 12px;
    color: var(--primary);
    & > li {
      flex-direction: column;
      width: 76px;
      height: 70px;
      border-radius: 8px;
    }
    & > li {
      p:last-child {
        margin-top: 6px;
      }
    }
    img {
      display: block;
      height: 18px;
    }
  }
  ::v-deep {
    .appp-top-bar-title {
      flex: 1;
      text-align: left;
    }
    .swiper {
      .van-swipe {
        height: 200px;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }
    .van-button__icon {
      font-size: 30px !important;
      font-weight: bold;
    }
    .register {
      background-color: var(--color-text);
      border-color: var(--color-text);
    }
    .search {
      border: 1px solid var(--primary);
      .field-input {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 12px;
        height: 30px;
        background-color: #303234;
        font-size: 12px;
        border: 1px solid #303234;
      }
      @searchColor: #737b8c;
      .van-icon-search {
        font-size: 24px;
        color: #ef7367;
      }
      ::-webkit-input-placeholder,
      ::placeholder {
        color: @searchColor;
      }
    }
  }
}
.home-hot {
  .hot-all {
    overflow-x: auto;
    max-width: 100%;
    padding-bottom: 8px;
  }
  .hot-tips {
    color: var(--color-text);
    font-size: 16px;
    padding-top: 24px;
    padding-bottom: 16px;
    font-weight: bold;
    img {
      height: 20px;
    }
    & > li:nth-child(2) {
      margin-left: 8px;
    }
    & > li.see-all {
      color: #707070;
      font-size: 12px;
    }
  }
}
.hot-row {
  width: 206px;
  height: 163px;
  padding: 16px 13px 15px 16px;
  border-radius: 8px;
  box-shadow: @shadow;
  border: solid 1px rgba(0, 0, 0, 0.02);
  background-color: #fff;
  margin-right: 8px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .pic-box {
    & > span {
      width: 34px;
      height: 34px;
      border-radius: 17px;
      background-color: #fff;
      border: solid 1px #e8e8e8;
      overflow: hidden;
    }
    & > span:nth-child(1) {
      position: relative;
      box-shadow: @shadow;
      z-index: 1;
    }
    & > span:nth-child(2) {
      margin-left: -8px;
    }
  }
  .text-list {
    font-size: 14px;
    text-align: right;
    color: #e5142e;
    & > span:nth-child(1) {
      font-weight: bold;
    }
    & > span:nth-child(2) {
      color: #475467;
    }
  }
  .hot-row-icon {
    margin-bottom: 26px;
  }
  .gest-alliance {
    font-size: 14px;
    font-weight: bold;
  }
  .main-name {
    font-size: 12px;
    color: #a2a2a2;
  }
  .gest-name {
    font-size: 14px;
    color: #6f757e;
  }
}
</style>
