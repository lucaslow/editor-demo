import { zoomComponentData } from 'utils/calculateComponentData'
/* ZoomCanvas store */
/* 缩放原理
 ** 1、基础组件 VImage VText
 ** 按缩放值等比例计算出缩放之后的width 、 height 、 left、 top值
 ** 2、VText 的文字 fontSize
 ** 在其组件最外层父元素中使用scale 缩放，不改变fontSize
 ** 3、缩放不记录快照
 */
export default {
  namespaced: true,
  state: {
    scalingRatio: 0.1, // 缩放比例
    minRatio: 0.2,
    maxRatio: 4
  },
  mutations: {
    scalingComponentData({ minRatio, maxRatio }, scale) {
      const { scaleRatio } = this.state.Canvas.canvasData
      let zoom = Number(scale)
      zoom < minRatio && (zoom = minRatio)
      zoom > maxRatio && (zoom = maxRatio)
      /* 
        组件只需要缩放 width height left top 值
        文字组件需要根据scaleRatio设置scale值，以达到fontSize不需要改变
      */
      zoomComponentData(this.state.Canvas.componentData, zoom / scaleRatio)
      //   设置 scaleRatio 值
      this.state.Canvas.canvasData.scaleRatio = zoom
    }
  },
  actions: {
    decreaseRatio({ commit, state, rootState }) {
      /* 预设比例缩小画布 */
      const { scaleRatio } = rootState.Canvas.canvasData
      const scaleRatio_calc = (scaleRatio - state.scalingRatio).toFixed(1)
      commit('scalingComponentData', scaleRatio_calc)
    },
    increaseRatio({ commit, state, rootState }) {
      /* 预设比例放大画布 */
      const { scaleRatio } = rootState.Canvas.canvasData
      const scaleRatio_calc = (scaleRatio + state.scalingRatio).toFixed(1)
      commit('scalingComponentData', scaleRatio_calc)
    }
  },
  modules: {}
}
