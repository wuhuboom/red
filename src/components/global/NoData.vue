<template>
  <div class="no-data center-center">
    <img src="@/assets/img/nodata.webp" alt="" />
  </div>
</template>

<script>
export default {
  name: "NoData",
};
</script>
<style scoped lang="less">
.no-data {
  padding-top: 80px;
  img {
    width: 102px;
    height: 112px;
    object-fit: cover;
  }
}
</style>
