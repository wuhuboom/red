<template>
  <div class="buy-detail-page font14">
    <AppTopBar
      :styleObj="{
        backgroundColor: '',
      }"
    />
    <div class="detail-up flex-column"></div>
    <div class="saler-wrap">
      <div class="saler-info flex-column center-center">
        <img class="avatar" :src="$userPic" alt="" />
        <b class="saler-name capitalize font18">{{ merInfo.merName }}</b>
        <p class="saler-rate">
          {{ $t("deal.buyDetail.387081-9") }}： <span>{{ orderTimeout }}</span
          >{{ $t("deal.buyDetail.387081-10") }}
        </p>
      </div>
    </div>
    <div class="px-16">
      <van-form ref="form" class="saler-form" @submit="onSubmit">
        <van-field
          v-model.trim="form.amount"
          type="number"
          name="amount"
          :rules="[
            {
              required: true,
              message: $t('deal.buyDetail.387081-13'),
            },
            {
              validator: validateMax,
              message: $t('backapi.payMoneyTooMinOrMax'),
            },
            {
              validator: validateMin,
              message: $t('backapi.payMoneyTooMinOrMax'),
            },
          ]"
        >
          <template #left-icon>
            <van-button
              size="small"
              class="code-btn center-center font16"
              native-type="button"
              @click="form.amount = merInfo.maxBalance"
              >{{ $t("deal.buyDetail.387081-4") }}</van-button
            >
          </template>
        </van-field>
      </van-form>
      <ul class="justify-between range">
        <li>
          {{ $t("deal.buyDetail.387081-5") }}: <br />
          <b>{{ merInfo.minBalance }}-{{ merInfo.maxBalance }}</b>
        </li>
        <li>
          {{ $t("merchant.balance") }}:<br />
          <b>{{ merInfo.balance / $globalNum.val }}</b>
        </li>
      </ul>
    </div>
    <div class="flex-1 detail-bottom">
      <!-- <p class="notice">
        If you agree to use C2C transactions, it means you accept &nbsp;
        <span>C2C Transaction Legal Disclaimer</span>
      </p> -->
      <div class="place center-center max-width750 uppercase">
        <p class="center-center flex-1" @click="vaidForm">
          {{ $t("deal.buyDetail.387081-12") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import to from "await-to-js";
import userApi from "@/api/user";
import userPic from "@/assets/img/user@2x.png";
export default {
  name: "BankAccountlist",
  data() {
    return {
      userPic,
      form: {
        amount: "",
      },
      id: this.$route.query.id,
      merInfo: {},
      confOpt: {},
      orderTimeout: "",
    };
  },
  methods: {
    open() {},
    async vaidForm() {
      const [err] = await to(this.$refs.form.validate("amount"));
      console.log(err);
      if (err) return;
      this.onSubmit();
    },
    async onSubmit() {
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      const [err, res] = await userApi.fbBuyReq({
        id: this.id,
        money: this.form.amount,
      });
      this.$toast.clear();
      if (err) {
        const errData = err.data;
        if (err.code == 103) {
          if (errData.length > 0) {
            const msg = errData[0].msgKey;
            this.$toast(this.$t(`backapi.${msg}`));
            if (msg == "hasUnFinishOrder") {
              this.goOrder(errData[0].data.id);
            }
          }
        }
        return;
      }
      this.goOrder(res.data.id);
    },
    goOrder(id) {
      this.$router.push({
        name: "createOrder",
        query: { id },
      });
    },
    validateMax(value) {
      return Number(value) <= Number(this.merInfo.maxBalance);
    },
    validateMin(value) {
      return Number(value) >= Number(this.merInfo.minBalance);
    },
    async fbInfoSalerReqApi() {
      const [err, res] = await userApi.fbInfoSalerReq({ id: this.id });
      if (err) return;
      this.merInfo = res.data;
    },
    async fbConfReqApi() {
      const [err, res] = await userApi.palyerConfig();
      if (err) return;
      this.orderTimeout = res.data.orderTimeout;
      this.confOpt = res.data;
    },
  },
  async created() {
    this.$store.commit("setPdTop", false);
    this.fbInfoSalerReqApi();
    this.fbConfReqApi();
  },
};
</script>
<style scoped lang="less">
.buy-detail-page {
  //padding-bottom: 84px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .detail-up {
    height: 214px;
    background: url("@/assets/img/detailupbg@2x.png") no-repeat;
    background-size: cover;
  }
  ::v-deep {
    .icon-button {
      color: #fff !important;
    }
  }
  .detail-bottom {
    display: flex;
    align-items: flex-end;
  }
  .place {
    padding: 0 24px 16px;
    width: 100%;
    p {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      height: 52px;
      border-radius: 20px;
      background-color: #02f;
    }
  }
  .saler-wrap {
    margin-top: -60px;
    color: #222;
    .saler-info {
      text-align: center;
      .avatar {
        height: 104px;
        width: 104px;
        display: block;
        margin-bottom: 10px;
        object-fit: cover;
        border-radius: 50%;
      }
      .saler-rate {
        margin: 8px 0 14px;
        font-size: 14px;
        text-transform: capitalize;
        font-weight: bold;
        span {
          color: #02f;
        }
      }
    }
  }
  ::v-deep {
    .saler-form {
      .van-cell {
        border: 1px solid var(--primary);
        border-radius: 8px;
        font-size: 24px;
        // height: 60px;
        // line-height: 40px;
      }
      .van-field__control {
        text-align: right;
        color: #02f;
        font-weight: bold;
      }
    }
    .van-field__left-icon {
      display: flex;
      align-items: center;
      [type="button"] {
        min-width: 51.1px;
        padding: 0 4px;
        height: 25.5px;
        border-radius: 12.8px;
        background-color: #eaecff;
        color: var(--primary);
      }
    }
  }
  .range {
    margin-top: 12px;
    line-height: 16px;
    color: #707070;
    li:last-child {
      // padding-right: 28px;
      text-align: right;
    }
    b {
      color: #222;
    }
  }
  .notice {
    margin-bottom: 22px;
    line-height: 21px;
    text-align: center;
    color: #9f9f9f;
    span {
      color: #222;
      text-decoration: underline;
    }
  }
}
</style>
