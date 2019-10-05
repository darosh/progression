<template>
  <text
    dy=".35em"
    text-anchor="middle">
    <tspan
      v-for="(part, keyName) in parts"
      :key="keyName"
      :font-size="part.secondary ? secondary : part.post ? post : null"
      :style="{
        fontWeight: part.primary ? '700' : '500'
      }"
      :baseline-shift="part.secondary ? 6.3 : (part.pre ? -0.6 : (part.post ? 4 : null))"
      v-text="part.text" />
  </text>
</template>
<script>
export default {
  props: {
    parts: {
      type: Array,
      required: true
    },
    secondary: {
      type: Number,
      required: true
    },
    post: {
      type: Number,
      required: true
    }
  }
}
</script>
