<template>
  <div class="element-bar-v1">
    <div class="element-bar_container element-bar_layer">
      <div class="element-bar_wrapper">
        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" icon=" ">
          <template slot="title">
            <div class="global-align_wrapper">
              <div class="global-align_label popover-text">画布对齐</div>
              <div class="global-align_inner">
                <div class="global-align_content">
                  <div
                    class="global-align_btn"
                    v-for="gAlign_h in globaleAlignArr_h"
                    :key="gAlign_h.id"
                    @click="changeAlignOfGb(gAlign_h.id)"
                  >
                    <img :src="gAlign_h.src" alt="" />
                  </div>
                </div>
                <a-divider type="vertical" class="align-divider" />
                <div class="global-align_content">
                  <div
                    class="global-align_btn"
                    v-for="gAlign_v in globaleAlignArr_v"
                    :key="gAlign_v.id"
                    @click="changeAlignOfGb(gAlign_v.id)"
                  >
                    <img :src="gAlign_v.src" alt="" />
                  </div>
                </div>
              </div>
              <div class="global-align_label popover-text">图层顺序</div>
              <div class="global-zIndex_inner">
                <div class="global-zIndex_content">
                  <div
                    class="global-zIndex_btn"
                    v-for="item in globaleZindexArr"
                    :key="item.id"
                    @click="changeZindexOfGb(item.id)"
                  >
                    <img :src="item.src" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="element-bar_label">
            <img :src="layerSrc" alt="layer" />
          </div>
        </a-popconfirm>
      </div>
    </div>
    <div class="element-bar_container element-bar_flip">
      <div class="element-bar_wrapper">
        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" icon=" ">
          <template slot="title">
            <div class="global-flip_wrapper">
              <div
                class="global-flip_hor global-flip_item"
                @click="changeFlipOfGb('hor')"
              >
                <img :src="flipSrc_h" alt="flip" />
                <span>水平翻转</span>
              </div>
              <div
                class="global-flip_ver global-flip_item"
                @click="changeFlipOfGb('ver')"
              >
                <img :src="flipSrc_v" alt="flip" />
                <span>垂直翻转</span>
              </div>
            </div>
          </template>
          <div class="element-bar_label">
            <img :src="flipSrc_h" alt="flip" />
          </div>
        </a-popconfirm>
      </div>
    </div>
    <div class="element-bar_container element-bar_copy" @click="copyComponent">
      <div class="element-bar_label">
        <img :src="copySrc" alt="flip" />
      </div>
    </div>
    <div
      class="element-bar_container element-bar_delete"
      @click="deleteComponent"
    >
      <div class="element-bar_label">
        <img :src="deleteSrc" alt="flip" />
      </div>
    </div>
  </div>
</template>

