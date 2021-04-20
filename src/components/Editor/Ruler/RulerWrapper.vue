<template>
  <!-- :style="getContainerStyle()" -->
  <div class="reference-container" :class="getContainerClassName()">
    <CanvasRuler
      :vertical="vertical"
      :scaleRatio="canvasData.scaleRatio"
      :width="getCanvasWidth()"
      :height="getCanvasHeight()"
      :canvasConfigs="canvasConfigs"
      :style="{ transform: `scale(${canvasData.scaleRatio})` }"
      @onAddLine="addNewLine"
      @onIndicatorMove="indicatorMove"
      @onIndicatorHide="indicatorHide"
    />
    <div
      class="lines"
      :class="getLinesClassName()"
      v-if="lines.length"
      :style="offsetStyle"
    >
      <LinerRuler
        v-for="(line, index) in lines"
        :key="line.id"
        :lineKey="index"
        :value="line.value"
        :canvasData="canvasData"
        :vertical="vertical"
        @deleteLine="deleteLine"
      />
    </div>
    <div
      class="indicator"
      :class="getIndicatorClassName()"
      :style="indicatorStyle"
      v-if="indicatorShow"
    >
      <!-- <span>{{ indicatorOffSet }}</span> -->
    </div>
  </div>
</template>

<script>
import { generateIDNormal } from 'utils/utils'
export default {
  data() {
    return {
      indicatorOffSet: 0,
      indicatorShow: false
    }
  },
  props: {
    ruleSize: {
      type: Number,
      require: true
    },
    canvasConfigs: {
      type: Object,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    },
    editorOffset: {
      type: DOMRect,
      require: true
    },
    vertical: {
      type: Boolean,
      require: true
    },
    lines: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    CanvasRuler: () =>
      import(
        /* webpackChunkName: "Ruler" */ 'components/Editor/Ruler/CanvasRuler.vue'
      ),
    LinerRuler: () =>
      import(
        /* webpackChunkName: "Ruler" */ 'components/Editor/Ruler/LineRuler.vue'
      )
  },
  computed: {
    offsetStyle() {
      return this.vertical
        ? { top: this.editorOffset.top + 'px' }
        : { left: this.editorOffset.left + 'px' }
    },
    indicatorStyle() {
      return this.vertical
        ? { transform: `translateY(${this.indicatorOffSet}px)` }
        : { transform: `translateX(${this.indicatorOffSet}px)` }
    }
  },
  methods: {
    getContainerClassName() {
      return this.vertical ? 'v-container' : 'h-container'
    },
    getLinesClassName() {
      return this.vertical ? 'v-lines' : 'h-lines'
    },
    getIndicatorClassName() {
      return this.vertical ? 'v-indicator' : 'h-indicator'
    },
    getCanvasWidth() {
      return this.vertical ? this.ruleSize : this.canvasData.width
    },
    getCanvasHeight() {
      return this.vertical ? this.canvasData.height : this.ruleSize
    },
    addNewLine(value) {
      // 增加参考线
      this.lines.push({ id: generateIDNormal(), value })
    },
    deleteLine(key) {
      // 删除参考线
      this.lines.splice(key, 1)
    },
    indicatorMove(offset) {
      this.indicatorShow = true
      this.indicatorOffSet = offset * this.canvasData.scaleRatio
    },
    indicatorHide() {
      this.indicatorShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.lines {
  position: fixed;
}
// 横向标尺样式
.h-container {
  width: 100%;
  height: 25px;
  left: 0;
  canvas {
    transform-origin: 0 bottom;
    float: left;
  }
  .h-lines {
    width: 2px;
    height: 100vh;
    top: 0;
  }
}
// 纵向标尺样式
.v-container {
  width: 25px;
  height: 100%;
  top: 0;
  canvas {
    transform-origin: right 0;
  }
  .v-lines {
    width: 100vw;
    height: 2px;
    left: 0;
  }
}
.indicator {
  position: absolute;
  opacity: 0.8;
  user-select: none;
  pointer-events: none;
  span {
    white-space: nowrap;
  }
  &.h-indicator {
    border-left: 1px dashed #000000;
    bottom: 0;
    left: 0;
    height: 50%;
    width: 1px;
  }
  &.v-indicator {
    border-top: 1px dashed #000000;
    right: 0;
    top: 0;
    width: 50%;
    height: 1px;
  }
}
</style>
