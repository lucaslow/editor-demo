<template>
  <div class="editable-element-wrap">
    <!-- 显示组件的画布 -->
    <!-- 背景组件 必备组件 -->
    <div class="editor-background" :style="getCanvasStyle()">
      <VBackground :canvasData="canvasData" v-if="colorOrImage === 'image'" />
    </div>
    <!-- 其余组件 显示 -->
    <div
      v-for="(item, index) in componentData"
      class="editor-shape"
      :class="{ 'editor-element-current': item === curComponent }"
      :key="item.id"
      :style="getShapeStyle(item.style, index)"
    >
      <!-- 图片组件 -->
      <component
        v-if="item.component !== 'VText'"
        class="component"
        :is="item.component"
        :style="getComponentStyle(item.style)"
        :propValue="item.propValue"
        :element="item"
        :key="item.id"
      />
      <!-- 文字组件 -->
      <component
        v-else
        class="component"
        :class="{
          'editor-element-editing': isEditingComponet(item)
        }"
        :is="item.component"
        :style="getTextComponetStyle(item.style)"
        :unitStyle="getComponentStyle(item.style)"
        :defaultStyle="item.style"
        :propValue="item.propValue"
        :element="item"
        :key="item.id"
        :editing="isEditingComponet(item)"
      />
    </div>
  </div>
</template>

<script>
import getStyle from '@/utils/style'
export default {
  data() {
    return {
      parentProps: [
        'top',
        'left',
        'width',
        'height',
        'zIndex',
        'rotate',
        'opacity',
        'scale'
      ] // 父节点的属性
    }
  },
  props: {
    componentData: {
      type: Array,
      require: true
    },
    curComponent: {
      type: Object,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    },
    scaleRatio: {
      type: Number,
      require: true
    },
    editing: {
      type: Boolean,
      require: true
    }
  },
  computed: {
    colorOrImage() {
      return this.canvasData.background.colorOrImage
    }
  },
  methods: {
    getCanvasStyle() {
      const initCanvasProps = ['width', 'height', 'backgroundColor']
      const canvasStyle = {}
      initCanvasProps.forEach(prop => {
        if (prop === 'backgroundColor') {
          canvasStyle[prop] = this.canvasData.background.style.backgroundColor
        } else {
          canvasStyle[prop] = this.canvasData[prop] * this.scaleRatio + 'px'
        }
      })
      return canvasStyle
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
          } else if (key === 'opacity') {
            shapeStyle.opacity = result[key]
          } else if (key === 'scale') {
            shapeStyle.transform += ` scale(${result.scale.scaleX}, ${result.scale.scaleY})`
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
      const zoomReci = 1 / this.scaleRatio
      const width = style.width * zoomReci
      const height = style.height * zoomReci
      return {
        width: width + 'px',
        height: height + 'px',
        transform: `scale(${this.scaleRatio})`
      }
    },
    isEditingComponet(componet) {
      return this.editing && componet === this.curComponent
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>

<!-- <div class="editable-element-wrap"> -->
<!-- 显示组件的画布 -->
<!-- <div
        v-for="(item, index) in componentData"
        class="editor-shape"
        :class="{ 'editor-element-current': item === curComponent }"
        :key="item.id"
        :style="getShapeStyle(item.style, index)"
        > -->
<!-- 图片组件 -->
<!-- <component
            v-if="item.component !== 'VText'"
            class="component"
            :is="item.component"
            :style="getComponentStyle(item.style)"
            :propValue="item.propValue"
            :element="item"
          /> -->
<!-- 文字组件 -->
<!-- <component
            v-else
            class="component"
            :class="{
              'editor-element-editing': isEditingComponet(item)
            }"
            :is="item.component"
            :style="getTextComponetStyle(item.style)"
            :unitStyle="getComponentStyle(item.style)"
            :defaultStyle="item.style"
            :propValue="item.propValue"
            :element="item"
          />
        </div>
      </div> -->