<script>
import { moveCurComponentPos } from 'utils/calculateComponentData'
export default {
  name: 'textPanelV1',
  data() {
    return {
      layerSrc: require('assets/elementBar/layer.png'),
      flipSrc_h: require('assets/elementBar/h_flip.png'),
      flipSrc_v: require('assets/elementBar/v_flip.png'),
      copySrc: require('assets/elementBar/copy.png'),
      deleteSrc: require('assets/elementBar/delete.png'),
      globaleAlignArr_h: [
        {
          id: 'left',
          name: '左对齐',
          src: require('assets/elementBar/layer/layer-left.png')
        },
        {
          id: 'hCenter',
          name: '水平居中对齐',
          src: require('assets/elementBar/layer/layer-center.png')
        },
        {
          id: 'right',
          name: '右对齐',
          src: require('assets/elementBar/layer/layer-right.png')
        }
      ],
      globaleAlignArr_v: [
        {
          id: 'top',
          name: '上对齐',
          src: require('assets/elementBar/layer/layer-top.png')
        },
        {
          id: 'vCenter',
          name: '垂直居中对齐',
          src: require('assets/elementBar/layer/layer-middle.png')
        },
        {
          id: 'bottom',
          name: '下对齐',
          src: require('assets/elementBar/layer/layer-bottom.png')
        }
      ],
      globaleZindexArr: [
        {
          id: 'up',
          name: '上移',
          src: require('assets/elementBar/layer/up.png')
        },
        {
          id: 'down',
          name: '下移',
          src: require('assets/elementBar/layer/down.png')
        },
        {
          id: 'upper',
          name: '置顶',
          src: require('assets/elementBar/layer/upper.png')
        },
        {
          id: 'downer',
          name: '置底',
          src: require('assets/elementBar/layer/downer.png')
        }
      ]
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
  methods: {
    copyComponent() {
      /* 复制组件 */
      this.$store.dispatch('Canvas/ContextMenu/copyComponent')
      this.$store.dispatch('Canvas/ContextMenu/pasteComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },
    deleteComponent() {
      /* 删除组件 */
      this.$store.commit('Canvas/ContextMenu/deleteComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },
    changeAlignOfGb(type) {
      /* 实现组件基于画布对齐 */
      const globalSize = {
        width: this.canvasData.width,
        height: this.canvasData.height
      }
      const curComponentSize = {
        width: this.curComponent.style.width,
        height: this.curComponent.style.height,
        left: this.curComponent.style.left,
        top: this.curComponent.style.top
      }
      const style = moveCurComponentPos(
        globalSize,
        this.canvasData.scaleRatio,
        curComponentSize,
        type
      )
      this.$store.commit('Canvas/setShapeStyle', style)
      this.$store.commit('Canvas/recordSnapshot')
    },
    changeZindexOfGb(type) {
      switch (type) {
        case 'up':
          this.$store.commit('Canvas/ContextMenu/upComponent')
          break
        case 'down':
          this.$store.commit('Canvas/ContextMenu/downComponent')
          break
        case 'upper':
          this.$store.commit('Canvas/ContextMenu/topComponent')
          break
        case 'downer':
          this.$store.commit('Canvas/ContextMenu/bottomComponent')
          break
        default:
          return
      }
      this.$store.commit('Canvas/recordSnapshot')
    },
    changeFlipOfGb(type) {
      this.$store.commit('Canvas/flipCurComponent', type)
      this.$store.commit('Canvas/recordSnapshot')
    }
  }
}
</script>

<style lang="scss" scoped>
.element-bar-v1 {
  margin-top: 12px;
  width: 228px;
  height: 40px;
  position: relative;
  padding: 4px 10px;
  background: #f6f7f9;
  border-radius: 4px;
  border: none;
  @include flexWrapper(space-between, center);
}
.element-bar_container {
  width: 30px;
  height: 30px;
  transition: all 0.2s ease;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  @include flexWrapper(space-between, center);
  &:hover {
    background-color: #dbdcdf;
  }
}
.element-bar_label {
  width: 80%;
  margin: 0 auto;
  img {
    max-width: 100%;
  }
}
.element-bar_delete {
  .element-bar_label {
    width: 70%;
  }
}
.element-bar_inner {
  width: 252px;
  height: 158px;
}
.popover-text {
  width: 100%;
  margin-bottom: 12px;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #9da3ac;
  text-align: left;
  cursor: default;
}
.global-align_wrapper {
  width: 220px;
  height: 120px;
  .align-divider {
    margin: 0px 20px;
    height: 20px;
    top: 0;
    background: #000;
  }
  .global-align_inner {
    // height: 28px;
    margin-bottom: 12px;
    @include flexWrapper(space-between, center);
  }
  .global-align_content {
    flex: 1;
    @include flexWrapper(space-between, center);
  }
  .global-align_btn {
    width: 20px;
    height: 20px;
    cursor: pointer;
    img {
      max-width: 100%;
    }
  }
  .global-zIndex_content {
    flex: 1;
    @include flexWrapper(space-between, center);
  }
  .global-zIndex_btn {
    width: 30px;
    height: 30px;
    cursor: pointer;
    img {
      max-width: 100%;
    }
  }
}
.global-flip_wrapper {
  width: 100px;
  height: 50px;
  @include userSelectNone;
  .global-flip_item {
    width: 90%;
    margin: 0 auto 10px;
    cursor: pointer;
    @include flexWrapper(space-between, center);
    transition: all 0.2s ease;
    &:hover {
      background: #dbdcdf;
    }
    img {
      width: 20px;
      height: 20px;
    }
    span {
      font-size: 15px;
    }
  }
}
</style>
