<template>
  <div class="eui-text-effect-common-panel-v1">
    <div class="eui-tabs__header" @click="closeTextEffect">
      <a-icon type="left" class="text-effect-icon" />
      <div class="tag-name">
        <span>高级设置</span>
      </div>
    </div>
    <div class="editor-panel-content">
      <!-- 描边 -->
      <div class="text-effect-row text-effect-stroke">
        <div class="panel-feature-head">
          <span>描边</span>
          <a-icon type="plus" class="plus-icon" @click="addStroke" />
        </div>
        <div class="panel-feature-body">
          <!-- 一条列表 S -->
          <div
            class="panel-feature-item"
            v-for="(strokeProp, index) in strokeData"
            :key="index"
            @mousedown="setCurDetail('stroke', index)"
          >
            <div
              class="panel-feature_color panel-feature_prop"
              @click.stop="showColorPick('stroke', index, $event)"
            >
              <div :style="{ 'background-color': strokeProp.color }"></div>
            </div>
            <!-- @mouseup="recordSnapshot" -->
            <div class="effect-stroke_form">
              <div
                class="effect-stroke-form-cell effect-stroke-width panel-feature_prop"
              >
                <a-input-number
                  :id="`inputNumber_stroke_${index}`"
                  v-model="strokeProp.width"
                  :min="0"
                  :max="100"
                  @change="changeWidth"
                />
              </div>
              <div
                class="effect-stroke-form-cell effect-stroke-type panel-feature_prop"
              >
                <a-select v-model="strokeProp.type" @change="changeStrokeType">
                  <a-select-option
                    :value="type.id"
                    v-for="type in strokeType"
                    :key="type.id"
                  >
                    {{ type.value }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="text-effect-delete" @click="deleteStroke(index)">
              <a-icon type="minus" />
            </div>
            <div
              class="stroke-picker"
              :class="{ 'active-picker': strokeProp.showColorPick }"
              @click.stop
              @mouseup="recordSnapshot"
              v-if="strokeProp.showColorPick"
            >
              <chrome-picker
                class="colorPicker"
                v-model="strokeProp.colorPickVal"
                @input="changeColor"
              />
            </div>
          </div>
          <!-- 一条列表 E -->
        </div>
      </div>
      <a-divider />
      <!-- 投影 -->
      <div class="text-effect-row text-effect-shadow">
        <div class="panel-feature-head">
          <span>投影</span>
          <a-icon type="plus" class="plus-icon" @click="addShadow" />
        </div>
        <div class="panel-feature-body">
          <!-- 一条列表 S -->
          <div
            class="panel-feature-item"
            v-for="(shadowProp, index) in shadowData"
            :key="index"
            @mousedown="setCurDetail('shadow', index)"
          >
            <div
              class="panel-feature_color panel-feature_prop"
              @click.stop="showColorPick('shadow', index, $event)"
            >
              <div :style="{ 'background-color': shadowProp.color }"></div>
            </div>
            <!-- @mouseup="recordSnapshot" -->
            <div class="effect-shadow_form">
              <div
                class="effect-shadow-form-cell effect-shadow-angle panel-feature_prop"
              >
                <!-- 阴影 角度 -->
                <a-input-number
                  :id="`angle_shadow_${index}`"
                  v-model="shadowProp.angle"
                  :min="-180"
                  :max="180"
                  @change="changeAngel"
                />
              </div>
              <div
                class="effect-shadow-form-cell effect-shadow-blur panel-feature_prop"
              >
                <!-- 阴影 模糊 -->
                <a-input-number
                  :id="`blur_shadow_${index}`"
                  v-model="shadowProp.blur"
                  :min="0"
                  :max="180"
                  @change="changeBlur"
                />
              </div>
              <div
                class="effect-shadow-form-cell effect-shadow-distance panel-feature_prop"
              >
                <!-- 阴影 距离 -->
                <a-input-number
                  :id="`distance_shadow_${index}`"
                  v-model="shadowProp.distance"
                  :min="0"
                  :max="180"
                  @change="changeDistance"
                />
              </div>
            </div>
            <div class="text-effect-delete" @click="deleteShadow(index)">
              <a-icon type="minus" />
            </div>
            <div
              class="stroke-picker"
              :class="{ 'active-picker': shadowProp.showColorPick }"
              @click.stop
              @mouseup="recordSnapshot"
              v-if="shadowProp.showColorPick"
            >
              <chrome-picker
                class="colorPicker"
                v-model="shadowProp.colorPickVal"
                @input="changeColor"
              />
            </div>
          </div>
          <div class="effect-shadow-form-label" v-if="shadowData.length">
            <p class="effect-shadow-label">角度</p>
            <p class="effect-shadow-label">模糊</p>
            <p class="effect-shadow-label">距离</p>
          </div>
          <!-- 一条列表 E -->
        </div>
      </div>
      <a-divider />
    </div>
  </div>
</template>

<script>
import eventBus from 'utils/eventBus'
import { radianToAngel, angleToRadian } from 'utils/translate'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'textEffectPanelV1',
  data() {
    return {
      textEffectType: ['stroke', 'shadow'],
      activeEffectType: '', // 当前操作的特效类型
      activeEffectIndex: 0, // 当前操作的特效类型的列表序号
      strokeType: [
        {
          id: 'center',
          value: '居中'
        },
        {
          id: 'outer',
          value: '向外'
        }
      ],
      strokeData: [],
      shadowData: []
    }
  },
  props: {
    curComponent: {
      type: Object,
      require: true
    }
  },
  components: {
    'chrome-picker': () =>
      import(
        /* webpackChunkName: "ColorPicker" */ 'components/Editor/ColorPicker/components/Chrome.vue'
      )
  },
  watch: {
    curComponent() {
      this.closeTextEffect()
    },
    fontSize() {
      this.initTextEffect()
    }
  },
  created() {
    this.initTextEffect()
  },
  mounted() {
    const that = this
    eventBus.$on('hideColorPicker', function() {
      that.strokeData.forEach(stroke => {
        stroke.showColorPick = false
      })
      that.shadowData.forEach(shadow => {
        shadow.showColorPick = false
      })
    })
  },
  computed: {
    fontSize() {
      return this.curComponent.style.fontSize
    }
  },
  methods: {
    closeTextEffect() {
      this.$emit('closeTextEffect')
    },
    initTextEffect() {
      /* 初始化所有的文本特效 */
      this.strokeData.splice(0)
      this.shadowData.splice(0)
      if (
        !this.curComponent.style.textEffects ||
        this.curComponent.style.textEffects.length === 0
      ) {
        return
      }
      this.textEffectType.forEach(type => {
        this.curComponent.style.textEffects.forEach(textEffect => {
          // if (!textEffect.enable) return
          if (textEffect[type]) {
            const textEffectType = cloneDeep(textEffect[type])
            textEffectType.showColorPick = false
            textEffectType.colorPickVal = textEffectType.color
            switch (type) {
              case 'stroke':
                textEffectType.width = Math.floor(textEffectType.width)
                break
              case 'shadow':
                this.handleTextShadow(textEffectType)
                break
              default:
                return
            }
            this[`${type}Data`].push(textEffectType)
          }
        })
      })
    },
    handleTextShadow(data) {
      /* 处理角度 */
      const radian = Math.atan(data.offsetY / data.offsetX)
      data.angle = Math.floor(radianToAngel(radian))
      data.offsetX < 0 && (data.angle += 180)
      /* 处理距离 */
      data.distance = Math.floor(
        Math.sqrt(Math.pow(data.offsetY, 2) + Math.pow(data.offsetX, 2))
      )
    },
    setCurDetail(type, index) {
      /* 设置当前特效的详细 */
      this.activeEffectType = type
      this.activeEffectIndex = index
    },
    recordSnapshot(type = 'color') {
      /* 只有鼠标松开的时候才记录数据 */
      this.$emit('recordSnapshot', type)
    },
    showColorPick(type, index, event) {
      /* 点击颜色框显示拾色器 */
      if (!type) return
      this.strokeData.forEach(stroke => {
        stroke.showColorPick = false
      })
      this.shadowData.forEach(shadow => {
        shadow.showColorPick = false
      })
      switch (type) {
        case 'stroke':
          this.strokeData[index].showColorPick = !this.strokeData[index]
            .showColorPick
          break
        case 'shadow':
          this.shadowData[index].showColorPick = !this.shadowData[index]
            .showColorPick
          break
      }
      this.$nextTick(() => {
        const activePicker = document.querySelectorAll('.active-picker')
        if (activePicker.length) {
          const target = event.target
          let top = 32
          let left = 0
          left += target.offsetLeft
          top += target.offsetTop
          activePicker[0].style.left = left + 'px'
          activePicker[0].style.top = top + 'px'
        }
      })
    },
    changeColor(val) {
      const rgbaObj = val.rgba
      const rgba =
        'rgba(' + [rgbaObj.r, rgbaObj.g, rgbaObj.b, rgbaObj.a].join(',') + ')'
      this[`${this.activeEffectType}Data`][this.activeEffectIndex].color = rgba
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          color: rgba
        }
      )
    },
    changeWidth(val) {
      /* stroke 的width */
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          width: val
        }
      )
    },
    changeStrokeType(type) {
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          type
        }
      )
    },
    changeAngel(angle) {
      /* 阴影更改角度 */
      const activeEffectData = this.shadowData[this.activeEffectIndex]
      const exchangeRadian = angleToRadian(angle)
      activeEffectData.offsetY =
        Math.sin(exchangeRadian) * activeEffectData.distance
      activeEffectData.offsetX =
        Math.cos(exchangeRadian) * activeEffectData.distance
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          offsetX: activeEffectData.offsetX,
          offsetY: activeEffectData.offsetY
        }
      )
    },
    changeBlur(blur) {
      /* 阴影更改透明度 */
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          blur
        }
      )
    },
    changeDistance(distance) {
      /* 阴影 更改距离 */
      const activeEffectData = this.shadowData[this.activeEffectIndex]
      const exchangeRadian = angleToRadian(activeEffectData.angle)
      activeEffectData.offsetY = Math.sin(exchangeRadian) * distance
      activeEffectData.offsetX = Math.cos(exchangeRadian) * distance
      this.$emit(
        'changeTextEffect',
        this.activeEffectType,
        this.activeEffectIndex,
        {
          offsetX: activeEffectData.offsetX,
          offsetY: activeEffectData.offsetY
        }
      )
    },
    addStroke() {
      /* 新增描边 */
      this.$emit('addStroke')
      this.initTextEffect()
    },
    deleteStroke(index) {
      /* 删除描边 */
      this.$emit('deleteStroke', index)
      this.initTextEffect()
    },
    addShadow() {
      /* 新增阴影 */
      this.$emit('addShadow')
      this.initTextEffect()
    },
    deleteShadow(index) {
      /* 删除阴影 */
      this.$emit('deleteShadow', index)
      this.initTextEffect()
    }
  }
}
</script>

