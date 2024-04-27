<template>
  <div class="user-list-page font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('agency.center.user.center.text')"
    >
    </AppTopBar>
    <div class="px-16 head center-center bg-blue">
      <ul class="list-table center-center app-ellipsis">
        <li class="app-ellipsis">
          {{ $t("group.un.aim.list.total.text") }}: {{ curItem.totalCount }}
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
          <ul class="trade-days active">
            <li>
              {{ $t(`backapi.self.statistics.top.content.playerName.text`) }}
            </li>
            <li>
              {{
                $t("backapi.self.safe.team.motivation.not.list.aim.count.text")
              }}
            </li>
          </ul>
          <div class="cont" v-for="(item, idx) in curItem.results" :key="idx">
            <ul class="align-center list-table app-ellipsis">
              <li class="app-ellipsis">{{ item.playerName }}</li>

              <li class="app-ellipsis">
                {{ item.aimCount }}
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
        pageSize: 30,
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
        level: 1,
        pageNo: pageNo,
        pageSize: this.curItem.pageSize,
      };
      const [err, res] = await userApi.groupUnaimReq(obj);
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
  .trade-days {
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #9da4b4;
    display: flex;
    li {
      width: 50%;
    }
  }
  .head {
    border-bottom: 1px solid #484b4c;
    height: 46px;
  }
  .list-table {
    width: 100%;
    text-align: center;
    li {
      width: 50%;
    }
  }
  .rank {
    width: 12px;
    height: 12px;
    object-fit: cover;
    margin-left: 4px;
  }
  .cont {
    .list-table {
      height: 48px;
    }
  }
  .cont:last-child .list-table {
    border-bottom: none;
  }
}
</style>
