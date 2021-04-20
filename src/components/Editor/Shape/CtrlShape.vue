<template>
  <!-- @click.exact="selectCurComponent" -->
  <!-- @dblclick="handleDblclick" -->
  <!-- @mousedown="handleMouseDown" -->
  <div
    class="shape shape-multiple"
    id="shape"
    :class="{ active: this.active }"
    @click="clearCtrlComponent"
    @mousedown="handleMouseDownOnShape"
    @contextmenu="handleContextMenu"
    ref="shape"
  >
    <div
      class="shape-point editor-transition"
      v-for="(item, index) in active ? pointListCrtl : []"
      :class="'editor-grip-' + item"
      @mousedown="handleMouseDownOnPoint(item)"
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
        <span v-if="rotateShowTips">{{ ctrlComponentStyle.rotate }}°</span>
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
import getTextHeight from 'utils/getTextHeight'
import { getIncludeComponent } from 'utils/calculateComponentData'
import { mapState } from 'vuex'

export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    componentData: {
      require: true,
      type: Array
    },
    zIndex: {
      require: true,
      type: [Number, String]
    },
    ctrlComponentStyle: {
      require: true,
      type: Object
    },
    ctrlComponentData: {
      require: true,
      type: Array
    }
  },
  data() {
    return {
      rotateShowTips: false, // 是否需要显示旋转角度
      pointList: ['t', 'r', 'b', 'l', 'lt', 'rt', 'lb', 'rb'],
      pointListCrtl: ['lt', 'rt', 'lb', 'rb'], // 文字需要的点
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
      editor: null,
      cursors: {},
      isClick: true
    }
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData
    }),
    componentType() {
      return this.element ? this.element.component : 'Ctrl'
    }
  },
  mounted() {
    this.editor = document.querySelector('#editor')
    this.cursors = this.getCursor() // 根据旋转角度获取光标位置
  },
  methods: {
    getPointStyle(point) {
      /* 设置操作矩形的操作点的位置样式 */
      const { width, height } = this.ctrlComponentStyle
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
      e.preventDefault()
      e.stopPropagation()
      let startTime, endTime // 定义起始时间和结束时间

      const style = { ...this.ctrlComponentStyle }
      const startY = e.clientY
      const startX = e.clientX
      // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
      const startTop = Number(style.top)
      const startLeft = Number(style.left)
      const ctrlComponentStartStyle = []
      // 遍历保存CTRL下的所有组件 的初始样式
      this.ctrlComponentData.forEach(component => {
        ctrlComponentStartStyle.push({ ...component.style })
      })

      // 如果元素没有移动，则不保存快照
      let hasMove = false
      startTime = new Date().getTime() //获取事件开始时间
      this.isClick = true
      const move = moveEvent => {
        hasMove = true
        const ctrlComponentStyle = []
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        style.top = currY - startY + startTop
        style.left = currX - startX + startLeft

        ctrlComponentStartStyle.forEach(styleObj => {
          ctrlComponentStyle.push({
            top: currY - startY + styleObj.top,
            left: currX - startX + styleObj.left
          })
        })
        // 修改当前组件样式
        this.$store.commit('Canvas/CtrlComponent/setCtrlShapeStyle', style)
        this.$store.commit(
          'Canvas/CtrlComponent/setCtrlComponentStyle',
          ctrlComponentStyle
        )
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

        endTime = new Date().getTime()
        let timeDiffer = endTime - startTime //获取抬起时间
        if (timeDiffer < 100) {
          //时间间隔小于100,那么就判断为单击事件,这里时间间隔可自由设置
          this.isClick = true
        } else {
          this.isClick = false
        }
        // 触发元素停止移动事件，用于隐藏标线
        eventBus.$emit('unmove')
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    handleMouseDownOnPoint(point) {
      // 八个点处理
      const downEvent = window.event
      downEvent.stopPropagation()
      downEvent.preventDefault()

      const pos = { ...this.defaultStyle }
      const height = Number(pos.height)
      const width = Number(pos.width)
      const top = Number(pos.top)
      const left = Number(pos.left)
      const fontSize = Number(pos.fontSize)

      const startX = downEvent.clientX
      const startY = downEvent.clientY

      const editorRectInfo = this.editor.getBoundingClientRect()

      // 是否需要保存快照
      let needSave = false
      const move = moveEvent => {
        needSave = true
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        const disY = currY - startY
        const disX = currX - startX
        const hasT = /t/.test(point)
        const hasB = /b/.test(point)
        const hasL = /l/.test(point)
        const hasR = /r/.test(point)
        let newHeight = height + (hasT ? -disY : hasB ? disY : 0)
        let newWidth = width + (hasL ? -disX : hasR ? disX : 0)
        /* 参考点的坐标 */
        const locatePointY = top + (hasT ? height : 0)
        const locatePointX = left + (hasL ? width : 0)
        let lastedDisY = disY
        if (point.length === 2) {
          /* 如果是四个角的点则等比例缩放 */
          newHeight = Math.round((newWidth / width) * height)
          if (this.componentType === 'VText') {
            /* 计算鼠标移动的距离（以参照点计算）和组件的对角边长度的比值，作为文字缩放比例 */
            const activeLength = Math.sqrt(
              Math.pow(currX - editorRectInfo.left - locatePointX, 2) +
                Math.pow(currY - editorRectInfo.top - locatePointY, 2)
            )
            const originLength = Math.sqrt(
              Math.pow(width, 2) + Math.pow(height, 2)
            )
            let scale = activeLength / originLength
            if (scale < 0.1) {
              scale = 0.1
            }
            newWidth = width * scale
            newHeight = height * scale
            pos.fontSize = Math.floor(fontSize * scale)
            this.$store.commit('Canvas/setCurComponentStyle', pos)
          }
          lastedDisY = height - newHeight
        } else {
          if (this.componentType === 'VText') {
            newHeight = getTextHeight(
              this.curTextDom,
              this.canvasData.scaleRatio
            )
            newWidth = Math.max(this.defaultStyle.fontSize + 1, newWidth)
          }
        }
        pos.left = left + (hasL ? disX : 0)
        pos.top = top + (hasT ? lastedDisY : 0)
        pos.height = newHeight > 0 ? newHeight : 0
        pos.width = newWidth > 0 ? newWidth : 0
        // 同步更新外形样式
        this.$store.commit('Canvas/setShapeStyle', pos)
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
      const pos = { ...this.ctrlComponentStyle }
      const startRotate = pos.rotate // 记录原始旋转角度
      const ctrlComponentStartRotate = []
      // 遍历保存CTRL下的所有组件 的初始样式
      this.ctrlComponentData.forEach(component => {
        ctrlComponentStartRotate.push({ rotate: component.style.rotate })
      })
      const startX = e.clientX,
        startY = e.clientY

      // 获取元素中心点位置
      const rect = this.$el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // 旋转前的角度
      const rotateDegreeBefore =
        Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

      // 是否需要保存快照
      let needSave = false
      const move = moveEvent => {
        needSave = true
        const curX = moveEvent.clientX
        const curY = moveEvent.clientY
        const ctrlComponentStyle = []

        // 旋转后的角度
        const rotateDegreeAfter =
          Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)

        // 获取旋转的角度值
        pos.rotate = Math.round(
          startRotate + rotateDegreeAfter - rotateDegreeBefore
        )
        ctrlComponentStartRotate.forEach(styleObj => {
          ctrlComponentStyle.push({
            rotate: Math.round(
              styleObj.rotate + rotateDegreeAfter - rotateDegreeBefore
            )
          })
        })
        // console.log(ctrlComponentStyle)
        // 同步更新外形样式
        this.$store.commit('Canvas/CtrlComponent/setCtrlShapeStyle', pos)
        this.$store.commit(
          'Canvas/CtrlComponent/setCtrlComponentStyle',
          ctrlComponentStyle
        )
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
    getCursor() {
      const {
        angleToCursor,
        initialAngle,
        pointList,
        ctrlComponentStyle
      } = this
      const rotate = (ctrlComponentStyle.rotate + 360) % 360 // 防止角度有负数，所以 + 360
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
    clearCtrlComponent(e) {
      e.stopPropagation()
      this.$store.commit('Canvas/ContextMenu/hideContexeMenu')
      if (this.isClick) {
        const rectInfo = this.editor.getBoundingClientRect()
        const points = {
          x: e.clientX - rectInfo.left,
          y: e.clientY - rectInfo.top
        }
        const includeComponents = getIncludeComponent(
          this.componentData,
          points
        )
        this.$store.commit('Canvas/CtrlComponent/clearCtrlComponent')
        includeComponents.length &&
          this.$store.commit('Canvas/setCurComponent', {
            component: includeComponents[0].component,
            zIndex: includeComponents[0].zIndex
          })
      }
    }
  }
}
</script>
