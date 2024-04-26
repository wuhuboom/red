<template>
  <van-dialog
    v-model="fromModal2"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
  >
    <div class="common-dialog">
      <p class="close center-center" @click="fromModal2 = false">
        <van-icon name="cross" />
      </p>
      <p class="center-center"><i class="iconfont icon-jingti-copy"></i></p>
      <div class="cont align-center flex-1">
        <ul class="update">
          <li class="update-text">{{ $t("version.update") }}</li>
          <li class="">
            <p
              class="btns app-ellipsis"
              @click="simulateProgressBar"
              v-if="!progressBarState"
            >
              {{ $t(`update.now`) }}
            </p>
            <van-progress
              v-else
              track-color="rgba(255, 255, 255, 0.55)"
              :show-pivot="false"
              color="#fff"
              :percentage="progressBar"
              stroke-width="8"
            />
          </li>
        </ul>
      </div>

      <div><img class="sorck" src="@/assets/img/update.webp" alt="" /></div>
    </div>
  </van-dialog>
</template>

<script>
import userApi from "@/api/user";
import auth from "@/plugins/auth";
export default {
  name: "VersionDilalog",
  data() {
    return {
      version: "",
      progressBarState: false,
      fromModal2: false,
      progressBar: 0,
      key: "storageVersion",
    };
  },
  methods: {
    simulateProgressBar() {
      this.progressBarState = true;
      var duration = Math.floor(Math.random() * 6) + 5; // 生成5到10之间的随机秒数
      var increment = 100 / (duration * 10); // 计算每100毫秒增加的进度

      var progress = 0;

      this.interval = setInterval(() => {
        progress += increment;
        this.progressBar = progress;
        if (progress >= 100) {
          console.log("done");
          auth.setToken(this.version, this.key);
          location.reload();
          clearInterval(this.interval);
        }
      }, 100);
    },
    isNumber(val) {
      return typeof val === "number" && !isNaN(val);
    },
    async getVersion() {
      const [err] = await userApi.versionReq();
      if (!this.isNumber(+err)) {
        return;
      }
      const res = +err;
      console.log(this.version, this.key);
      let storageVersion = auth.getToken(this.key);
      if (storageVersion && storageVersion != res) {
        this.fromModal2 = true;
        this.version = res;
      } else {
        auth.setToken(res, this.key);
      }
    },
  },
  created() {
    this.getVersion();
  },
  beforeDestroy() {
    this.interval && clearInterval(this.interval);
  },
};
</script>
<style lang="less" scoped>
.common-dialog {
  padding: 0 25px;
  position: relative;
  font-size: 16px;
  background-color: var(--main);
  color: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .btns {
    font-size: 13px;
    color: #222;
    height: 36px;
    border-radius: 10px;
    background-color: #fff;
    padding: 0 8px;
    line-height: 36px;
    text-align: center;
    width: 115px;
  }
  .close {
    position: absolute;
    right: 15px;
    top: 13px;
    font-size: 12px;
    height: 24px;
    width: 24px;
    border-radius: 12px;
    background-color: rgba(0, 0, 0, 0.55);
  }
  .cont {
    height: 152px;
  }
  .update {
    width: 146px;
  }
  .update-text {
    margin-bottom: 35px;
  }
  .sorck {
    width: 56px;
    display: block;
    height: 111px;
  }
}
</style>
