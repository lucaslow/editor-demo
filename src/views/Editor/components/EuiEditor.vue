<template>
  <div
    class="eui-editorContainer"
    :style="getEditorContainerStyle()"
    @mousedown="clearActiveComponent"
    @contextmenu="handleContextMenu"
  >
    <!-- 主画布 -->
    <div
      class="editor-shellWrap"
      :style="{
        width: canvasData.width * canvasData.scaleRatio + 'px',
        height: canvasData.height * canvasData.scaleRatio + 'px'
      }"
    >
      <!-- backgroundColor: canvasData.backgroundColor -->
      <div
        class="editor-shell editor-global-wrap"
        id="editor"
        :style="{
          width: canvasData.width * canvasData.scaleRatio + 'px',
          height: canvasData.height * canvasData.scaleRatio + 'px'
        }"
      >
        <!-- 画布显示区 -->
        <ComponentStage
          :componentData="componentData"
          :curComponent="curComponent"
          :canvasData="canvasData"
          :scaleRatio="canvasData.scaleRatio"
          :editing="editing"
        />
        <!-- 操作矩形 -->
        <Shape
          v-for="(item, index) in componentData"
          :defaultStyle="item.style"
          :style="getShapeStyle(item.style, 20)"
          :key="item.id"
          :active="item === curComponent"
          :class="{ 'editor-shape-selected': ctrlComponentData.includes(item) }"
          :element="item"
          :zIndex="index"
        >
          <component
            v-if="item.component === 'VText' && isEditingComponet(item)"
            :class="{
              'editor-element-editing': isEditingComponet(item)
            }"
            :key="item.id"
            class="editor-text-editor"
            @input="handleInput"
            :is="item.component"
            :style="getTextComponetStyle(item.style)"
            :unitStyle="getComponentStyle(item.style)"
            :defaultStyle="item.style"
            :propValue="item.propValue"
            :element="item"
            :editable="true"
            :editing="isEditingComponet(item)"
          />
        </Shape>

        <!-- ctrl 多选 -->
        <CtrlShape
          v-if="ctrlComponentData.length > 1"
          :style="getShapeStyle(ctrlComponentStyle, 2)"
          :componentData="componentData"
          :ctrlComponentStyle="ctrlComponentStyle"
          :ctrlComponentData="ctrlComponentData"
          :key="10"
          :active="ctrlComponentData.length > 1 ? true : false"
          :zIndex="1"
        >
        </CtrlShape>
        <!-- 右击菜单 -->
        <ContextMenu />
        <!-- 拖动参考线 -->
        <MarkLine />
        <!-- 标尺参考线 -->
        <Ruler :canvasData="canvasData" />
        <!-- 背景操作 -->
        <BackgroundEditor v-if="bgEditing" :canvasData="canvasData" />
      </div>
    </div>
    <div class="editor-bottom">
      <Buttonbar />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getStyle from '@/utils/style'
