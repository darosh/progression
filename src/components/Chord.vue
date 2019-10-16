<template>
  <text
    dominant-baseline="central"
    text-anchor="middle">
    <tspan
      v-for="(part, keyName) in parts"
      :key="keyName"
      :font-size="part.secondary ? secondary : part.post ? post : null"
      :style="{
        fontWeight: part.primary ? '700' : '500'
      }"
      :dy="keyName === 1 ? '-0.4em' : null"
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
