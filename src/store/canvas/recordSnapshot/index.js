import { zoomComponentData } from 'utils/calculateComponentData'
import cloneDeep from 'lodash/cloneDeep'

export default {
  namespaced: true,
  state: {
    snapshotData: [], // 编辑器快照数据
    snapshotCanvasBgData: [], // 编辑器底色快照数据
    snapshotIndex: -1 // 快照索引
  },
  mutations: {
    /* 编辑器快照 处理 S */
    recordSnapshot(state) {
      /* 快照记录的都是百分百比例的组件数据 */
      const componentData = this.state.Canvas.componentData
      const canvasData = this.state.Canvas.canvasData
      const cloneData = cloneDeep(componentData)
      const cloneCanvasBgData = cloneDeep(canvasData.background)
      zoomComponentData(cloneData, 1 / canvasData.scaleRatio)
      state.snapshotIndex++
      state.snapshotData[state.snapshotIndex] = cloneData
      /* 画板属性记录 */
      state.snapshotCanvasBgData[state.snapshotIndex] = cloneCanvasBgData
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(
          0,
          state.snapshotIndex + 1
        )
        /* 画板属性记录 */
        state.snapshotCanvasBgData = state.snapshotCanvasBgData.slice(
          0,
          state.snapshotIndex + 1
        )
      }
    },
    undo(state) {
      if (state.snapshotIndex > 0) {
        state.snapshotIndex--
        this.commit(
          'Canvas/setComponentData',
          cloneDeep(state.snapshotData[state.snapshotIndex])
        )
        /* 画板属性更新 */
        this.commit('Canvas/setCanvasStyle', {
          background: cloneDeep(state.snapshotCanvasBgData[state.snapshotIndex])
        })
      }
    },
    redo(state) {
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++
        this.commit(
          'Canvas/setComponentData',
          cloneDeep(state.snapshotData[state.snapshotIndex])
        )
        /* 画板属性更新 */
        this.commit('Canvas/setCanvasStyle', {
          background: cloneDeep(state.snapshotCanvasBgData[state.snapshotIndex])
        })
      }
    }
    /* 编辑器快照 处理 E */
  },
  modules: {}
}
