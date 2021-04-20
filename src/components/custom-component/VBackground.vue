<template>
  <div class="editor-background-element">
    <img
      draggable="false"
      :src="backgroundImage"
      :style="getImageStyle()"
      alt=""
    />
  </div>
</template>

<script>
export default {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-background-element {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  img {
    position: absolute;
  }
}
</style>
