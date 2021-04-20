<template>
  <div class="reference-line">
    <!-- 横向标尺 + 参考线 -->
    <RulerWrapper
      :vertical="false"
      :ruleSize="ruleSize"
      :style="getContainerStyle(false)"
      :lines="hLines"
      :canvasData="canvasData"
      :editorOffset="editorOffset"
      :canvasConfigs="canvasConfigs"
    />
    <!-- 纵向标尺 + 参考线 -->
    <RulerWrapper
      :vertical="true"
      :ruleSize="ruleSize"
      :style="getContainerStyle(true)"
      :lines="vLines"
      :canvasData="canvasData"
      :editorOffset="editorOffset"
      :canvasConfigs="canvasConfigs"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleSize: 25,
      $editor: null,
      hLines: [], // 存储横向标尺点击生成的纵向参考线
      vLines: [], // 存储纵向标尺点击生成的横向参考线
      editorOffset: null,
      canvasConfigs: {
        ratio: 1,
        bgColor: 'transparent',
        fontColor: '#000000',
        longfgColor: '#000000',
        shortfgColor: '#2c2c2c'
      }
    }
  },
  props: {
    canvasData: {
      type: Object,
      require: true
    }
  },
  components: {
    RulerWrapper: () =>
      import(
        /* webpackChunkName: "Ruler" */ 'components/Editor/Ruler/RulerWrapper.vue'
      )
  },
  created() {
    this.$editor = document.getElementById('editor')
    this.editorOffset = this.$editor.getBoundingClientRect()
  },
  computed: {
    scaleRatio() {
      return this.canvasData.scaleRatio
    }
  },
  watch: {
    scaleRatio() {
      // 监听画布缩放重新获取画布的位置信息
      this.editorOffset = this.$editor.getBoundingClientRect()
    }
  },
  mounted() {
    window.onresize = () => {
      // 监听窗口变化重新获取画布的位置信息
      return (() => {
        this.editorOffset = this.$editor.getBoundingClientRect()
      })()
    }
  },
  methods: {
    getContainerStyle(vertical) {
      /* 设置lineContainer 的位置 */
      return vertical
        ? {
            left: this.ruleSize * -1 + 'px'
          }
        : {
            top: this.ruleSize * -1 + 'px'
          }
    }
  }
}
</script>

<style lang="scss" scoped>
.reference-container {
  position: absolute;
  z-index: 20;
}
// .indicator {
//   position: absolute;
//   color: white;
//   background-color: black;
//   border-radius: 4px;
//   padding: 3px 7px;
//   user-select: none;
//   span {
//     white-space: nowrap;
//   }
//   &.h-indicator {
//     top: 20px;
//   }
//   &.v-indicator {
//     left: 20px;
//   }
// }
</style>
