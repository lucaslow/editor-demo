<template>
  <a-modal
    v-model="uploadDialog"
    :destroyOnClose="true"
    :footer="null"
    :closable="false"
    :maskClosable="false"
    dialogClass="editor-full-dialog"
  >
    <a-icon type="close" class="dialog-close-btn" @click="closeDialog" />
    <div class="dialog-inner">
      <div class="upload-button">
        <a-upload
          class="uploadBtn"
          name="file"
          :multiple="false"
          action="#"
          :beforeUpload="beforeUpload"
          ><span class="upload-text">上传</span></a-upload
        >
      </div>
      <div class="upload-lists">
        <div class="upload-list" v-for="list in fileList" :key="list.id">
          <img :src="list.src" alt="" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          id: 0,
          src: require('assets/test/bg1.jpg')
        },
        {
          id: 1,
          src: require('assets/test/bg1.jpg')
        }
      ]
    }
  },
  computed: {},
  props: {
    uploadDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    beforeUpload() {}
  }
}
</script>

<style lang="scss" scoped>
.dialog-inner {
  width: 100%;
  height: 100%;
}
.upload-button {
  width: 118px;
  height: 40px;
  border-radius: 4px;
  background: #2254f4;
  position: relative;
  .uploadBtn {
    width: 100%;
    height: 100%;
    display: block;
  }
  .upload-text {
    width: 118px;
    height: 40px;
    display: block;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    @include flexWrapper(center, center);
    @include userSelectNone;
    cursor: pointer;
  }
}
.upload-lists {
  margin-top: 20px;
  @include flexWrapper(flex-start, center);
  .upload-list {
    height: 130px;
    margin-right: 20px;
    cursor: pointer;
    img {
      max-height: 100%;
    }
  }
}
</style>
