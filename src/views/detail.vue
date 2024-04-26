<template>
  <div class="detail-page font12">
    <AppTopBar
      :topBarTitle="`${game.allianceName || ''}`"
      class="app-top-bar-black"
    >
    </AppTopBar>
    <RowMatch :hotList="[game]" />
    <p class="black-line m-b-16 m-l-24 m-r-24"></p>
    <div class="game-bg">
      <div class="geme-type flex-column center-center">
        <p
          class="page-res-btn m-b-8"
          :class="{ active: type === 2 }"
          @click="type = 2"
        >
          {{ $t("bet.detail.screenings.full.text") }}
        </p>
        <p
          class="page-res-btn"
          :class="{ active: type === 1 }"
          @click="type = 1"
        >
          {{ $t("bet.detail.screenings.half.text") }}
        </p>
      </div>
    </div>
    <div class="p-l-16 p-r-16 m-b-24">
      <van-grid
        class="color-primary m-b-8 m-t-16"
        :border="false"
        :column-num="3"
      >
        <van-grid-item v-for="(value, idx) in head" :key="value">
          <p v-if="idx !== head.length - 1">{{ value }}</p>
          <p v-else class="three-row">{{ value }}</p>
        </van-grid-item>
      </van-grid>
      <van-grid
        class="color-primary m-b-8"
        v-for="(item, idx) in lossPerCent"
        :key="idx"
        :border="false"
        :column-num="3"
      >
        <van-grid-item class="color-fff">
          {{ item.scoreHome }}-{{ item.scoreAway }}
        </van-grid-item>
        <van-grid-item class="color-fff">
          {{ item.antiPerCent }}%
        </van-grid-item>
        <van-grid-item class="color-fff">
          <p class="page-res-btn three-row" @click="chose(item)">
            {{ $t(`match.cmopetition.list.canbescore.text`) }}
          </p>
        </van-grid-item>
      </van-grid>
    </div>
    <DetailSheet ref="DetailSheet" />
  </div>
</template>

<script>
import userApi from "@/api/user";
import DetailSheet from "@/views/components/DetailSheet.vue";
import i18n from "@/locale";
export default {
  name: "DetailView",
  components: { DetailSheet },
  data() {
    return {
      head: [
        i18n.t("match.cmopetition.list.scorebet.text"),
        i18n.t("match.cmopetition.list.odd.text"),
        i18n.t("match.cmopetition.list.status.text"),
      ],
      gameId: this.$route.query.id,
      isScrolled: false,
      doc: {},
      curItem: {},
      type: 2,
    };
  },
  computed: {
    lossPerCent() {
      return (this.doc.lossPerCent || []).filter(
        (item) => item.gameType === this.type
      );
    },
    game() {
      return this.doc.game || {};
    },
  },
  methods: {
    open() {
      this.$refs.DetailSheet.open({ curItem: this.curItem, game: this.game });
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 20;
    },
    chose(item) {
      this.curItem = item;
      this.open();
    },
    async geDetail() {
      const [err, res] = await userApi.gameDetail({
        gameId: this.gameId,
      });
      if (err) return;
      res.data.game.remainingTime = parseInt(
        res.data.game.remainingTime / 1000
      );
      this.doc = res.data;
      if (this.lossPerCent.length) {
        this.curItem = this.lossPerCent[0];
      }
    },
  },
  created() {
    this.geDetail();
  },
};
</script>
<style scoped lang="less">
.detail-page {
  .three-row {
    width: 144px;
    white-space: nowrap;
  }
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
  .focus {
    background: url("@/assets/img/detailbg.png") no-repeat center;
    background-size: cover;
    height: 320px;
  }
  .focus-list {
    padding-top: 106px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    .name {
      width: 140px;
      text-align: center;
      margin-top: 18px;
    }
  }
  .pic {
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .txt-vs {
    font-size: 48px;
    font-weight: bold;
    color: #fff;
  }
  .time {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    color: #ff7c43;
  }
  .geme-type {
    p {
      width: 216px;
      text-align: center;
      border: 1px solid var(--active);
      background-color: transparent !important;
    }
    p.active {
      color: #fff !important;
      background-color: var(--main) !important;
    }
  }
  .loss-list {
    display: flex;
    flex-wrap: wrap;
    padding: 16px 8px 0;
    & > li {
      padding: 0 8px;
      margin-bottom: 16px;
      width: 33.33%;
    }
    .loss-cont {
      height: 47px;
      padding: 4px;
      font-size: 14px;
      border-radius: 7.5px;
      border: solid 1px #ccc;
      display: flex;
      justify-content: space-around;
      align-items: center;
      & > p:nth-child(1) {
        color: #8c8c8c;
      }
      & > p:nth-child(2) {
        color: #292929;
        font-weight: bold;
      }
    }
    .active {
      border: solid 1px #02f;
      background-color: #f0f2ff;
      color: #fff;

      & > p:nth-child(2) {
        color: var(--primary);
      }
    }
  }
  .game-id {
    width: 160px;
    margin-left: 8px;
  }

  .place {
    padding: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    p {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      height: 40px;
      border-radius: 8px;
      background-color: #0025fc;
    }
  }
}
</style>
