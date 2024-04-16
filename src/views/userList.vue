<template>
  <div class="user-list-page font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('agency.center.user.center.text')"
    >
    </AppTopBar>
    <HistoryNav
      :skip1="{
        name: 'Agency',
        text: $t('DATE.CENTER.LEVEL1-3'),
      }"
      :skip2="{
        name: 'UserList',
        text: $t('agency.center.user.center.text'),
      }"
    />
    <div class="px-16 head align-center bg-blue">
      <ul class="align-center list-table app-ellipsis">
        <li class="app-ellipsis">{{ $t(`form.account.text`) }}</li>
        <li class="app-ellipsis">{{ $t(`vip.level`) }}</li>
        <li class="flex-1 app-ellipsis center-center">
          {{ $t(`user.list.last.text`) }}
          <img class="rank" src="@/assets/img/rank.webp" alt="" />
        </li>
      </ul>
    </div>

    <div>
      <van-list
        v-model="loading"
        :finished="curItem.hasNext === false"
        finished-text=""
        loading-text="loading"
        @load="onLoad"
      >
        <NoData v-if="notthing" />
        <div class="cont" v-else>
          <div
            class="mx-16 cont"
            v-for="(item, idx) in curItem.results"
            :key="idx"
          >
            <ul class="align-center list-table app-ellipsis">
              <li class="app-ellipsis">{{ item.username }}</li>
              <li class="app-ellipsis">LEVEL{{ item.vipRank }}</li>
              <li class="flex-1 app-ellipsis">
                {{
                  item.theNewLoginTime == 0
                    ? "--"
                    : formatDate(item.theNewLoginTime, "yyyy-MM-dd hh:mm:ss")
                }}
              </li>
            </ul>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "UserListView",
  data() {
    return {
      loading: false,
      curItem: {
        hasNext: true,
        pageNo: 1,
        pageSize: 10,
        results: [],
        totalCount: null,
        totalPage: null,
      },
    };
  },
  computed: {
    notthing() {
      return this.curItem.totalCount === 0 && !this.loading;
    },
  },
  methods: {
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      const [err, res] = await userApi.subPlayersReq(obj);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }
      let list = this.curItem.results.concat(res.data.results);
      // if (list.length === 0) {
      //   list = [
      //     {
      //       username: 154545,
      //       vipRank: 1,
      //       theNewLoginTime: new Date().getTime(),
      //     },
      //     {
      //       username: 154545,
      //       vipRank: 1,
      //       theNewLoginTime: new Date().getTime(),
      //     },
      //   ];
      // }
      this.curItem = {
        ...res.data,
        results: list,
        pageNo: res.data.pageNo + 1,
      };
    },
  },
};
</script>
<style scoped lang="less">
.user-list-page {
  .head {
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    text-transform: uppercase;
    height: 46px;
  }
  .list-table {
    width: 100%;
    text-align: center;
    li {
      padding: 0 2px;
      width: 27%;
    }
    & > li:nth-child(3) {
      width: 46%;
    }

    // & > li:nth-child(1) {
    //   width: 108px;
    // }
    // & > li:nth-child(2) {
    //   width: 90px;
    // }
  }
  .bg-blue {
    background-color: #135ef2;
    color: #fff;
  }
  .rank {
    width: 12px;
    height: 12px;
    object-fit: cover;
    margin-left: 4px;
  }
  .cont {
    background-color: #fff;
    .list-table {
      padding: 0 8px;
      border-bottom: 1px solid #efefef;
      height: 48px;
      // & > li:nth-child(1) {
      //   width: 100px;
      // }
      // & > li:nth-child(2) {
      //   width: 70px;
      // }
    }
  }
  .cont:last-child .list-table {
    border-bottom: none;
  }
}
</style>
