<template>
  <div
    class="line"
    @mousedown="handleLineDown"
    :style="style"
    :class="{ deleteStyle: deleteArea }"
  >
    <div class="action" v-if="showLine" :style="actionAreaStyle">
      <span class="value" v-if="!deleteArea">{{ actionVal }}</span>
      <span class="value" v-else>放开删除</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineRuler',
  data() {
    return {
      showLine: false, // 设置参考线的提示部分是否显示
      offsetVal: 0,
      deleteArea: false, // 是否处于删除区域
      actionAreaStyle: null
    }
  },
  props: {
    value: {
      type: Number,
      require: true
    },
    lineKey: {
      type: Number,
      require: true
    },
    vertical: {
      type: Boolean,
      require: true,
      defalut: true
    },
    canvasData: {
      type: Object,
      require: true
    }
  },
  computed: {
    scaleRatio() {
      return this.canvasData.scaleRatio
    },
    style() {
      return this.vertical
        ? { transform: `translate(0px, ${this.offsetVal}px)` }
        : { transform: `translate(${this.offsetVal}px, 0px)` }
    },
    actionVal() {
      // 操作的 时候显示的度数文本
      const value = Math.round(this.offsetVal / this.scaleRatio)
      return this.vertical ? `Y:${value}` : `X:${value}`
    }
  },
  watch: {
    scaleRatio(nV, oV) {
      this.offsetVal = (this.offsetVal / oV) * nV
    }
  },
  mounted() {
    this.initStartOffset()
  },
  methods: {
    initStartOffset() {
      // 设置参考线初始位置
      this.offsetVal = this.value
    },
    handleLineDown(e) {
      /* 参考线绑定事件 */
      e.preventDefault()
      e.stopPropagation()
      this.showLine = true // 点击线的时候显示位置提示器
      // 初始位置
      const startY = e.clientY
      const startX = e.clientX
      const startOffset = this.offsetVal
      const move = moveEvent => {
        const currY = moveEvent.clientY
        const currX = moveEvent.clientX
        this.vertical
          ? (this.offsetVal = currY - startY + startOffset)
          : (this.offsetVal = currX - startX + startOffset)

        this.vertical
          ? (this.actionAreaStyle = { left: currX + 'px', top: '20px' })
          : (this.actionAreaStyle = { left: '20px', top: currY + 'px' })

        if (this.vertical) {
          this.offsetVal > this.canvasData.height * this.scaleRatio &&
            (this.deleteArea = true)
          this.offsetVal < this.canvasData.height * this.scaleRatio &&
            (this.deleteArea = false)
        } else {
          this.offsetVal > this.canvasData.width * this.scaleRatio &&
            (this.deleteArea = true)
          this.offsetVal < this.canvasData.width * this.scaleRatio &&
            (this.deleteArea = false)
        }
        this.offsetVal < 0 && (this.deleteArea = true)
      }
      const up = () => {
        if (this.deleteArea) {
          // 如果是在删除区域删除参考线
          this.$emit('deleteLine', this.lineKey, this.vertical)
        }
        this.showLine = false // 鼠标松开线的时候隐藏位置提示器
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    getActionStyle() {
      return this.vertical
        ? { left: '10%', top: '10px' }
        : { left: '10px', top: '20%' }
    }
  }
}
</script>

<style lang="scss" scoped>
.line {
  position: absolute;
  background-color: rgb(245, 69, 49);
  opacity: 0.7;
  &.deleteStyle {
    opacity: 0.4;
  }
}
.h-container {
  .line {
    width: 100%;
    height: 100%;
    cursor: col-resize;
  }
}
.v-container {
  .line {
    width: 100%;
    height: 100%;
    cursor: row-resize;
  }
}
.action {
  position: absolute;
  color: white;
  background-color: black;
  border-radius: 4px;
  padding: 3px 7px;
  user-select: none;
  span {
    white-space: nowrap;
  }
}
</style>
