<template>
  <div class="editor-canvas-panel-v1">
    <div class="editor-panel-content">
      <div class="panel-row">
        <div class="panel-cell-with-tips">
          <div class="panel-label">
            <span>画布尺寸</span>
          </div>
        </div>
        <div class="canvas-view">
          <div class="canvas-view-item">
            <span>{{ canvasData.width }}px</span>
            <span class="canvas-view-item-lable">宽</span>
          </div>
          <div class="canvas-view-item">
            <span>{{ canvasData.height }}px</span>
            <span class="canvas-view-item-lable">高</span>
          </div>
        </div>
      </div>
      <div class="panel-row margin20">
        <div class="panel-cell-with-tips">
          <div class="panel-label">
            <span>背景</span>
          </div>
        </div>
        <div class="background-view">
          <a-radio-group
            v-model="currentBgView"
            button-style="solid"
            @change="changeGbgView"
          >
            <a-radio-button
              v-for="bv in backgroundViews"
              :value="bv.id"
              :key="bv.id"
            >
              {{ bv.name }}
            </a-radio-button>
          </a-radio-group>
          <!-- 更换背景底色 -->
          <div
            class="background-color-view background-row"
            v-if="currentBgView === 'color'"
          >
            <div
              class="background-color"
              @click.stop="showColorPick = true"
              :style="{ backgroundColor: globalBgColor }"
            ></div>
          </div>
          <!-- 上传背景图片 -->
          <div class="background-image-view background-row" v-else>
            <div class="background-image-inner" v-if="canvasHasBgImg">
              <!-- 显示原本背景图 -->
              <div class="bg-preview background-block">
                <div
                  class="bg-preview-inner"
                  :style="getPreviewContainerStyle()"
                >
                  <img
                    :src="canvasBackgroundInfo.style.backgroundImage"
                    :style="getPreviewStyle()"
                    alt=""
                  />
                </div>
              </div>
              <div class="background-image-button background-block">
                <p>替换背景图</p>
              </div>
              <div
                class="background-image-button background-block"
                @click="cropBackGroundBg"
              >
                <p>裁剪背景</p>
              </div>
            </div>
            <!-- 上传新的背景 -->
            <div class="background-image-button background-block" v-else>
              <p>上传背景图</p>
            </div>
          </div>
        </div>
        <div @click.stop @mouseup="recordSnapshot">
          <chrome-picker
            v-if="showColorPick && currentBgView === 'color'"
            class="colorPicker"
            v-model="colors"
            @input="updateGColor"
          />
        </div>
      </div>
    </div>
    <UploadDialog :uploadDialog="uploadDialog" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import eventBus from 'utils/eventBus'
export default {
  name: 'EditorPanelV1',
  data() {
    return {
      backgroundViews: [
        {
          id: 'color',
          name: '颜色'
        },
        {
          id: 'image',
          name: '图片'
        }
      ],
      currentBgView: 'color',
      colors: '#194d33',
      showColorPick: false,
      uploadDialog: false
    }
  },
  components: {
    'chrome-picker': () =>
      import(
        /* webpackChunkName: "ColorPicker" */ 'components/Editor/ColorPicker/components/Chrome.vue'
      ),
    UploadDialog: () =>
      import(
        /* webpackChunkName: "UploadDialog" */ 'views/Editor/components/EuiAttrPanel/UploadDialog.vue'
      )
  },
  props: {
    globalBgColor: {
      type: String,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    }
  },
  computed: {
    canvasHasBgImg() {
      return this.canvasData.background.backgroundImageInfo.url !== ''
        ? true
        : false
    },
    canvasBackgroundInfo() {
      return this.canvasData.background
    }
  },
  created() {
    this.colors = this.globalBgColor
  },
  mounted() {
    const that = this
    this.currentBgView = this.canvasBackgroundInfo.colorOrImage
    /* 监听颜色识别器隐藏 */
    eventBus.$on('hideColorPicker', function() {
      that.showColorPick = false
    })
  },
  methods: {
    updateGColor(val) {
      const rgbaObj = val.rgba
      const rgba =
        'rgba(' + [rgbaObj.r, rgbaObj.g, rgbaObj.b, rgbaObj.a].join(',') + ')'
      this.$emit('updateGColor', rgba)
    },
    recordSnapshot() {
      /* 只有鼠标松开的时候才记录数据 */
      this.$emit('recordSnapshot')
    },
    changeGbgView() {
      /* 切换显示背景底色 OR 显示背景图片 */
      this.$emit('changeGbgView', this.currentBgView)
    },
    getPreviewContainerStyle() {
      const style = {}
      style.width = this.canvasData.width * 0.2 + 'px'
      style.height = this.canvasData.height * 0.2 + 'px'
      return style
    },
    getPreviewStyle() {
      const style = {}
      const props = ['width', 'height', 'left', 'top']
      props.forEach(prop => {
        if (this.canvasBackgroundInfo.style[prop] !== undefined) {
          style[prop] = this.canvasBackgroundInfo.style[prop] * 0.2 + 'px'
        }
      })
      return style
    },
    uploadBgImage() {
      this.uploadDialog = true
    },
    cropBackGroundBg() {
      /* 裁剪背景 */
      this.$store.commit('Canvas/setBgEditing', true)
    },
    closeDialog() {
      this.uploadDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-canvas-panel-v1 {
  height: 100%;
  width: 100%;
  padding: 16px 24px;
  overflow-x: hidden;
  overflow-y: auto;
}
.margin20 {
  margin-top: 20px;
}
.panel-label {
  @include flexWrapper(space-between, center);
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: #9da3ac;
  @include userSelectNone;
}
.canvas-view {
  @include flexWrapper(space-between, center);
  .canvas-view-item {
    @include flexWrapper(space-between, center);
    width: 48%;
    height: 40px;
    background: #f6f7f9;
    border-radius: 4px;
    font-size: 14px;
    color: #33383e;
    padding: 0 11px 0 16px;
    cursor: pointer;
  }
  .canvas-view-item-lable {
    font-size: 14px;
    color: #7f8792;
  }
}
.background-block {
  background: #f6f7f9;
  border-radius: 4px;
}
.background-view {
  border-radius: 4px;
  font-size: 14px;
  .ant-radio-group {
    width: 100%;
    height: 35px;
    @include userSelectNone;
    @include flexWrapper(center, center);
    .ant-radio-button-wrapper {
      width: 50%;
      height: 100%;
      box-shadow: none;
      color: #000;
      @include flexWrapper(center, center);
    }
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    font-weight: bold;
    background: #cbcccd;
    border-color: #cbcccd;
  }
  .ant-radio-button-wrapper:hover {
    color: inherit;
  }
  .background-row {
    width: 228px;
    margin: 10px auto;
    border-radius: 4px;
    @include flexWrapper(center, center);
  }
}
.background-color-view {
  .background-color {
    width: 90%;
    height: 25px;
    border-radius: 4px;
    cursor: pointer;
  }
}
.background-image-view {
  .background-image-button {
    transition: all 0.5s ease;
    width: 100%;
    height: 40px;
    &:hover {
      background: #cbcccd;
    }
    @include flexWrapper(center, center);
    cursor: pointer;
    p {
      margin: 0;
    }
  }
  .background-image-inner {
    width: 100%;
    height: 100%;
    .bg-preview {
      width: 100%;
      height: 84px;
      @include flexWrapper(center, center);
    }
    .bg-preview-inner {
      padding: 5px 0;
      position: relative;
      overflow: hidden;
      img {
        position: absolute;
        height: 100%;
      }
    }
    .background-image-button {
      margin-top: 12px;
    }
  }
}
</style>
