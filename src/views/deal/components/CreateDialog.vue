<template>
  <!-- 声明书弹窗，进来页面先弹出 -->
  <van-action-sheet v-model="showDialog">
    <div class="state-content flex-column">
      <div class="content-up px-16">
        <strong>{{ $t("deal.createMerchant.354499-0") }}</strong>
        <p class="mb-16">
          C2C({{ $t("deal.createMerchant.354499-1") }}){{
            $t("deal.createMerchant.354499-2")
          }}({{ $t("deal.createMerchant.354499-3") }}){{
            $t("deal.createMerchant.354499-4")
          }}
        </p>
        <p class="mb-16">
          {{ $t("deal.createMerchant.354499-5") }}
          {{ $t("deal.createMerchant.354499-6") }}({{
            $t("deal.createMerchant.354499-7")
          }}){{ $t("deal.createMerchant.354499-8") }}
        </p>
        <p class="mb-16">
          {{ $t("deal.createMerchant.354499-9") }}
        </p>
        <p class="mb-16">
          {{ $t("deal.createMerchant.354499-10") }}({{
            $t("deal.createMerchant.354499-11")
          }}){{ $t("deal.createMerchant.354499-12") }}
        </p>
      </div>
      <div class="content-bottom">
        <div class="space-between">
          <el-checkbox v-model="checked"></el-checkbox>
          <p class="notice" @click="checked = !checked">
            {{ $t("deal.createMerchant.354499-13") }}
            {{ $t("deal.createMerchant.354499-14")
            }}{{ $t("deal.createMerchant.354499-15") }}
          </p>
        </div>
        <div class="place center-center pa-0">
          <van-button
            class="res-van-button button-blue"
            :loading="loading"
            :disabled="!checked"
            @click="suceess"
            block
            type="info"
            native-type="button"
            >{{ $t("deal.createMerchantRes.729665-2") }}</van-button
          >
          <!-- <p class="center-center flex-1">Next step</p> -->
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "DealDialog",
  data() {
    return {
      checked: false,
      loading: false,
      showDialog: false,
      form: {
        bmin: "",
        bmax: "",
      },
    };
  },
  methods: {
    suceess() {
      this.hide();
      this.$emit("suceess");
    },
    validateMax(value) {
      if (value <= this.form.bmin) {
        return false;
      } else {
        return true;
      }
    },
    async fbSaleMerLimitrReqApi() {
      this.loading = true;
      const [err] = await userApi.fbSaleMerLimitrReq(this.form);
      this.loading = false;
      if (err) return;
      this.$toast.success();
      this.showDialog = false;
      this.$emit("refresh");
    },
    setNun(obj) {
      //maxBalance:3 minBalance:1
      //  Object.assign(this.form, obj);
      this.form.bmin = obj.minBalance;
      this.form.bmax = obj.maxBalance;
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
<style lang="less" scoped>
.state-content {
  .content-up {
    max-height: 58vh;
    overflow: scroll;
    padding-top: 10px;
    background-color: #f8f8f8;
    strong {
      display: block;
      margin-bottom: 14px;
      font-size: 24px;
      text-transform: uppercase;
    }
    p {
      line-height: 16px;
      font-size: 12px;
      color: #707070;
    }
  }
  .content-bottom {
    padding: 18px 20px 18px;
    .notice {
      margin-left: 7px;
      line-height: 20px;
      font-size: 13px;
      color: #222;
    }
    .place {
      margin: 12px 4px 0;
    }
  }
}
</style>
