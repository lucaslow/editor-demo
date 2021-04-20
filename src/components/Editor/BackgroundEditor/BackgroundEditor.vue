<template>
  <div class="editor-background-wrapper">
    <div class="editor-toolBar">
      <div class="tooBar-inner">
        <span class="tool-btn">缩放</span>
        <div class="slider">
          <a-slider
            class="bg-scale-slider"
            :step="1"
            :tip-formatter="formatter"
            v-model="zoomFactor"
            @change="handleBgScaleChange"
          />
        </div>
        <a-divider type="vertical" :style="{ height: '80%' }" />
        <!-- <span class="tool-btn">重置</span> -->
        <span class="tool-btn" @click="handleCancel">取消</span>
        <span class="tool-btn" @click="handleSuccess">完成</span>
      </div>
    </div>
    <BackgroundImage :canvasData="canvasData" @changePos="changePos" />
  </div>
</template>

<script>
import { Subtr } from 'utils/utils'
export default {
  name: 'BackgroundEditor',
  data() {
    return {
      defaultStyle: null,
      defaultScaleRatio: 1,
      defaultProps: ['width', 'height', 'left', 'top'],
      zoomFactor: 0,
      activePos: {
        left: 0,
        top: 0
      }
    }
  },
  props: {
    canvasData: {
      type: Object,
      require: true
    }
  },
  computed: {
    backgroundStyle() {
      return this.canvasData.background.style
    }
  },
  created() {
    this.setDefaultStyle()
    this.defaultScaleRatio = this.canvasData.background.scaleRatio
    this.activePos = {
      left: this.backgroundStyle.left,
      top: this.backgroundStyle.top
    }
    this.zoomFactor =
      Math.abs(Subtr(1, this.canvasData.background.scaleRatio)) * 100
  },
  components: {
    BackgroundImage: () =>
      import(
        /* webpackChunkName: "BackgroundEditor" */ 'components/Editor/BackgroundEditor/BackgroundImage.vue'
      )
  },
  methods: {
    setDefaultStyle() {
      this.defaultStyle = {}
      this.defaultProps.forEach(prop => {
        if (this.canvasData.background.style[prop] !== undefined) {
          this.defaultStyle[prop] = this.canvasData.background.style[prop]
        }
      })
    },
    formatter(factor) {
      return `${100 + factor}%`
    },
    changePos() {
      this.activePos = {
        left: this.backgroundStyle.left,
        top: this.backgroundStyle.top
      }
    },
    handleBgScaleChange(factor) {
      const bgScaleRatio = parseFloat((1 + factor * 0.01).toFixed(2))
      const props = ['width', 'height', 'left', 'top']
      const style = {}
      props.forEach(prop => {
        if (this.backgroundStyle[prop] !== undefined) {
          style[prop] =
            (this.defaultStyle[prop] * bgScaleRatio) /
            this.canvasData.background.scaleRatio
          // if (['width', 'height'].includes(prop)) {
          //   style[prop] =
          //     (this.defaultStyle[prop] * bgScaleRatio) /
          //     this.canvasData.background.scaleRatio
          // } else {
          //   style[prop] =
          //     (this.activePos[prop] * bgScaleRatio) /
          //     this.canvasData.background.scaleRatio
          // }
        }
      })
      this.$store.commit('Canvas/setCanvasBgStyle', { style })
    },
    handleCancel() {
      /* 取消对背景的操作 */
      this.$store.commit('Canvas/setCanvasBgStyle', {
        style: this.defaultStyle,
        scaleRatio: this.defaultScaleRatio
      })
      this.$store.commit('Canvas/setBgEditing', false)
    },
    handleSuccess() {
      /* 确定对背景的操作 */
      this.$store.commit('Canvas/setCanvasBgStyle', {
        scaleRatio: parseFloat((1 + this.zoomFactor * 0.01).toFixed(2))
      })
      this.$store.commit('Canvas/setBgEditing', false)
      this.$store.commit('Canvas/recordSnapshot')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-background-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
}
.editor-toolBar {
  width: 370px;
  height: 38px;
  background-color: #fff;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: -50px;
  z-index: 5;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  cursor: default;
  .tooBar-inner {
    width: 100%;
    height: 100%;
    padding: 5px;
    font-size: 13px;
    @include flexWrapper(left, center);
    .slider {
      width: 50%;
    }
    .tool-btn {
      cursor: pointer;
      padding: 0 10px;
      white-space: nowrap;
    }
  }
}
</style>
