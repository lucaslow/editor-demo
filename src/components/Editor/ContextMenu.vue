<template>
  <div
    class="editor-contextmenu"
    v-show="menuShow"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
    @click="hideContext"
  >
    <ul v-if="menuType === 'component'">
      <li
        v-for="componentList in componentLists"
        :key="componentList.id"
        @click="handle_function_call(componentList.funcName)"
      >
        <span>{{ componentList.name }}</span>
      </li>
    </ul>
    <ul v-else>
      <li
        v-for="componentList in editorLists"
        :key="componentList.id"
        @click="handle_function_call(componentList.funcName)"
      >
        <span>{{ componentList.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      componentLists: [
        {
          id: 'copy',
          funcName: 'copyComponent',
          name: '复制'
        },
        {
          id: 'paste',
          funcName: 'pasteComponent',
          name: '粘贴'
        },
        {
          id: 'delete',
          funcName: 'deleteComponent',
          name: '删除'
        },
        {
          id: 'top',
          funcName: 'topComponent',
          name: '置顶'
        },
        {
          id: 'bottom',
          funcName: 'bottomComponent',
          name: '置底'
        },
        {
          id: 'up',
          funcName: 'upComponent',
          name: '上移'
        },
        {
          id: 'down',
          funcName: 'downComponent',
          name: '下移'
        }
      ],
      editorLists: [
        {
          id: 'addText',
          funcName: 'addTextComponent',
          name: ' 插入文本'
        },
        {
          id: 'addImage',
          funcName: 'addImageComponent',
          name: ' 插入图片'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      menuTop: state => state.Canvas.ContextMenu.menuTop,
      menuLeft: state => state.Canvas.ContextMenu.menuLeft,
      menuShow: state => state.Canvas.ContextMenu.menuShow,
      menuType: state => state.Canvas.ContextMenu.menuType
    })
  },
  methods: {
    handle_function_call(function_name) {
      this[function_name]()
    },
    hideContext() {
      this.$store.commit('Canvas/ContextMenu/hideContexeMenu')
    },
    deleteComponent() {
      /* 删除组件 */
      this.$store.commit('Canvas/ContextMenu/deleteComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },

    upComponent() {
      /* 向上移动一层组件 */
      this.$store.commit('Canvas/ContextMenu/upComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },

    downComponent() {
      /* 向下移动一层组件 */
      this.$store.commit('Canvas/ContextMenu/downComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },

    topComponent() {
      /* 置顶组件 */
      this.$store.commit('Canvas/ContextMenu/topComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },

    bottomComponent() {
      /* 置底组件 */
      this.$store.commit('Canvas/ContextMenu/bottomComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },

    copyComponent() {
      /* 复制组件 */
      this.$store.dispatch('Canvas/ContextMenu/copyComponent')
    },

    pasteComponent() {
      /* 粘贴组件 */
      this.$store.dispatch('Canvas/ContextMenu/pasteComponent')
      this.$store.commit('Canvas/recordSnapshot')
    },
    addTextComponent() {
      /* 新增文字组件 */
      this.$store.dispatch('Canvas/ComponentLists/addText')
      this.$store.commit('Canvas/recordSnapshot')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-contextmenu {
  position: absolute;
  z-index: 9999;
  border-radius: 4px;
  box-shadow: 0 0 5px 0 rgba(11, 3, 6, 0.2);
  background-color: hsla(0, 0%, 100%, 0.95);
  width: 200px;
  ul {
    padding: 4px 0;
    list-style: none;
    color: #333;
    font-size: 13px;

    li {
      padding: 0 20px;
      cursor: pointer;
      line-height: 36px;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
