import { loadFontFile } from 'utils/getFontCut'
export default {
  data() {
    return {
      normalFamily: 'syht_bold' // 粗体思源雅黑
    }
  },
  created() {
    /* 加载组件所需字体 */
    this.queryAllFontFamily()
  },
  mounted() {
    /* 画板自适应 */
    window.addEventListener(
      'resize',
      () => {
        const scaleRatio = this.canvasInitScale()
        this.$store.commit('Canvas/ZoomCanvas/scalingComponentData', scaleRatio)
      },
      false
    )
    const scaleRatio = this.canvasInitScale()
    this.$store.commit('Canvas/setCanvasStyle', { scaleRatio })
    this.$store.commit('Canvas/setComponentData')
    this.$store.commit('Canvas/recordSnapshot')
  },
  methods: {
    canvasInitScale() {
      /* 获取canvas的缩放值 */
      const { width, height } = this.$refs.euiMain.getBoundingClientRect()
      let scaleRatio = 1
      if (this.canvasData.width / this.canvasData.height > width / height) {
        if (this.canvasData.width > width) {
          scaleRatio = Number(((width - 80) / this.canvasData.width).toFixed(2))
        }
      } else {
        if (this.canvasData.height > height) {
          scaleRatio = Number(
            ((height - 80) / this.canvasData.height).toFixed(2)
          )
        }
      }
      return scaleRatio
    },
    queryAllFontFamily() {
      const needToQuery = []
      const fontFamily = []
      this.componentData.forEach(component => {
        if (component.type === 'text') {
          const data = {
            fontName: component.style.fontFamily || '',
            text: component.propValue
          }
          fontFamily.push(data.fontName)
          needToQuery.push(data)
        }
      })
      if (needToQuery.length > 0) {
        loadFontFile(needToQuery).then(() => {
          console.log('load-font-success')
          this.$store.commit('Canvas/updateFontFamilyCache', fontFamily) // 缓存字体
        })
      }
    }
  }
}
