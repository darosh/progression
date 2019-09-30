<template>
  <svg
    id="chart"
    :width="width"
    :height="height"
    :class="{dark: dark}">
    <defs>
      <marker
        id="head-marker"
        markerWidth="2"
        markerHeight="2"
        orient="auto"
        refY="0.8"
        refX="-0.4">
        <path
          d="M0,0 L1.6,0.8 0,1.6"
          fill-opacity="0.333" />
      </marker>
      <marker
        id="start-marker"
        markerWidth="2"
        markerHeight="2"
        orient="auto"
        refY="1"
        refX="2">
        <circle
          r="0.6"
          cx="1"
          cy="1"
          fill-opacity="0.333" />
      </marker>
      <radialGradient id="gradient">
        <stop
          offset="0.10"
          stop-color="transparent" />
        <stop
          offset="0.11"
          :stop-color="rippleColor" />
        <stop
          offset="0.18"
          :stop-color="rippleColor" />
        <stop
          offset="0.19"
          stop-color="transparent" />
        <stop
          offset="0.30"
          stop-color="transparent" />
        <stop
          offset="0.31"
          :stop-color="rippleColor" />
        <stop
          offset="0.38"
          :stop-color="rippleColor" />
        <stop
          offset="0.39"
          stop-color="transparent" />
        <stop
          offset="0.50"
          stop-color="transparent" />
        <stop
          offset="0.51"
          :stop-color="rippleColor" />
        <stop
          offset="0.58"
          :stop-color="rippleColor" />
        <stop
          offset="0.59"
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
          rx="12"
          ry="12" />
      </clipPath>
      <g>
        <path
          v-for="(link, key) in graph.links"
          :key="key"
          class="link"
          :class="{active: link.active}"
          marker-start="url(#start-marker)"
          marker-end="url(#head-marker)"
          :d="path(link)"
          :style="{stroke: stroke(link.source.color)}" />
      </g>
      <g>
        <g
          v-for="(node, key) in graph.nodes"
          :key="key"
          class="node"
          :class="{active: node.active}"
          :transform="`translate(${[node.x0, node.y0]})`">
          <rect
            :height="node.y1 - node.y0"
            :width="nodeWidth"
            rx="12"
            ry="12"
            :style="{fill: node.color, stroke: stroke(node.color)}"
            @mouseenter="$emit('enter', node)"
            @mouseleave="$emit('leave', node)"
            @click="ripple($event, 1, node), $emit('clicked', node)" />
          <text
            :y="(node.y1 - node.y0) / 2"
            dy=".35em"
            text-anchor="middle"
            :x="nodeWidth / 2"
            style="font-size: 22px;">
            <tspan
              v-for="(part, keyName) in format(node.name)"
              :key="keyName"
              :style="{
                fontWeight: part.primary ? 'bold' : null,
                fontSize: part.secondary ? '18px' : null,
              }"
              :baseline-shift="part.secondary ? '6' : (part.pre ? 1 : (part.post ? 6 : null))"
              v-text="part.text" />
          </text>
          <g
            v-for="(alt, index) in node.alts"
            :key="alt"
            class="alt"
            :transform="`translate(${[nodeWidth, node.y1 - node.y0 - index * 24]})`">
            <circle
              r="18"
              :style="{fill: altColor(node.color)}"
              @mouseenter="$emit('enter', node)"
              @mouseleave="$emit('leave', node)"
              @click="ripple($event, 1, node), $emit('clicked-alt', { node, alt })" />
            <text
              dy=".35em"
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
  </svg>
</template>
<script>
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey'
import * as d3 from 'd3'

import { TimelineMax, Linear } from 'gsap/TweenMax'

export default {
  props: {
    graph: {
      type: Object,
      required: true
    },
    iterations: {
      type: Number,
      default: 6
    },
    nodeWidth: {
      type: Number,
      default: 64
    },
    dark: {
      type: Boolean,
      default: false
    },
    format: {
      type: Function,
      default: text => [{ text }]
    },
    simpleFormat: {
      type: Function,
      default: text => text.replace(/b/g, '♭')
    }
  },
  data: () => ({
    margin: { top: 32, right: 32, bottom: 32, left: 32 },
    width: 1200,
    height: 720,
    path: null,
    lastNode: null,
    rippleColor: null
  }),
  watch: {
    graph: {
      handler (value) {
        if (value) {
          this.draw()
        }
      },
      immediate: true
    }
  },
  methods: {
    stroke (color) {
      return d3.rgb(color).darker(0.5)
    },
    altColor (color) {
      return this.$vuetify.theme.dark
        ? d3.color(d3.interpolateCubehelix(d3.rgb(color), '#fff')(0.66)).darker(0.11)
        : d3.color(d3.interpolateCubehelix(d3.rgb(color), '#000')(0.33)).darker(0.33)
    },
    draw () {
      const { margin, graph, iterations } = this
      const width = this.width - margin.right
      const height = this.height - margin.bottom

      const san = sankey()
        .nodeWidth(this.nodeWidth)
        .nodePadding(12)
        .nodeSort((b, a) => (a.romanChord.step + a.romanChord.alt) - (b.romanChord.step + b.romanChord.alt))
        .iterations(iterations)
        .nodeAlign(sankeyCenter)
        .extent([[margin.left, margin.top], [width, height]])

      this.path = sankeyLinkHorizontal()

      san(graph)
    },
    async ripple (event, timing, node) {
      this.rippleColor = this.$vuetify.theme.dark ? d3.rgb(node.color).brighter(1.5) : d3.rgb(node.color).darker(1.25)
      this.lastNode = node
      await new Promise(resolve => this.$nextTick(resolve))
      const { ripple } = this.$refs
      new TimelineMax().fromTo(ripple, timing, {
        x: event.offsetX,
        y: event.offsetY,
        transformOrigin: '50% 50%',
        scale: 0,
        opacity: 0.87,
        ease: Linear.easeOut
      }, {
        scale: 96,
        opacity: 0
      })
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
  font-size: 14px;
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

@keyframes selection {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: 9;
  }
}

.node.active rect {
  stroke: #000 !important;
  stroke-dasharray: 8 5;
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
  animation: selection 0.4s linear infinite reverse;
}

.dark .node.active rect {
  stroke: #fff !important;
}

path.link.active {
  stroke: #000 !important;
  stroke-dasharray: 3 5;
  stroke-width: 1.5 !important;
  stroke-opacity: 1;
  stroke-linejoin: round;
  stroke-linecap: round;
  animation: selection 0.4s linear infinite reverse;
}

.dark path.link.active {
  stroke: #fff !important;
}
</style>
