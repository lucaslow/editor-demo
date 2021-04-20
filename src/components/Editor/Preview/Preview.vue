<template>
  <div
    class="resource-page-layout editor-global-wrap"
    :style="{
      width: canvasData.width * scaleRatio + 'px',
      height: canvasData.height * scaleRatio + 'px'
    }"
  >
    <ComponentStage
      :componentData="componentData"
      :curComponent="curComponent"
      :canvasData="canvasData"
      :scaleRatio="scaleRatio"
      :editing="editing"
    />
  </div>
</template>

<script>
export default {
  name: 'Preview',
  data() {
    return {}
  },
  props: {
    componentData: {
      type: Array,
      require: true
    },
    curComponent: {
      type: Object,
      require: true
    },
    canvasData: {
      type: Object,
      require: true
    },
    scaleRatio: {
      type: Number,
      require: true
    },
    editing: {
      type: Boolean,
      require: true
    }
  },
  components: {
    ComponentStage: () =>
      import(
        /* webpackChunkName: "ComponentStage" */ 'components/Editor/ComponentStage.vue'
      )
  }
}
</script>

<style></style>
