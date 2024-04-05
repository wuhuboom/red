<template>
  <van-action-sheet
    :description="description"
    class="btm-action-sheet"
    v-model="show"
    :actions="list"
    @select="onSelect"
  />
</template>

<script>
export default {
  name: "BtmActionSheet",
  data() {
    return {
      show: false,
    };
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "Select country code",
    },
    actions: {
      type: Array,
      default: () => [],
    },
    fix: {
      type: String,
      default: "",
    },
  },
  computed: {
    list() {
      return this.actions.map((item) => {
        return {
          name: `${this.fix}${item}`,
        };
      });
    },
  },
  methods: {
    open() {
      this.show = true;
    },
    onSelect(item) {
      this.$emit("select", {
        ...item,
        name: item.name.replace(this.fix, ""),
      });
      this.close();
    },
    close() {
      this.show = false;
    },
  },
};
</script>
<style scoped lang="less">
.btm-action-sheet {
  ::v-deep {
    .van-action-sheet__description {
      color: var(--color-text);
    }
    .van-action-sheet__item {
      text-align: left;
    }
    .van-action-sheet__content {
      padding: 0 16px;
    }
    .van-action-sheet__content {
      max-height: 258px;
    }
  }
}
</style>
