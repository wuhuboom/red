<template>
  <div>
    <p class="icon-back">
      <span @click="open">मार्गदर्शन चरणहरू</span>
    </p>
    <div class="win-usdt">
      <div class="amount-list">
        <div>
          <p>स्थानान्तरण रकम</p>
          <p class="num-card">{{ query.amount }}</p>
        </div>
        <p class="count-down">
          <CountDown :time="count()" format="HH:mm:ss" />
        </p>
      </div>
      <ul class="order-msg order-btn">
        <li class="order-list">
          <p>प्रयोगकर्ता नाम</p>
          <div class="list-desc c-c" @click="copyToClipboard(query.username)">
            <p class="expe">{{ query.username }}</p>
            <span class="copy"
              ><img src="@/assets/img/bluecopt.webp" alt=""
            /></span>
          </div>
        </li>
        <li class="order-list">
          <p>खाता</p>
          <div class="list-desc c-c" @click="copyToClipboard(query.bankCode)">
            <p class="expe">{{ query.bankCode }}</p>
            <span class="copy"
              ><img src="@/assets/img/bluecopt.webp" alt=""
            /></span>
          </div>
        </li>
        <li class="order-list">
          <p>बैंकको नाम</p>
          <div class="list-desc c-c" @click="copyToClipboard(query.bankname)">
            <p class="expe">{{ query.bankname }}</p>
            <span class="copy"
              ><img src="@/assets/img/bluecopt.webp" alt=""
            /></span>
          </div>
        </li>
        <li class="order-list" style="border-color: transparent">
          <p>आदेश संख्या</p>
          <div
            class="list-desc c-c"
            @click="copyToClipboard(query.orderNumber)"
          >
            <p class="expe">{{ query.orderNumber }}</p>
            <span class="copy"
              ><img src="@/assets/img/bluecopt.webp" alt=""
            /></span>
          </div>
        </li>
      </ul>
      <p class="upload-desc">
        कृपया हामीलाई तपाईंको आदेश पुष्टि गर्नका लागि स्थानान्तरण प्राप्ति अपलोड
        गर्नुहोस्।
      </p>
      <div class="upload-row">
        <div class="upload c-c" @click="upload">
          <img :src="url" v-if="url" alt="" />
        </div>
      </div>

      <Uploader :after-read="afterRead" ref="upload" v-show="false" />
      <popup v-model="show" position="center" class="pop-alert">
        <div class="cont-popup">
          <!-- <p class="drc drc-l c-c" v-if="index > 0" @click="chang(-1)">
            BACK <img src="@/assets/img/left.png" alt="" />
          </p> -->
          <img :src="img" alt="" />
          <!-- <p
            class="drc drc-r c-c"
            v-if="index < imgs.length - 1"
            @click="chang(1)"
          >
            <img src="@/assets/img/rit.png" alt="" /> NEXT
          </p> -->
          <ul class="handel-btn">
            <li @click="chang(1)" v-if="index < imgs.length - 1">अर्को चरण</li>
            <li @click="show = false">थाहा भयो, यो चरण छोड्नुहोस्</li>
          </ul>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Uploader, CountDown, Popup } from "vant";
