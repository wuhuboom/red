<template>
  <van-image class="img-com" fit="cover" :src="src">
    <template v-slot:loading><i></i> </template>
    <template v-slot:error><i></i></template>
  </van-image>
</template>

<script>
export default {
  name: "ImgCom",
  data() {
    return {
      show: false,
    };
  },
  props: {
    src: {
      type: String,
      default: "",
    },
  },
};
</script>
<style scoped lang="less">
.img-com {
  height: 100%;
  width: 100%;
  padding: 2px;
  ::v-deep {
    .van-image img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
