/* canvas  */
/* 组件数据 */
/***** 
{
    component: 'v-text', // 组件名称，需要提前注册到 Vue
    label: '文字', // 左侧组件列表中显示的名字
    propValue: '文字', // 组件所使用的值
    icon: 'el-icon-edit', // 左侧组件列表中显示的名字
    style: { // 组件样式
        width: 200,
        height: 33,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '',
        letterSpacing: 0,
        textAlign: '',
        color: ''
    },
}
 * 
 * 
 * *****/
import Vue from 'vue'
import {
  zoomComponentData,
  syncUpdateTextComponentEffects
} from 'utils/calculateComponentData'
import cloneDeep from 'lodash/cloneDeep'
import contextMenu from './contextMenu'
import zoomCanvas from './zoomCanvas'
import ctrlComponent from './ctrlComponent'
import componentLists from './componentLists'
import componentEffect from './componentEffect'
import getTextHeight from 'utils/getTextHeight'
import { isArray } from 'utils/typeUtils'
export default {
  namespaced: true,
  state: {
    editMode: 'edit', // 编辑器模式 edit read
    canvasData: {
      // 页面全局数据
      width: 900,
      height: 383,
      scaleRatio: 1,
      title: '元旦新年牛年春节',
      background: {
        colorOrImage: 'color',
        backgroundImageInfo: {
          url: require('assets/test/bgq.jpg'),
          width: 2208,
          height: 1242
        },
        scaleRatio: 1,
        style: {
          backgroundColor: '#9B0F0F',
          backgroundImage: require('assets/test/bgq.jpg'),
          opacity: 1,
          width: 900,
          height: 506,
          left: 0,
          top: -61.5
        }
      }
    },
    componentData: [
      {
        id: 2,
        component: 'VImage',
        type: 'image',
        propValue:
          'https://st-gdx.dancf.com/gaodingx/0/uxms/design/20201231-172648-cb49.png',
        style: {
          top: 17,
          left: 500,
          width: 339,
          height: 347.5,
          rotate: 0,
          opacity: 1,
          scale: {
            scaleX: 1,
            scaleY: 1
          }
        }
      },
      {
        id: 'text_0',
        component: 'VText', // 组件名称，需要提前注册到 Vue
        type: 'text', // 左侧组件列表中显示的名字
        propValue: '测试数据', // 组件所使用的值
        icon: 'el-icon-edit', // 左侧组件列表中显示的名字
        style: {
          top: 85,
          left: 50,
          width: 500,
          height: 213,
          rotate: 0,
          scale: {
            scaleX: 1,
            scaleY: 1
          },
          fontSize: 110,
          fontWeight: 'bold',
          lineHeight: 1.5,
          letterSpacing: 0,
          textAlign: 'center',
          color: 'rgb(0, 0, 0, 1)',
          fontStyle: 'normal',
          textDecoration: 'none',
          fontFamily: 'syht_heavy',
          opacity: 1,
          textEffects: [
            {
              // enable: true,
              stroke: {
                enable: true,
                type: 'outer', // outer center
                width: 4,
                color: '#ffffff'
              },
              shadow: {
                enable: true,
                color: '#000000',
                blur: 10,
                offsetX: 0,
                offsetY: 16
              }
            }
          ]
        }
      }
    ], // 当前画布组件数据
    curComponent: null, // 当前处理的组件
    curComponentZIndex: null,
    editing: false, // 文本是否正在 编辑
    bgEditing: false, // 背景是否在编辑
    curTextDom: null, // 当前编辑的文本Dom元素
    snapshotData: [], // 编辑器快照数据
    snapshotCanvasBgData: [], // 编辑器底色快照数据
    snapshotIndex: -1, // 快照索引
    /* 组件相关数据 ↓↓↓↓↓↓ */
    fontFamilyCache: [],
    textEffect_stroke: {
      enable: true,
      type: 'outer', // outer center
      width: 1,
      color: '#000000'
    },
    textEffect_shadow: {
      enable: true,
      color: '#000000',
      blur: 10,
      offsetX: 0,
      offsetY: 16
    }
  },
  mutations: {
    setEditMode(state, mode) {
      state.editMode = mode
    },
    setCanvasStyle({ canvasData }, { width, height, scaleRatio, background }) {
      width && (canvasData.width = width)
      height && (canvasData.height = height)
      scaleRatio && (canvasData.scaleRatio = scaleRatio)
      background && (canvasData.background = background)
    },
    setCanvasBgStyle(
      /* 设置背景的数据 */
      { canvasData },
      { colorOrImage, backgroundImageInfo, scaleRatio, style }
    ) {
      const canvasBg = canvasData.background
      backgroundImageInfo &&
        Object.assign(canvasBg.backgroundImageInfo, backgroundImageInfo)
      style && Object.assign(canvasBg.style, style)
      scaleRatio && (canvasBg.scaleRatio = scaleRatio)
      colorOrImage && (canvasBg.colorOrImage = colorOrImage)
    },
    setBgEditing(state, editing) {
      /*
       ** 设置当前背景是否正在编辑状态 true false
       */
      state.bgEditing = editing
    },
    setComponentData(state, componentData = state.componentData) {
      /* 接收的是百分百比例下的组件数据 */
      /* 用于初始组件数据加载 + 快照数据加载 */
      // 根据全局scale进行缩放
      zoomComponentData(componentData, state.canvasData.scaleRatio)
      Vue.set(state, 'componentData', componentData)
    },
    addComponent(state, component) {
      state.componentData.push(component)
    },
    setCurComponent(state, { component, zIndex }) {
      // 设置当前的组件
      component !== undefined && (state.curComponent = component)
      zIndex !== undefined && (state.curComponentZIndex = zIndex)
    },
    clearCurComponent(state) {
      // 清除当前的组件
      state.curComponent = null
      state.curComponentZIndex = null
    },
    setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
      /* 设置组件操作矩形的位置和宽高 */
      top != undefined && (curComponent.style.top = top)
      left != undefined && (curComponent.style.left = left)
      width != undefined && (curComponent.style.width = width)
      height != undefined && (curComponent.style.height = height)
      rotate != undefined && (curComponent.style.rotate = rotate)
    },
    setShapePosStyle({ curComponent }, { key, value }) {
      /*
       ** 吸附功能
       ** 设置组件的left / top
       */
      curComponent.style.rotate === 0 && (curComponent.style[key] = value)
    },
    setCurComponentStyle(state, style) {
      /*
       ** 改变当前组件样式状态
       ** fontSize
       */
      Object.keys(style).forEach(key => {
        key === 'fontSize' &&
          syncUpdateTextComponentEffects(
            state.curComponent,
            style[key],
            state.curComponent.style.fontSize
          )
        key && (state.curComponent.style[key] = style[key])
        if (state.curComponent.type === 'text') {
          Vue.nextTick(() => {
            state.curComponent.style.height = getTextHeight(
              state.curTextDom,
              state.canvasData.scaleRatio
            )
          })
        }
      })
    },
    setEditing(state, editing) {
      /*
       ** 设置当前是否正在编辑状态 true false
       ** 文字组件编辑
       */
      state.editing = editing
    },
    setCurTextDom(state, dom) {
      /*
       ** 设置当前正在编辑的文字组件
       */
      state.curTextDom = dom
    },
    /* 编辑器快照 处理 S */
    recordSnapshot(state) {
      /* 快照记录的都是百分百比例的组件数据 */
      const cloneData = cloneDeep(state.componentData)
      const cloneCanvasBgData = cloneDeep(state.canvasData.background)
      zoomComponentData(cloneData, 1 / state.canvasData.scaleRatio)
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
    },
    /* 编辑器快照 处理 E */
    /* 其他 ↓↓↓↓↓↓ */
    updateFontFamilyCache({ fontFamilyCache }, fontNames) {
      /* 缓存字体 */
      if (isArray(fontNames)) {
        /* 首次加载 */
        fontFamilyCache.splice(0)
        fontNames.forEach(fontName => fontFamilyCache.push(fontName))
      } else {
        fontFamilyCache.push(fontNames)
      }
    },
    // setCurComponentEffect({ curComponent }, { type, index, style }) {
    //   /*
    //    ** 改变当前组件的特效
    //    ** 文字组件 textEffects属性
    //    */
    //   Object.keys(style).forEach(key => {
    //     curComponent.style.textEffects[index][type][key] = style[key]
    //   })
    // },
    // addTextEffect(state, type) {
    //   if (state.curComponent.type === 'text') {
    //     if (
    //       state.curComponent.style.textEffects.length &&
    //       !state.curComponent.style.textEffects[0][type]
    //     ) {
    //       state.curComponent.style.textEffects[0][type] = cloneDeep(
    //         state[`textEffect_${type}`]
    //       )
    //     } else {
    //       const effectObj = {}
    //       effectObj[type] = cloneDeep(state[`textEffect_${type}`])
    //       state.curComponent.style.textEffects.unshift(effectObj)
    //     }
    //   }
    // },
    // deleteTextEffect(state, { type, index }) {
    //   if (state.curComponent.type === 'text') {
    //     delete state.curComponent.style.textEffects[index][type]
    //     if (
    //       Object.keys(state.curComponent.style.textEffects[index]).length === 0
    //     ) {
    //       state.curComponent.style.textEffects.splice(index, 1)
    //     }
    //   }
    // },
    flipCurComponent({ curComponent }, type) {
      /* 翻转组件 */
      if (!curComponent.style.scale) return
      switch (type) {
        case 'hor':
          curComponent.style.scale.scaleX = -curComponent.style.scale.scaleX
          break
        case 'ver':
          curComponent.style.scale.scaleY = -curComponent.style.scale.scaleY
          break
        default:
          return
      }
    }
  },
  modules: {
    ContextMenu: contextMenu,
    ZoomCanvas: zoomCanvas,
    CtrlComponent: ctrlComponent,
    ComponentLists: componentLists,
    ComponentEffect: componentEffect
  }
}
