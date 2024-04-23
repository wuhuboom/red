<template>
  <van-dialog
    v-model="show"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
    class="cancel-dialog-parent font12"
  >
    <ul class="flex-column cancle-dialog">
      <li class="sure-game center-center p-l-16 p-r-16">
        {{ $t("You.sure.cancel.game") }}
      </li>
      <li class="cancle-btns center-center p-l-24 p-r-24">
        <p class="page-res-btn" @click="close">
          {{ $t("modal.cancel.text") }}
        </p>
        <p class="page-res-btn" @click="sure">
          {{ $t("modal.confirm.text") }}
        </p>
      </li>
    </ul>
  </van-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "CancleOrder",
  data() {
    return {
      show: false,
    };
  },
  methods: {
    sure() {
      this.$emit("sure");
      this.close();
    },
    close() {
      this.show = false;
    },
    open() {
      this.show = true;
    },
  },
};
</script>
<style scoped lang="less">
.cancel-dialog-parent {
  background-color: transparent;
  color: var(--primary);
  .sure-game {
    height: 123px;
    width: 100%;
  }
  .cancle-dialog {
    width: 318px;
    height: 194px;
    background: url("@/assets/img/red/canclebg.webp") no-repeat center center;
    background-size: 100% 100%;
  }
  .cancle-btns {
    width: 100%;
    justify-content: space-around !important;
    P {
      width: 76px;
      height: 18px;
      color: #fff;
      border-radius: 9px;
      background-color: var(--primary);
    }
  }
}
</style>
