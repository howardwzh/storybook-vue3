<template>
  <div class="virtual-scroll-list" ref="container" @scroll="onScroll">
    <div class="spacer" :style="{ height: totalHeight + 'px' }"></div>
    <div class="item" v-for="item in visibleItems" :key="item.id" :style="item.style">
      {{ item.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualScrollList',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      required: true
    },
    buffer: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      containerHeight: 0,
      scrollTop: 0
    };
  },
  computed: {
    totalHeight() {
      return this.items.length * this.itemHeight;
    },
    visibleItems() {
      const start = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
      const end = Math.min(this.items.length, Math.ceil((this.scrollTop + this.containerHeight) / this.itemHeight) + this.buffer);
      return this.items.slice(start, end).map((item, index) => ({
        ...item,
        style: {
          position: 'absolute',
          top: (start + index) * this.itemHeight + 'px',
          height: this.itemHeight + 'px'
        }
      }));
    }
  },
  mounted() {
    this.containerHeight = this.$refs.container.clientHeight;
  },
  methods: {
    onScroll() {
      this.scrollTop = this.$refs.container.scrollTop;
    }
  }
};
</script>

<style scoped>
.virtual-scroll-list {
  position: relative;
  overflow-y: auto;
  height: 400px; /* Adjust as needed */
}

.spacer {
  width: 100%;
}

.item {
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
</style>
