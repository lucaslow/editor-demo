<template>
  <a-modal
    v-model="previewDialog"
    :destroyOnClose="true"
    :footer="null"
    :closable="false"
    :maskClosable="false"
    dialogClass="editor-full-dialog"
  >
    <a-icon type="close" class="dialog-close-btn" @click="closeDialog" />
    <div class="preview-wrap dialog-inner" :style="wrapStyle">
      <Preview
        :componentData="cloneComponentData"
        :curComponent="curComponent"
        :scaleRatio="scaleRatio"
        :editing="editing"
        :canvasData="canvasData"
      />
    </div>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
import { zoomComponentData } from 'utils/calculateComponentData'
import cloneDeep from 'lodash/cloneDeep'
export default {
  data() {
    return {
      scaleRatio: 1,
      dialogMaxHeight: 400 // 弹窗最大高度
    }
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData,
      componentData: state => state.Canvas.componentData,
      curComponent: state => state.Canvas.curComponent,
      editing: state => state.Canvas.editing
    }),
    cloneComponentData() {
      // 需要获取原比例下 的画布数据渲染
      const cloneComponentData = cloneDeep(this.componentData)
      zoomComponentData(cloneComponentData, 1 / this.canvasData.scaleRatio)
      return cloneComponentData
    },
    wrapStyle() {
      const scaleRatioDialog = Number(
        (this.dialogMaxHeight / this.canvasData.height).toFixed(1)
      )
      return {
        transform: `scale(${scaleRatioDialog})`
      }
    }
  },
  props: {
    previewDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Preview: () =>
      import(
        /* webpackChunkName: "Preview" */ 'components/Editor/Preview/Preview.vue'
      )
  },
  methods: {
    closeDialog() {
      this.$emit('closePreview')
    }
  }
}
</script>

<style></style>
