<template>
  <g :class="{dark: dark}">
    <g
      v-for="({value: v, text}, index) in inversions.slice().reverse()"
      :key="v"
      :class="{active: value === v}"
      :transform="`translate(${[0, index * distance]})`">
      <rect
        :width="width"
        :height="size"
        rx="8"
        ry="8"
        @mousedown.stop="$emit('update:value', v)"
        @mouseup.stop=""
        @touchstart.stop="$emit('update:value', v)"
        @touchmove.stop="$emit('update:value', v)"
        @touchend.stop="" />
      <text
        fill="rgba(0,0,0,0.6)"
        dy="0.12em"
        alignment-baseline="middle"
        :x="width/2"
        :y="size/2"
        text-anchor="middle"
        :font-size="width / 2"
        style="pointer-events: none;"
        v-text="text" />
    </g>
  </g>
</template>
<script>
export default {
  props: {
    inversions: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    space: {
      type: Number,
      required: true
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    size () {
      const { height, space, inversions: { length } } = this

      return (height + space) / length - space
    },
    distance () {
      const { size, space } = this

      return size + space
    }
  }
}
</script>
<style scoped>
rect {
  fill: rgba(0, 0, 0, 0.06);
}
text {
  fill: rgba(0, 0, 0, 0.5);
}
.active text {
  fill: rgba(0, 0, 0, 0.87);
}
.active rect {
  fill: rgba(0, 0, 0, 0.12);
}
.dark rect {
  fill: rgba(255, 255, 255, 0.12);
}
.dark text {
  fill: rgba(255, 255, 255, 0.6);
}
.dark .active rect {
  fill: rgba(255, 255, 255, 0.36);
}
.dark .active text {
  fill: #fff
}
</style>
