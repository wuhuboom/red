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
      <ul class="order-step justify-between center-center">
        <li class="flex-column center-center active">
          <img src="@/assets/img/step1.webp" alt="" />
          <p class="pt-16">{{ $t(`deal.order.535219-0`) }}</p>
        </li>
        <li
          class="flex-column center-center"
          :class="{
            active: orderData.status >= 2,
          }"
        >
          <img :src="orderData.status >= 2 ? line : docline" alt="" />
          <p class="pt-16">{{ $t(`Submitted.Back.Payment`) }}</p>
        </li>
        <li
          class="flex-column center-center"
          :class="{
            active: orderData.status >= 3,
          }"
        >
          <img :src="orderData.status >= 3 ? line : docline" alt="" />
          <p class="pt-16">{{ $t(`modal.confirm.text`) }}</p>
        </li>
      </ul>
      <!-- status == 1 已下单，未选择支付方式  -->
      <div
        class="order-detail-wrap px-16"
        v-if="orderData.status == 1 && orderData.payType == null"
      >
        <div class="top-title">
          <img src="@/assets/img/usdt.webp" alt="" />
          <b class="capitalize">
            {{
              $t("deal.createOrder.354499-3", {
                type: confOpt.currencySymbol || "",
              })
            }}</b
          >
        </div>
        <div class="info-box">
          <ul>
            <li>
              <span>{{ $t("deal.createOrder.354499-4") }}</span>
              <b>{{ orderData.money / $globalNum.val }}</b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-5") }}</span>
              <b>{{ orderData.orderNo }}</b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-6") }}</span>
              <b>{{
                formatDate(orderData.createdAt, "hh:mm:ss yyyy-MM-dd")
              }}</b>
            </li>
          </ul>
        </div>
        <div class="top-title">
          <b class="capitalize">{{ $t("deal.buyDetail.387081-8") }}</b>
        </div>
        <div class="info-box">
          <ul>
            <li>
              <span>{{ $t("deal.buyDetail.387081-9") }}</span>
              <p>{{ orderData.timeout }}{{ $t("deal.buyDetail.387081-10") }}</p>
            </li>
            <li>
              <span>{{ $t("deal.buyDetail.387081-11") }}</span>
              <p class="center-center">
                <img class="avatar" :src="$userPic" alt="" />{{
                  orderData.merName
                }}
                <van-icon name="arrow" class="" />
              </p>
            </li>
          </ul>
          <div class="time align-center" v-if="orderData.timeoutBuyer">
            <img src="@/assets/img/clock.webp" alt="" />
            {{ $t("deal.buyDetail.387081-9") }}
            <Count-down :time="orderData.timeoutBuyer" format="hh:mm:ss">
              <template slot-scope="{ time }">
                <div class="center-center">
                  {{ time }}
                </div>
              </template>
            </Count-down>
          </div>
        </div>
        <div class="order-bottom">
          <!-- <p class="notice">
            If you agree to use C2C transactions, it means you accept &nbsp;
            <span>C2C Transaction Legal Disclaimer</span>
          </p> -->
          <ul class="justify-between mt-16">
            <li class="cancel-btn center-center" @click="goCancle">
              {{ $t("modal.cancel.text") }}
            </li>
            <li class="confirm-btn center-center" @click="selectBtnClick">
              {{ $t(`modal.confirm.text`) }}
            </li>
          </ul>
        </div>
        <!-- 支付方式弹窗 -->
        <van-action-sheet v-model="paymentShow" description="payment method">
          <ul class="content-user-lang">
            <li
              @click="selectPopupClick(idx)"
              class="align-center"
              :class="{ active: selectVal.value === item.value }"
              v-for="(item, idx) in usdtTypeOptions"
              :key="idx"
            >
              {{ item.label }}
            </li>
          </ul>
        </van-action-sheet>
      </div>
      <!-- status == 1 已下单，选择了支付方式  -->
      <div
        class="order-detail-wrap px-16"
        v-if="orderData.status == 1 && orderData.payType != null"
      >
        <div class="top-title">
          <b class="capitalize"> {{ $t("deal.createOrder.354499-8") }}</b>
        </div>
        <div class="info-box">
          <ul>
            <li class="flex-column amount-text">
              <span>{{ $t("rebate.center.list.nav.smount.text") }}</span>
              <b
                >{{ orderData.money / $globalNum.val }}
                <i
                  class="el-icon-document-copy font16"
                  v-clipboard:copy="getCopyValue(orderData)"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>
            <li>
              <span> {{ $t("deal.buyDetail.387081-9") }}</span>
              <b>
                <Count-down :time="orderData.timeoutBuyer" format="hh:mm:ss">
                  <template slot-scope="{ time }">
                    <div class="center-center color-primary">
                      {{ time }}
                    </div>
                  </template>
                </Count-down>
              </b>
            </li>
          </ul>
        </div>

        <div class="top-title">
          <b class="capitalize">{{ $t("Submitted.Payment.Information") }}</b>
        </div>
        <div class="info-box">
          <ul>
            <li>
              <span>{{ $t("deal.createOrder.354499-11") }}</span>
              <b
                >{{ orderData.orderNo
                }}<i
                  class="el-icon-document-copy font16 ml-4"
                  v-clipboard:copy="orderData.orderNo"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-12") }}</span>
              <b
                >{{ orderData.payType.payName
                }}<i
                  class="el-icon-document-copy font16 ml-4"
                  v-clipboard:copy="orderData.payType.payName"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-13") }}</span>
              <b
                >{{ orderData.payType.accountName
                }}<i
                  class="el-icon-document-copy font16 ml-4"
                  v-clipboard:copy="orderData.payType.accountName"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>

            <li>
              <span>{{ $t("deal.chat.921073-5") }}</span>
              <b
                >{{ orderData.payType.accountNo
                }}<i
                  class="el-icon-document-copy font16 ml-4"
                  v-clipboard:copy="orderData.payType.accountNo"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-14") }}</span>
              <b
                >{{ orderData.payType.bankName
                }}<i
                  class="el-icon-document-copy font16 ml-4"
                  v-clipboard:copy="orderData.payType.bankName"
                  v-clipboard:success="handleCopySuccess"
                ></i
              ></b>
            </li>
          </ul>
        </div>
        <div class="order-bottom">
          <!-- <p class="notice">
            If you agree to use C2C transactions, it means you accept &nbsp;
            <span>C2C Transaction Legal Disclaimer</span>
          </p> -->
          <ul class="justify-between mt-16">
            <li class="cancel-btn center-center" @click="goCancle">
              {{ $t("modal.cancel.text") }}
            </li>
            <li class="confirm-btn center-center" @click="fbBuyPayedReqApi">
              {{ $t(`modal.confirm.text`) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- status ==2 已付款  -->
    <div class="order-detail-wrap px-16" v-if="orderData.status == 2">
      <div class="top-title">
        <img src="@/assets/img/usdt.webp" alt="" />
        <b class="capitalize">
          {{
            $t("deal.createOrder.354499-3", {
              type: confOpt.currencySymbol || "",
            })
          }}</b
        >
      </div>
      <div class="info-box">
        <ul>
          <li>
            <span>{{ $t("deal.createOrder.354499-4") }}</span>
            <b>{{ orderData.money / $globalNum.val }}</b>
          </li>
          <li>
            <span>{{ $t("deal.createOrder.354499-5") }}</span>
            <b>{{ orderData.orderNo }}</b>
          </li>
          <li>
            <span>{{ $t("deal.createOrder.354499-6") }}</span>
            <b>{{ formatDate(orderData.createdAt, "hh:mm:ss yyyy-MM-dd") }}</b>
          </li>
        </ul>
      </div>
      <div class="top-title">
        <b class="capitalize">{{ $t("Submitted.Payment.Information") }}</b>
      </div>
      <div class="info-box">
        <ul>
          <li>
            <span>{{ $t("deal.createOrder.354499-11") }}</span>
            <b
              >{{ orderData.orderNo
              }}<i
                class="el-icon-document-copy font16 ml-4"
                v-clipboard:copy="orderData.orderNo"
                v-clipboard:success="handleCopySuccess"
              ></i
            ></b>
          </li>
          <li>
            <span>{{ $t("deal.createOrder.354499-12") }}</span>
            <b
              >{{ orderData.payType.payName
              }}<i
                class="el-icon-document-copy font16 ml-4"
                v-clipboard:copy="orderData.payType.payName"
                v-clipboard:success="handleCopySuccess"
              ></i
            ></b>
          </li>
          <li>
            <span>{{ $t("deal.createOrder.354499-13") }}</span>
            <b
              >{{ orderData.payType.accountName
              }}<i
                class="el-icon-document-copy font16 ml-4"
                v-clipboard:copy="orderData.payType.accountName"
                v-clipboard:success="handleCopySuccess"
              ></i
            ></b>
          </li>

          <li>
            <span>{{ $t("deal.chat.921073-5") }}</span>
            <b
              >{{ orderData.payType.accountNo
              }}<i
                class="el-icon-document-copy font16 ml-4"
                v-clipboard:copy="orderData.payType.accountNo"
                v-clipboard:success="handleCopySuccess"
              ></i
            ></b>
          </li>
          <li>
            <span>{{ $t("deal.createOrder.354499-14") }}</span>
            <b
              >{{ orderData.payType.bankName
              }}<i
                class="el-icon-document-copy font16 ml-4"
                v-clipboard:copy="orderData.payType.bankName"
                v-clipboard:success="handleCopySuccess"
              ></i
            ></b>
          </li>
        </ul>
      </div>
      <div class="top-title center-center justify-between color-primary">
        <b class="capitalize">{{ $t("deal.createOrder.354499-41") }}</b>
        <van-loading class="ml-4" size="24" color="#0022FF" />
      </div>
      <div class="order-bottom">
        <!-- <p class="notice">
            If you agree to use C2C transactions, it means you accept &nbsp;
            <span>C2C Transaction Legal Disclaimer</span>
          </p> -->
        <ul class="justify-between mt-16">
          <li class="cancel-btn center-center flex-1" @click="goServe">
            {{ $t(`service.online.text`) }}
          </li>
        </ul>
      </div>
      <!-- 支付方式弹窗 -->
      <van-action-sheet v-model="paymentShow" description="payment method">
        <ul class="content-user-lang">
          <li
            @click="selectPopupClick(idx)"
            class="align-center"
            :class="{ active: selectVal.value === item.value }"
            v-for="(item, idx) in usdtTypeOptions"
            :key="idx"
          >
            {{ item.label }}
          </li>
        </ul>
      </van-action-sheet>
    </div>
    <!-- status ==3 交易成功  -->
    <div v-if="orderData.status == 3">
      <ul>
        <li class="center-center credited">
          <img src="@/assets/img/credited.png" alt="" />
        </li>
        <li class="center-center credited-money color222">
          {{ orderData.money / $globalNum.val }}
          {{ confOpt.currencySymbol || "" }}
        </li>
        <li class="center-center credited-successfully">
          {{ $t(`Submitted.Successfully.credited`) }}
        </li>
      </ul>
      <div class="px-16 mt-16">
        <p
          @click="$router.push({ name: 'User' })"
          style="width: 100%"
          class="cancel-btn credited-btn center-center"
        >
          {{ $t(`Submitted.Back.Home`) }}
        </p>
      </div>
    </div>
    <!-- status ==4 交易取消  -->
    <!-- status ==5 交易超时 -->
    <div v-if="[5, 4].includes(orderData.status)">
      <ul>
        <li class="center-center credited">
          <img src="@/assets/img/cancellation.png" alt="" />
        </li>
        <li v-if="orderData.remark" class="center-center credited-money">
          {{ orderData.remark }}
        </li>
        <li class="center-center credited-successfully">
          {{
            orderData.status == 4
              ? $t(`deal.createOrderMer.354499-12`)
              : $t("deal.createOrder.354499-22")
          }}
        </li>
      </ul>
      <div class="px-16 mt-16">
        <div class="top-title">
          <img src="@/assets/img/usdt.webp" alt="" />
          <b class="capitalize">
            {{
              $t("deal.createOrder.354499-3", {
                type: confOpt.currencySymbol || "",
              })
            }}</b
          >
        </div>
        <div class="info-box">
          <ul>
            <li>
              <span>{{ $t("deal.createOrder.354499-4") }}</span>
              <b>{{ orderData.money / $globalNum.val }}</b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-5") }}</span>
              <b>{{ orderData.orderNo }}</b>
            </li>
            <li>
              <span>{{ $t("deal.createOrder.354499-6") }}</span>
              <b>{{
                formatDate(orderData.createdAt, "hh:mm:ss yyyy-MM-dd")
              }}</b>
            </li>
          </ul>
        </div>
      </div>
      <div class="px-16 mt-16 pb-16">
        <p
          @click="goServe"
          style="width: 100%"
          class="cancel-btn credited-btn center-center"
        >
          {{ $t(`service.online.text`) }}
        </p>
      </div>
    </div>

    <!-- 点击取消弹窗 -->
  </div>
</template>

<script>
import userApi from "@/api/user";
import userPic from "@/assets/img/user@2x.png";
import line from "@/assets/img/step1.webp";
import docline from "@/assets/img/step2.webp";
export default {
  name: "CreateOrder",
  data() {
    return {
      timerId: null,
      line,
      docline,
      userPic,
      orderData: {},
      id: this.$route.query.id,
      usdtTypeOptions: [],
      selectVal: {},
      confOpt: {},
      paymentShow: false,
      langOptions: [
        { text: "MasterCard", value: "" },
        { text: "American Express", value: "" },
        { text: "VISA", value: "" },
      ],
    };
  },
  methods: {
    goCancle() {
      this.$router.push({ name: "CanleOrder", query: { id: this.id } });
    },
    goServe() {
      this.$store.commit("goServe");
    },
    async fbBuyPayedReqApi() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      const [err] = await userApi.fbBuyPayedReq({ id: this.id });
      this.$toast.clear();
      if (err) return;
      this.$toast(this.$t("backapi.self.safe.bill.detail.status.success.text"));
      this.fbSaleOrderDetailReqApi();
    },
    getCopyValue(orderData) {
      console.log(orderData);
      return `${orderData.money / this.$globalNum.val}`;
    },
    handleCopySuccess() {
      this.$toast.success("");
    },
    async fbBuy1ReqApi() {
      const [err, res] = await userApi.fbBuy1Req({ id: this.id });
      if (err) return;
      let obj = [];
      if (res.data.length > 0) {
        res.data.forEach((item) => {
          obj.push({
            value: item.id,
            label: item.payName,
            ...item,
          });
        });
      }
      this.usdtTypeOptions = obj;
      // this.selectVal = obj[0];
    },
    async fbSaleOrderDetailReqApi() {
      const [err, res] = await userApi.fbSaleOrderDetailReq({ id: this.id });
      if (err) return;
      this.orderData = res.data;
      //this.orderData.status = 3;
      if (this.orderData.status > 2) {
        this.stopPolling();
      }
    },
    startPolling() {
      this.timerId = setInterval(() => {
        this.fbSaleOrderDetailReqApi();
      }, 2000);
    },
    stopPolling() {
      clearInterval(this.timerId);
    },
    async palyerConfig() {
      const [err, res] = await userApi.palyerConfig();
      if (err) return;
      this.confOpt = res.data;
    },
    selectPopupClick(idx) {
      this.selectVal = this.usdtTypeOptions[idx];
      this.paymentShow = false;
      this.selectBtnClick();
    },
    async selectBtnClick() {
      if (!this.selectVal.value) {
        this.paymentShow = true;
        // this.$toast(this.$t("deal.buy.957990-5"));

        return;
      }
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.fbSaleOrderDetailReqApi();

      // < !--status == 5 支付超时-- >
      if (this.orderData.status == 5) {
        this.$toast(this.$t("recharge.record.status.pay.timeout.text"));
        return;
      }
      await this.fbBuy2ReqApi();
      this.$toast.clear();
    },
    async fbBuy2ReqApi() {
      const [err] = await userApi.fbBuy2Req({
        id: this.id,
        payId: this.selectVal.value,
      });
      if (err) return;
      this.fbSaleOrderDetailReqApi();
    },
  },
  async created() {
    // this.$store.commit("setPdTop", false);
    this.fbSaleOrderDetailReqApi();
    this.fbBuy1ReqApi();
    this.palyerConfig();
    this.startPolling();
  },
  beforeDestroy() {
    this.stopPolling();
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
  .credited-money {
    padding: 0 8px;
    text-align: center;
  }
  .countdown {
    margin-left: 4px;
  }
  .order-step {
    padding-bottom: 32px;
    background-color: #02f;
    li {
      position: relative;
      flex: 1;
      opacity: 0.5;
      color: #fff;
      font-size: 16px;
      &::after {
        position: absolute;
        left: 74%;
        top: 21%;
        content: "";
        display: block;
        width: 50%;
        height: 1px;
        background-image: linear-gradient(
          to right,
          #fff 0%,
          #fff 50%,
          transparent 50%
        );
        background-size: 18px 1px;
        background-repeat: repeat-x;
      }
      &.active {
        opacity: 1;
        &::after {
          background-image: none;
          border-bottom: 1px solid #fff;
        }
      }
      &:last-child::after {
        display: none;
      }
      img {
        width: 24px;
        height: 24px;
      }
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
}
</style>
