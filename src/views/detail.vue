<template>
  <div class="detail-page">
    <AppTopBar
      :styleObj="{
        backgroundColor: isScrolled
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(186, 12, 47, 0)',
      }"
    >
      <template #title>
        <ul class="head-title align-center">
          <li class="title-in app-ellipsis flex-1">{{ game.allianceName }}</li>
          <li class="game-id">ID:{{ gameId }}</li>
        </ul>
      </template>
    </AppTopBar>
    <div class="focus">
      <ul class="align-center focus-list justify-around">
        <li>
          <div class="flex-column center-center">
            <span class="pic">
              <ImgCom :src="game.mainLogo" />
            </span>
            <p class="name">{{ game.mainName | removeEsports }}</p>
          </div>
        </li>
        <li class="flex-column center-center">
          <div class="center-center txt-vs">VS</div>
          <div v-if="game.remainingTime">
            <Count-down :time="game.remainingTime" format="hh:mm:ss">
              <template slot-scope="{ time }">
                <div class="center-center time">
                  {{ time }}
                </div>
              </template>
            </Count-down>
          </div>
        </li>
        <li>
          <div class="flex-column center-center">
            <span class="pic">
              <ImgCom :src="game.guestLogo" />
            </span>
            <p class="name">{{ game.guestName | removeEsports }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="game-bg">
      <div class="geme-type align-center">
        <p :class="{ active: type === 1 }" @click="type = 1">
          {{ $t("bet.detail.screenings.half.text") }}
        </p>
        <p :class="{ active: type === 2 }" @click="type = 2">
          {{ $t("bet.detail.screenings.full.text") }}
        </p>
      </div>
    </div>
    <ul class="loss-list">
      <li v-for="(item, idx) in lossPerCent" :key="idx" @click="chose(item)">
        <div class="loss-cont" :class="{ active: item.id == curItem.id }">
          <p>{{ item.scoreHome }}-{{ item.scoreAway }}</p>
          <p>{{ item.antiPerCent }}%</p>
        </div>
      </li>
    </ul>
    <div class="place center-center max-width750">
      <p class="center-center flex-1" @click="open">
        {{ $t("Confirm Transaction") }}
      </p>
    </div>
    <DetailSheet ref="DetailSheet" />
  </div>
</template>

<script>
import userApi from "@/api/user";
import DetailSheet from "@/views/components/DetailSheet.vue";
export default {
  name: "DetailView",
  components: { DetailSheet },
  data() {
    return {
      gameId: this.$route.query.id,
      isScrolled: false,
      doc: {},
      curItem: {},
      type: 1,
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
    this.$store.commit("setPdTop", false);
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style scoped lang="less">
.detail-page {
  padding-bottom: 88px;
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
  .game-bg {
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    background-image: var(--bg-primary);
    margin-top: -23px;
    color: #fff;
    &,
    .geme-type {
      height: 46px;
    }
    .geme-type {
      background: url("@/assets/img/iconv.webp") no-repeat center;
      background-size: cover;
      font-size: 17px;
      padding: 0 28px;
      color: #fff;
      position: relative;
      .active {
        &::after {
          content: "";
          display: block;
          width: 23px;
          margin-left: -11.5px;
          height: 2px;
          background-color: #fff;
          position: absolute;
          bottom: 5px;
          left: 50%;
        }
      }
      & > p {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
      }
      & > p:nth-child(2) {
        margin-left: 24px;
      }
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
  ::v-deep {
    .appp-top-bar-title {
      width: 100%;
    }
    .icon-button,
    .head-title {
      color: #fff !important;
      font-size: 14px;
    }
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
