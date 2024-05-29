<!-- eslint-disable no-unused-vars -->
<template>
  <div class="invite-friends font14 color-primary">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t(`me.my.qr.code.text`)"
    >
    </AppTopBar>
    <div class="px-16 pb-16">
      <div class="cont">
        <p class="center-center long-text">{{ $t(`ercode.Long.QR`) }}</p>
        <div class="center-center">
          <QrcodeVue :value="link" :size="146" />
        </div>
        <p class="referral">{{ $t(`ercode.referral.code`) }}</p>
        <div
          class="your-code center-center copy-button"
          @click="copy(invitationCode)"
        >
          <span>{{ invitationCode }}</span
          ><i class="iconfont icon-copy color-active"></i>
        </div>
        <p class="referral-link">{{ $t(`ercode.referral.link`) }}</p>
        <div class="hrefs center-center copy-button" @click="copy(link)">
          <span class="href-link flex-1 app-ellipsis">{{ link }}</span
          ><i class="iconfont icon-copy color-active"></i>
        </div>
      </div>
    </div>
    <van-dialog
      class="promotion-upload-dialog"
      :showConfirmButton="false"
      v-model="showDialog"
      :close-on-click-overlay="true"
    >
      <ul class="promotion-cont font14">
        <li></li>
        <li class="center-center tip color-active font16 p-t-24 p-b-24">
          {{ $t(`WARNING`) }}!
        </li>
        <li class="center-center">
          <img src="@/assets/img/red/share1.png" alt="" />
        </li>
        <li class="center-center tip colorfff p-t-24">
          {{ $t(`WARNING.desc`) }}
        </li>
      </ul>
      <div class="center-center p-b-24 p-t-24">
        <van-button
          class="page-res-btn"
          block
          type="info"
          @click="showDialog = false"
          >{{ $t("modal.confirm.text") }}</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>

<script>
import ClipboardJS from "clipboard";
import QrcodeVue from "qrcode.vue";
export default {
  name: "AebateView",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    invitationCode() {
      return this.$store.state.user.invitationCode;
    },
    link() {
      return `${window.location.protocol}//${window.location.host}/#/login/register?code=${this.invitationCode}`;
    },
  },
  methods: {
    copy(t) {
      const clipboard = new ClipboardJS(".copy-button", {
        text: () => t,
      });
      clipboard.on("success", () => {
        this.$toast(this.$t(`copy.success.text`));
        // if (+window.shareDialogConfig === 1) {

        // }
        this.showDialog = true;
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$toast("error");
        clipboard.destroy();
      });
    },
  },
};
</script>
<style scoped lang="less">
.invite-friends {
  text-align: center;
  .cont {
    padding: 24px 12px 45px;
  }
  .long-text {
    padding: 0 30px 20px;
  }
  .referral {
    padding: 20px 0 12px;
  }
  .your-code {
    width: 219px;
    height: 55px;
    border-radius: 16px;
    font-size: 20px;
    font-weight: bold;
    margin: 0 auto;
    color: var(--active);
  }
  .icon-copy {
    margin-left: 8px;
  }
  .referral-link {
    padding: 15px 0 13px;
  }
  .hrefs {
    width: 318px;
    height: 55px;
    border-radius: 16px;
    padding: 0 16px;
    border: solid 1px var(--main);
    color: var(--color-fff);
  }
  .href-link {
    font-size: 16px;
  }
  .promotion-upload-dialog {
    background: url("@/assets/img/sharebg.png") no-repeat center center;
    background-size: 100% 100%;
    color: #474747;
    padding: 10px 20px 20px;
    ::v-deep {
      .van-dialog__content {
        //padding: 0;
      }
    }
    .promotion-cont {
      & > li:nth-child(1) {
        margin-bottom: 10px;
        img {
          height: 48px;
          width: 48px;
          object-fit: cover;
          display: block;
        }
      }
      & > li {
        margin-bottom: 12px;
      }
      & > li:nth-child(1) {
        img {
          height: 48px;
          width: 48px;
          object-fit: cover;
          display: block;
        }
      }
      & > li:nth-child(3) {
        img {
          height: 40px;
          object-fit: cover;
          display: block;
        }
      }
    }
  }
}
</style>
