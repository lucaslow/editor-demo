<template>
  <div class="editor-background-editor" @mousedown="handleMouseDownOnBg">
    <div class="editor-background_mask">
      <img :src="backgroundImage" :style="getImageStyle()" alt="" />
    </div>
    <div class="editor-background-editor_light">
      <img :src="backgroundImage" :style="getImageStyle()" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackgroundImage',
  data() {
    return {}
  },
  props: {
    canvasData: {
      type: Object,
      require: true
    }
  },
  computed: {
    backgroundImage() {
      return this.canvasData.background.style.backgroundImage
    },
    backgroundStyle() {
      return this.canvasData.background.style
    }
  },
  methods: {
    getImageStyle() {
      const props = ['width', 'height', 'left', 'top']
      const style = {}
      props.forEach(prop => {
        if (this.backgroundStyle[prop] !== undefined) {
          style[prop] =
            this.backgroundStyle[prop] * this.canvasData.scaleRatio + 'px'
        }
      })
      return style
    },
    handleMouseDownOnBg(e) {
      e.preventDefault()
      e.stopPropagation()

      const style = { ...this.backgroundStyle }

      const startY = e.clientY
      const startX = e.clientX

      const startTop = parseInt(style.top)
      const startLeft = parseInt(style.left)

      const move = moveEvent => {
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        style.top = currY - startY + startTop
        style.left = currX - startX + startLeft

        // 限制范围
        style.top > 0 && (style.top = 0)
        style.top < this.canvasData.height - style.height &&
          (style.top = this.canvasData.height - style.height)
        style.left > 0 && (style.left = 0)
        style.left < this.canvasData.width - style.width &&
          (style.left = this.canvasData.width - style.width)

        this.$store.commit('Canvas/setCanvasBgStyle', {
          style
        })
        this.$emit('changePos')
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-background-editor {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  img {
    position: absolute;
  }
  .editor-background-editor_light {
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: move;
    position: absolute;
    left: 0;
    top: 0;
  }
  .editor-background_mask {
    img {
      opacity: 0.3;
      cursor: move;
    }
  }
}
</style>
