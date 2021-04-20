/** * Created by lucas on 20210102. * * Editor 图像编辑器 */
<template>
  <div class="home" @click="hideBlock">
    <header>
      <EuiHeader @onPreview="onPreview" />
    </header>
    <div class="euiMain" id="euiMain" ref="euiMain">
      <EuiEditor />
    </div>
    <div class="euiAttrPanel">
      <EuiAttrPanel />
    </div>
    <Dialog :previewDialog="previewDialog" @closePreview="closePreview" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from 'utils/eventBus'
import parseComponent from './mixin/parseComponent'
export default {
  name: 'Home',
  mixins: [parseComponent],
  data() {
    return {
      previewDialog: false
    }
  },
  components: {
    EuiHeader: () =>
      import(
        /* webpackChunkName: "EuiHeader" */ 'views/Editor/components/EuiHeader/EuiHeader.vue'
      ),
    EuiEditor: () =>
      import(
        /* webpackChunkName: "EuiEditor" */ 'views/Editor/components/EuiEditor.vue'
      ),
    EuiAttrPanel: () =>
      import(
        /* webpackChunkName: "EuiAttrPanel" */ 'views/Editor/components/EuiAttrPanel/EuiAttrPanel.vue'
      ),
    Dialog: () =>
      import(/* webpackChunkName: "Dialog" */ 'components/Editor/Dialog.vue')
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData,
      componentData: state => state.Canvas.componentData,
      fontFamilyCache: state => state.Canvas.fontFamilyCache
    })
  },
  mounted() {},
  methods: {
    onPreview() {
      this.previewDialog = true
    },
    closePreview() {
      this.previewDialog = false
    },
    hideBlock() {
      /* 关闭所有的颜色选择器 */
      eventBus.$emit('hideColorPicker')
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: $gWidth;
  height: $gHeight;
  position: relative;
  overflow: hidden;
}
header {
  position: relative;
  z-index: 10;
  width: $gWidth;
  background-color: #ffffff;
  border-bottom: 1px solid #eef2f8;
  // -webkit-box-shadow: 0 2px 20px 0 $headerShadow;
  // box-shadow: 0 2px 20px 0 $headerShadow;
}
.euiMain {
  position: absolute;
  top: $headerH;
  left: 0;
  // right: 0;
  // left: 228px;
  right: 276px;
  overflow: auto;
  bottom: 0;
  z-index: 0;
  transition: left 0.15s ease;
}
.euiAttrPanel {
  position: absolute;
  top: $headerH;
  bottom: 0;
  right: 0;
  width: $attrPanelWidth;
  transition: width 0.15s ease;
  background: #fff;
  overflow: visible;
}
</style>
