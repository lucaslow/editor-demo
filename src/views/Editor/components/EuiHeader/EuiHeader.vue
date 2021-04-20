<template>
  <div class="eui-headerContainer">
    <div class="eui-headerLeft">
      <div class="editor-logo">LOGO</div>
      <a-divider type="vertical" />
      <!-- <div class="editor-changeTitleInput"></div> -->
      <!-- disable -->
      <button
        class="eui-button eui-button-size-40 eui-button-undo editor-snapshot-button"
        :class="{ disable: snapshotIndex <= 0 }"
        @click="undo"
      >
        <div class="button-contain">
          <img :src="undoSrc" alt="undo" />
        </div>
      </button>
      <button
        class="eui-button eui-button-size-40 eui-button-redo editor-snapshot-button"
        @click="redo"
        :class="{ disable: snapshotIndex >= snapshotData.length - 1 }"
      >
        <div class="button-contain">
          <img :src="redoSrc" alt="redo" />
        </div>
      </button>
      <a-divider type="vertical" />
      <button
        class="eui-button eui-button-size-40 editor-preview-button"
        @click="previewDialog"
      >
        <a-icon type="eye" />
        <div class="button-contain">
          预览
        </div>
      </button>
      <a-divider type="vertical" :style="{ margin: '0 5px' }" />
      <button class="eui-button eui-button-size-40 editor-save-button">
        <img :src="saveSrc" alt="save" />
        <div class="button-contain">
          保存
        </div>
      </button>
    </div>
    <div class="eui-headerRight">
      <div class="download-wrapper">
        <a-button class="eui-button eui-button-download" @click="downloadEidtor"
          >下载</a-button
        >
      </div>
      <a-divider type="vertical" :style="{ margin: '0 10px' }" />
      <div class="user-wrapper">
        <div class="login" v-if="isLogin">
          <img class="avator" :src="avatorSrc" alt="avator" />
          <span class="nickname">测试用户</span>
        </div>
        <div class="unlogin" v-else></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import domtoimage from './dom-to-image'
import { downloadImage } from 'utils/downloadImage'
// import { changeDpiDataUrl } from 'changedpi'
export default {
  name: 'EuiHeader',
  data() {
    return {
      isLogin: true,
      undoSrc: require('assets/header/undo.png'),
      redoSrc: require('assets/header/redo.png'),
      saveSrc: require('assets/header/save.png'),
      avatorSrc: require('assets/header/avatar.png')
    }
  },
  computed: {
    ...mapState({
      canvasData: state => state.Canvas.canvasData,
      snapshotData: state => state.Canvas.snapshotData,
      snapshotIndex: state => state.Canvas.snapshotIndex
    }),
    globalTitle() {
      return this.canvasData.title ? this.canvasData.title : '创意模板'
    }
  },
  methods: {
    redo() {
      /* 只有对undo进行点击之后才会有对redo的操作机会 */
      if (this.snapshotIndex < this.snapshotData.length - 1) {
        this.$store.commit('Canvas/redo')
        this.$store.commit('Canvas/clearCurComponent')
      }
    },
    undo() {
      if (this.snapshotIndex > 0) {
        this.$store.commit('Canvas/undo')
        this.$store.commit('Canvas/clearCurComponent')
      }
    },
    previewDialog() {
      this.$emit('onPreview')
    },
    downloadEidtor() {
      const that = this
      const editor = document.getElementsByClassName('editable-element-wrap')[0]
      const scaleRatio = 1 / this.canvasData.scaleRatio
      downloadImage(
        editor,
        {
          height: this.canvasData.height,
          width: this.canvasData.width
        },
        scaleRatio,
        4
      ).then(dataUrl => {
        const link = document.createElement('a')
        link.download = `${that.globalTitle}.jpg`
        link.href = dataUrl
        link.click()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'index.scss';
.eui-headerContainer {
  width: 95%;
  height: $headerH;
  position: relative;
  margin: 0 auto;
  @include flexWrapper(space-between, center);
}
.ant-divider {
  height: 1.5em;
  margin: 0 20px;
}
</style>
