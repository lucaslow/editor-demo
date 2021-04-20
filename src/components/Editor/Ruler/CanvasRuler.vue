<template>
  <canvas
    class="ruler"
    ref="$canvas"
    @click="handleCanvasClick"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  />
</template>

<script>
import { drawHorizontalRuler, drawVerticalRuler } from 'utils/ruler'
export default {
  name: 'CanvasRuler',
  data() {
    return {
      $canvas: null,
      canvasContext: null,
      scale: 1,
      start: 0 //起始坐标
    }
  },
  props: {
    canvasConfigs: {
      type: Object,
      require: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      require: true
    },
    height: {
      type: Number,
      require: true
    },
    scaleRatio: {
      type: Number,
      defalut: 1,
      require: true
    }
  },
  mounted() {
    this.initCanvasRef()
    this.updateCanvasContext()
    this.drawRuler()
  },
  computed: {
    ratio() {
      // 文字大小最小为 12px
      return Math.max(1, 1 / this.scaleRatio)
    }
  },
  watch: {
    ratio() {
      this.updateCanvasContext()
      this.drawRuler()
    }
  },
  methods: {
    initCanvasRef() {
      /* 初始化canvas */
      this.$canvas = this.$refs.$canvas
      this.canvasContext = this.$canvas && this.$canvas.getContext('2d')
    },
    updateCanvasContext() {
      /* 设置canvas的画笔颜色等配置属性 */
      // 比例宽高
      this.$canvas.width = this.width
      this.$canvas.height = this.height

      const ctx = this.$canvas.getContext('2d')
      const fontSize = Math.min(12 * this.ratio, 26)
      ctx.font = `${fontSize}px -apple-system, 
                "Helvetica Neue", ".SFNSText-Regular", 
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", 
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
      ctx.lineWidth = 1
      ctx.textBaseline = 'middle'
    },
    drawRuler() {
      /* 画标尺 */
      const options = {
        scale: this.scale,
        width: this.width,
        height: this.height,
        canvasConfigs: this.canvasConfigs
      }
      !this.vertical &&
        drawHorizontalRuler(this.canvasContext, this.start, options)
      this.vertical &&
        drawVerticalRuler(this.canvasContext, this.start, options)
    },
    handleCanvasClick(e) {
      /* 标尺点击的时候生成一条位于点击位置的参考线 */
      const offset = this.vertical ? e.offsetY : e.offsetX
      const value = offset * this.scaleRatio
      this.$emit('onAddLine', value)
    },
    handleMove(e) {
      const offset = this.vertical ? e.offsetY : e.offsetX
      this.$emit('onIndicatorMove', offset)
    },
    handleLeave() {
      this.$emit('onIndicatorHide')
    }
  }
}
</script>

<style lang="scss" scoped></style>
