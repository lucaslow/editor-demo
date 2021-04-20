<template>
  <div class="eui-panelContainer">
    <div class="eui-tabs__header">
      <div class="tag-name">
        <span>{{ currentTagName }}</span>
      </div>
    </div>
    <div class="eui-tabs__panel">
      <transition name="fade">
        <EditorPanelV1
          v-if="currentTagName === '全局'"
          :globalBgColor="globalBgColor"
          :canvasData="canvasData"
          @updateGColor="updateGColor"
          @recordSnapshot="recordSnapshot"
          @changeGbgView="changeGbgView"
        />
        <TextPanelV1
          v-else-if="currentTagName === '文字'"
          :curComponent="curComponent"
          :canvasData="canvasData"
          @changeFontSize="changeFontSize"
          @changeFontStyle="changeFontStyle"
          @changeTextEffect="changeTextEffect"
          @recordSnapshot="recordSnapshot"
        />
        <ImagePanelV1
          :curComponent="curComponent"
          :canvasData="canvasData"
          @changeImageStyle="changeImageStyle"
          @recordSnapshot="recordSnapshot"
          v-else
        />
      </transition>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle'
import { mapState } from 'vuex'
export default {
  name: 'EuiAttrPanel',
  data() {
    return {
      colorPickerChange: false,
      textKey: 0
    }
  },
  components: {
    EditorPanelV1: () =>
      import(
        /* webpackChunkName: "EuiAttrPanel" */ 'views/Editor/components/EuiAttrPanel/editorPanel-v1.vue'
      ),
    TextPanelV1: () =>
      import(
        /* webpackChunkName: "EuiAttrPanel" */ 'views/Editor/components/EuiAttrPanel/textPanel-v1.vue'
      ),
    ImagePanelV1: () =>
      import(
        /* webpackChunkName: "EuiAttrPanel" */ 'views/Editor/components/EuiAttrPanel/imagePanel-v1.vue'
      )
  },
  computed: {
    ...mapState({
      curComponent: state => state.Canvas.curComponent,
      canvasData: state => state.Canvas.canvasData
    }),
    currentTagName() {
      // 当前显示的属性板块名称
      let currentTagName = '全局'
      if (this.curComponent) {
        currentTagName =
          this.curComponent.type === 'image'
            ? '图片'
            : this.curComponent.type === 'text'
            ? '文字'
            : '全局'
      }
      return currentTagName
    },
    globalBgColor() {
      return this.canvasData.background.style.backgroundColor
    }
  },
  methods: {
    throttle: throttle(
      /* 所有的数据更新都要节流 */
      (fn, data) => {
        fn(data)
      },
      2000,
      {
        leading: false,
        trailing: true
      }
    ),
    recordSnapshot(type) {
      /* 只有鼠标松开且更新了颜色的时候才记录数据 */
      if (type === 'slider') {
        this.$store.commit('Canvas/recordSnapshot')
      } else {
        setTimeout(() => {
          this.colorPickerChange && this.$store.commit('Canvas/recordSnapshot')
          this.colorPickerChange = false
        }, 50)
      }
    },
    /* 背景 Panel */
    updateGColor(val) {
      // 更新画板背景色
      this.colorPickerChange = true
      const style = {
        backgroundColor: val
      }
      this.$store.commit('Canvas/setCanvasBgStyle', {
        style
      })
    },
    changeGbgView(val) {
      // 更新画板背景显示 Color OR Image
      this.$store.commit('Canvas/setCanvasBgStyle', {
        colorOrImage: val
      })
    },
    /* 文字 Panel S */
    changeFontSize(fontSize) {
      this.$store.commit('Canvas/setCurComponentStyle', { fontSize })
      this.throttle(() => {
        this.$store.commit('Canvas/recordSnapshot')
      })
    },
    changeFontStyle(style) {
      const extra_props = ['opacity', 'color'] // 不需要同步拍快照的属性
      const key = Object.keys(style)[0]
      this.$store.commit('Canvas/setCurComponentStyle', style)
      if (style.color) {
        this.colorPickerChange = true
      }
      if (!extra_props.includes(key)) {
        this.$store.commit('Canvas/recordSnapshot')
      }
    },
    changeTextEffect(type, index, style) {
      const extra_props = ['opacity', 'color'] // 不需要同步拍快照的属性
      this.$store.dispatch('Canvas/ComponentEffect/setCurComponentEffect', {
        type,
        index,
        style
      })
      if (style.color) {
        this.colorPickerChange = true
      }
      const key = Object.keys(style)[0]
      if (!extra_props.includes(key)) {
        this.throttle(() => {
          this.$store.commit('Canvas/recordSnapshot')
        })
      }
    },
    /* 文字 Panel E */
    /* 图片 Panel S */
    changeImageStyle(style) {
      this.$store.commit('Canvas/setCurComponentStyle', style)
    }
    /* 图片 Panel E */
  }
}
</script>

<style lang="scss" scoped>
.eui-tabs__header {
  border-bottom: 1px solid #eef2f8;
  height: 48px;
  @include flexWrapper(left, center);
  .tag-name {
    span {
      font-size: 14px;
      line-height: 20px;
      padding: 17px 16px 17px;
    }
  }
}
.eui-tabs__panel {
  width: 100%;
  padding-top: 48px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