<style lang="scss" scoped>
.eui-tabs__header {
  border-bottom: 1px solid #eef2f8;
  height: 48px;
  cursor: pointer;
  @include flexWrapper(left, center);
  .tag-name {
    span {
      font-size: 15px;
      line-height: 20px;
      padding: 17px 16px 17px;
      font-weight: bold;
    }
  }
  .text-effect-icon {
    margin: 0 -3% 0 6%;
    font-weight: bold;
  }
}
.editor-panel-content {
  padding: 16px 24px;
}
.panel-feature-head {
  @include flexWrapper(space-between, center);
  font-size: 13px;
  line-height: 17px;
  margin-bottom: 10px;
  .plus-icon {
    cursor: pointer;
    padding: 5px;
    background: none;
    transition: all 0.2s ease;
    &:hover {
      background: #eef2f8;
    }
  }
}
.text-effect-row {
  .panel-feature_prop {
    background-color: rgb(246, 247, 249);
    border-radius: 4px;
    cursor: pointer;
  }
  .panel-feature-item {
    @include flexWrapper(space-between, center);
    margin-bottom: 10px;
  }
}
.text-effect-row {
  .panel-feature_color {
    width: 32px;
    height: 32px;
    // margin-right: 8px;
    @include flexWrapper(center, center);
    div {
      width: 70%;
      height: 70%;
      border-radius: 4px;
    }
  }
  .effect-stroke_form {
    @include flexWrapper(space-between, center);
    .effect-stroke-form-cell {
      width: 58px;
      font-size: 12px;
      line-height: 17px;
      margin-right: 20px;
    }
    .effect-stroke-width {
      width: 40px;
    }
    .effect-stroke-type {
      width: 70px;
    }
  }
}
.text-effect-delete {
  cursor: pointer;
  padding: 5px;
}
.text-effect-shadow {
  .effect-shadow-form-cell {
    width: 45px;
    margin: 0 5px;
  }
  .effect-shadow_form {
    @include flexWrapper(space-between, center);
  }
  .effect-shadow-form-label {
    @include flexWrapper(flex-start, center);
    padding-left: 54px;
    margin-top: 0;
    color: #9da3ac;
    .effect-shadow-label {
      margin-right: 30px;
      font-size: 10px;
      line-height: 14px;
    }
  }
}
/* 拾色器 */
.stroke-picker {
  position: absolute;
  z-index: 1;
}
</style>
<style lang="scss">
.eui-text-effect-common-panel-v1 {
  .ant-input-number {
    width: 100%;
    box-shadow: none !important;
    border: none !important;
    background: none;
    text-align: center;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
  .ant-input-number-input {
    text-align: center;
  }
  .ant-select {
    font-size: 12px;
  }
}
</style>
