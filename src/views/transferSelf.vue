<template>
  <div class="address-add font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="`${$t('wallet.index.transfer.text')}( ${$t(
        'wallet.index.for.self.text'
      )})`"
    >
    </AppTopBar>
    <!-- v-if="!dataList.length" -->
    <div class="center-center py-16" v-if="false">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16">
      <van-form class="register-form column-form" @submit="onSubmit">
        <van-field
          :value="mygold"
          disabled
          :label="$t(`wallet.index.balance.text`)"
          :rules="[{ required: true, message: $t('ruls.accout.empty') }]"
        />
        <div class="center-center icon-img py-16">
          <img src="@/assets/img/down@2x.webp" alt="" />
        </div>
        <van-field
          v-model.trim="form.amount"
          placeholder="0.00"
          class="mb-16"
          :label="$t('backapi.self.safe.transfer.money.text')"
          type="number"
          :rules="[
            {
              required: true,
              message: $t('ruls.amount.length'),
            },
          ]"
        >
          <template #button>
            <van-button
              size="small"
              class="code-btn center-center"
              native-type="button"
              @click="sendAll"
              color="#0025fc"
              >{{ $t("match.order.detail.all.text") }}</van-button
            >
          </template>
        </van-field>
        <van-field
          class="mb-16"
          v-model.trim="form.password"
          type="password"
          autocomplete="new-password"
          :label="$t('ruls.pwd2.empty')"
          :rules="[
            {
              required: true,
              message: $t('ruls.pwd2.empty'),
            },
          ]"
        />
        <div class="sumit-section">
          <van-button
            class="res-van-button button-blue"
            block
            type="info"
            :loading="formLoaing"
            native-type="submit"
            >{{ $t("confirm.btn.text") }}</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
const initData = () => {
  return { amount: "", password: "" };
};
export default {
  name: "TransferSelfSubView",
  data() {
    return {
      form: {
        ...initData(),
      },
      formLoaing: false,
      loading: false,
      playerInfo: {},
    };
  },
  computed: {
    mygold() {
      return (
        this.numToFixed(this.playerInfo.money, this.$globalUnit.val) /
        this.$globalNum.val
      );
    },
  },
  methods: {
    sendAll() {
      this.form.amount = this.mygold;
    },
    async onSubmit() {
      let reqParam = {};
      reqParam.money = this.form.amount;
      reqParam.payPwd = this.form.password;
      if (this.form.amount > this.mygold) {
        this.$toast(this.$t("backapi.balanceNotEnough"));
        return;
      }
      if (+this.form.amount <= 0) {
        this.$toast(this.$t("backapi.balanceNotEnough"));
        return;
      }
      this.formLoaing = true;
      const [err, res] = await userApi.safeToBalance(reqParam);
      this.formLoaing = false;
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      if (res.msg) {
        this.$toast(res.msg);
      }
      this.form = { ...initData() };
    },
    async detailSafeInfo() {
      const [err, res] = await userApi.safeInfo();
      if (err) return;
      this.playerInfo = res.data;
    },
  },
  created() {
    this.detailSafeInfo();
  },
};
</script>
<style scoped lang="less">
.address-add {
  min-height: 100vh;
  background-color: #f8f8f8;
  .van-cell {
    padding: 0;
    background-color: transparent;
  }
  .balance {
    span {
      color: #0022ff;
    }
  }
  .icon-img {
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
    }
  }
  ::v-deep {
    .van-field__label {
      color: #9da4b4;
    }
    .van-field__body {
      border-color: #fff;
      background-color: #fff;
      color: #222222;
    }
    .code-btn {
      min-width: 70px;
      padding: 0 4px;
      height: 32px;
      border-radius: 8px;
      background-color: #0025fc;
    }
    .van-field--disabled {
      .van-field__body {
        background-color: transparent;
        border-bottom: 1px solid #fff;
        border-color: transparent;
        border-bottom-color: #d5d5d5;
        border-radius: 0;
      }
      .van-field__control:disabled {
        color: #222222;
        -webkit-text-fill-color: initial;
      }
    }
  }
}
</style>
