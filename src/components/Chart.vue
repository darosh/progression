<template>
  <svg
    ref="chart"
    :width="width"
    :height="height"
    :class="{dark: dark, highlight: highlight, pause: !animate, pads: pads}"
    @touchstart.stop="onGlobalTouch"
    @mousedown.stop="highlight = false"
    @mouseup.stop="onMouseUp($event, null)">
    <defs>
      <marker
        id="end-marker"
        markerWidth="2"
        markerHeight="2"
        orient="auto"
        refY="0.8"
        refX="-0.4">
        <path
          d="M0,0 L2,0.8 0,2"
          fill-opacity="0.16" />
      </marker>
      <marker
        id="start-marker"
        markerWidth="2"
        markerHeight="2"
        orient="auto"
        refY="1"
        refX="2">
        <circle
          r="0.9"
          cx="1"
          cy="1"
          fill-opacity="0.16" />
      </marker>
      <radialGradient id="gradient">
        <stop
          :offset="0"
          stop-color="transparent" />
        <template v-for="(s, key) in [1, 2.7, 4.7, 6.7].map(d => d / 7)">
          <stop
            :key="`${key}a`"
            :offset="s - 0.035"
            stop-color="transparent" />
          <stop
            :key="`${key}b`"
            :offset="s - 0.029"
            :stop-color="rippleColor" />
          <stop
            :key="`${key}c`"
            :offset="s + 0.029"
            :stop-color="rippleColor" />
          <stop
            :key="`${key}d`"
            :offset="s + 0.035"
            stop-color="transparent" />
        </template>
        <stop
          :offset="1"
          stop-color="transparent" />
      </radialGradient>
      <symbol
        id="ripply-scott"
        viewBox="0 0 100 100">
        <circle
          fill="url(#gradient)"
          cx="1"
          cy="1"
          r="1" />
      </symbol>
    </defs>
    <g v-if="!!path">
      <clipPath id="clipping">
        <rect
          v-if="lastNode"
          :height="lastNode.y1 - lastNode.y0"
          :width="nodeWidth"
          :transform="`translate(${[lastNode.x0, lastNode.y0]})`"
          :rx="radius(lastNode)"
          :ry="radius(lastNode)" />
      </clipPath>
      <g class="links">
        <path
          v-for="(link, key) in graph.links"
          :key="key"
          class="link"
          :class="{active: link.active}"
          marker-start="url(#start-marker)"
          marker-end="url(#end-marker)"
          :d="path(link)"
          :style="{stroke: stroke(link.source.extra.color)}" />
      </g>
      <g>
        <g
          v-for="(node, key) in graph.nodes"
          :key="key"
          class="node"
          :class="{active: node.extra.active, alias: lastEnterName === node.data.name}"
          :transform="`translate(${[node.x0, node.y0]})`">
          <rect
            :data-cid="node.id"
            :height="node.y1 - node.y0"
            :width="nodeWidth"
            :rx="radius(node)"
            :ry="radius(node)"
            :style="{fill: node.extra.color, stroke: stroke(node.extra.color)}"
            @mouseenter="onEnter(node)"
            @touchstart.stop="onTouchStart($event, {node})"
            @touchend.stop="onTouchEnd($event, {node})"
            @mousedown.stop.prevent="onMouseDown($event, {node})"
            @mouseup.stop.prevent="onMouseUp($event, {node})" />
          <x-chord
            :secondary="altRadius - 4"
            :post="altRadius - 2"
            :y="(node.y1 - node.y0) / 2"
            :x="nodeWidth / 2"
            :font-size="Math.max(altRadius, 14)"
            :parts="format(node)" />
          <g
            v-for="(alt, index) in node.extra.alts"
            :key="alt"
            class="alt"
            :transform="`translate(${node.extra.altsTranslate[index]})`">
            <circle
              :r="altRadius"
              :data-aid="alt"
              :style="{fill: altColor(node.extra.color)}"
              @mouseenter="onEnter(node)"
              @touchstart.stop="onTouchStart($event, {node, alt})"
              @touchend.stop="onTouchEnd($event, {node, alt})"
              @mousedown.stop.prevent="onMouseDown($event, {node, alt})"
              @mouseup.stop.prevent="onMouseUp($event, {node, alt})" />
            <text
              dy=".35em"
              :font-size="alt.length > 3 ? Math.floor(altRadius * 0.7) - 2 : Math.floor(altRadius * 0.8)"
              text-anchor="middle">
              {{ simpleFormat(alt) }}
            </text>
          </g>
        </g>
      </g>
    </g>
    <g clip-path="url(#clipping)">
      <use
        ref="ripple"
        height="100"
        width="100"
        xlink:href="#ripply-scott"
        style="pointer-events: none;" />
    </g>
    <x-inversion
      :width="inversionPad"
      :height="height - margin.top - margin.bottom - 32 * 2"
      :space="margin.left / 2"
      :inversions="inversions"
      :value="inversion"
      :transform="`translate(${[margin.left / 2, margin.top + 32]})`"
      @update:value="value => $emit('update:inversion', value)" />
    <x-recent
      :width="inversionPad * 1.5"
      :height="height - margin.top / 2 - margin.bottom - 32"
      :space="margin.left / 2"
      :items="recent"
      :dark="dark"
      :format="format"
      :value="lastRecent"
      :transform="`translate(${[width - inversionPad * 1.5 - margin.right / 2, margin.top / 2]})`" />
  </svg>
