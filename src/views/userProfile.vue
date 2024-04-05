<template>
  <div class="user-profile font14">
    <AppTopBar
      :styleObj="{
        backgroundColor: isScrolled ? '#0025fc !important' : '',
      }"
      :titleClass="['app-top-black-title']"
      topBarTitle="C2C"
    >
      <template #right>
        <ul class="head-icon center-center">
          <li
            v-if="userInfo.business"
            @click="$router.push({ name: `DealBankAccountList` })"
          >
            <img src="@/assets/img/userprofile1.webp" alt="" />
          </li>
          <li @click="goServe">
            <img src="@/assets/img/serveicon.webp" alt="" />
          </li>
          <li>
            <van-badge
              @click.native="$router.push({ name: 'DealMessage' })"
              :dot="fbMsg.hasMsg > 0"
            >
              <img src="@/assets/img/userprofile3.webp" alt="" />
            </van-badge>
          </li>
        </ul>
      </template>
    </AppTopBar>
    <div class="card font12">
      <div class="card-head">
        <img
          class="order-enter"
          @click="$router.push({ name: 'DealOrder' })"
          src="@/assets/img/profile-order.webp"
          alt=""
        />
        <div class="align-center">
          <div>
            <img class="use-img" :src="$userPic" alt="" />
          </div>
          <ul class="user">
            <li class="font16 align-center">
              {{ userInfo.merName || userInfo.username }}
              <img
                class="vip-img"
                src="@/assets/img/userprofile-vip.png"
                alt=""
                v-if="userInfo.status == 1"
              />
              <p
                class="font12 align-center status-bar"
                v-if="![undefined, 1].includes(userInfo.status)"
              >
                <img
                  class="status-icon"
                  :src="userInfo.status == 1 ? statusIcon1 : statusIcon2"
                  alt=""
                />
                {{ statusOpt[userInfo.status] }}
              </p>
            </li>
            <li class="conrtys">
              <span>{{ conrtys.name }}</span
              ><span class="">|</span
              ><span>{{ $t(`UserProfile.timeofentry`) }}：{{ date }}</span>
            </li>
          </ul>
        </div>
        <ul class="card-rate" v-if="!userInfo.business">
          <li class="align-center">
            <img src="@/assets/img/right.webp" alt="" />
            {{ $t(`UserProfile.Id.Card`) }}
          </li>
          <li class="align-center">
            <img src="@/assets/img/right.webp" alt="" />{{
              $t(`UserProfile.Sms`)
            }}
          </li>
          <li class="align-center">
            <img src="@/assets/img/right.webp" alt="" />
            {{ $t(`form.email.text`) }}
          </li>
        </ul>
        <ul class="success-rate" v-else>
          <li>
            {{ $t("deal.userProfile.430671-0") }}{{ userInfo.cumulativeCount }}
          </li>
          <li>
            {{ $t("deal.userProfile.430671-1") }}{{ getCumulativeCountRate }}%
          </li>
          <li>
            {{ $t("deal.userProfile.430671-7") }}{{ userInfo.todayCount }}
          </li>
        </ul>
        <ul class="player-money" v-if="!userInfo.business">
          <li class="align-center">
            <p>{{ $t("deal_total_trades_last_30_days") }}：</p>
            <p>{{ userInfo.order || 0 }}</p>
          </li>
          <li class="align-center">
            <p>{{ $t("deal_trade_rate_last_30_days") }}：</p>
            <p>{{ getCumulativeCountRate }}%</p>
          </li>
        </ul>
        <ul v-else class="current-balance mt-set flex-wrap justify-between">
          <li>
            <p>{{ $t("deal.userProfile.430671-2") }}</p>
            <p>{{ userInfo.balance / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-3") }}</p>
            <p>{{ userInfo.cumulativeSale / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-4") }}</p>
            <p>{{ userInfo.cumulativeGain / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-5") }}</p>
            <p>{{ userInfo.todayBalance / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-6") }}</p>
            <p>{{ userInfo.todayGain / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-5") }}</p>
            <p>{{ userInfo.todayBalance / $globalNum.val }}</p>
          </li>
          <li>
            <p>{{ $t("deal.userProfile.430671-6") }}</p>
            <p>{{ userInfo.todayGain / $globalNum.val }}</p>
          </li>
        </ul>
      </div>
      <ul class="card-btns justify-between align-center">
        <li
          @click="$router.push({ name: 'CreateMerchant' })"
          class="align-center"
          v-if="!userInfo.business"
        >
          <img class="dollar-icon" src="@/assets/img/settledin.webp" alt="" />
          <p>{{ $t(`UserProfile.Settled.in`) }}</p>
        </li>
        <li class="align-center" v-else @click="rechargeDialog = true">
          <img class="dollar-icon" src="@/assets/img/dollar.png" alt="" />
          <p>{{ $t(`deal_deposit`) }}</p>
        </li>
        <li>
          <el-dropdown class="align-center" trigger="click">
            <span class="el-dropdown-link align-center drop-box">
              <i class="txt app-ellipsis">{{ choseDoc.text }}</i>
              <img class="drop" src="@/assets/img/drop.png" alt="" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="chose(item)"
                v-for="(item, idx) in typeOptions"
                :key="idx"
                >{{ item.text }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <div class="user-content">
      <div class="content-top justify-between align-center row">
        <p class="col">Name/payment</p>
        <p class="col">{{ $t("deal_limit_range_2061_206400_cny") }}</p>
        <p class="col">{{ $t("deal_trade_volume") }}</p>
      </div>
      <van-list
        v-model="loading"
        :finished="curItem.hasNext === false"
        finished-text=""
        loading-text="loading"
        @load="onLoad"
      >
        <div v-if="nothing">
          <NoData />
        </div>
        <ul class="user-list-wrap">
          <li v-for="(item, idx) in curItem.results" :key="idx">
            <div class="user-info justify-between align-center row">
              <div class="display-flex col align-center">
                <img class="user-avatar" :src="$userPic" alt="" />
                <p class="user-name app-ellipsis">{{ item.merName }}</p>
              </div>
              <p class="col">{{ item.minBalance }}- {{ item.maxBalance }}</p>
              <p class="col">{{ item.cumulativeCount }}</p>
            </div>
            <div class="justify-between align-center row">
              <p class="payment-method col" style="width: 60%">
                {{ $t("deal_payment_method") }}:&nbsp;&nbsp;{{ item.payTypes }}
              </p>
              <div
                class="col center-center"
                @click="
                  $router.push({
                    name: 'BuyDetail',
                    query: {
                      id: item.id,
                      payTypes: item.payTypes,
                    },
                  })
                "
              >
                <p class="buy-btn capitalize">{{ $t("deal_buy_in") }}</p>
              </div>
            </div>
          </li>
        </ul>
      </van-list>
    </div>
    <!-- 缴纳保证金弹窗 -->
    <van-dialog
      class="recharge-upload-dialog"
      :showConfirmButton="false"
      v-model="rechargeDialog"
      :close-on-click-overlay="true"
    >
      <div class="recharge-cont font14">
        <div class="center-center">
          <img src="@/assets/img/recharge.webp" alt="" />
        </div>
        <p>{{ $t("deal.userProfile.430671-10") }}</p>
        <van-form ref="form" class="recharge-form">
          <van-field
            v-model.trim="rechargeForm.amount"
            type="number"
            placeholder="0.00"
            name="amount"
            :rules="[
              {
                required: true,
                message: $t('ruls.xxx.empty', {
                  type: $t(`recharge.amount.text`),
                }),
              },
              {
                validator: validate,
                message: `${$t('deal.buyDetail.387081-5')} ${
                  rechargePreObj.minMax
                }`,
              },
            ]"
          >
          </van-field>
        </van-form>
        <div class="space-between rate-info">
          <span>{{ $t("deal.userProfile.430671-11") }}</span>
          <span>{{ rechargePreObj.rate }}</span>
        </div>
        <div class="space-between rate-info">
          <span>{{ $t("deal.userProfile.430671-12") }}</span>
          <span>{{ ngnToUsdtMoney }}</span>
        </div>
        <p class="tips" v-html="$t('deal.userProfile.430671-13')"></p>
        <ul class="justify-between mt-16">
          <li class="cancel-btn center-center" @click="rechargeDialog = false">
            {{ $t("index.editor.psd.modal.cancel.btn") }}
          </li>
          <li class="confirm-btn center-center" @click="fbRechargeReqApi">
            {{ $t("index.editor.psd.modal.confirm.btn") }}
          </li>
        </ul>
      </div>
    </van-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import dayjs from "dayjs";
import userApi from "@/api/user";
import statusIcon1 from "@/assets/img/profile-status1.png";
import statusIcon2 from "@/assets/img/profile-status2.webp";
import i18n from "@/locale";
import to from "await-to-js";
export default {
  name: "UserProfile",
  data() {
    return {
      rechargeDialog: false,
      rechargePreObj: {},
      unholdObj: {},
      merId: this.$route.query.merId,
      rechargeForm: {
        amount: "",
      },
      fbMsg: {
        hasMsg: 0,
      },
      isScrolled: false,
      statusIcon1,
      statusIcon2,
      statusOpt: {
        0: this.$t("deal.userProfile.980335-2"),
        1: this.$t("deal.userProfile.980335-3"),
        2: this.$t("deal.userProfile.980335-4"),
      },
      area: [
        {
          code: 1,
          name: "USA",
        },
        {
          code: 20,
          name: "Egypt",
        },
        {
          code: 91,
          name: "India",
        },
        {
          code: 92,
          name: "Pakistan",
        },
        {
          code: 62,
          name: "Indonesia",
        },
        {
          code: 964,
          name: "Iraq",
        },
        {
          code: 998,
          name: "Uzbekistan",
        },
        {
          code: 213,
          name: "Algeria",
        },
      ],
      //商家用户信息
      userInfo: {},
      typeValue: 0,
      typeOptions: [
        { text: i18n.t("match.all.text"), value: 0 },
        { text: i18n.t("deal.buy.957990-0"), value: 1 },
        { text: i18n.t("deal.buy.957990-1"), value: 2 },
        { text: i18n.t("deal.buy.957990-2"), value: 3 },
      ],
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
      loading: false,
    };
  },
  computed: {
    amount() {
      return this.rechargeForm.amount;
    },
    ngnToUsdtMoney() {
      if (this.amount) {
        let returnAmountStr = "";
        let reAmountStr = (this.amount * this.rechargePreObj.rate).toString();
        reAmountStr = reAmountStr.split(".");
        let leftAmount = reAmountStr[0];
        if (reAmountStr[1]) {
          let saveToStr = reAmountStr[1].substring(0, 2);
          returnAmountStr = leftAmount + "." + saveToStr;
        } else {
          returnAmountStr = reAmountStr[0];
        }
        return returnAmountStr;
      } else {
        return 0.0;
      }
    },
    conrtys() {
      let doc = this.area.find((item) => {
        return item.code === this.playerInfo.areaCode;
      });
      if (!doc) {
        return this.area[0];
      }
      return doc;
    },
    playerInfo() {
      return {
        business: false,
        ...this.$store.state.user,
      };
    },
    choseDoc() {
      return this.typeOptions.find((item) => item.value === this.typeValue);
    },
    nothing() {
      return this.curItem.results.length === 0 && !this.loading;
    },
    getCumulativeCountRate() {
      let countRate = 0;
      console.log("userInfo", this.userInfo);
      if (this.userInfo.orderTotal && this.userInfo.orderTotal !== 0) {
        countRate = (this.userInfo.order / this.userInfo.orderTotal) * 100;
      }
      return countRate.toFixed(2);
    },
    date() {
      return this.userInfo.createdAt
        ? dayjs(this.userInfo.createdAt || this.userInfo.updatedAt).format(
            "YYYY/MM/DD"
          )
        : "";
    },
    minMax() {
      return this.rechargePreObj.minMax.split("-").map((v) => +v);
    },
  },
  methods: {
    validate(value) {
      if (value < this.minMax[0]) {
        return false;
      }
      if (value > this.minMax[1]) {
        return false;
      }
      return true;
    },
    async fbRechargePreReqApi() {
      const [err, res] = await userApi.fbRechargePreReq();
      if (err) return;
      this.rechargePreObj = res.data;
      this.unholdObj = {
        unhold: res.data.unhold,
        unholdMsg: res.data.unholdMsg,
      };
    },
    async fbRechargeReqApi() {
      const [accountErr] = await to(this.$refs.form.validate("amount"));
      if (accountErr) return;
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      const [err, res] = await userApi.fbRechargeReq({
        money: this.amount,
        payId: this.rechargePreObj.id,
      });
      if (err) {
        if (err.data && err.data[0]) {
          this.$toast(this.$t(`backapi.${err.data[0].msgKey}`));
        }
        return;
      }
      this.rechargeDialog = false;
      this.$toast.clear();
      if (res.data.UrlAddress) {
        window.location.href = res.data.UrlAddress;
      }
    },
    goServe() {
      this.$store.commit("goServe");
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 20;
    },
    async chose(item) {
      this.typeValue = item.value;
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      await this.onLoad(1);
    },
    loginOut() {
      this.$store.commit("loginOut");
      this.$router.replace({ name: "Login" });
    },
    async getInfo() {
      const [err, res] = await userApi.fbInfo();
      if (err) {
        this.userInfo = this.playerInfo;
        return;
      }
      this.userInfo = {
        business: true,
        ...res.data,
      };
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      if (this.typeValue !== 0) {
        obj.sort = this.typeValue;
      }
      const [err, res] = await userApi.saleList(obj);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }
      let list =
        res.data.pageNo == 1
          ? res.data.results
          : this.curItem.results.concat(res.data.results);
      this.curItem = {
        ...res.data,
        results: list,
        pageNo: res.data.pageNo + 1,
      };
      this.$toast.clear();
    },
    async fbMsgHasReq() {
      const [err, res] = await userApi.fbMsgHasReq();
      if (err) return;
      this.fbMsg = res.data;
    },
  },
  created() {
    this.$store.commit("setPdTop", false);
    this.getInfo();
    this.fbMsgHasReq();
    this.fbRechargePreReqApi();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
<style scoped lang="less">
.user-profile {
  padding-top: @navHeight;
  background-image: linear-gradient(to bottom, #3181ff, #02f);
  .conrtys {
    & > span:nth-child(2) {
      margin: 0 4px;
    }
  }
  .head-icon {
    li {
      margin-right: 16px;
    }
    img {
      display: block;
      height: 31px;
      width: 31px;
    }
  }
  .card {
    padding: 12px 12px;
  }
  .status-bar {
    img {
      display: block;
      width: 13px;
      height: 13px;
      margin: 0 4px;
    }
  }
  .drop-box {
    color: #fff;
    margin-top: -4px;
  }
  .txt {
    padding: 0 10px;
    max-width: 130px;
  }
  .drop {
    height: 30px;
    width: 30px;
    display: block;
    object-fit: cover;
  }
  .card-head {
    padding: 16px 12px 12px;
    color: #fff;
    border-radius: 19px;
    overflow: hidden;
    width: 351px;
    margin: auto;
    height: 254px;
    position: relative;
    background: url("@/assets/img/pribg.webp") no-repeat center center;
    background-size: contain;
  }
  .vip-img {
    width: 25px;
    height: 25px;
    object-fit: cover;
  }
  .use-img {
    height: 62px;
    width: 62px;
    display: block;
    object-fit: cover;
  }
  .user {
    padding-left: 12px;
    padding-right: 31px;
    & > li:nth-child(1) {
      margin-bottom: 8px;
    }
  }
  .order-enter {
    height: 31px;
    width: 31px;
    display: block;
    position: absolute;
    top: 12px;
    right: 12px;
  }
  .card-rate {
    margin-top: 12px;
    height: 51px;
    display: flex;
    & > li {
      margin-right: 20px;
    }
    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
      display: block;
      object-fit: cover;
    }
  }
  .success-rate {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    height: 51px;
    li {
      width: 50%;
      padding-bottom: 10px;
    }
    li:nth-child(even) {
      text-align: right;
    }
  }
  .mt-set {
    margin-top: 16px;
  }
  .current-balance {
    & > li {
      width: 33.33%;
      padding-bottom: 8px;
    }
  }
  ::v-deep {
    .appp-top-bar {
      background-color: transparent !important;
      color: #fff !important;
      .icon-button,
      .appp-top-bar-title {
        color: #fff !important;
      }
    }
  }
  .card-btns {
    margin-top: 12px;
    li {
      height: 36px;
      line-height: 36px;
      padding: 3px;
      font-size: 14px;
      color: #fff;
      border: solid 1px rgba(255, 255, 255, 0.4);
      border-radius: 18px;
      background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.4),
        rgba(255, 255, 255, 0)
      );
    }
    .dollar-icon {
      height: 27px;
      width: 27px;
      display: block;
      margin: 0 8px;
    }
    p {
      margin-right: 20px;
    }
    .drop-wrap {
      position: relative;
      span {
        display: block;
        position: absolute;
        right: 0;
        top: -1px;
        z-index: 1;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: solid 1px rgba(255, 255, 255, 0.4);
      }
    }
    .drop-menu {
      width: 162px;
    }
    ::v-deep {
      .van-dropdown-menu__bar {
        height: inherit;
        background-color: unset;
      }
      .van-dropdown-menu__title {
        line-height: 28px;
        color: #fff;
      }
    }
  }
  .user-content {
    padding: 20px 0;
    background: #fff;
    border-radius: 12px 12px 0 0;
    .content-top {
      padding: 0 13px;
      font-size: 12px;
      line-height: 26px;
      color: #fff;
      text-transform: capitalize;
      background-color: #02f;
    }
    .row {
      & > .col {
        width: 33.33%;
      }
      & > .col:nth-child(2),
      & > .col:nth-child(3) {
        text-align: center;
      }
    }
    .p1 {
      width: 30px;
      text-align: center;
    }
    .p2 {
      width: 120px;
      margin: 0 16px;
      text-align: center;
    }
    .p3 {
      width: 68px;
      text-align: center;
    }
    .user-list-wrap {
      padding: 0 12px;
      li {
        padding-top: 14px;
        padding-bottom: 6px;
        font-size: 12px;
        border-bottom: 1px solid #f5f5f5;
      }
    }
    .user-info {
      margin-bottom: 8px;
      .p2 {
        color: #3dae23;
      }
    }
    .user-avatar {
      height: 30px;
      width: 30px;
      display: block;
      margin: 0 8px;
      object-fit: cover;
      border-radius: 13px;
    }
    .user-name {
      //width: 78px;
      margin: 0 8px;
      color: #000;
    }
    .payment-method {
      padding: 0 8px;
    }
    .buy-btn {
      line-height: 24px;
      width: 52px;
      padding: 0 4px;
      border-radius: 8px;
      color: #fff;
      background-color: #02f;
    }
  }
  .player-money {
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .recharge-upload-dialog {
    padding: 18px;
    padding-top: 12px;
    .recharge-cont {
      img {
        width: 85px;
        height: 69px;
        margin-bottom: 12px;
      }
      p {
        text-align: center;
        color: #222;
      }
      .rate-info {
        margin-bottom: 14px;
        span {
          &:first-child {
            font-size: 13px;
            color: #474747;
          }
          &:last-child {
            font-size: 15px;
            color: #222;
          }
        }
      }
      .tips {
        font-size: 12px;
        color: #707070;
        text-align: left;
      }
      .cancel-btn,
      .confirm-btn {
        width: 110px;
        line-height: 40px;
        font-size: 14px;
        text-transform: capitalize;
        text-align: center;
        border-radius: 16px;
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
    }
    ::v-deep {
      .recharge-form {
        margin: 10px 0;
        .van-cell {
          padding: 0 16px;
          border-radius: 5px;
          font-size: 25px;
          background-color: #f3f4f7;
        }
        .van-field__control {
          text-align: center;
          color: #a2a2a2;
          line-height: 42px;
        }
      }
    }
  }
}
</style>
