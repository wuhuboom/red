<template>
  <div class="bank-account-list font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('security.bank.card.text')"
    >
    </AppTopBar>
    <div class="center-center px-16 py-16" v-if="loading">
      <van-loading color="#1989fa" />
    </div>
    <div class="px-16 py-16" v-else>
      <ul
        class="bank align-center"
        v-for="(item, idx) in usdtList"
        :key="`${idx}-usdt`"
      >
        <li class="icon-box center-center"><img :src="udticon1" alt="" /></li>
        <li class="name flex-1 app-ellipsis">
          <p class="app-ellipsis">
            {{ item.addr | usdt_left_addr }} **** ****
            {{ item.addr | usdt_right_addr }}
          </p>
          <p>{{ item.protocol }}</p>
        </li>
        <li class="rit">
          <img
            src="@/assets/img/edt.webp"
            alt=""
            @click="
              $router.push({ name: 'AddressUsdt', query: { id: item.id } })
            "
          />
          <p>{{ formatDate(item.createdAt, "yyyy-MM-dd") }}</p>
        </li>
      </ul>
      <ul
        class="bank align-center bg-yellow"
        v-for="(item, idx) in bankList"
        :key="`${idx}-bank`"
      >
        <li class="icon-box center-center"><img :src="udticon2" alt="" /></li>
        <li class="name flex-1 app-ellipsis">
          <p class="app-ellipsis">
            {{ item.cardNumber | leftAddr }} **** ****
            {{ item.cardNumber | rightAddr }}
          </p>
          <p>{{ item.cardName }}</p>
        </li>
        <li class="rit">
          <img
            src="@/assets/img/edt.webp"
            @click="
              $router.push({ name: 'AddBankCard', query: { id: item.id } })
            "
          />
          <p>{{ formatDate(item.createdAt, "yyyy-MM-dd") }}</p>
        </li>
      </ul>
      <ul
        class="bank align-center bg-blue"
        v-for="(item, idx) in wallwtList"
        :key="`${idx}-wallet`"
      >
        <li class="icon-box center-center"><img :src="udticon3" alt="" /></li>
        <li class="name flex-1 app-ellipsis">
          <p class="app-ellipsis">
            {{ item.address | leftAddr }} **** ****
            {{ item.address | rightAddr }}
          </p>
          <p>{{ item.type }}{{ $t("wallet.list.wallet.text") }}</p>
        </li>
        <li class="rit">
          <img
            src="@/assets/img/edt.webp"
            @click="
              $router.push({ name: 'AddressWallet', query: { id: item.id } })
            "
          />
          <p>{{ formatDate(item.createdAt, "yyyy-MM-dd") }}</p>
        </li>
      </ul>
      <div class="types-list">
        <p
          class="bank-types"
          v-if="!(usdtList.length && bankList.length && wallwtList.length)"
        >
          {{ $t("bank.types") }}
        </p>
        <ul
          class="add-list align-center"
          v-if="!usdtList.length && listWay.find((item) => item.type === 2)"
          @click="$router.push({ name: 'AddressUsdt' })"
        >
          <li>
            <img src="@/assets/img/addbank3.webp" alt="" />
          </li>
          <li>+{{ $t("user.Add.usdt.Address") }}</li>
        </ul>
        <ul
          class="add-list align-center"
          v-if="!bankList.length && listWay.find((item) => item.type === 1)"
          @click="$router.push({ name: 'AddBankCard' })"
        >
          <li>
            <img src="@/assets/img/addbank2.webp" alt="" />
          </li>
          <li>+{{ $t("user.new.bank") }}</li>
        </ul>
        <ul
          class="add-list align-center"
          v-if="!wallwtList.length && listWay.find((item) => item.type === 4)"
          @click="$router.push({ name: 'AddressWallet' })"
        >
          <li>
            <img src="@/assets/img/addbank1.webp" alt="" />
          </li>
          <li>+{{ $t("user.Add.Wallet") }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "BankAccountlist",
  data() {
    return {
      udticon1: require("@/assets/img/udticon1.webp"),
      udticon2: require("@/assets/img/udticon2.webp"),
      udticon3: require("@/assets/img/udticon3.webp"),
      usdtList: [],
      bankList: [],
      wallwtList: [],
      listWay: [],
      loading: false,
    };
  },
  filters: {
    leftAddr(value) {
      return value.substr(0, 4);
    },
    rightAddr(value) {
      return value.substr(-3);
    },
    usdt_left_addr(value) {
      return value.substr(0, 5);
    },
    usdt_right_addr(value) {
      return value.substr(-4);
    },
  },
  methods: {
    async getEwalletData() {
      const [err, res] = await userApi.walletInfo();
      if (err) return;
      if (res.data && !res.data.length) {
        // this.$router.push({ name: "AddressWallet" });
        return;
      }
      this.wallwtList = res.data;
    },
    async getBankList() {
      const [err, res] = await userApi.bankCardinfo();
      if (err) {
        return;
      }
      if (res.data) {
        if (Array.isArray(res.data)) {
          this.bankList = res.data;
        } else {
          this.bankList = [res.data];
        }
      }
    },
    async getUsdtList() {
      const [err, res] = await userApi.usdtListReq();
      if (err) {
        return;
      }
      this.usdtList = res.data;
    },
  },
  async created() {
    this.getUsdtList();
    this.getBankList();
    this.getEwalletData();
    this.loading = true;
    const [err, res] = await userApi.withdrawalPre();
    this.loading = false;
    if (err) {
      return;
    }
    this.listWay = res.data;
  },
};
</script>
<style scoped lang="less">
.bank-account-list {
  min-height: 100vh;
  background-color: #f8f8f8;
  .bank-types {
    font-size: 16px;
    font-weight: bold;
    padding: 16px 0;
    color: #222;
  }
  .bank {
    height: 80px;
    border-radius: 15px;
    border: solid 1px #f5f5f5;
    margin-bottom: 8px;
    background: url("@/assets/img/bankbg.webp") right center no-repeat #52b173;
    background-size: auto 100%;
    color: #fff;
    padding-right: 16px;
    .name {
      & > p:first-child {
        margin-bottom: 8px;
      }
    }
    .rit {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      img {
        width: 24px;
        height: 24px;
        display: block;
        margin-bottom: 4px;
      }
    }
    .icon-box {
      width: 74px;
      img {
        width: 44px;
        height: 44px;
        object-fit: cover;
      }
    }
  }
  .add-list {
    height: 48px;
    border-radius: 15px;
    border: solid 1px #f5f5f5;
    background-color: #fff;
    margin-bottom: 4px;
    & > li:first-child {
      padding: 0 8px 0 16px;
    }
    img {
      width: 22px;
      display: block;
      height: 22px;
      object-fit: cover;
    }
  }
  .bg-yellow {
    background-color: #f79e1b;
  }
  .bg-blue {
    background-color: #0022ff;
  }
}
</style>
