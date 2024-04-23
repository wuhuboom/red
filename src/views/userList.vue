<template>
  <div class="user-list-page font12 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('agency.center.user.center.text')"
    >
    </AppTopBar>
    <HistoryNav
      :type="1"
      :skip1="{
        name: 'Agency',
        text: $t('DATE.CENTER.LEVEL1-3'),
      }"
      :skip2="{
        name: 'UserList',
        text: $t('agency.center.user.center.text'),
      }"
    />
    <div class="m-l-16 m-r-16">
      <van-form ref="form" class="defind-form" @submit="changTab">
        <van-field
          :placeholder="$t(`form.account.text`)"
          v-model.trim="username"
        />
      </van-form>
    </div>
    <ul class="drop-list justify-between align-center m-b-12 m-l-16 m-r-16">
      <li>
        <el-select v-model="tabCurrent" @change="changTab">
          <el-option
            v-for="item in dropList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </li>
      <li class="page-res-btn center-center" @click="changTab">
        {{ $t("backapi.self.bank.search.text") }}
      </li>
    </ul>
    <div class="m-l-16 m-r-16 head align-center bg-blue">
      <ul class="align-center list-table app-ellipsis">
        <li class="app-ellipsis">{{ $t(`form.account.text`) }}</li>
        <li class="app-ellipsis">{{ $t(`vip.level`) }}</li>
        <li class="flex-1 app-ellipsis center-center">
          {{ $t(`user.list.last.text`) }}
          <!-- <img class="rank" src="@/assets/img/rank.webp" alt="" /> -->
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
            class="m-l-16 m-r-16 cont"
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
import HistoryNav from "@/views/components/HistoryNav.vue";
import userApi from "@/api/user";
export default {
  name: "UserListView",
  components: {
    HistoryNav,
  },
  data() {
    return {
      loading: false,
      tabCurrent: 1,
      username: "",
      dropList: [
        {
          label: this.$t("backapi.self.statistics.top.content.sub.level1.text"),
          value: 1,
        },
        {
          label: this.$t("backapi.self.statistics.top.content.sub.level2.text"),
          value: 2,
        },
        {
          label: this.$t("backapi.self.statistics.top.content.sub.level3.text"),
          value: 3,
        },
      ],
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
    changTab() {
      this.onLoad(1);
    },
    async onLoad(num) {
      const pageNo = !isNaN(num) ? num : this.curItem.pageNo;
      const obj = {
        pageNo: pageNo,
        level: this.tabCurrent,
        pageSize: this.curItem.pageSize,
      };
      if (this.username) {
        obj.username = this.username;
      }
      const [err, res] = await userApi.subPlayersReq(obj);
      this.loading = false;
      if (err) {
        if (err.code == 409) {
          this.$toast(this.$t("backapi.self.alert.fast.access.tip.text"));
        }
        this.curItem.hasNext = false;
        return;
      }
      let list =
        pageNo === 1
          ? res.data.results
          : this.curItem.results.concat(res.data.results);
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
  .drop-list {
    height: 32px;
    border-bottom: 1px solid #484b4c;
    .search {
      min-width: 74px;
      height: 18px;
      border-radius: 8px;
      background-color: var(--primary);
      color: #fff;
    }
  }
  .head {
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
