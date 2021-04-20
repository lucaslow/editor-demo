/* ContextMenu store */
import { swap, generateID } from 'utils/utils'
import { message } from 'ant-design-vue'
import cloneDeep from 'lodash/cloneDeep'
export default {
  namespaced: true,
  state: {
    menuTop: 0,
    menuLeft: 0,
    menuShow: false,
    menuType: 'component', // component OR Editor
    copyComponent: [] // 存储复制的组件队列
  },
  mutations: {
    showContexeMenu(state, { top, left, menuType = 'component' }) {
      state.menuShow = true
      state.menuTop = top
      state.menuLeft = left
      state.menuType = menuType
    },
    hideContexeMenu(state) {
      state.menuShow = false
    },
    deleteComponent() {
      /* 删除组件 */
      const { componentData, curComponentZIndex } = this.state.Canvas
      componentData.splice(curComponentZIndex, 1)
      this.commit('Canvas/clearCurComponent')
    },
    upComponent() {
      /* 组件向上移动一个层级 （数组序号往后） */
      const { componentData, curComponentZIndex } = this.state.Canvas
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, curComponentZIndex + 1)
        this.commit('Canvas/setCurComponent', {
          zIndex: curComponentZIndex + 1
        })
      } else {
        message.warning('已经位于最顶部', 1)
      }
    },
    downComponent() {
      /* 组件向下移动一个层级 （数组序号往前 */
      const { componentData, curComponentZIndex } = this.state.Canvas
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, curComponentZIndex - 1)
        this.commit('Canvas/setCurComponent', {
          zIndex: curComponentZIndex - 1
        })
      } else {
        message.warning('已经位于最底部', 1)
      }
    },
    topComponent() {
      /* 组件置顶 */
      const { componentData, curComponentZIndex } = this.state.Canvas
      if (curComponentZIndex < componentData.length - 1) {
        swap(componentData, curComponentZIndex, componentData.length - 1)
        this.commit('Canvas/setCurComponent', {
          zIndex: componentData.length - 1
        })
      } else {
        message.warning('已经位于最顶部', 1)
      }
    },
    bottomComponent() {
      /* 组件置底 */
      const { componentData, curComponentZIndex } = this.state.Canvas
      if (curComponentZIndex > 0) {
        swap(componentData, curComponentZIndex, 0)
        this.commit('Canvas/setCurComponent', {
          zIndex: 0
        })
      } else {
        message.warning('已经位于最底部', 1)
      }
    },
    COPYCOMPONENT({ copyComponent }, { curComponent }) {
      // 复制组件
      if (curComponent) {
        copyComponent.length = 0
        const cloneCom = cloneDeep(curComponent)
        cloneCom.style.top -= 10
        cloneCom.style.left += 10
        copyComponent.push(cloneCom)
      }
    },
    PASTECOMPONENT({ copyComponent }, { componentData }) {
      // 粘贴组件
      if (copyComponent.length) {
        copyComponent.forEach(com => {
          const deepCom = cloneDeep(com)
          deepCom.id = `${deepCom.type}-${generateID()}`
          componentData.push(deepCom)
          /* 设置为当前活跃组件 */
          this.commit('Canvas/setCurComponent', {
            component: deepCom,
            zIndex: componentData.length - 1
          })
        })
      } else {
        message.warning('没有可粘贴的组件', 1)
      }
    }
  },
  actions: {
    copyComponent(context) {
      /* 组件复制 ACTION */
      context.commit('COPYCOMPONENT', context.rootState.Canvas)
    },
    pasteComponent(context) {
      /* 组件粘贴 ACTION */
      context.commit('PASTECOMPONENT', context.rootState.Canvas)
    }
    // deleteComponent(context) {
    //   /* 删除组件 ACTION */
    //   // context.commit('DELETECOMPONENT', context.rootState.Canvas)
    //   const { componentData, curComponentZIndex } = context.rootState.Canvas
    //   componentData.splice(curComponentZIndex, 1)
    // },
    // upComponent(context) {
    //   /* 组件向上移动一个层级 （数组序号往后） ACTION */
    //   // context.commit('UPCOMPONENT', context.rootState.Canvas)
    //   const { componentData, curComponentZIndex } = context.rootState.Canvas
    //   if (curComponentZIndex < componentData.length - 1) {
    //     swap(componentData, curComponentZIndex, curComponentZIndex + 1)
    //   } else {
    //     message.warning('已经位于最顶部', 1)
    //   }
    // },
    // downComponent(context) {
    //   /* 组件向下移动一个层级 （数组序号往前） ACTION */
    //   // context.commit('DOWNCOMPONENT', context.rootState.Canvas)
    //   const { componentData, curComponentZIndex } = context.rootState.Canvas
    //   if (curComponentZIndex > 0) {
    //     swap(componentData, curComponentZIndex, curComponentZIndex - 1)
    //   } else {
    //     message.warning('已经位于最底部', 1)
    //   }
    // },
    // topComponent(context) {
    //   /* 组件置顶 ACTION */
    //   // context.commit('TOPCOMPONENT', context.rootState.Canvas)
    //   const { componentData, curComponentZIndex } = context.rootState.Canvas
    //   if (curComponentZIndex < componentData.length - 1) {
    //     swap(componentData, curComponentZIndex, componentData.length - 1)
    //   } else {
    //     message.warning('已经位于最顶部', 1)
    //   }
    // },
    // bottomComponent(context) {
    //   /* 组件置底 ACTION */
    //   // context.commit('BOTTOMCOMPONENT', context.rootState.Canvas)
    //   const { componentData, curComponentZIndex } = context.rootState.Canvas
    //   if (curComponentZIndex > 0) {
    //     swap(componentData, curComponentZIndex, 0)
    //   } else {
    //     message.warning('已经位于最底部', 1)
    //   }
    // },
  },
  modules: {}
}
