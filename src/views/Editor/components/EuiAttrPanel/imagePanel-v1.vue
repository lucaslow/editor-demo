<template>
  <div class="eui-image-common-panel-v1">
    <div class="editor-panel-content">
      <div class="row image-row change-image-row row-1">
        <div class="change-image-button">
          <a-button type="primary" class="row-btn">
            替换图片
          </a-button>
        </div>
      </div>
      <div class="row image-row cutout-image-row row-1">
        <div class="cutout-image-button">
          <a-button type="primary" class="row-btn">
            抠图
          </a-button>
        </div>
      </div>
      <div class="image-effect-panel-row row component-opacity-wrapper">
        <div class="component-opacity-panel_label">
          <img :src="fillOpacitySrc" alt="" />
        </div>
        <a-slider
          v-model="opacity"
          class="slider"
          :min="0"
          :max="100"
          :step="1"
          @change="changeComponentOpacity"
          @afterChange="recordSnapshot('slider')"
        />
        <a-input-number
          v-model="opacity"
          :min="0"
          :max="100"
          @blur="changeComponentOpacity"
          @pressEnter="changeComponentOpacity"
          @change="val => numChangeLimit(val, 'opacity')"
        />
        <span class="component-opacity-panel_input_label">%</span>
      </div>
    </div>
    <ElementBar :curComponent="curComponent" :canvasData="canvasData" />
  </div>
</template>

<script>
export default {
  name: 'textPanelV1',
  data() {
    return {
      opacity: 100,
      fillOpacitySrc: require('assets/text/fill-opacity.png')
    }
  },
  props: {
    curComponent: {
      type: Object,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    }
  },
  watch: {
    curComponent() {
      this.initPropFunc()
    }
  },
  components: {
    ElementBar: () =>
      import(
        /* webpackChunkName: "ElementBar" */ 'components/Editor/ElementBar/ElementBar.vue'
      )
  },
  created() {
    this.initPropFunc()
  },
  methods: {
    initPropFunc() {
      this.opacity = this.curComponent.style.opacity * 100 || 100
    },
    changeComponentOpacity(val) {
      this.$emit('changeImageStyle', {
        opacity: val / 100
      })
    },
    recordSnapshot(type = 'color') {
      /* 只有鼠标松开的时候才记录数据 */
      this.$emit('recordSnapshot', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.eui-image-common-panel-v1 {
  height: 100%;
  width: 100%;
  padding: 16px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
.row {
  border-radius: 4px;
  height: 40px;
  background: #f6f7f9;
  @include userSelectNone;
}
.image-row {
  width: 100%;
  height: 40px;
  margin-bottom: 12px;
  border-radius: 4px;
  @include flexWrapper(space-between, center);
}
.row-1 {
  height: 45px;
  .row-btn {
    width: 100%;
    height: 100%;
    background-color: #1d1dea;
  }
}
.change-image-button,
.cutout-image-button {
  width: 100%;
  height: 100%;
}
.component-opacity-wrapper {
  background: #ffffff;
  padding: 10px;
  font-size: 12px;
  height: 50px;
  @include flexWrapper(space-between, center);
  .component-opacity-panel_label {
    width: 20px;
    height: 20px;
    img {
      max-width: 100%;
    }
  }
  .slider {
    width: 120px;
  }
  .ant-input-number {
    width: 30px;
  }
  .component-opacity-panel_input_label {
    width: 20px;
    margin-left: -7px;
  }
}
.opacity-picker {
  position: absolute;
  z-index: 1;
}
</style>
<style lang="scss">
.component-opacity-wrapper {
  .ant-input-number {
    box-shadow: none;
    &:hover,
    &:active,
    &:focus {
      border: 1px solid #e3dede;
    }
    border: none;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }
  input {
    text-align: center;
    padding: 0;
  }
}
.component-opacity-wrapper {
  input {
    text-align: right;
    padding: 0 !important;
  }
}
.ant-popover-placement-bottom {
  width: 250px;
}
.ant-popover-buttons {
  display: none;
}
.ant-popover-message-title {
  padding: 0;
}
</style>
