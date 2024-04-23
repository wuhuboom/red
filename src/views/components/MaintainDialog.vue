<template>
  <div class="main-tain-dialog">
    <van-dialog
      class="tain-upload-dialog"
      :showConfirmButton="false"
      v-model="showDialog"
      :close-on-click-overlay="false"
    >
      <ul class="upload-cont">
        <li class="center-center">
          <!-- <img src="@/assets/img/notification.png" alt="" /> -->
        </li>
        <li class="center-center tip color-fff">
          {{ $t(`UserProfile.Notification`) }}
        </li>
        <li class="color-primary">{{ msg }}</li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "MaintainDialog",
  data() {
    return {
      showDialog: false,
      loading: false,
      form: {
        payPwd: "",
        payPwdAgain: "",
      },
      showText: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    show() {
      return this.$store.state.showMain.show;
    },
    msg() {
      return this.$store.state.showMain.msg;
    },
  },
  watch: {
    showDialog(val) {
      this.$store.commit("setMainShow", { show: val });
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "setMainShow") {
        this.showDialog = state.showMain.show;
      }
    });
    this.trimr = setInterval(async () => {
      const [err] = await userApi.authSysconfig();
      if (!err && this.showDialog) {
        location.reload();
      }
    }, 1000 * 5);
  },
  beforeDestroy() {
    clearInterval(this.trimr);
  },
};
</script>
<style lang="less">
.main-tain-dialog {
  .tain-upload-dialog {
    padding: 20px 30px 30px;
    background: url("@/assets/img/red/note.webp") no-repeat center bottom
      transparent;
    background-size: 100% 100%;
    .van-hairline--top::after {
      display: none;
    }
    .tip {
      padding: 12px 0;
      font-size: 22px;
      font-weight: bold;
    }
    .upload-cont {
      & > li:nth-child(1) {
        img {
          width: 190px;
          height: 102px;
          object-fit: contain;
          display: block;
        }
      }

      & > li:nth-child(3) {
        font-size: 14px;
        line-height: 1.8;
      }
    }
  }
}
</style>
