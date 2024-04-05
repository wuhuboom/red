<template>
  <van-dialog
    v-model="showDialog"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
    class="deal-dialog-out"
  >
    <div class="deal-dialog">
      <van-form
        class="register-form column-form px-16 py-16"
        @submit="fbSaleMerLimitrReqApi"
      >
        <van-field
          class="res-icon-size"
          v-model.trim="form.bmin"
          :label="$t('deal.addAccount.905393-0')"
          type="number"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.empty', {
                type: $t('deal.addAccount.905393-0'),
              }),
            },
          ]"
        />
        <van-field
          class="res-icon-size"
          v-model.trim="form.bmax"
          :label="$t('deal.addAccount.905393-1')"
          type="number"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.empty', {
                type: $t('deal.addAccount.905393-1'),
              }),
            },
            {
              validator: validateMax,
              message: $t('deal.addAccount.288178-1'),
            },
          ]"
        />

        <div class="sumit-section pt-16 px-16">
          <van-button
            class="res-van-button button-blue"
            :loading="loading"
            block
            type="info"
            native-type="submit"
            >{{ $t("modal.confirm.text") }}</van-button
          >
        </div>
      </van-form>
    </div>
  </van-dialog>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "DealDialog",
  data() {
    return {
      loading: false,
      showDialog: false,
      form: {
        bmin: "",
        bmax: "",
      },
    };
  },
  methods: {
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
.deal-dialog-out {
  border-radius: 20px;
}
</style>
