/* scale button bar */
<template>
  <div class="editor-buttons-bar">
    <div class="button-wrapper">
      <a-button class="scale-button" @mousedown.stop="decreaseRatio">
        <svg
          t="1610614816338"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2667"
          width="20"
          height="20"
        >
          <path d="M256 469.344h512v85.344H256v-85.344z" p-id="2668"></path>
        </svg>
      </a-button>
      <a-button class="scale-button scale-num">
        <span>{{ scaleRatio }}%</span>
      </a-button>
      <a-button class="scale-button" @mousedown.stop="increaseRatio">
        <svg
          t="1610615314287"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5083"
          width="20"
          height="20"
        >
          <path
            d="M807.936 581.376h-550.4a30.72 30.72 0 0 1 0-61.44h550.4a30.72 30.72 0 0 1 0 61.44z"
            fill=""
            p-id="5084"
          ></path>
          <path
            d="M532.736 856.576a30.72 30.72 0 0 1-30.72-30.72V275.2a30.72 30.72 0 0 1 61.44 0v550.4a30.72 30.72 0 0 1-30.72 30.976z"
            fill=""
            p-id="5085"
          ></path>
        </svg>
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData
    }),
    scaleRatio() {
      return Math.floor(this.canvasData.scaleRatio * 100)
    }
  },
  methods: {
    decreaseRatio(e) {
      e.stopPropagation()
      e.preventDefault()
      /* 缩小画布 */
      this.canvasData.scaleRatio > 0.15 &&
        this.$store.dispatch('Canvas/ZoomCanvas/decreaseRatio')
    },
    increaseRatio(e) {
      e.stopPropagation()
      e.preventDefault()
      /* 放大画布 */
      this.canvasData.scaleRatio < 4 &&
        this.$store.dispatch('Canvas/ZoomCanvas/increaseRatio')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-buttons-bar {
  height: 40px;
  color: #636c78;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(238, 242, 248, 0.9);
  border-radius: 6px;
  @include flexWrapper(center, center);
}
.button-wrapper {
  @include flexWrapper(center, center);
}
.scale-button {
  @include flexWrapper(center, center);
  background: transparent !important;
  color: #000 !important;
  border: none !important;
  &.scale-num {
    width: 70px;
  }
  &:after {
    display: none;
  }
}
</style>
