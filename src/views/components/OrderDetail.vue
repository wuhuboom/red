<template>
  <van-dialog
    v-model="show"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
  >
    <div v-if="load" class="px-16 py-16 center-center">
      <van-loading color="#1989fa" />
    </div>

    <div v-else class="order-detail">
      <ul class="head">
        <li class="game-info font-12">
          {{ betinfo.gameInfo | removeEsports }}
        </li>
        <li class="align-center name main-name font14">
          <p class="pic">
            <img :src="game.mainLogo" alt="" />
          </p>
          <p>{{ game.mainName | removeEsports }}</p>
        </li>
        <li class="align-center name font14">
          <p class="pic">
            <img :src="game.guestLogo" alt="" />
          </p>
          <p>{{ game.guestName | removeEsports }}</p>
        </li>
      </ul>
      <ul class="head list font14">
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.screenings.text") }}</p>
          <p>
            {{
              betinfo.gameType == 1
                ? $t("bet.detail.screenings.half.text")
                : betinfo.gameType == 2
                ? $t("bet.detail.screenings.full.text")
                : ""
            }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.score.text") }}</p>
          <p>
            {{ betinfo.betScore }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.odds.text") }}</p>
          <p>
            {{ betinfo.betOdds }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.bet.num.text") }}</p>
          <p>
            {{ numToFixed(betinfo.betMoney, $globalUnit.val) / $globalNum.val }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.loss.text") }}</p>
          <p>
            {{ getLoss }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.start.time.text") }}</p>
          <p>
            {{ game.startTimeStr }}
          </p>
        </li>
        <li class="game-info justify-between align-center">
          <p>{{ $t("bet.detail.lottey.status.text") }}</p>
          <p :class="[getLotteyStatusClass]">
            {{ getLotteyStatus }}
          </p>
        </li>
      </ul>
      <div class="canceled" v-if="betinfo.status == 3">
        <p class="center-center">{{ $t("order.canceled") }}</p>
      </div>
    </div>
  </van-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "OrderDetail",
  data() {
    return {
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
  components: {},
  computed: {
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
.order-detail {
  font-size: 14px;
  .game-info {
    color: #797d86;
  }
  .head {
    padding: 16px 30px 16px;
    border-bottom: 1px solid #e6e6e6;
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
    color: #17191c;
  }
  .list {
    color: #475467;
    li > p:nth-child(2) {
      color: #222;
    }
    li {
      padding-bottom: 10px;
    }
  }
  .notwin_state {
    color: #10ab61 !important;
  }
  .win_state {
    color: #e5142e !important;
  }
  .canceled {
    padding: 15px 15px 22px;
    p {
      height: 40px;
      border-radius: 8px;
      background-color: #acaab3;
      color: #fff;
    }
  }
}
</style>
