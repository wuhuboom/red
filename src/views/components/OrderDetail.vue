<template>
  <van-dialog
    v-model="show"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
    class="order-detail-dialog color-primary p-b-32"
  >
    <div v-if="load" class="px-16 py-16 center-center">
      <van-loading />
    </div>

    <div v-else class="order-detail p-l-12 p-r-12 font12">
      <ul class="text-center p-t-24 p-b-24 head-score">
        <li>{{ $t(`bet.detail.title.text`) }}</li>
        <li class="bet-score p-t-8 p-b-8">
          {{ betinfo.betScore }}
        </li>
        <li>{{ $t(`bet.detail.score.text`) }}</li>
      </ul>
      <ul class="head center-center color-fff">
        <li class="align-center name main-name">
          <p>{{ game.mainName | removeEsports }}</p>
        </li>
        <li class="m-r-4 m-l-4">vs</li>
        <li class="align-center name">
          <p>{{ game.guestName | removeEsports }}</p>
        </li>
      </ul>
      <ul class="head list">
        <li class="game-info justify-between align-center p-b-24">
          <p style="white-space: nowrap" class="p-r-8">
            {{ $t("bet.detail.team.text") }}
          </p>
          <p class="app-ellipsis color-fff">
            {{ betinfo.gameInfo | removeEsports }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.screenings.text") }}</p>
          <p class="color-fff">
            {{
              betinfo.gameType == 1
                ? $t("bet.detail.screenings.half.text")
                : betinfo.gameType == 2
                ? $t("bet.detail.screenings.full.text")
                : ""
            }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.score.text") }}</p>
          <p class="color-fff">
            {{ betinfo.betScore }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.odds.text") }}</p>
          <p class="color-fff">
            {{ betinfo.betOdds }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.bet.num.text") }}</p>
          <p class="color-fff">
            {{ numToFixed(betinfo.betMoney, $globalUnit.val) / $globalNum.val }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.loss.text") }}</p>
          <p class="color-fff">
            {{ getLoss }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.start.time.text") }}</p>
          <p class="color-fff">
            {{ game.startTimeStr }}
          </p>
        </li>
        <li class="game-info justify-between align-center p-b-24">
          <p>{{ $t("bet.detail.lottey.status.text") }}</p>
          <p class="color-fff" :class="[getLotteyStatusClass]">
            {{ getLotteyStatus }}
          </p>
        </li>
        <li
          class="game-info justify-between align-center p-b-24"
          v-if="betinfo.status == 3"
        >
          <p>{{ $t("recharge.Status") }}</p>
          <p class="color-fff">
            {{ $t("order.canceled") }}
          </p>
        </li>
      </ul>
      <div class="center-center m-t-8" v-if="wait">
        <van-button
          class="page-res-btn p-l-12 pr-12"
          @click="$refs.CancleOrder.open(item)"
          block
          type="info"
          >{{ $t("modal.cancel.text") }}</van-button
        >
      </div>
    </div>
    <CancleOrder @sure="sure" ref="CancleOrder" />
  </van-dialog>
</template>

<script>
import userApi from "@/api/user";
import CancleOrder from "@/views/components/CancleOrder.vue";
export default {
  name: "OrderDetail",
  components: {
    CancleOrder,
  },
  data() {
    return {
      loading: false,
      load: true,
      show: false,
      game: {},
      odds: {},
      betinfo: {},
      item: {},
    };
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    wait() {
      return this.item.status == 1 && this.item.statusOpen == 0;
    },
    getLotteyStatus() {
      if (this.betinfo.status === 1 && this.betinfo.statusSettlement === 1) {
        if (this.betinfo.winningAmount > this.betinfo.betMoney) {
          //赢的情况
          return this.$t("bet.detail.lottey.status.win.text");
        } else if (this.betinfo.winningAmount === 0) {
          //输的情况
          return this.$t("bet.detail.lottey.status.notwin.text");
        }
      } else if (this.betinfo.status === 1) {
        //未开奖(已确认)
        return this.$t("bet.detail.lottey.status.norrizes.text");
      } else if (this.betinfo.status === 3) {
        return "--";
      }
      return "--";
    },
    getLotteyStatusClass() {
      if (this.betinfo.status === 1 && this.betinfo.statusSettlement === 1) {
        if (this.betinfo.winningAmount > this.betinfo.betMoney) {
          //赢的情况
          return "win_state";
        } else if (this.betinfo.winningAmount === 0) {
          //输的情况
          return "notwin_state";
        }
      } else if (this.betinfo.status === 1) {
        //未开奖(已确认)
        return "norrizes_state";
      } else if (this.betinfo.status === 3) {
        return "norrizes_state";
      }
      return "";
    },
    getLoss() {
      if (this.betinfo.status === 1 && this.betinfo.statusSettlement === 1) {
        if (this.betinfo.winningAmount > this.betinfo.betMoney) {
          //赢的情况
          return (
            "+" +
            this.numToFixed(this.betinfo.winningAmount, this.$globalUnit.val) /
              this.$globalNum.val
          );
        } else if (this.betinfo.winningAmount === 0) {
          //输的情况
          return (
            this.numToFixed(
              this.betinfo.winningAmount * 1 - this.betinfo.betMoney,
              this.$globalUnit.val
            ) / this.$globalNum.val
          );
        }
      } else if (this.betinfo.status === 1 || this.betinfo.status === 3) {
        return "--";
      }
      return "--";
    },
    date() {
      let time = this.formatDate(this.betinfo.startTime, "yyyy-MM-dd hh:mm:ss");
      return time;
    },
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async sure() {
      this.show = false;
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err] = await userApi.unbet({ betId: this.item.id });
      if (err) {
        if (Array.isArray(err.data) && err.data.length) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }

      await this.sleep(1000);
      this.$toast(this.$t("wallet.index.cancel.bet.success.desc"));
      this.$emit("onLoad");
      // this.onLoad(1);
    },
    async getBetInfo() {
      this.load = true;
      const [err, res] = await userApi.betInfo({ betId: this.item.id });
      this.load = false;
      if (err) return;
      this.betinfo = res.data.betinfo;
      this.game = res.data.game;
      this.odds = res.data.odds;
    },
    open(item) {
      this.show = true;
      this.item = item;
      this.getBetInfo();
    },
    close() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="less">
.order-detail-dialog {
  background: url("@/assets/img/red/event.webp") transparent no-repeat center
    bottom;
  background-size: 100% 100%;
}
.order-detail {
  .bet-score {
    font-size: 20px;
    font-weight: bold;
  }
  .head-score {
    border-bottom: solid 1px var(--main);
  }
  .game-info {
  }
  .head {
    // padding: 16px 30px 16px;
    // border-bottom: 1px solid #e6e6e6;
  }
  .main-name {
    padding: 10px 0;
  }
  .pic {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
  }
  .list {
    li > p:nth-child(2) {
    }
    li {
      padding-bottom: 10px;
    }
  }
  .notwin_state {
  }
  .win_state {
  }
  .canceled {
    padding: 15px 15px 22px;
    p {
      height: 40px;
      border-radius: 8px;
      background-color: #acaab3;
    }
  }
}
</style>
