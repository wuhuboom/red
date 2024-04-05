<template>
  <van-dialog
    class="withdraw-clear-vip-dialog"
    :showConfirmButton="false"
    v-model="showDialog"
    :close-on-click-overlay="true"
  >
    <ul class="promotion-cont font14">
      <li class="center-center">
        <img src="@/assets/img/shared.png" alt="" />
      </li>
      <li class="center-center tip pt-16 pb-16">
        {{ $t(`withdrawal.level.to.reset`) }}
      </li>
    </ul>
    <div class="d-flex bmt-btns">
      <van-button
        class="res-van-button no-bg-btn"
        :loading="loading"
        block
        type="info"
        @click="hide"
        >{{ $t("index.editor.psd.modal.cancel.btn") }}</van-button
      >
      <van-button
        class="res-van-button button-confirm button-blue"
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
  background-image: linear-gradient(to bottom, #c6cdff, #fff 22%);
  color: #474747;
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
