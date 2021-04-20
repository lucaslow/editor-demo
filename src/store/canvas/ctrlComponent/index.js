/* ContextMenu store */
import { caclMinRange } from 'utils/calculateComponentData'
export default {
  namespaced: true,
  state: {
    ctrlComponentData: [],
    ctrlComponentStyle: {
      width: 50,
      height: 50,
      left: 50,
      right: 50,
      rotate: 0
    }
  },
  mutations: {
    /* CTRL S */
    addCtrlComponent(state, ctrlArr) {
      state.ctrlComponentData = state.ctrlComponentData.concat(ctrlArr)
      state.ctrlComponentStyle = caclMinRange(state.ctrlComponentData)
    },
    clearCtrlComponent(state) {
      state.ctrlComponentData.splice(0)
    },
    setCtrlShapeStyle({ ctrlComponentStyle }, { left, top, rotate }) {
      /* 设置CTRL组件操作矩形的位置和宽高 */
      top && (ctrlComponentStyle.top = top)
      left && (ctrlComponentStyle.left = left)
      rotate != undefined && (ctrlComponentStyle.rotate = rotate)
    },
    setCtrlComponentStyle({ ctrlComponentData }, ctrlComponentStyle) {
      // 设置CTRL中所有组件的位置信息
      ctrlComponentStyle.forEach(({ left, top, rotate }, index) => {
        top && (ctrlComponentData[index].style.top = top)
        left && (ctrlComponentData[index].style.left = left)
        rotate != undefined && (ctrlComponentData[index].style.rotate = rotate)
      })
    },
    setCtrlShapePosStyle(
      { ctrlComponentStyle, ctrlComponentData },
      { key, value }
    ) {
      /*
       ** 吸附功能
       ** 设置组件的left / top
       */
      const diff = value - ctrlComponentStyle[key]
      if (ctrlComponentStyle.rotate === 0) {
        ctrlComponentStyle[key] = value
        ctrlComponentData.forEach(component => {
          component.style[key] += diff
        })
      }
    }
    /* CTRL E */
  },
  modules: {}
}
