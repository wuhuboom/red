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
      <li class="center-center text-center tip pb-16">
        {{
          $t(`Your.current.VIPlevel`, {
            vip: obj.vip,
            num: obj.num,
          })
        }}
      </li>
    </ul>
    <div class="bmt-btns p-b-24">
      <van-button
        class="page-res-btn comfire"
        :loading="loading"
        block
        type="info"
        @click="hide"
        >{{ $t("modal.cancel.text") }}</van-button
      >
      <van-button
        class="page-res-btn cancle"
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
  name: "WithdrawFree",
  data() {
    return {
      loading: false,
      showDialog: false,
    };
  },
  props: {
    obj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  methods: {
    confirm() {
      this.$emit("confirm", true);
      this.hide();
    },
    show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    cancle() {
      this.emit("cancle", false);
      this.hide();
    },
  },
};
</script>
<style scoped lang="less">
.withdraw-clear-vip-dialog {
  background: url("@/assets/img/red/vipicon.png") no-repeat center bottom
    transparent;
  background-size: 100% 100%;
  padding: 112px 20px 20px;
  width: 308px;
  height: 403px;
  ::v-deep {
    .bmt-btns {
      .comfire {
        min-width: 76px !important;
        margin-bottom: 16px !important;
      }
      .cancle {
        background-color: transparent !important;
        border-color: transparent !important;
        color: var(--main);
      }
      .page-res-btn {
        margin: 0 auto;
      }
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
