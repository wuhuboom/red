<template>
  <div class="order-detail-page">
    <AppTopBar
      :styleObj="{
        backgroundColor: '#02f',
      }"
    />
    <!-- status <3 下单中 -->
    <div>
      <!-- 进度条 -->
      <div class="order-step px-16">
        <p class="mb-16">{{ $t("deal.createOrder.354499-23") }}</p>
        <ul class="font12">
          <li class="mt-16">{{ $t("deal.createOrder.354499-24") }}</li>
          <li class="mt-16">{{ $t("deal.createOrder.354499-25") }}</li>
          <li class="mt-16">
            {{ $t("deal.createOrder.354499-26") }}({{
              $t("deal.createOrder.354499-27")
            }})
          </li>
          <li class="mt-16">{{ $t("deal.createOrder.354499-28") }}</li>
        </ul>
      </div>
      <!-- status == 1 已下单，未选择支付方式  -->
      <div class="order-detail-wrap px-16 color222 pb-16">
        <p class="font16 mt-16">{{ $t("deal.createOrder.354499-29") }}</p>
        <ul class="font12 chose">
          <li class="mt-16" v-for="(item, idx) in remakopt" :key="idx">
            <el-radio v-model="radio" :label="idx"></el-radio>
            <span @click="radio = idx">{{ item.label }}</span>
          </li>
        </ul>
        <div class="sumit-section pt-16">
          <van-button
            class="res-van-button button-blue"
            block
            type="info"
            :loading="loading"
            @click="submit"
            native-type="button"
            >{{ $t("modal.cancel.text") }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "CanleOrder",
  data() {
    return {
      radio: 0,
      loading: false,
      remakopt: [
        {
          label: this.$t("deal.createOrder.354499-30"),
          value: this.$t("deal.createOrder.354499-30"),
        },
        {
          label: this.$t("deal.createOrder.354499-31"),
          value: this.$t("deal.createOrder.354499-31"),
        },
        {
          label: this.$t("deal.createOrder.354499-32"),
          value: this.$t("deal.createOrder.354499-32"),
        },
        {
          label: this.$t("deal.createOrder.354499-33"),
          value: this.$t("deal.createOrder.354499-33"),
        },
        {
          label: this.$t("deal.createOrder.354499-34"),
          value: this.$t("deal.createOrder.354499-34"),
        },
        {
          label: this.$t("deal.createOrder.354499-35"),
          value: this.$t("deal.createOrder.354499-35"),
        },
        {
          label: this.$t("deal.createOrder.354499-36"),
          value: this.$t("deal.createOrder.354499-36"),
        },
        {
          label: this.$t("deal.createOrder.354499-37"),
          value: this.$t("deal.createOrder.354499-37"),
        },
        {
          label: this.$t("deal.createOrder.354499-38"),
          value: this.$t("deal.createOrder.354499-38"),
        },
      ],
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      await userApi.fbBuyCancelReq({
        id: this.$route.query.id,
        remark: this.remakopt[this.radio].value,
      });
      this.loading = false;
      this.$toast(this.$t("backapi.self.safe.bill.detail.status.success.text"));
      this.$router.back();
    },
  },
};
</script>
<style scoped lang="less">
.order-detail-page {
  ::v-deep {
    .icon-button {
      color: #fff !important;
    }
    .van-action-sheet__description {
      color: #222;
      font-size: 17px;
      font-weight: bold;
      text-transform: capitalize;
    }
  }

  .content-user-lang {
    & > li {
      height: 52px;
      padding: 0 40px;
      font-size: 16px;
      &.active {
        color: #02f;
      }
    }
  }
  .countdown {
    margin-left: 4px;
  }
  .order-step {
    padding-bottom: 32px;
    background-color: #02f;
    color: #fff;
    & > p {
      font-size: 18px;
    }
  }

  .order-detail-wrap {
    margin-top: -16px;
    padding-top: 12px;
    border-radius: 16px 16px 0 0;
    background: #fff;
  }
  .top-title {
    display: flex;
    align-items: center;
    padding: 8px 0;
    font-size: 16px;
    font-weight: bold;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .info-box {
    margin-bottom: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    border: solid 1px #e6e6e6;
    font-size: 12px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1.8;
      font-size: 12px;
    }
    .amount-text {
      align-items: flex-start;
      b {
        font-size: 20px;
        font-weight: bold;
      }
    }
    span {
      color: #707070;
      text-transform: capitalize;
    }
    p,
    b {
      color: #222;
    }
    .avatar {
      height: 24px;
      width: 24px;
      margin-right: 4px;
      border-radius: 50%;
    }
    ::v-deep {
      .van-icon {
        margin-top: 2px;
        margin-left: 8px;
      }
    }
    .time {
      display: inline-flex;
      height: 40px;
      padding: 0 16px;
      margin-top: 4px;
      color: #02f;
      text-transform: capitalize;
      border-radius: 16px;
      background-color: #edefff;
      img {
        height: 16px;
        width: 16px;
        margin-right: 6px;
      }
    }
  }
  .cancel-btn,
  .confirm-btn {
    width: 163.5px;
    line-height: 48px;
    font-size: 14px;
    text-transform: capitalize;
    text-align: center;
    border-radius: 14px;
  }
  .cancel-btn {
    color: #222;
    background: #fff;
    border: solid 1px #222;
  }
  .confirm-btn {
    color: #fff;
    background: #02f;
  }
  .order-bottom {
    display: flex;
    flex-direction: column;
  }
  .notice {
    margin-bottom: 22px;
    line-height: 21px;
    text-align: center;
    color: #9f9f9f;
    font-size: 13px;
    span {
      color: #222;
      text-decoration: underline;
    }
  }
  .active {
    color: var(--primary);
  }
  .credited {
    padding-top: 81px;
    margin-bottom: 30px;
    color: #fff;
    img {
      width: 93px;
      height: 93px;
      display: block;
      object-fit: cover;
    }
  }
  .credited-money {
    font-weight: bold;
    font-size: 24px;
  }
  .credited-successfully {
    padding-top: 8px;
    font-size: 20px;
  }
  .credited-btn {
    //margin-top: 60px;
  }
  .chose {
    li {
      display: flex;
      align-items: flex-start;
    }
    ::v-deep {
      [role="radio"] {
        margin-right: 6px;
      }
      .el-radio__label {
        display: none;
      }
    }
  }
}
</style>
