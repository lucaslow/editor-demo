<template>
  <!-- :contenteditable="editable" -->
  <!-- @keydown="handleKeyDown" -->
  <!-- v-html="parsePropValue" -->
  <!-- @blur="handleBlur" -->
  <div class="editor-element editor-element-text">
    <div
      v-if="textEffectArray.length === 0 || editing"
      class="element-inner"
      ref="editor"
      :contenteditable="editable"
      :style="parentStyle"
      v-scale="defaultStyle.fontSize"
      @input="handleInput"
      @focus="selectText"
      @blur="handleBlur"
    >
      <span
        class="text-span"
        ref="vText"
        :style="unitStyle"
        v-html="parsePropValue"
        >双击编辑文字</span
      >
    </div>
    <template v-for="(textEffect, index) in textEffectArray" v-else>
      <template v-if="textEffect.stroke && textEffect.stroke.type === 'outer'">
        <div class="element-inner-position" :key="index">
          <div
            class="element-inner"
            ref="editor"
            :contenteditable="editable"
            :style="getParentStyleWithEffect(index)"
            v-scale="defaultStyle.fontSize"
          >
            <span
              class="text-span"
              ref="vText"
              :style="unitStyle"
              v-html="parsePropValue"
              >双击编辑文字</span
            >
          </div>
        </div>
        <div class="element-inner-position" :key="`${index}-0`">
          <div
            class="element-inner"
            ref="editor"
            :contenteditable="editable"
            :style="parentStyle"
            v-scale="defaultStyle.fontSize"
          >
            <span
              class="text-span"
              ref="vText"
              :style="unitStyle"
              v-html="parsePropValue"
              >双击编辑文字</span
            >
          </div>
        </div>
      </template>
      <template v-else>
        <div class="element-inner-position" :key="index">
          <div
            class="element-inner"
            ref="editor"
            :contenteditable="editable"
            :style="getParentStyleWithEffect(index)"
            v-scale="defaultStyle.fontSize"
          >
            <span
              class="text-span"
              ref="vText"
              :style="unitStyle"
              v-html="parsePropValue"
              >双击编辑文字</span
            >
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { selectNodeText } from 'utils/utils'
import cloneDeep from 'lodash/cloneDeep'
export default {
  props: {
    propValue: {
      type: String,
      default: '双击编辑文字'
    },
    unitStyle: {
      type: Object,
      require: true
    },
    defaultStyle: {
      type: Object,
      require: true
    },
    element: {
      type: Object
    },
    editing: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      parentProps: [
        'textAlign',
        'lineHeight',
        'letterSpacing',
        'textStroke',
        'textShadow',
        'fontSize',
        'color'
      ],
      text: ''
    }
  },
  directives: {
    scale: {
      update(el, binding, vnode) {
        if (binding.value < 14) {
          const scale = binding.value * (1 / 14)
          const scaleWidth = 1 / scale
          el.style.transform = `scale(${scale})`
          el.style.width = `${scaleWidth * 100}%`
        } else {
          el.style.width = `calc(100% + ${vnode.context.defaultStyle.letterSpacing}px)`
          el.style.transform = ''
        }
      }
    }
  },
  computed: {
    parentStyle() {
      const result = {}
      Object.keys(this.unitStyle).forEach(key => {
        if (this.parentProps.includes(key)) {
          result[key] = this.unitStyle[key]
        }
      })
      /* 解决letterspacing 无法居中问题 */
      this.unitStyle.letterSpacing &&
        (result.width = `calc(100% + ${this.defaultStyle.letterSpacing}px)`)
      return result
    },
    parsePropValue() {
      return this.propValue.replaceAll('\n', '<br>')
    },
    textEffectArray() {
      /* 文字特效 数组*/
      return this.defaultStyle.textEffects
    }
  },
  methods: {
    // getStyle() {
    //   const result = {}
    //   Object.keys(this.unitStyle).forEach(key => {
    //     if (!this.parentProps.includes(key)) {
    //       result[key] = this.unitStyle[key]
    //     }
    //   })
    //   return result
    // },
    getParentStyleWithEffect(index) {
      const result = cloneDeep(this.parentStyle)
      /* 添加文字特效 */
      const effects = this.textEffectArray[index]
      Object.keys(effects).forEach(key => {
        switch (key) {
          case 'stroke':
            if (effects.stroke.enable) {
              effects.stroke.type === 'center' &&
                (result[
                  '-webkit-text-stroke'
                ] = `${effects.stroke.width}px ${effects.stroke.color}`)
              effects.stroke.type === 'outer' &&
                (result['-webkit-text-stroke'] = `${effects.stroke.width *
                  2}px ${effects.stroke.color}`)
            }
            break
          case 'shadow':
            if (effects.shadow.enable) {
              result[
                'text-shadow'
              ] = `${effects.shadow.color} ${effects.shadow.offsetX}px ${effects.shadow.offsetY}px ${effects.shadow.blur}px`
            }
            break
        }
      })
      return result
    },
    handleInput(e) {
      this.text = e.target.innerText
      this.$emit('input', e.target)
    },
    handleBlur() {
      this.element.propValue =
        this.text === ''
          ? this.element.propValue
          : this.text.replaceAll('\n', '<br>')
      this.$store.commit('Canvas/setEditing', false)
      this.$store.commit('Canvas/recordSnapshot')
    },
    selectText() {
      selectNodeText('editor-text-editor')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-element-text {
  position: relative;
  transform-origin: 0 0;
  // &:before {
  //   content: '';
  //   display: inline-block;
  //   height: 100%;
  //   width: 0;
  //   vertical-align: middle;
  // }
  &.editor-element-editing {
    /* 正在编辑时 原本显示文字消失， 出现编辑的文字 */
    visibility: hidden;
    // .element-inner {
    // }
    &.editor-text-editor {
      .element-inner:last-of-type {
        z-index: 6;
        visibility: visible;
        outline: 0;
        -webkit-user-modify: read-write-plaintext-only;
        -webkit-user-select: text;
      }
    }
  }
}
.element-inner-position {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.element-inner {
  position: relative;
  width: 100%;
  height: auto;
  transform-origin: 0 0;
  white-space: normal;
  word-wrap: break-word;
  display: inline-block;
  vertical-align: top;
}
.text-span {
  vertical-align: top;
}
</style>
