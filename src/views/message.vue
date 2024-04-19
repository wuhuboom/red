<template>
  <div class="message-page color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('fuc.message.center')"
    >
    </AppTopBar>
    <div class="center-center py-16" v-if="!noticeList">
      <van-Loading color="#1989fa" />
    </div>
    <div v-else class="px-16 py-16">
      <ul class="msg-list" v-for="(item, index) in noticeList" :key="index">
        <li class="">{{ item.title }}</li>
        <li class="cont">{{ item.content }}</li>
        <li class="time font12">
          {{ formatDate(item.createdAt, "yyyy-MM-dd hh:mm:ss") }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  name: "MessageView",
  data() {
    return {
      noticeList: null,
    };
  },
  methods: {
    async getMsgList() {
      const params = {
        lang: this.$store.state.lang,
      };
      const [err, res] = await userApi.notice(params);
      if (err) return;
      this.noticeList = res.data;
    },
  },
  created() {
    this.getMsgList();
  },
};
</script>
<style scoped lang="less">
.message-page {
  .msg-list {
    margin-bottom: 4px;
    padding: 20px 16px 16px;
    font-size: 14px;
    border-bottom: solid 1px #484b4c;
    .cont,
    .time {
      color: #fff;
    }
  }
  .cont {
    margin: 8px 0;
  }
}
</style>
