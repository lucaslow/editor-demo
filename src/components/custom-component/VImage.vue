<template>
  <div
    class="editor-element editor-element-image"
    style="overflow: hidden; width: 100%; height: 100%"
  >
    <img :src="propValue" />
  </div>
</template>

<script>
export default {
  props: {
    propValue: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
