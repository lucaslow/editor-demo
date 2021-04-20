/* ContextMenu store */
import { generateID } from 'utils/utils'
import getTextHeight from 'utils/getTextHeight'
import cloneDeep from 'lodash/cloneDeep'
import list from './component-list'
import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    VText: {
      id: 'text_0',
      component: 'VText', // 组件名称，需要提前注册到 Vue
      type: 'text', // 左侧组件列表中显示的名字
      propValue: '双击输入文字', // 组件所使用的值
      icon: 'el-icon-edit', // 左侧组件列表中显示的名字
      style: {
        top: 0,
        left: 0,
        width: 450,
        height: 80,
        rotate: 0,
        scale: {
          scaleX: 1,
          scaleY: 1
        },
        fontSize: 71,
        fontWeight: 'bold',
        lineHeight: 1.5,
        letterSpacing: 0,
        textAlign: 'center',
        color: 'rgb(255, 255, 255, 1)',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontFamily: 'syht_bold',
        opacity: 1
      }
    }
  },
  mutations: {
    ADDTEXT(state, { componentData, canvasData }) {
      const deepCom = cloneDeep(list.VText)
      deepCom.id = `text-${generateID()}`
      deepCom.style.left = canvasData.width / 2 - deepCom.style.width / 2
      deepCom.style.top = canvasData.height / 2 - deepCom.style.height / 2
      componentData.push(deepCom)
      this.commit('Canvas/setCurComponent', {
        component: deepCom,
        zIndex: componentData.length - 1
      })
      Vue.nextTick(() => {
        const editorElementCurrent = document.querySelectorAll(
          '.editor-element-current .editor-element-text'
        )[0]
        const curDom = editorElementCurrent.querySelectorAll(
          '.element-inner:last-of-type'
        )[0]
        this.commit('Canvas/setCurTextDom', curDom)
        this.commit('Canvas/setShapeStyle', {
          height: getTextHeight(curDom, canvasData.scaleRatio)
        })
      })
    }
  },
  actions: {
    addText(context) {
      /* 组件粘贴 ACTION */
      context.commit('ADDTEXT', context.rootState.Canvas)
    }
  },
  modules: {}
}
