<template>
  <div class="create-merchant-view font14">
    <AppTopBar
      :styleObj="{
        backgroundColor: isScrolled ? '#f8f8f8 !important' : '',
      }"
    />
    <div class="merchant-up flex-column">
      <img class="img-up" src="@/assets/img/merchant-up.webp" alt="" />
      <img class="img-line" src="@/assets/img/merchant-line.webp" alt="" />
    </div>
    <div class="merchant-tip">
      <b>Welcome Settled in</b>
      <p>Earn <span>5%</span> profit on each transaction</p>
    </div>
    <div class="">
      <van-form ref="form" class="merchant-form column-form" @submit="onSubmit">
        <van-field class="chose-verification" label="Card name">
          <template #input>
            <van-dropdown-menu
              class="drop-menu"
              :overlay="false"
              active-color="#222222"
            >
              <van-dropdown-item
                v-model.trim="form.cardType"
                :options="cardList"
              />
            </van-dropdown-menu>
          </template>
          <template #button>
            <img
              class="img-arrow center-center"
              src="@/assets/img/arrow.webp"
              alt=""
            />
          </template>
        </van-field>
        <van-field
          v-model.trim="form.amount"
          label="Card Number"
          type="number"
          name="amount"
        >
        </van-field>
        <van-field
          v-model.trim="form.amount"
          label="Holder name"
          type="number"
          name="amount"
        >
        </van-field>
        <van-field
          v-model.trim="form.amount"
          label="email Address"
          type="number"
          name="amount"
        >
          <template #button>
            <span class="email-fix">{{ emailFix }}</span>
          </template>
        </van-field>
        <van-field
          class="mb-16"
          :label="$t('form.vercode.text')"
          v-model.trim="form.vercode"
          :rules="[
            {
              required: true,
              message: $t('ruls.xxx.please', {
                name: $t('form.vercode.text'),
              }),
            },
          ]"
        >
          <template #button>
            <van-button
              size="small"
              @click="sendCode"
              :disabled="countdown > 0"
              class="code-btn center-center"
              color="#0025fc"
              >{{ $t("deal.chat.921073-7")
              }}{{ countdown ? `(${countdown})` : "" }}</van-button
            >
          </template>
        </van-field>
      </van-form>
    </div>
    <div class="merchant-bottom">
      <p class="notice">
        If you agree to use C2C transactions, it means you accept &nbsp;
        <span>C2C Transaction Legal Disclaimer</span>
      </p>
      <div class="place center-center capitalize">
        <p class="center-center flex-1" @click="vaidForm">Submit Application</p>
      </div>
    </div>
    <!-- 声明书弹窗，进来页面先弹出 -->
    <van-action-sheet v-model="show">
      <div class="state-content flex-column">
        <div class="content-up px-16">
          <strong>Legal Disclaimer for C2C Transactions</strong>
          <p class="mb-16">
            C2C (peer-to-peer) trading refers to transactions conducted directly
            between two users. After buyers and sellers are matched on our
            platform, both parties must undergo real-name authentication to
            verify their identities.
          </p>
          <p class="mb-16">
            You will solely bear the risks associated with using C2C trading
            services and all information, materials, and other content
            (including content from third parties) accessed through or involved
            in such services. The company is only responsible for facilitating
            the digital asset trading process on the platform. Unless required
            by law, all payments are final upon completion. We have no authority
            or obligation to resolve any disputes or claims arising from
            completed payments. The company is also not responsible for any
            losses resulting from or caused by completed payments.
          </p>
          <p class="mb-16">
            Buyers/sellers may directly contact you to verify your identity or
            obtain more information to verify transactions and/or payments.
            Similar communication or information exchange may occur outside the
            platform. Such exchanges between you and buyers/sellers will not be
            controlled or managed by the company. The company will not be liable
            for any losses incurred or caused by such exchanges between you and
            buyers/sellers.
          </p>
          <p class="mb-16">
            Buyers/sellers may directly contact you to verify your identity or
            obtain more information to verify transactions and/or payments.
            Similar communication or information exchange may occur outside the
            platform. Such exchanges between you and buyers/sellers will not be
            controlled or managed by the company. The company will not be liable
            for any losses incurred or caused by such exchanges between you and
            buyers/sellers.
          </p>
        </div>
        <div class="content-bottom">
          <div class="space-between">
            <van-radio-group v-model="checked">
              <van-radio name="1"></van-radio>
            </van-radio-group>
            <p class="notice">
              If you agree to use C2C trading, it means you accept Legal
              Disclaimer for C2C Transactions
            </p>
          </div>
          <div class="place center-center pa-0" @click="show = false">
            <p class="center-center flex-1">Next step</p>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "CreateMerchantView",
  data() {
    return {
      countdown: 0,
      checked: false,
      isScrolled: false,
      show: true,
      emailFix: "@gmail.com",
      form: {
        cardType: "",
        amount: "",
      },
      cardList: [
        {
          text: "Standard Bank Group",
          value: 1,
        },
        {
          text: "Standard Bank Group 22",
          value: 2,
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      console.log("submit");
    },
    sendCode() {
      console.log("sendCode");
    },
    vaidForm() {
      console.log("vaidForm");
    },
  },
  async created() {
    this.$store.commit("setPdTop", false);
  },
};
</script>
<style scoped lang="less">
.create-merchant-view {
  .code-btn {
    min-width: 70px;
    padding: 0 4px;
    height: 32px;
    border-radius: 8px;
    background-color: #0025fc;
  }
  .img-arrow {
    width: 28px;
    height: 28px;
  }
  .email-fix {
    color: #222;
  }
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
  ::v-deep {
    .van-popup--bottom.van-popup--round {
      border-radius: 0;
    }
    .van-cell {
      background-color: transparent;
    }
    .van-field__body {
      padding: 0 18px;
      background-color: #f3f4f7;
      border-color: #f3f4f7;
    }
    .van-dropdown-menu__bar {
      background-color: #f3f4f7;
    }
    .van-cell__title {
      color: #9da4b4;
    }
    .chose-verification {
      .van-field__body {
        // padding: 0;
        border: none;
      }
      .van-dropdown-menu__bar {
        border-radius: 15px;
      }
    }
    .van-field--disabled {
      .van-field__label {
        color: #646566;
      }
    }
  }
  .merchant-up {
    height: 346px;
    background-color: #f8f8f8;
    .img-up {
      width: 275px;
      height: 218px;
      margin-top: 80px;
      margin-left: 42px;
    }
    .img-line {
      width: 100%;
      height: 92px;
      margin-top: -44px;
    }
  }
  .merchant-tip {
    padding: 0 24px;
    b {
      line-height: 29px;
      font-size: 24px;
      color: #061941;
    }
    p {
      margin-top: 9px;
      font-size: 14px;
      color: #707070;
    }
    span {
      color: #02f;
    }
  }
  .merchant-form {
    margin: 16px 0;
  }
  .merchant-bottom {
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
  .place {
    padding: 0 24px 16px;
    width: 100%;
    p {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      height: 56px;
      border-radius: 16px;
      background-color: #02f;
    }
  }
}
</style>
