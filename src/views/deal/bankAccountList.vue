<template>
  <div class="bank-account-list font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('deal.bankAccountList.473637-0')"
    >
    </AppTopBar>
    <div class="center-center px-16 py-16" v-if="loading">
      <van-loading color="#1989fa" />
    </div>
    <div class="px-16 pb-16" v-else>
      <ul class="pay-name">
        <li class="bank-card align-center font16">
          {{ $t(`withdraw.record.center.show.detail.type.bank.text`) }}
        </li>
        <li class="font16 mb-16">
          <p class="add-card center-center" @click="show = !show">
            <img class="add-img" src="@/assets/img/add-card.webp" alt="" />
            +{{ $t(`bankcard.bankadd.title.text`) }}
          </p>
        </li>
      </ul>
      <ul class="justify-between align-center seeting font16">
        <li>{{ $t(`UserProfile.my.Card`) }}</li>
        <li class="align-center" @click="$refs.DealDialog.show()">
          <i class="el-icon-setting"></i>{{ $t(`deal.buy.957990-4`) }}
        </li>
      </ul>
      <ul
        class="bank align-center bg-blue"
        v-for="(item, idx) in bankList"
        :key="`${idx}-bank`"
      >
        <!-- <li class="icon-box center-center"><img :src="udticon2" alt="" /></li> -->
        <li class="name flex-1 app-ellipsis">
          <p class="app-ellipsis">
            {{ item.accountNo | leftAddr }} **** ****
            {{ item.accountNo | rightAddr }}
          </p>
          <p>
            {{ $t(`backapi.self.creatimer`) }}
            {{ formatDate(item.createdAt, "yyyy-MM-dd") }}
          </p>
        </li>
        <li class="rit app-ellipsis">
          <img src="@/assets/img/edt.webp" @click="editClick" />
          <p class="remove-btns app-ellipsis" @click="changPay(item)">
            {{
              item.payStatus == 1
                ? $t("deal.bankAccountList.649685-0")
                : $t("deal.resale.610054-0")
            }}
          </p>
        </li>
      </ul>
    </div>
    <van-action-sheet v-model="show">
      <div class="py-16">
        <van-form class="register-form column-form" @submit="onSubmit">
          <van-field
            class="res-icon-size chose-verification"
            autocomplete="new-password"
            :label="$t('backapi.self.safe.bill.data.type.text')"
          >
            <template #input>
              <van-dropdown-menu
                class="drop-menu"
                :overlay="false"
                active-color="#222222"
                @change="changeTypeValue"
              >
                <van-dropdown-item
                  v-model.trim="form.typeValue"
                  :options="usdtTypeOptions"
                />
              </van-dropdown-menu>
            </template>
          </van-field>
          <van-field
            class="res-icon-size chose-verification"
            autocomplete="new-password"
            :label="$t('deal.addAccount.760277-1')"
          >
            <template #input>
              <van-dropdown-menu
                class="drop-menu"
                :overlay="false"
                active-color="#222222"
              >
                <van-dropdown-item
                  v-model.trim="form.bankName"
                  :options="banksOptions"
                />
              </van-dropdown-menu>
            </template>
          </van-field>
          <van-field
            class="res-icon-size"
            v-model.trim="form.accountNo"
            :label="$t('deal.addAccount.760277-0')"
            :rules="[
              {
                required: true,
                message: $t('ruls.xxx.please', {
                  name: $t('deal.addAccount.760277-0'),
                }),
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
    </van-action-sheet>
    <DealDialog @refresh="palyerConfig" ref="DealDialog" />
  </div>
</template>

<script>
import userApi from "@/api/user";
import DealDialog from "./components/DealDialog";
export default {
  name: "BankAccountlist",
  data() {
    return {
      usdtTypeOptions: [],
      banksOptions: [],
      form: {
        typeValue: "",
        bankName: "",
        accountNo: "",
      },
      udticon1: require("@/assets/img/udticon1.webp"),
      udticon2: require("@/assets/img/udticon2.webp"),
      udticon3: require("@/assets/img/udticon3.webp"),
      bankList: [],
      payTypeList: [],
      loading: false,
      show: false,
    };
  },
  components: {
    DealDialog,
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
    changeTypeValue() {
      if (this.form.typeValue) {
        for (let i = 0; i < this.usdtTypeOptions.length; i++) {
          const item = this.usdtTypeOptions[i];
          if (item.value == this.form.typeValue) {
            this.form.bankName = item.banksArr[0].value;
            break;
          }
        }
      }
    },
    async getBankList() {
      const [err, res] = await userApi.fbSaleMe();
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
    async palyerConfig() {
      const [err, res] = await userApi.fbInfo();
      if (err) {
        return;
      }
      this.$refs.DealDialog.setNun(res.data);
    },
    editClick() {
      this.$toast(this.$t("deal.userProfile-1"));
    },
    async changPay(item) {
      const obj = {
        id: item.id,
      };
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
      });
      if (item.payStatus == 1) {
        await userApi.soldout(obj);
        item.payStatus = 0;
      } else {
        await userApi.resale(obj);
        item.payStatus = 1;
      }
      this.$toast.clear();
    },
    async fbConfReqApi() {
      const [err, res] = await userApi.palyerConfig();
      if (err) {
        return;
      }
      let obj = [];
      if (res.data.payTypeList.length > 0) {
        res.data.payTypeList.forEach((item) => {
          let bankObj = [];
          for (let i = 0; i < item.banksArr.length; i++) {
            const it = item.banksArr[i];
            bankObj.push({
              value: it,
              text: it,
            });
          }
          obj.push({
            value: item.name,
            text: item.name,
            banksArr: bankObj,
          });
        });
        this.$set(this.form, "typeValue", obj[0].value);
        this.$set(this.form, "bankName", obj[0].banksArr[0].value);
        this.$set(this, "banksOptions", obj[0].banksArr);
      }
      this.$set(this, "usdtTypeOptions", obj);
    },
    async onSubmit() {
      const [err] = await userApi.fbSaleReq({
        type: this.form.typeValue,
        ...this.form,
      });
      if (err) {
        return;
      }
      this.show = false;
      this.form.accountNo = "";
      this.getBankList();
    },
  },
  async created() {
    this.getBankList();
    this.palyerConfig();
    this.fbConfReqApi();
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
  .add-img {
    height: 24px;
    width: 24px;
    object-fit: cover;
    display: block;
    margin-right: 5px;
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
    padding-left: 16px;
    .name {
      & > p:first-child {
        margin-bottom: 8px;
      }
    }
    .rit {
      // width: 100px;
      max-width: 127px;
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
    .remove-btns {
      max-width: 127px;
      padding: 0 13px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 8px;
      background-color: #fff;
      color: var(--color-text);
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
  .pay-name {
    .bank-card {
      height: 48px;
      color: #222;
    }
    .add-card {
      padding: 0 16px;
      height: 48px;
      border-radius: 15px;
      border: solid 1px var(--primary);
      color: var(--primary);
    }
  }
  .seeting {
    height: 60px;
    i {
      font-size: 18px;
      margin-right: 6px;
    }
  }
  ::v-deep {
    .van-dropdown-menu__bar {
      background-color: transparent;
    }
    .van-dropdown-menu__title {
      line-height: 28px;
      //color: #fff;
    }
  }
}
</style>
