<template>
  <div class="home">
    <div class="pb-16 px-16 search">
      <van-field
        @click="goList"
        left-icon="search"
        class="field-input"
        :placeholder="$t('backapi.self.bank.search.text')"
      />
    </div>
    <ul class="nav px-16 pb-16 d-flex align-center capitalize">
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
    <div class="swiper" v-if="swiperList.length">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item, index) in swiperList" :key="index">
          <img v-lazy="item.imageUrl" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="home-hot px-16">
      <ul class="hot-tips align-center">
        <li><img class="d-block" src="@/assets/img/live.webp" /></li>
        <li>{{ $t("home.Hot.Matches") }}</li>
      </ul>
      <div class="hot-all">
        <div class="d-flex">
          <div
            v-for="(item, idx) in hotList"
            :key="idx"
            @click="
              $router.push({
                name: 'Detail',
                query: {
                  id: item.id,
                },
              })
            "
          >
            <ul class="hot-row">
              <li class="justify-between hot-row-icon">
                <p class="align-center pic-box">
                  <span class="pic"> <ImgCom :src="item.mainLogo" /></span>
                  <span class="pic">
                    <ImgCom :src="item.guestLogo" />
                  </span>
                </p>
                <p class="text-list">
                  <span class="d-block text" v-if="item.remainingTime">
                    <Count-down :time="item.remainingTime" format="hh:mm:ss">
                      <template slot-scope="{ time }">{{ time }}</template>
                    </Count-down>
                  </span>
                  <span v-if="item.startTimeStr" class="d-block text">{{
                    item.startTimeStr.slice(5, 10)
                  }}</span>
                </p>
              </li>

              <li class="app-ellipsis main-name">
                {{ item.mainName | removeEsports }}
              </li>
              <li class="app-ellipsis gest-name">
                {{ item.guestName | removeEsports }}
              </li>
              <li class="app-ellipsis gest-alliance">
                {{ item.allianceName }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ul class="hot-tips align-center justify-between" @click="goList">
        <li>{{ $t("home.All.Games") }}</li>
        <li class="see-all">{{ $t("home.SEE.ALL") }}</li>
      </ul>
    </div>
    <RowList :hotList="allList" :title="$t('home.All.Games')" />
    <!-- <van-list
      v-else
      v-model="loading"
      :finished="curItem.data.hasNext === false"
      finished-text="No More"
      loading-text="loading"
      @load="onLoad"
    >
      <RowList :hotList="curItem.data.results" />
    </van-list> -->
    <VersionDilalog ref="VersionDilalog" />
  </div>
</template>

<script>
import VersionDilalog from "@/views/components/VersionDilalog.vue";
import userApi from "@/api/user";
import staticData from "@/data/hot.json";
//import slide from "@/data/slide.json";
import nav1 from "@/assets/img/nav1@2x.png";
import nav2 from "@/assets/img/nav2@2x.png";
import nav3 from "@/assets/img/nav3@2x.png";
import nav4 from "@/assets/img/nav4.webp";
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
  },
  methods: {
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
      this.hotList = this.turnSecond(data.filter((item, idx) => idx < 4));
      this.allList = this.turnSecond(data.filter((item, idx) => idx >= 4));
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
        name: this.$t("home.index.nav.text3"),
        link: "List",
        icon: nav1,
      },
      {
        name: this.$t("home.index.recharge.text"),
        link: "Recharge",
        icon: nav2,
      },
      {
        name: this.$t("backapi.self.home.tool.online.ser.text"),
        link: "service",
        icon: nav3,
      },
      {
        name: this.$t("safe.invite.types"),
        link: "Share",
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
  .nav {
    justify-content: space-between;
    font-size: 12px;
    color: #17191c;
    & > li {
      flex-direction: column;
      width: 76px;
      height: 70px;
      box-shadow: @shadow;
      border: solid 1px rgba(0, 0, 0, 0.02);
      background-color: #fff;
      border-radius: 8px;
    }
    & > li {
      p:last-child {
        margin-top: 6px;
      }
    }
    img {
      display: block;
      height: 32px;
      width: 32px;
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
      .field-input {
        height: 46px;
        background-color: #f7f7f8;
        border-radius: 23px;
        font-size: 16px;
        border: 1px solid #f5f5f5;
      }
      @searchColor: #737b8c;
      .van-icon-search {
        font-size: 24px;
        color: @searchColor;
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