import getTextHeight from 'utils/getTextHeight'
export default {
  name: 'EuiEditor',
  data() {
    return {
      tIndex: 0,
      parentProps: ['top', 'left', 'width', 'height', 'zIndex', 'rotate'] // 父节点的属性
    }
  },
  components: {
    Shape: () =>
      import(
        /* webpackChunkName: "Shape" */ 'components/Editor/Shape/Shape.vue'
      ),
    CtrlShape: () =>
      import(
        /* webpackChunkName: "CtrlShape" */ 'components/Editor/Shape/CtrlShape.vue'
      ),
    MarkLine: () =>
      import(
        /* webpackChunkName: "MarkLine" */ 'components/Editor/MarkLine.vue'
      ),
    ContextMenu: () =>
      import(
        /* webpackChunkName: "ContextMenu" */ 'components/Editor/ContextMenu.vue'
      ),
    Buttonbar: () =>
      import(
        /* webpackChunkName: "Buttonbar" */ 'components/Editor/Buttonbar.vue'
      ),
    Ruler: () =>
      import(
        /* webpackChunkName: "Ruler" */ 'components/Editor/Ruler/Ruler.vue'
      ),
    ComponentStage: () =>
      import(
        /* webpackChunkName: "ComponentStage" */ 'components/Editor/ComponentStage.vue'
      ),
    BackgroundEditor: () =>
      import(
        /* webpackChunkName: "BackgroundEditor" */ 'components/Editor/BackgroundEditor/BackgroundEditor.vue'
      )
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData,
      componentData: state => state.Canvas.componentData,
      curComponent: state => state.Canvas.curComponent,
      editing: state => state.Canvas.editing,
      bgEditing: state => state.Canvas.bgEditing,
      curTextDom: state => state.Canvas.curTextDom,
      ctrlComponentStyle: state =>
        state.Canvas.CtrlComponent.ctrlComponentStyle,
      ctrlComponentData: state => state.Canvas.CtrlComponent.ctrlComponentData
    })
  },
  methods: {
    getEditorContainerStyle() {
      const euiMain = document.getElementById('euiMain')
      const rectInfo = euiMain.getBoundingClientRect()
      const paddingTop =
        Math.round(
          Math.round(rectInfo.height) -
            this.canvasData.height * this.canvasData.scaleRatio
        ) /
          2 -
        30
      return {
        'padding-top': paddingTop + 'px'
      }
    },
    getShapeStyle(style, index) {
      // index 表示componeData里面的索引，也表示对应组件的zIndex
      const result = { ...style }
      const shapeStyle = {}
      shapeStyle.transform = ''
      this.parentProps.forEach(key => {
        if (Object.hasOwnProperty.call(result, key)) {
          if (key === 'rotate') {
            shapeStyle.transform += `rotate(${result.rotate}deg)`
          } else {
            shapeStyle[key] = result[key] + 'px'
          }
        }
      })
      // 按顺序添加 z-index 层级
      shapeStyle.zIndex = index
      return shapeStyle
    },
    getComponentStyle(style) {
      return getStyle(style, this.parentProps)
    },
    getTextComponetStyle(style) {
      /* 画布缩放的时候 VText组件fontSize不需要变换， 在最外层div标签设置scale值 */
      const zoomReci = 1 / this.canvasData.scaleRatio
      const width = style.width * zoomReci
      const height = style.height * zoomReci
      return {
        width: width + 'px',
        height: height + 'px',
        transform: `scale(${this.canvasData.scaleRatio})`
      }
    },
    isEditingComponet(componet) {
      return this.editing && componet === this.curComponent
    },
    handleInput(element) {
      // element.propValue = value.replaceAll('\n', '<br>')
      // 根据文本组件高度调整 shape 高度
      this.$nextTick(() => {
        this.$store.commit('Canvas/setShapeStyle', {
          height: getTextHeight(element, this.canvasData.scaleRatio)
        })
        element = null
      })
    },
    clearActiveComponent(e) {
      if (e.target.className.includes('editor')) {
        this.$store.commit('Canvas/ContextMenu/hideContexeMenu')
        this.$store.commit('Canvas/clearCurComponent')
      }
    },
    handleContextMenu(e) {
      e.stopPropagation()
      e.preventDefault()
      let menuType = 'component'
      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.offsetY
      let left = e.offsetX
      if (target.className.includes('shape')) {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      } else if (target.className.includes('background')) {
        menuType = 'editor'
      } else {
        return
      }
      this.$store.commit('Canvas/ContextMenu/showContexeMenu', {
        top,
        left,
        menuType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.eui-editorContainer {
  overflow: auto;
  z-index: 1;
  flex: 1;
  width: 100%;
  height: 100%;
}
.editor-shellWrap {
  position: relative;
  box-sizing: content-box;
  padding: 30px;
  margin: 0 auto;
  .editor-shell {
    box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
  }
}
.editable-element-wrap {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  @include userSelectNone;
  .editor-shape {
    position: absolute;
  }
}
.editor-bottom {
  display: flex;
  position: absolute;
  bottom: 26px;
  right: 24px;
  z-index: 20;
}
</style>
