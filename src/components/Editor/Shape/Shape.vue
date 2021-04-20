<template>
  <!-- @click.exact="selectCurComponent" -->
  <div
    class="shape"
    id="shape"
    :class="{ active: this.active }"
    @mousedown.left.ctrl="ctrlComponent"
    @click="selectCurComponent"
    @mousedown.exact="handleMouseDownOnShape"
    @dblclick="handleDblclick"
    ref="shape"
  >
    <div
      class="shape-point editor-transition"
      v-for="(item, index) in active
        ? componentType === 'VText'
          ? pointListText
          : pointList
        : []"
      :class="'editor-grip-' + item"
      @mousedown="handleMouseDownOnPoint(item, $event)"
      :key="index"
      :style="getPointStyle(item)"
    >
      <b></b>
    </div>
    <div
      class="editor-rotator editor-transition"
      v-if="active"
      @mousedown="handleMouseDownOnRotate"
    >
      <b>
        <span v-if="rotateShowTips">{{ element.style.rotate }}°</span>
      </b>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
@import 'index.scss';
</style>

<script>
import eventBus from 'utils/eventBus'
import calculateComponentRotate from 'utils/calculateComponentRotate'
import calculateComponentPositonAndSize from '@/utils/calculateComponentPositonAndSize'
import getTextHeight from 'utils/getTextHeight'
import { mapState } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    element: {
      require: true,
      type: Object
    },
    defaultStyle: {
      require: true,
      type: Object
    },
    zIndex: {
      require: true,
      type: [Number, String]
    }
  },
  data() {
    return {
      rotateShowTips: false, // 是否需要显示旋转角度
      pointList: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      pointListText: ['r', 'l', 'lt', 'rt', 'lb', 'rb'], // 文字需要的点
      initialAngle: {
        // 每个点对应的初始角度
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315
      },
      angleToCursor: [
        // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' }
      ],
      cursors: {},
      editor: null,
      preComponent: null
    }
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData,
      curComponent: state => state.Canvas.curComponent,
      editing: state => state.Canvas.editing,
      curTextDom: state => state.Canvas.curTextDom,
      ctrlComponentData: state => state.Canvas.CtrlComponent.ctrlComponentData
    }),
    componentType() {
      return this.element.component
    }
  },
  mounted() {
    this.editor = document.querySelector('#editor')
  },
  methods: {
    getPointStyle(point) {
      /* 设置操作矩形的操作点的位置样式 */
      const { width, height } = this.defaultStyle
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0

      // 四个角的点
      if (point.length === 2) {
        newLeft = hasL ? 0 : width
        newTop = hasT ? 0 : height
      } else {
        // 上下两点的点，宽度居中
        if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT ? 0 : height
        }

        // 左右两边的点，高度居中
        if (hasL || hasR) {
          newLeft = hasL ? 0 : width
          newTop = Math.floor(height / 2)
        }
      }

      const style = {
        marginLeft: hasR ? '-5px' : '-6px',
        marginTop: hasB ? '-5px' : '-6px',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        cursor: this.cursors[point]
      }

      return style
    },
    handleMouseDownOnShape(e) {
      /* 操作矩形 绑定鼠标事件 */
      !this.editing && e.preventDefault()
      e.stopPropagation()
      this.$store.commit('Canvas/ContextMenu/hideContexeMenu')
      /* 删除ctrl组合中的组合数据 S */
      this.ctrlComponentData.length &&
        this.$store.commit('Canvas/CtrlComponent/clearCtrlComponent')
      /* 删除ctrl组合中的组合数据 E */
      const preComponent = this.curComponent
      this.$store.commit('Canvas/setCurComponent', {
        component: this.element,
        zIndex: this.zIndex
      })
      this.cursors = this.getCursor() // 根据旋转角度获取光标位置

      /* 处理文字 */
      if (this.element.component === 'VText' && preComponent !== this.element) {
        /* 文字外框的高度根据span元素来计算 */
        this.$nextTick(() => {
          const editorElementCurrent = document.querySelectorAll(
            '.editor-element-current .editor-element-text'
          )[0]
          const curDom = editorElementCurrent.querySelectorAll(
            '.element-inner:last-of-type'
          )[0]
          this.$store.commit('Canvas/setCurTextDom', curDom)
          this.$store.commit('Canvas/setShapeStyle', {
            height: getTextHeight(this.curTextDom, this.canvasData.scaleRatio)
          })
        })
      }

      const pos = { ...this.defaultStyle }
      const startY = e.clientY
      const startX = e.clientX
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startTop = Number(pos.top)
      const startLeft = Number(pos.left)

      // 如果元素没有移动，则不保存快照
      let hasMove = false
      let isFirst = true // 解决第一次点击的时候组件会出现移动情况
      const move = moveEvent => {
        if (isFirst) {
          isFirst = false
          return
        }
        hasMove = true
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        pos.top = currY - startY + startTop
        pos.left = currX - startX + startLeft

        // 修改当前组件样式
        this.$store.commit('Canvas/setShapeStyle', pos)
        // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
        // 如果不使用 $nextTick，吸附后将无法移动
        this.$nextTick(() => {
          // 触发元素移动事件，用于显示标线、吸附功能
          // 后面两个参数代表鼠标移动方向
          // currY - startY > 0 true 表示向下移动 false 表示向上移动
          // currX - startX > 0 true 表示向右移动 false 表示向左移动
          eventBus.$emit(
            'move',
            this.$el,
            currY - startY > 0,
            currX - startX > 0
          )
        })
      }

      const up = () => {
        hasMove && this.$store.commit('Canvas/recordSnapshot')
        hasMove = !hasMove
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.$emit('unmove')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    selectCurComponent(e) {
      e.stopPropagation()
      e.preventDefault()
      this.$store.commit('Canvas/ContextMenu/hideContexeMenu')
    },
    handleDblclick() {
      /* 操作矩形 绑定双击事件 */
      switch (this.element.component) {
        case 'VText':
          // 双击文字组件
          this.$store.commit('Canvas/setEditing', true)
          this.$nextTick(() => {
            this.$slots.default[0].componentInstance.$refs.editor.focus()
          })
          break
        case 'VImage':
          //  处理图片双击事件
          break
        default:
          return
      }
    },
    handleMouseDownOnPoint(point, e) {
      // 八个点处理
      e.stopPropagation()
      e.preventDefault()

      const style = { ...this.defaultStyle }

      // 原矩形宽高比例
      const height = Number(style.height)
      const width = Number(style.width)
      const proportion = width / height
      const fontSize = style.fontSize
      const letterSpacing = style.letterSpacing

      const originStyle = {
        proportion,
        width,
        height,
        fontSize,
        letterSpacing,
        scaleRatio: this.canvasData.scaleRatio
      }

      const editorRectInfo = this.editor.getBoundingClientRect()

      // 获取组件的的中心坐标（无论旋转角度，中心坐标都不会变）
      const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2
      }

      // 当前点击坐标
      const startPoint = {
        x: e.clientX - editorRectInfo.left,
        y: e.clientY - editorRectInfo.top
      }

      // 获取对称点的坐标
      const symmetricPoint = {
        x: center.x - (startPoint.x - center.x),
        y: center.y - (startPoint.y - center.y)
      }

      // 是否需要保存快照
      let needSave = false
      let isFirst = true
      const move = moveEvent => {
        if (isFirst) {
          isFirst = false
          return
        }
        needSave = true

        const curPositon = {
          x: moveEvent.clientX - editorRectInfo.left,
          y: moveEvent.clientY - editorRectInfo.top
        }

        calculateComponentPositonAndSize(
          point,
          style,
          originStyle,
          curPositon,
          {
            center,
            startPoint,
            symmetricPoint
          }
        )
        if (point.length === 1 && this.componentType === 'VText') {
          style.height = getTextHeight(
            this.curTextDom,
            this.canvasData.scaleRatio
          )
          style.width = Math.max(
            (this.defaultStyle.fontSize + 1) * this.canvasData.scaleRatio,
            style.width
          )
        }
        this.componentType === 'VText' &&
          this.$store.commit('Canvas/setCurComponentStyle', style)
        // 同步更新外形样式
        this.$store.commit('Canvas/setShapeStyle', style)
      }

      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        needSave && this.$store.commit('Canvas/recordSnapshot')
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    handleMouseDownOnRotate(e) {
      // 旋转处理
      e.preventDefault()
      e.stopPropagation()
      this.rotateShowTips = !this.rotateShowTips
      const pos = { ...this.defaultStyle }
      const startRotate = pos.rotate // 记录原始旋转角度

      const startX = e.clientX,
        startY = e.clientY

      // 获取元素中心点位置
      const rect = this.$el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // 是否需要保存快照
      let needSave = false
      const move = moveEvent => {
        needSave = true
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        /* 计算旋转角度 */
        pos.rotate = calculateComponentRotate(
          startRotate,
          [centerX, centerY],
          [startX, startY],
          [curX, curY]
        )
        // 同步更新外形样式
        this.$store.commit('Canvas/setShapeStyle', pos)
      }

      const up = () => {
        this.rotateShowTips = !this.rotateShowTips
        needSave && this.$store.commit('Canvas/recordSnapshot')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        this.cursors = this.getCursor() // 根据旋转角度获取光标位置
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    getCursor() {
      const { angleToCursor, initialAngle, pointList, curComponent } = this
      const rotate = (curComponent.style.rotate + 360) % 360 // 防止角度有负数，所以 + 360
      const result = {}
      let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度
      pointList.forEach(point => {
        const angle = (initialAngle[point] + rotate) % 360
        const len = angleToCursor.length
        const flag = true
        while (flag) {
          lastMatchIndex = (lastMatchIndex + 1) % len
          const angleLimit = angleToCursor[lastMatchIndex]
          if (angle < 23 || angle >= 338) {
            result[point] = 'nw-resize'
            return
          }

          if (angleLimit.start <= angle && angle < angleLimit.end) {
            result[point] = angleLimit.cursor + '-resize'
            return
          }
        }
      })

      return result
    },
    handleContextMenu(e) {
      // this.$forceUpdate()
      e.stopPropagation()
      e.preventDefault()

      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.offsetY
      let left = e.offsetX
      while (!target.className.includes('editor')) {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      }
      this.$store.commit('Canvas/ContextMenu/showContexeMenu', { top, left })
    },
    ctrlComponent(e) {
      /* 为ctrl多选添加的方法 */
      e.stopPropagation()
      if (!this.curComponent && !this.ctrlComponentData.length) return false // 如果没有上一个活跃的组件 和 ctrl组合中没有组件则没办法往里面加临时组件
      if (this.curComponent) {
        this.$store.commit('Canvas/CtrlComponent/addCtrlComponent', [
          this.curComponent
        ])
      }
      this.$store.commit('Canvas/CtrlComponent/addCtrlComponent', [
        this.element
      ])
      this.$store.commit('Canvas/clearCurComponent')
    }
  }
}
</script>