</template>
<script>
import * as d3 from 'd3'

import { TimelineMax, Linear } from 'gsap/TweenMax'
import { debounce } from 'rambdax'
import XInversion from './Inversion'
import XRecent from './Recent'
import XChord from './Chord'
import { draw } from '@/utils/draw'

export default {
  components: { XInversion, XRecent, XChord },
  props: {
    sanGraph: {
      type: Object,
      required: true
    },
    iterations: {
      type: Number,
      default: 6
    },
    nodeSize: {
      type: Number,
      default: 64
    },
    dark: {
      type: Boolean,
      default: false
    },
    format: {
      type: Function,
      default: ({ data: { name } }) => [{ text: name }]
    },
    simpleFormat: {
      type: Function,
      default: text => text.replace(/b/g, '♭')
    },
    width: {
      type: Number,
      default: 1200
    },
    height: {
      type: Number,
      default: 720
    },
    margin: {
      type: Object,
      default: () => ({ top: 32, right: 32, bottom: 32, left: 32 })
    },
    animate: {
      type: Boolean,
      default: true
    },
    pads: {
      type: Boolean,
      default: false
    },
    inversions: {
      type: Array,
      required: true
    },
    inversion: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      nodeWidth: this.nodeSize,
      altRadius: 22,
      path: null,
      graph: null,
      lastNode: null,
      inversionPad: 48,
      rippleColor: null,
      lastEnter: null,
      lastRecent: null,
      lastPlayed: [],
      recent: [],
      highlight: false,
      lazyDraw: debounce(this.draw, 100),
      lazyDrawOrNot: null
    }
  },
  computed: {
    lastEnterName () {
      return this.lastEnter && this.lastEnter.data.name
    },
    graphValues () {
      const { sanGraph, nodeSize, width, height, pads, margin } = this

      return sanGraph, nodeSize, width, height, pads, margin, Date.now() // eslint-disable-line no-sequences
    }
  },
  watch: {
    graphValues: {
      handler: 'lazyDraw',
      immediate: true
    }
  },
  methods: {
    onEnter (node) {
      if (this.lastEnter) {
        if (this.lastEnter === node) {
          return
        }

        this.$emit('leave', this.lastEnter)
      }

      this.lastEnter = node

      if (node) {
        this.$emit('enter', node)
      }
    },
    onGlobalTouch (event, cancel = false) {
      if (cancel && event.cancelable) {
        event.preventDefault()
      }

      this.highlight = false
    },
    onTouchStart (event, node, recent = false) {
      if (event.cancelable) {
        event.preventDefault()
      }

      this.onMouseDown(event, node, false, recent)
      this.onEnter(node.node || node)
    },
    onTouchEnd (event, node) {
      if (event.cancelable) {
        event.preventDefault()
      }

      this.onMouseUp(event, node, false)
    },
    onMouseDown (event, node, mouse = true, recent = false) {
      if (!recent) {
        node.inversion = this.inversion
        this.ripple(event, 1, node.node, mouse)
      } else if (this.graph.nodes.includes(node.node)) {
        this.ripple(this.nodeCenter(node), 1, node.node, mouse)
      }

      this.highlight = true
      this.lastPlayed.push(node)

      this.lastRecent = this.recent.find(({ node: { id }, alt, inversion }) => node.node.id === id && node.alt === alt && node.inversion === inversion)

      if (!this.lastRecent) {
        this.recent.unshift(node)
        this.$emit('update:recent', this.recent.length)

        if (this.recent.length > 9) {
          this.recent.pop()
        }
      }

      this.$emit('attack', node)
    },
    onMouseUp (event, node, mouse = true) {
      if (!mouse) {
        const id = event.target.getAttribute('data-cid')
        const aid = event.target.getAttribute('data-aid') || undefined

        if (id) {
          node = this.lastPlayed.find(({ node, alt }) => node.id === id && alt === aid) || node
        }
      }

      const lp = node && this.lastPlayed.find(obj => obj.node === node.node)

      if (lp) {
        this.$emit('release', lp)
        this.lastPlayed.splice(this.lastPlayed.indexOf(lp), 1)
      } else if (this.lastPlayed.length) {
        this.$emit('release', this.lastPlayed.shift())
      }
    },
    stroke (color) {
      return d3.rgb(color).darker(0.5)
    },
    altColor (color) {
      return this.$vuetify.theme.dark
        ? d3.color(d3.interpolateCubehelix(d3.rgb(color), '#fff')(0.66)).darker(0.11)
        : d3.color(d3.interpolateCubehelix(d3.rgb(color), '#000')(0.33)).darker(0.33)
    },
    radius ({ extra: { radius }, y1, y0 }, nodeWidth = this.nodeWidth) {
      return Math.min((y1 - y0) / 2, nodeWidth / 2, radius < 1 ? radius * nodeWidth : radius)
    },
    draw () {
      if (!this.sanGraph) {
        return
      }

      const { altRadius, path, nodeSize, graph } = draw(this)
      this.altRadius = altRadius
      this.path = path
      this.nodeWidth = nodeSize
      this.graph = graph
    },
    async ripple (event, timing, node, mouse) {
      let x
      let y

      if (event.touches) {
        const { left, top } = this.$refs.chart.getBoundingClientRect()
        x = event.touches[0].clientX - left
        y = event.touches[0].clientY - top
      } else {
        x = event.offsetX
        y = event.offsetY
      }

      this.rippleColor = this.$vuetify.theme.dark ? d3.rgb(node.extra.color).brighter(1.5) : d3.rgb(node.extra.color).darker(1.25)
      this.lastNode = node
      await new Promise(resolve => this.$nextTick(resolve))
      const { ripple } = this.$refs
      new TimelineMax().fromTo(ripple, timing, {
        x,
        y,
        transformOrigin: '50% 50%',
        scale: 0,
        opacity: 0.87,
        ease: Linear.easeOut
      }, {
        scale: 120,
        opacity: 0
      })
    },
    nodeCenter (node) {
      if (node.alt) {
        const t = node.node.extra.altsTranslate[node.node.extra.alts.indexOf(node.alt)]

        return { offsetX: node.node.x0 + t[0], offsetY: node.node.y0 + t[1] }
      }

      return { offsetX: (node.node.x1 + node.node.x0) / 2, offsetY: (node.node.y1 + node.node.y0) / 2 }
    }
  }
}
</script>
<style>
.node rect {
  fill-opacity: .5;
  stroke-width: 0.5;
  cursor: pointer;
}

