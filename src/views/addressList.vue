<template>
  <div class="address-list font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      :topBarTitle="$t('Manage.Address')"
    >
    </AppTopBar>
    <!-- !dataList.length -->
    <div class="center-center py-16" v-if="false">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16 adr-cont">
      <ul class="bank-trc d-flex justify-between align-center">
        <li class="no-grow no-shrink">
          <p class="pic">
            <img src="" alt="" />
          </p>
        </li>
        <li class="flex-1 app-ellipsis text">
          <p class="app-ellipsis">Standard Bank Group Standard Bank Group</p>
          <p class="app-ellipsis font12">
            1545 5656 5656 5658 Standard Bank Group
          </p>
        </li>
        <li class="no-grow no-shrink"><van-icon name="delete-o" /></li>
      </ul>
      <ul class="no-data">
        <li class="center-center">
          <img class="card-none" src="@/assets/img/notcard.webp" alt="" />
        </li>
        <li class="center-center">{{ $t("Address.not.cards") }}</li>
      </ul>
      <ul class="btns-btm px-16 max-width750">
        <li>
          <van-button
            @click="$router.push({ name: 'AddressAdd' })"
            class="res-van-button button-blue"
            block
            type="info"
            >{{ $t("Address.Add.Card") }}</van-button
          >
        </li>
        <li>
          <van-button
            @click="$router.push({ name: 'AddressAdd' })"
            class="res-van-button button-blue"
            block
            type="info"
            >{{ $t("Address.virtual.wallet") }}</van-button
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "WithdrawView",
  data() {
    return {
      head: ["level", i18n.t(`new.Add.betting`), i18n.t(`new.Add.rebate`)],
      list: [
        "Vip1",
        "7day",
        "1%",
        "Vip2",
        "10day",
        "2%",
        "Vip3",
        "15day",
        "3%",
      ],
      loading: false,
      dataList: "",
    };
  },
  computed: {
    vipLevel() {
      return this.$store.state.user.vipLevel;
    },
    createdAt() {
      return this.$store.state.user.createdAt;
    },
    balanceMoneyNum() {
      return this.$store.state.user.balance;
    },
    frozenBet() {
      return this.$store.state.user.frozenBet;
    },
    calculateDaysFromTimestamp() {
      // 获取当前时间的时间戳（单位：毫秒）
      const currentTime = Date.now();

      // 计算给定时间戳距离当前时间的毫秒数差值
      const timeDiff = currentTime - this.createdAt;

      // // 将毫秒数差值转换为天数
      // const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      // 将毫秒数差值转换为天数，并向上取整
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      return daysDiff;
    },
  },
  methods: {
    getProgress() {
      if (!Array.isArray(this.dataList)) return 0;
      const nextVip = this.dataList.find((item) => {
        if (item.level == this.vipLevel + 1) {
          return true;
        } else {
          return false;
        }
      });
      if (nextVip) {
        return this.numToFixed(
          ((this.balanceMoneyNum / this.$globalNum.val +
            this.frozenBet / this.$globalNum.val) /
            nextVip.balance) *
            100,
          this.$globalUnit.val
        );
      }
      return 100;
    },
    async homeVip() {
      const [err, res] = await userApi.homeVip();
      if (err) return;
      this.dataList = res.data;
    },
  },
  created() {
    this.homeVip();
  },
};
</script>
<style scoped lang="less">
.address-list {
  min-height: 100vh;
  background-color: #f8f8f8;
  @head-height: 108px;
  padding-bottom: @head-height;
  font-size: 14px;
  .bank-trc {
    margin: 0 16px 16px;
    background-color: #fff;
    padding: 12px 20px 12px 16px;
    .van-icon-delete-o {
      font-size: 18px;
      margin-left: 4px;
    }
    .pic {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      border-radius: 48px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .text {
      color: #222;
      & > p:nth-child(1) {
        margin-bottom: 8px;
        font-size: 16px;
      }
    }
  }
  .btns-btm {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: @head-height;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .no-data {
    .card-none {
      width: 220px;
      height: 168px;
      object-fit: cover;
    }
    & > :nth-child(2) {
      margin-top: 23px;
      color: #9a9a9a;
    }
  }
}
</style>
