<template>
  <g
    ref="root"
    :class="{dark: dark}">
    <g
      v-for="(v, index) in slots"
      :key="index"
      :class="{active: v && (v === value)}"
      :transform="`translate(${[0, index * distance]})`">
      <text
        v-if="v"
        :style="{ fontSize: `${size * 0.8}px`, opacity: dark ? 0.28 : 0.14 }"
        text-anchor="middle"
        alignment-baseline="text-bottom"
        dy="0.1em"
        :y="size"
        :x="width * 0.97"
        v-text="index + 1" />
      <rect
        v-if="v"
        :width="width"
        :height="size"
        class="slot"
        :rx="$parent.radius(v.node, width > size ? size / 2 : width)"
        :ry="$parent.radius(v.node, width > size ? size / 2 : width)"
        :style="{fill: v.node.color, stroke: $parent.stroke(v.node.color)}"
        @mouseenter="$parent.onEnter(v.node)"
        @touchstart.stop="$parent.onTouchStart($event, v, true)"
        @touchend.stop="$parent.onTouchEnd($event, v)"
        @mousedown.stop.prevent="$parent.onMouseDown($event, v, null, true)"
        @mouseup.stop.prevent="$parent.onMouseUp($event, v)" />
      <rect
        v-else
        class="placeholder"
        :width="width"
        :height="size"
        rx="8"
        ry="8" />
      <text
        v-if="(size > 52) && v && (v.inversion !== 0)"
        font-size="14"
        text-anchor="middle"
        alignment-baseline="middle"
        dy="0.2em"
        :y="size * 3 / 4"
        :x="width / 2"
        v-text="formatNumber(v.inversion)" />
      <text
        v-if="(size > 52) && v && v.alt"
        font-size="14"
        dy="-0.2em"
        :x="width / 2"
        alignment-baseline="middle"
        :y="size / 4"
        text-anchor="middle"
        v-text="v.alt" />
      <x-chord
        v-if="v"
        fill="rgba(0,0,0,0.6)"
        dy="0.34em"
        :x="width/2"
        :y="size/2"
        :font-size="18"
        style="pointer-events: none;"
        :secondary="14"
        :post="16"
        :parts="format(v.node)" />
    </g>
  </g>
</template>
<script>
import XChord from './Chord'
import { formatNumber } from '@/utils/format'

const keys = {}

export default {
  components: {
    XChord
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      default: null
    },
    width: {
      type: Number,
      required: true
    },
    height: {
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
    },
    format: {
      type: Function,
      default: ({ name }) => [{ text: name }]
    }
  },
  computed: {
    size () {
      const { height, space, slots: { length } } = this

      return (height + space) / length - space
    },
    distance () {
      const { size, space } = this

      return size + space
    },
    slots () {
      return [...this.items, ...new Array(9)].slice(0, 9)
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    formatNumber,
    onKeyDown (event) {
      const index = parseInt(event.key, 10) - 1

      if (keys[index] || isNaN(index) || (index < 0) || (index >= this.items.length)) {
        return
      }

      keys[index] = true
      this.$parent.onEnter(this.items[index].node)
      this.$parent.onMouseDown(null, this.items[index], null, true)
    },
    onKeyUp () {
      const index = parseInt(event.key, 10) - 1

      if (isNaN(index) || (index < 0) || (index >= this.items.length)) {
        return
      }

      keys[index] = false
      this.$parent.onMouseUp(null, this.items[index], true)
    }
  }
}
</script>
<style scoped>
rect {
  cursor: pointer;
  stroke-width: 0.5;
}

rect.placeholder {
  fill: rgba(0, 0, 0, 0.06);
  cursor: initial;
  pointer-events: none;
}

.slot {
  fill-opacity: .5;
  opacity: 0.48;
}

.slot:hover {
  stroke-width: 1.5;
  fill-opacity: 0.75;
  opacity: 1;
}

.active .slot {
  opacity: 1;
}

.active rect.slot {
  stroke: #000 !important;
  stroke-dasharray: 1.5 4.5;
  stroke-width: 1.5 !important;
  stroke-linecap: round;
  stroke-linejoin: round;
}

text {
  fill: rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.dark rect {
  fill: rgba(255, 255, 255, 0.12);
}

.dark text {
  fill: rgba(255, 255, 255, 0.8);
}
</style>
