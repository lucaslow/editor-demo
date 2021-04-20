/* TEXTEFFECT store */
import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
export default {
  namespaced: true,
  state: {},
  mutations: {
    SETCURCOMPONENTEFFECT(
      state,
      { rootCanvas: { curComponent }, data: { type, index, style } }
    ) {
      /*
       ** 改变当前组件的特效
       ** 文字组件 textEffects属性
       */
      Object.keys(style).forEach(key => {
        curComponent.style.textEffects[index][type][key] = style[key]
      })
    },
    ADDTEXTEFFECT(state, { rootCanvas, type }) {
      if (rootCanvas.curComponent.type === 'text') {
        if (
          rootCanvas.curComponent.style.textEffects.length &&
          !rootCanvas.curComponent.style.textEffects[0][type]
        ) {
          Vue.set(
            rootCanvas.curComponent.style.textEffects[0],
            type,
            cloneDeep(rootCanvas[`textEffect_${type}`])
          )
        } else {
          const effectObj = {}
          effectObj[type] = cloneDeep(rootCanvas[`textEffect_${type}`])
          rootCanvas.curComponent.style.textEffects.unshift(effectObj)
        }
      }
    },
    DELETETEXTEFFECT(state, { rootCanvas, data: { type, index } }) {
      if (rootCanvas.curComponent.type === 'text') {
        Vue.delete(rootCanvas.curComponent.style.textEffects[index], type)
        if (
          Object.keys(rootCanvas.curComponent.style.textEffects[index])
            .length === 0
        ) {
          rootCanvas.curComponent.style.textEffects.splice(index, 1)
        }
      }
    }
  },
  actions: {
    setCurComponentEffect(context, data) {
      context.commit('SETCURCOMPONENTEFFECT', {
        rootCanvas: context.rootState.Canvas,
        data
      })
    },
    addTextEffect(context, type) {
      context.commit('ADDTEXTEFFECT', {
        rootCanvas: context.rootState.Canvas,
        type
      })
    },
    deleteTextEffect(context, data) {
      context.commit('DELETETEXTEFFECT', {
        rootCanvas: context.rootState.Canvas,
        data
      })
    }
  },
  modules: {}
}
