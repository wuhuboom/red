<template>
  <van-dialog
    class="withdraw-clear-vip-dialog color-primary"
    :showConfirmButton="false"
    v-model="showDialog"
    :close-on-click-overlay="true"
  >
    <ul class="promotion-cont font14">
      <li class="center-center">
        <!-- <img src="@/assets/img/shared.png" alt="" /> -->
      </li>
      <li class="center-center tip pt-16 pb-16">
        {{ $t(`withdrawal.level.to.reset`) }}
      </li>
    </ul>
    <div class="justify-around bmt-btns p-b-24">
      <van-button
        class="page-res-btn"
        :loading="loading"
        block
        type="info"
        @click="hide"
        >{{ $t("index.editor.psd.modal.cancel.btn") }}</van-button
      >
      <van-button
        class="page-res-btn"
        :loading="loading"
        @click="confirm"
        block
        type="info"
        >{{ $t("index.editor.psd.modal.confirm.btn") }}</van-button
      >
    </div>
  </van-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "WithdrawClearVip",
  data() {
    return {
      loading: false,
      showDialog: false,
    };
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  components: {},
  methods: {
    confirm() {
      this.$emit("confirm");
      this.hide();
    },
    show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
  },
};
</script>
<style scoped lang="less">
.withdraw-clear-vip-dialog {
  //background-color: var(--bg-body);
  background: url("@/assets/img/red/witbg.webp") no-repeat center bottom
    transparent;
  background-size: 100% 100%;
  padding: 10px 20px 20px;
  ::v-deep {
    .bmt-btns {
      .no-bg-btn {
        background-color: transparent;
        border: 1px solid var(--primary);
        background-image: none;
        color: var(--primary);
        margin-right: 10px;
      }
      .button-confirm {
        margin-left: 10px;
      }
    }
    .promotion-cont {
      & > li:nth-child(1) {
        img {
          height: 48px;
          width: 48px;
          object-fit: cover;
          display: block;
        }
      }
      & > li:nth-child(1) {
        img {
          height: 48px;
          width: 48px;
          object-fit: cover;
          display: block;
        }
      }
    }
  }
}
</style>
