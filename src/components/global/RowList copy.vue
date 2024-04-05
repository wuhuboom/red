<template>
  <div class="home-hot px-16">
    <div class="hot-all">
      <div class="d-flex flex-wrap">
        <div class="full" v-for="(item, idx) in hotList" :key="idx">
          <ul class="hot-row hot-row-full">
            <li class="justify-between">
              <p class="align-center pic-box">
                {{ item.allianceName }}
              </p>
              <p class="text-list">
                <span class="d-block text">12‘</span>
                <span class="d-block text">1st Half</span>
              </p>
            </li>
            <li class="justify-between align-center">
              <div class="data-left-list">
                <div class="app-ellipsis main-name pic-box align-center">
                  <span class="pic"> <ImgCom :src="item.mainLogo" /></span>
                  {{ item.mainName }}
                </div>
                <div class="app-ellipsis gest-name pic-box align-center">
                  <span class="pic">
                    <ImgCom :src="item.guestLogo" />
                  </span>
                  {{ item.guestName }}
                </div>
              </div>
              <div class="align-center data-up-list">
                <div class="data-box center-center flex-column">
                  <p>1-2</p>
                  <p>1-2</p>
                </div>
                <div class="data-box data-red center-center flex-column">
                  <p>1-2</p>
                  <p>1-2</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  },
};
</script>
<style scoped lang="less">
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
  }
}
.hot-row {
  width: 206px;
  height: 163px;
  padding: 16px 13px 15px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.09);
  border: solid 1px rgba(0, 0, 0, 0.02);
  background-color: #fff;
  margin-right: 8px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .pic-box {
    & > span {
      flex-shrink: 0;
      flex-grow: 0;
      width: 34px;
      height: 34px;
      border-radius: 17px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      background-color: #fff;
      border: solid 1px #e8e8e8;
      overflow: hidden;
    }
    & > span:nth-child(1) {
      position: relative;
      z-index: 1;
    }
    & > span:nth-child(2) {
      margin-left: -8px;
    }
  }
  .text-list {
    font-size: 14px;
    text-align: right;
    & > span:nth-child(1) {
      font-size: 17px;
    }
  }
  .gest-alliance {
    color: var(--color-text);
    // font-weight: bold;
  }
}
.full {
  width: 100%;
}
.hot-row.hot-row-full {
  width: 100%;
  margin-right: 0;
  margin-bottom: 8px;
  .pic-box {
    & > span {
      width: 20px;
      height: 20px;
      box-shadow: none;
      margin-right: 8px;
    }
  }
  .main-name {
    margin-bottom: 8px;
  }
  .data-box {
    color: #10ab61;
    width: 54px;
    height: 44px;
    padding: 4px;
    border-radius: 10px;
    background-color: #e7f7ef;
  }
  .data-left-list {
    width: 180px;
    & > div {
      max-width: 100%;
      overflow: hidden;
    }
  }
  .data-up-list {
    & > div {
      margin-left: 4px;
    }
  }
  .data-red {
    background-color: #f7e7e7;
    color: #e5142e;
  }
  .main-name,
  .gest-name {
    color: var(--color-text);
  }
}
</style>
