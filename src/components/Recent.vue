<template>
  <g
    ref="root"
    :class="{dark: dark}">
    <g
      v-for="(v, index) in slots"
      :key="index"
      :class="{active: value === v}"
      :transform="`translate(${[0, index * distance]})`">
      <rect
        v-if="v"
        :width="width"
        :height="size"
        class="slot"
        :rx="$parent.radius(v.node, width * 0.614)"
        :ry="$parent.radius(v.node, width * 0.614)"
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
        v-if="v && (v.inversion !== 0)"
        font-size="14"
        text-anchor="middle"
        alignment-baseline="middle"
        dy="0.2em"
        :y="size * 3 / 4"
        :x="width / 2"
        v-text="formatNumber(v.inversion)" />
      <text
        v-if="v && v.alt"
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

export default {
  components: {
    XChord
  },
  props: {
    items: {
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
  data: () => ({ value: null }),
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
  methods: {
    formatNumber
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
}

.slot {
  fill-opacity: .5;
  opacity: 0.48;
}

.slot:hover {
  fill-opacity: .5;
  opacity: 1;
}

text {
  fill: rgba(0, 0, 0, 0.6);
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
