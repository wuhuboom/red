<template>
  <div class="agency-page font14">
    <AppTopBar
      :titleClass="['user.financial.records']"
      :topBarTitle="$t('user.financial.records')"
    >
    </AppTopBar>
    <ul class="tabs-list px-16 align-center">
      <li
        @click="$router.replace({ name: item.link })"
        :class="{
          active: $router.currentRoute.name == item.link || item.active,
        }"
        class="align-center"
        v-for="(item, idx) in tablist"
        :key="idx"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="filter-nav mx-16">
      <ul class="tabs-filter align-center">
        <li
          @click="changFilter(item)"
          :class="{ active: filterTab == item.value }"
          class="align-center"
          v-for="(item, idx) in tabs"
          :key="idx"
        >
          <p>{{ item.name || item.label }}</p>
        </li>
      </ul>
    </div>
    <div class="pb-16">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
import i18n from "@/locale";
export default {
  name: "RecordsLayout",
  data() {
    return {
      loading: false,
      curTab: 1,
      tablist: [
        {
          name: i18n.t("deal.recharge.354498-0"),
          value: 1,
          link: "FinancialPecords",
        },
        {
          name: i18n.t("home.index.withdraw.text"),
          link: "WithdrawHistory",
          value: 2,
        },
        {
          name: i18n.t("wallet.index.balance.text"),
          link: "BalanceDetails",
          value: 3,
        },
      ],
    };
  },
  props: {
    title: {
      type: String,
      default: i18n.t("fuc.rebate.center"),
    },
    tabs: {
      type: Array,
      default: () => [
        {
          name: i18n.t("match.records.today.text"),
          value: 1,
        },
        {
          name: i18n.t("match.records.yes.text"),
          value: 2,
        },
        {
          name: i18n.t("match.records.nearly7.text"),
          value: 3,
        },
        {
          name: i18n.t("match.records.nearly10.text"),
          value: 4,
        },
        {
          name: i18n.t("match.records.nearly30.text"),
          value: 5,
        },
      ],
    },
    filterTab: {
      type: Number,
      default: 4,
    },
  },
  methods: {
    back() {
      this.$router.push({ name: "User" });
    },
    changFilter(item) {
      this.$emit("changFilter", item.value);
    },
  },
};
</script>
<style scoped lang="less">
.agency-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  .tabs-list {
    background-color: #fff;
    color: #939598;
    & > li {
      margin-right: 40px;
      height: 45px;
      position: relative;
    }
    & > li:last-child {
      margin-right: 0;
    }
    .active {
      color: #135ef2;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        border-bottom: 2px solid #135ef2;
        display: block;
        width: 100%;
      }
    }
  }
  .filter-nav {
    overflow-x: auto;
  }
  .tabs-filter {
    height: 56px;
    white-space: nowrap;
    & > li {
      padding: 0 12px;
      height: 28px;
    }
    .active {
      border-radius: 14px;
      background-color: #135ef2;
      color: #fff;
    }
  }
}
</style>
