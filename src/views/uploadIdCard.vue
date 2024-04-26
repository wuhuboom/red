<template>
  <div class="uploadId-card-page font14">
    <AppTopBar
      :titleClass="['app-top-black-title']"
      class="app-top-bar-black"
      :topBarTitle="$t('KYC.Verification')"
    >
    </AppTopBar>
    <div class="px-16 py-16">
      <ul>
        <li class="center-center title">{{ $t("KYC.National.ID") }}</li>
        <li class="center-center desc font12">{{ $t("KYC.side.camera") }}</li>
      </ul>
      <div class="center-center img-font">
        <van-uploader
          :max-size="5 * 1024 * 1024"
          @oversize="oversizeImg"
          v-model="fontList"
          :max-count="1"
        >
          <img class="uploader-img" src="@/assets/img/kyc1.webp" alt="" />
        </van-uploader>
      </div>
      <p class="desc font12 center-center img-back">
        {{ $t("KYC.back.camera") }}
      </p>
      <div class="center-center img-font">
        <van-uploader
          @oversize="oversizeImg"
          accept="image/*"
          :max-size="5 * 1024 * 1024"
          v-model="backList"
          :max-count="1"
        >
          <img class="uploader-img" src="@/assets/img/kyc2.webp" alt="" />
        </van-uploader>
      </div>
      <p class="desc font12 center-center img-back" v-if="!this.UploadIdCard">
        {{ $t("KYC.selfie.video") }}
      </p>
      <div class="center-center img-font" v-if="!this.UploadIdCard">
        <van-uploader
          @oversize="oversizeVideo"
          accept="video/*"
          v-model="videoList"
          :max-size="10 * 1024 * 1024"
          :max-count="1"
        >
          <img class="uploader-img" src="@/assets/img/kyc3.webp" alt="" />
        </van-uploader>
      </div>
      <div class="upload-btm center-center">
        <van-button
          @click="submit"
          class="page-res-btn"
          :loading="loading"
          block
          type="info"
          >{{ $t("confirm.btn.text") }}</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import userApi from "@/api/user";
export default {
  name: "UploadIdCardView",
  data() {
    return {
      loading: false,
      fontList: [],
      backList: [],
      videoList: [],
    };
  },
  computed: {
    UploadIdCard() {
      return this.$route.name == "UploadIdCard";
    },
  },
  methods: {
    oversizeImg() {
      this.$toast(
        this.$t("ruls.xxx.please", {
          name: "5M",
        })
      );
    },
    oversizeVideo() {
      this.$toast(
        this.$t("ruls.xxx.please", {
          name: "10M",
        })
      );
    },
    async submit() {
      if (this.fontList.length === 0) {
        this.$toast(this.$t("KYC.side.camera"));
        return;
      }
      if (this.backList.length === 0) {
        this.$toast(this.$t("KYC.back.camera"));
        return;
      }
      if (!this.UploadIdCard && this.videoList.length === 0) {
        this.$toast(this.$t("KYC.selfie.video"));
        return;
      }
      const obj = {
        file1: this.fontList[0].content.replace(/^data:.+;base64,/gi, ""),
        file2: this.backList[0].content.replace(/^data:.+;base64,/gi, ""),
      };
      if (!this.UploadIdCard) {
        obj.video = this.videoList[0].file;
      }
      this.loading = true;
      const [err] = await userApi[
        this.UploadIdCard ? "riskSecure2" : "riskSecure6"
      ](obj);
      this.loading = false;
      if (err) {
        this.$toast(this.$t("KYC.incorrect.Image"));
        return;
      }
      this.$toast(this.$t("KYC.Upload.successful"));
      this.$router.back();
    },
  },
  created() {},
};
</script>
<style scoped lang="less">
.uploadId-card-page {
  background-color: #f8f8f8;
  .title {
    font-size: 22px;
    font-weight: bold;
    color: #000;
    padding: 34px 0 10px 0;
  }
  .desc {
    color: #6e6e6e;
  }
  .img-font {
    margin-top: 32px;
  }
  ::v-deep {
    .uploader-img,
    .van-uploader__preview-image {
      width: 298px;
      height: 205px;
    }
  }
  .img-back {
    margin: 16px 0 10px;
  }
  .upload-btm {
    margin-top: 32px;
  }
}
</style>
