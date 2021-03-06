<template>
  <g
    ref="root"
    :class="{dark: dark}"
    @touchmove.stop="onMove">
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
        @touchend.stop="" />
      <text
        fill="rgba(0,0,0,0.6)"
        dominant-baseline="central"
        :x="width/2"
        :y="size/2"
        text-anchor="middle"
        :font-size="width * 0.4"
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
      type: [Number, String],
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
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    onKeyDown (event) {
      if (event.key.toLowerCase() === 'w') {
        const i = this.inversions.indexOf(this.inversions.find(i => i.value === this.value)) + 1

        if (this.inversions[i]) {
          this.$emit('update:value', this.inversions[i].value)
        }
      } else if (event.key.toLowerCase() === 's') {
        const i = this.inversions.indexOf(this.inversions.find(i => i.value === this.value)) - 1

        if (this.inversions[i]) {
          this.$emit('update:value', this.inversions[i].value)
        }
      }
    },
    onMove (event) {
      const { top, left } = this.$refs.root.getBoundingClientRect()
      const x = event.touches[0].clientX - left
      const y = event.touches[0].clientY - top
      const h = this.height + this.space
      const p = Math.floor((h - y) / this.distance)

      if (x > this.width) {
        return
      }

      if (p >= 0 && p < this.inversions.length) {
        this.$emit('update:value', this.inversions[p].value)
      }
    }
  }
}
</script>
<style scoped>
rect {
  fill: rgba(0, 0, 0, 0.06);
  cursor: pointer;
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
