<template>
  <div class="row-list px-16">
    <div
      class="row-list-item px-16 py-16"
      v-for="(item, idx) in hotList"
      :key="idx"
      @click="goDetail(item)"
    >
      <ul class="row-list-up">
        <li class="flex-1 title app-ellipsis">{{ item.allianceName }}</li>
        <li class="row-list-rigth align-center mt-0" @click.stop>
          <span
            class="num"
            v-clipboard:copy="getCopyValue(item)"
            v-clipboard:success="handleCopySuccess"
            >ID:{{ item.id }} <i class="el-icon-document-copy"></i
          ></span>
          <!-- <span class="half">{{ screenings(item) }}</span> -->
        </li>
      </ul>
      <ul class="row-list-up align-center btm-list">
        <li class="flex-1 title flex-column app-ellipsis">
          <div class="app-ellipsis align-center fistr">
            <p class="pic"><img class="d-block" :src="item.mainLogo" /></p>
            <p class="app-ellipsis flex-1 galate">
              {{ item.mainName | removeEsports }}
            </p>
          </div>
          <div class="app-ellipsis align-center">
            <p class="pic"><img class="d-block" :src="item.guestLogo" /></p>
            <p class="app-ellipsis flex-1 galate">
              {{ item.guestName | removeEsports }}
            </p>
          </div>
        </li>
        <li class="row-list-rigth align-center">
          <div class="up-doc center-center doc-gray" v-if="item.startTimeStr">
            <p>{{ item.startTimeStr.slice(5, 10) }}</p>
            <p>{{ item.startTimeStr.slice(11, 16) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ClipboardJS from "clipboard";
export default {
  name: "RowList",
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
  .row-list-item {
    box-shadow: @shadow;
    font-size: 14px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  .row-list-up {
    display: flex;
    justify-content: space-between;
    .row-list-rigth {
      width: 112px;
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
  .title {
    font-size: 12px;
    color: #797d86;
  }
  .fistr {
    padding-bottom: 8px;
  }
  .num {
    font-size: 12px;
    color: #797d86;
  }
  .half {
    font-size: 12px;
    color: #e5142e;
    margin-left: 6px;
  }
  .galate {
    font-size: 14px;
    color: #17191c;
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