import axios from "axios";
//封装 axios
const host = window.BASEPATH || process.env.VUE_APP_API;
axios.defaults.baseURL = `${host}/user/v2`;
export default {
  data() {
    return {
      show: false,
      index: 0,
      query: {
        ...this.$route.query,
      },
      now: new Date().getTime(),
      imgs: [
        require("@/assets/img/step1.webp"),
        require("@/assets/img/step2.webp"),
        // require("@/assets/img/step3.webp"),
      ],
      url: "",
    };
  },
  components: {
    Uploader,
    CountDown,
    Popup,
  },
  computed: {
    // 计算过期时间
    expiration() {
      return this.formatExpiration(this.query.expiration);
    },
    img() {
      return this.imgs[this.index];
    },
  },
  methods: {
    copyToClipboard(text) {
      const input = document.createElement("input");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$toast("Copied to clipboard");
    },
    open() {
      this.show = true;
      this.index = 0;
    },
    chang(num) {
      this.index += num;
      console.log(this.index);
    },
    count() {
      let now = this.query.expiration * 1000 - new Date().getTime();
      return now > 0 ? now : 0;
    },
    formatExpiration(time) {
      // 将时间戳从秒转换为毫秒
      const date = new Date(time * 1000);

      // 获取年、月、日、小时、分钟和秒
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以要加1
      const day = String(date.getDate()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const hours = String(date.getHours()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const minutes = String(date.getMinutes()).padStart(2, "0");
      // eslint-disable-next-line no-unused-vars
      const seconds = String(date.getSeconds()).padStart(2, "0");
      // 构建格式化的日期时间字符串  ${hours}:${minutes}:${seconds}
      return `${year}-${month}-${day}`;
    },
    getDate() {
      const own_order = this.query.orderNumber;
      const formData = new FormData();
      formData.append("own_order", own_order);
      axios.post("/getCertificateForImageRtt", formData).then((res) => {
        const { code, result } = res.data;
        if (code !== 200) return;
        this.url = result.host + result.imageUrl;
      });
    },
    afterRead(file) {
      console.log(file);
      const own_order = this.query.orderNumber;
      const formData = new FormData();
      formData.append("order_num", own_order);
      formData.append("file", file.file);
      axios.post("/uploadCertificateImageRrt", formData).then((res) => {
        const { code } = res.data;
        console.log(code, "---");
        if (code !== 200) {
          this.$toast("Upload failed");
          return;
        }
        this.url = file.content;
        this.$toast("Upload successful");
      });
    },
    upload() {
      this.$refs.upload.chooseFile();
    },
  },
  mounted() {
    this.getDate();
  },
};
</script>

<style lang="scss">
$blue: #00d6d4;
.icon-back {
  padding: 18px 18px 18px 0;
  display: flex;
  justify-content: flex-end;
  color: $blue;
  text-decoration: underline;
  background-color: #0b0b0b;
}
.line1 {
  line-height: 1;
}
.m-b-16 {
  margin-bottom: 16px;
}
.d-c {
  flex-direction: column;
}
.dack {
  color: #ef7367;
}
.win-usdt {
  padding: 0 18px;
  font-size: 12px;
}
.c-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.amount-list {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
  color: $blue;
  font-size: 14px;
  .num-card {
    font-size: 25px;
    font-weight: bold;

    margin-top: 10px;
  }
  .van-count-down {
    font-size: 20px;
    color: $blue;
  }
}
.order-msg {
  padding: 26px 18px 18px 19px;
  border-radius: 10px;
  background-color: #fff;
  font-size: 14px;
  color: #000;
  .order-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    border-bottom: 1px solid #707070;
    & > p:first-child {
      flex-shrink: 0;
      margin-right: 6px;
    }
  }
  .list-desc {
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
  }
  .expe {
    //一行显示
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // max-width: 198px;
  }
  .copy {
    margin-left: 8px;
    img {
      width: 18px;
      height: 18px;
      display: block;
    }
  }
}

.upload-desc {
  margin: 22px 0 11px 12px;
  font-size: 14px;
  color: #ff0505;
}
.upload-row {
  display: flex;
  margin-top: 8px;
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .upload {
    width: 131px;
    height: 131px;
    padding: 1px;
    background: url("@/assets/img/uploadbg.webp") no-repeat center center;
    background-size: 100% 100%;
  }
}
.pop-alert {
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  img {
    max-width: 100%;
  }
}
.handel-btn {
  position: absolute;
  width: 100%;
  bottom: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > li {
    height: 36px;
    padding: 10px 43px 9px;
    border-radius: 18px;
    border: solid 1px #00d6d4;
  }
  & > li:nth-child(1) {
    margin-bottom: 20px;
  }
}
.cont-popup {
  img {
    display: block;
    width: 375px;
  }
}
</style>
<style>
.van-toast {
  background-color: green !important;
}
</style>
