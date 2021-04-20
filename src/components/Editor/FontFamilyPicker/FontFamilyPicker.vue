<template>
  <div class="eui-fontFamilyPicker">
    <a-select
      v-model="currentFontFamily"
      style="width: 100%"
      @change="changeFontFamily"
    >
      <a-select-option
        v-for="fontFamily in fontFamilySet"
        :key="fontFamily.id"
        :value="fontFamily.value"
      >
        {{ fontFamily.name }}
      </a-select-option>
    </a-select>
    <div class="font-family-loading" :style="getLoadingStyle()" v-if="loading">
      <img :src="loadingSrc" alt="loading" />
    </div>
  </div>
</template>

<script>
import { fontFamilySet } from './fontFamily'
import { loadFontFile } from 'utils/getFontCut'
import throttle from 'lodash.throttle'
export default {
  name: 'FontFamilyPicker',
  data() {
    return {
      loadingSrc: require('assets/loading/text-loading.gif'),
      loading: false,
      currentFontFamily: 'syht_bold',
      fontFamilySet: fontFamilySet
    }
  },
  props: {
    curComponent: {
      type: Object,
      require: true
    },
    fontFamilyCache: {
      type: Array,
      require: true
    }
  },
  computed: {
    currentText() {
      /* 当前文字 */
      return this.curComponent.propValue
    }
  },
  watch: {
    curComponent() {
      /* 初始化组件数据 */
      this.currentFontFamily = this.curComponent.style.fontFamily
    }
  },
  created() {
    /* 初始化组件数据 */
    this.currentFontFamily = this.curComponent.style.fontFamily
  },
  methods: {
    throttle: throttle(
      /* 所有的数据更新都要节流 */
      (fn, data) => {
        fn(data)
      },
      1000,
      {
        leading: false,
        trailing: true
      }
    ),
    changeFontFamily(val) {
      if (this.fontFamilyCache.includes(val)) {
        console.log('had cache ~')
        this.$emit('changeFontFamily', val)
        return
      }
      this.loading = true
      const data = {
        fontName: val,
        text: this.currentText
      }
      loadFontFile([data]).then(() => {
        console.log('load-font-success')
        this.$store.commit('Canvas/updateFontFamilyCache', val) // 缓存字体
        this.$emit('changeFontFamily', val)
        this.loading = false
      })
    },
    getLoadingStyle() {
      const style = {}
      const editorRectInfo = document
        .getElementById('editor')
        .getBoundingClientRect()
      style.left =
        this.curComponent.style.left +
        editorRectInfo.left +
        this.curComponent.style.width / 2 -
        30 +
        'px'
      style.top =
        this.curComponent.style.top +
        editorRectInfo.top +
        this.curComponent.style.height / 2 -
        15 +
        'px'
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.eui-fontFamilyPicker {
  height: 100%;
  .ant-select {
    font-size: 15px;
    font-weight: bold;
  }
}
.font-family-loading {
  width: 60px;
  height: 30px;
  position: fixed;
  background: rgba(63, 55, 55, 0.8);
  border-radius: 10px;
  @include flexWrapper(center, center);
  img {
    max-width: 60%;
  }
}
</style>