.node rect:hover {
  fill-opacity: 0.75;
  stroke-width: 1.5;
}

.node text {
  pointer-events: none;
  fill: rgba(0, 0, 0, 0.87);
  user-select: none;
}

.dark .node text {
  fill: #fff;
}

.link {
  fill: none;
  stroke-opacity: .5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 6;
}

.link:hover {
  stroke-opacity: 1;
  stroke: #ccc !important;
}

#head-marker path, #start-marker circle {
  fill: #666
}

.dark #head-marker path, .dark #start-marker circle {
  fill: #eee
}

.alt circle {
  fill: #444;
  fill-opacity: 0.8;
  cursor: pointer;
}

.alt circle:hover {
  fill: #000;
  fill-opacity: 1;
}

.alt text {
  fill: #fff;
  pointer-events: none;
  user-select: none;
}

.dark .alt circle {
  fill: #fff;
  fill-opacity: 0.8;
}

.dark .alt circle:hover {
  fill: #fff;
  fill-opacity: 1;
}

.dark .alt text {
  fill: #000;
}

@keyframes selection-8 {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: 8;
  }
}

@keyframes selection-13 {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: 13;
  }
}

@keyframes selection-7 {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: 13;
  }
}

.node.alias:not(.active) rect {
  stroke: #000 !important;
  /*noinspection CssInvalidPropertyValue*/
  stroke-dasharray: 1 6;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  fill-opacity: 0.3 !important;
  opacity: 1 !important;
  animation: selection-7 1.2s linear infinite;
}

.pause .node.alias:not(.active) rect {
  animation-play-state: paused !important;
}

.dark .node.alias:not(.active) rect {
  stroke: #fff !important;
}

.node.active rect {
  stroke: #000 !important;
  /*noinspection CssInvalidPropertyValue*/
  stroke-dasharray: 8 5;
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
  animation: selection-13 0.4s linear infinite reverse;
}

.pause .node.active rect {
  animation-play-state: paused !important;
}

.dark .node.active rect {
  stroke: #fff !important;
}

path.link.active {
  stroke: #000 !important;
  /*noinspection CssInvalidPropertyValue*/
  stroke-dasharray: 3 5;
  stroke-width: 1.5 !important;
  stroke-opacity: 1;
  stroke-linejoin: round;
  stroke-linecap: round;
  animation: selection-8 0.6s linear infinite reverse;
}

.pause path.link.active {
  animation-play-state: paused !important;
}

.dark path.link.active {
  stroke: #fff !important;
}

.highlight .node:not(.active) rect, .highlight .node:not(.active) circle {
  opacity: 0.28;
}

.highlight .link:not(.active) {
  opacity: 0.24;
}

.pads .link:not(.active) {
  opacity: 0.16 !important;
}
</style>
