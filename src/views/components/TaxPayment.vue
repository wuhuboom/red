<template>
  <van-dialog
    class="tax-payment-dialog p-l-12 p-r-12 p-b-40"
    :showConfirmButton="false"
    v-model="showDialog"
    :close-on-click-overlay="false"
  >
    <div class="tax-payment">
      <p class="title center-center">{{ $t("Tax.Payment") }}</p>
      <ul>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`wallet.index.balance.text`) }}</p>
          <p>{{ money1 }}</p>
        </li>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`backapi.self.already.money.text`) }}</p>
          <p>{{ money3 }}</p>
        </li>
        <li class="justify-between align-center p-t-16">
          <p class="color-pink">{{ $t(`backapi.self.need.money.text`) }}</p>
          <p
            v-clipboard:copy="getCopyValue()"
            v-clipboard:success="handleCopySuccess"
          >
            {{ moneyCeil }}
            <i class="el-icon-document-copy copy-button active font16 ml-4"></i>
          </p>
        </li>
      </ul>
      <div class="p-t-16 p-b-16 msg text-center">{{ obj.msg }}</div>
      <ul class="align-center desc">
        <li class="m-r-8">
          <img src="@/assets/img/red/group-338@2x.webp" alt="" />
        </li>
        <li>{{ $t(`backapi.self.all.alert.desc`) }}</li>
      </ul>
      <ul class="text-center">
        <li class="color-pink m-t-16 m-b-8">
          {{ $t(`backapi.self.already.money.time.text`) }}
        </li>
        <li class="color-fff">
          <van-count-down :time="obj.time" format="DD D HH H mm min ss sec" />
        </li>
        <li class="center-center m-t-20">
          <van-button
            class="page-res-btn"
            block
            type="info"
            @click.native="
              $router.push({ path: '/pages/wallet/onlineRecharge' })
            "
            native-type="button"
            >{{ $t("Pay.Taxes") }}</van-button
          >
        </li>
      </ul>
    </div>
  </van-dialog>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "TaxPayment",
  data() {
    return {
      showDialog: false,
      obj: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    money1() {
      // this.money1 = options.datas.data.balance / MONEYNUM
      // this.money2 = options.datas.data.needMoney / MONEYNUM
      // this.moneyCeil = Math.ceil(this.money2)
      // this.money3 = options.datas.data.money / MONEYNUM
      // let time1 = options.datas.data.time / 1000
      // let time2 = options.datas.data.time
      let txt =
        this.numToFixed(this.obj.balance, this.$globalUnit.val) /
        this.$globalNum.val;
      return parseInt(txt);
    },
    money3() {
      let txt =
        this.numToFixed(this.obj.money, this.$globalUnit.val) /
        this.$globalNum.val;
      return parseInt(txt);
    },
    moneyCeil() {
      return Math.ceil(this.money2);
    },
    money2() {
      return (
        this.numToFixed(this.obj.needMoney, this.$globalUnit.val) /
        this.$globalNum.val
      );
    },
  },
  methods: {
    getCopyValue() {
      return `${this.moneyCeil}`;
    },
    handleCopySuccess() {
      this.$toast(this.$t(`copy.success.text`));
    },
    async fbConf() {
      const [err] = await userApi.fbConf();
      if (!err) {
        this.showDialog = false;
        return;
      }
      if (err && err.code === 411) {
        this.obj = err.data;
        this.showDialog = true;
      }
    },
  },
  created() {
    this.fbConf();
    this.trimr = setInterval(() => {
      userApi.fbConf();
    }, 1000 * 5);
  },
  beforeDestroy() {
    this.trimr && clearInterval(this.trimr);
  },
};
</script>
<style lang="less">
.van-dialog.tax-payment-dialog {
  background: url("@/assets/img/red/group-339@2x.webp") no-repeat center center;
  background-color: transparent;
  background-size: 100% 100%;
  font-size: 14px;
  .msg {
    line-height: 1.5;
  }
  .color-pink {
    color: #ef7367;
  }
  .title {
    height: 74px;
    border-bottom: solid 1px #484b4c;
  }
  .desc {
    img {
      display: block;
      width: 52px;
      height: 40px;
    }
  }
  .van-count-down {
    color: #fff;
  }
}
</style>
