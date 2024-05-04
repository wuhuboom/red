<template>
  <div class="row-list">
    <div
      class="border-color-main row-list-item m-x-24 mt-0 font12 p-l-16 p-r-16 p-t-8 p-b-8"
      v-for="(item, idx) in hotList"
      :key="idx"
      @click="goDetail(item)"
    >
      <ul class="row-list-up m-b-4 justify-between align-center">
        <li class="row-list-rigth align-center mt-0" @click.stop>
          <span
            class="num"
            v-clipboard:copy="getCopyValue(item)"
            v-clipboard:success="handleCopySuccess"
            >ID:{{ item.id }} <i class="el-icon-document-copy active"></i
          ></span>
        </li>
        <li>{{ item.startTime | timestampStr }}</li>
      </ul>
      <p
        class="border-color-main center-center font14 alliance-name m-t-4 p-x-4"
      >
        {{ item.allianceName }}
      </p>
      <ul class="team-vs m-t-8">
        <li class="text-center">{{ item.mainName | removeEsports }}</li>
        <li class="pic">
          <img src="@/assets/img/red/vs.webp" alt="" class="d-block" />
        </li>
        <li class="text-center">{{ item.guestName | removeEsports }}</li>
      </ul>
      <ul class="justify-between m-t-4 align-center">
        <li class="flex-1 m-r-8" v-if="item.gameCurrBet !== undefined">
          <el-progress
            :percentage="percent(item)"
            color="#dc2525"
            :stroke-width="4"
          />
        </li>
        <li>
          <p>{{ $t("trade.Current.Bet") }}:{{ item.gameCurrBet }}</p>
          <p>{{ $t("trade.Total.Bet") }}:{{ item.gameTotalBet }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ClipboardJS from "clipboard";
export default {
  name: "RowMatch",
  data() {
    return {
      show: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    hotList: {
      type: Array,
      default: () => [],
    },
    goPage: {
      type: Function,
      default: null,
    },
  },
  methods: {
    percent(d) {
      if (d.gameTotalBet === 0) return 0;
      return +((d.gameCurrBet / d.gameTotalBet) * 100).toFixed(0);
    },
    getCopyValue(item) {
      return `${item.id}`;
    },
    handleCopySuccess() {
      this.$toast(this.$t(`copy.success.text`));
    },
    copy(t) {
      console.log(t);
      // const clipboard = new ClipboardJS(".js-num", {
      //   text: () => t,
      // });
      // console.log(t, clipboard);
      // clipboard.on("success", () => {
      //   this.$toast(this.$t(`copy.success.text`));
      //   clipboard.destroy();
      // });
      // clipboard.on("error", () => {
      //   this.$toast("error");
      //   clipboard.destroy();
      // });
    },
    goDetail(item) {
      if (this.goPage) {
        this.goPage(item);
        return;
      }
      this.$router.push({
        name: "Detail",
        query: {
          id: item.id,
        },
      });
    },
    screenings(item) {
      if (item.gameStatus == 1) {
        return this.$t("bet.detail.screenings.half.text");
      } else if (item.gameStatus == 2) {
        return this.$t("bet.detail.screenings.full.text");
      } else {
        return "";
      }
    },
  },
};
</script>
<style scoped lang="less">
@shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
.row-list {
  ::v-deep {
    .el-progress {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }
    .el-progress-bar {
      padding-right: 0;
      margin-right: 0;
    }
    .el-progress-bar__outer {
      background-color: #484b4c !important;
      overflow: visible;
    }
    .el-progress__text {
      color: #ff7f72 !important;
      margin-right: 4px;
      margin-left: 0;
      padding-right: 4px;
    }
    .el-progress-bar__inner {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        width: 4px;
        height: 12px;
        top: 50%;
        margin-top: -6px;
        right: 0;
        background-color: #ff7f72;
      }
    }
  }
  .row-list-item {
    box-shadow: @shadow;
    border-radius: 20px;
    color: var(--primary);
    border: 1px solid var(--active);
  }
  .row-list-up {
    display: flex;
    justify-content: space-between;
    .row-list-rigth {
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
  .title {
    font-size: 12px;
  }
  .fistr {
    padding-bottom: 8px;
  }
  .alliance-name {
    color: #fff;
    border-bottom: 1px solid var(--active);
    border-top: 1px solid var(--active);
  }
  .team-vs {
    color: var(--primary);
    .pic {
      width: 24px;
      height: 42px;
      margin: 0 auto;
    }
  }
  .num {
    color: var(--primary);
    .el-icon-document-copy {
      color: var(--active);
    }
  }
  .half {
    font-size: 12px;
    color: #e5142e;
    margin-left: 6px;
  }
  .galate {
    font-size: 14px;
  }
  .row-list-rigth {
    justify-content: flex-end;
    margin-top: 10px;
  }
  .up-doc {
    flex-direction: column;
    justify-content: space-around;
    width: 54px;
    height: 44px;
    border-radius: 10px;
    font-size: 12px;
    & > p:last-child {
      font-size: 14px;
    }
  }
  .doc-green {
    background-color: #e7f7ef;
    color: #10ab61;
  }
  .doc-red {
    background-color: #f7e7e7;
    color: #e5142e;
  }
  .doc-gray {
    background-color: #e9eaed;
    color: #707070;

    & > p:nth-child(1) {
      font-weight: 14px;
      font-weight: bold;
      color: #222222;
    }
  }
  .btm-list {
    padding-top: 10px;
  }
  .pic {
    width: 18px;
    height: 18px;
    margin-right: 4px;
    & > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .mt-0 {
    margin-top: 0 !important;
  }
}
</style>
