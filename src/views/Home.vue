<template>
  <v-app ref="full">
    <v-navigation-drawer
      v-model="showMenu"
      :mobile-break-point="mbp"
      :temporary="isFull"
      hide-overlay
      app
      :width="$vuetify.breakpoint.width > 1200 ? 368 : 240"
      :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
      <x-settings />
      <v-row
        no-gutters
        justify="center"
        align="center"
        class="py-5"
        style="opacity: 0.6">
        <span class="mx-3">
          Made in Brno, 2019, <a href="https://github.com/darosh/progression">GitHub</a>
        </span>
      </v-row>
    </v-navigation-drawer>
    <v-content>
      <v-container
        fluid
        :class="{'pa-5': (!isFull && $vuetify.breakpoint.width > 800), 'pa-0 black': !(!isFull && $vuetify.breakpoint.width > 800)}">
        <v-row
          v-if="!isFull && $vuetify.breakpoint.width > 800"
          class="pb-5"
          no-gutters
          align="center">
          <v-btn
            fab
            depressed
            color="transparent"
            @click="showMenu = !showMenu">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <span class="title ml-5">Progression</span>
          <v-spacer />
          <v-row
            style="position: relative;"
            class="mx-1">
            <v-spacer />
            <v-flex />
            <x-keyboard
              :style="{visibility: playStatus.loading ? 'hidden' : null}"
              :notes="piano"
              :start="36"
              :length="61"
              no-gutters
              class="d-block" />
            <div
              v-if="playStatus.loading"
              style="position: absolute; top: 0; right: 0; opacity: 0.87">
              <v-progress-circular
                indeterminate
                :size="48-3"
                :width="6"
                color="accent"
                class="mr-2" />
              <i>Loading sounds...</i>
            </div>
          </v-row>
        </v-row>
        <v-row
          no-gutters
          justify="center">
          <v-card
            :color="$vuetify.theme.dark ? 'grey darken-4' : null"
            :style="{borderRadius: (!isFull && $vuetify.breakpoint.width > 800) ? '24px' : 0}"
            elevation="1">
            <div style="overflow-x: auto;">
              <x-chart
                ref="chart"
                v-bind="graphProps"
                :style="{visibility: hide ? 'hidden' : null}"
                :margin="margin"
                :animate="visible"
                class="d-block"
                :width="width"
                :height="height"
                :inversions="inversions"
                :inversion.sync="inversion"
                :dark="$vuetify.theme.dark"
                :format="format()"
                :node-size="nodeWidth"
                @enter="activate($event, true)"
                @leave="activate($event, false)"
                @update:recent="recentCount = $event"
                @attack="play"
                @release="play($event, true)" />
            </div>
            <div
              style="position: absolute; bottom: 0; left: 0;"
              class="pa-2">
              <v-btn
                icon
                large
                @click="full">
                <v-icon v-text="`mdi-fullscreen`" />
              </v-btn>
            </div>
            <div
              v-if="isFull || ($vuetify.breakpoint.width <= 800)"
              style="position: absolute; top: 0; left: 0;"
              class="pa-2">
              <v-btn
                icon
                large
                @click="showMenu = !showMenu">
                <v-icon v-text="`mdi-menu`" />
              </v-btn>
            </div>
            <div
              v-if="recentCount"
              style="position: absolute; bottom: 0; right: 0;"
              class="pa-2">
              <v-btn
                icon
                large
                @click="$refs.chart.recent = []; recentCount = 0">
                <v-icon v-text="`mdi-close`" />
              </v-btn>
            </div>
          </v-card>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
/* eslint-disable no-unused-vars */

import { romanNumeral } from '@tonaljs/roman-numeral'

import XChart from '../components/Chart'
import XKeyboard from '../components/Keyboard'
import XSettings from '../components/Settings'
import Settable from '../components/Settable'

import { groups } from '../data/groups'
import { formatRoman, transposeFormatTransposed } from '../utils/format'
import { intervalsToMidi, invert, parseChord } from '../utils/chord'
import { initMidi, midiStatus, getMidiPlay, play as playMidi } from '../utils/midi'
import { playStatus, pianoPlay } from '../utils/piano'
import { initialize } from '@/utils/structure-chord'
import { groupByNameAlt, joinAllNodes, mergeGroups, removeBass, toBeGrouped } from '@/utils/structure-chord-ops'
import { filter, floodDepth, toList } from '@/utils/structure'
import { activate, mapExtra, toSankey } from '@/utils/structure-extra'
import { singleChannel } from '@/utils/midi'

const mbp = 1640

export default {
  components: { XSettings, XChart, XKeyboard },
  mixins: [Settable],
  data: () => ({
    mbp,
    showMenu: window.innerWidth >= mbp,
    visible: true,
    hide: false,
    midi: null,
    piano: [],
    playStatus,
    midiStatus,
    isFull: false,
    recentCount: 0,
    graphProps: {}
  }),
  computed: {
    width () {
      return this.isFull ? Math.max(800, this.$vuetify.breakpoint.width) : Math.max(800, Math.min(this.$vuetify.breakpoint.width - 48, 1200))
    },
    height () {
      return this.isFull ? Math.max(480, this.$vuetify.breakpoint.height) : Math.max(480, Math.min(this.$vuetify.breakpoint.height - 120, 720))
    },
    margin () {
      return this.isFull ? { top: 48, right: 48, bottom: 48, left: 48 } : { top: 32, right: 32, bottom: 32, left: 32 }
    },
    nodeWidth () {
      return (this.width - this.margin.left - this.margin.right) / (12 * 1.44)
    }
  },
  watch: {
    progressionType: {
      handler: 'draw',
      immediate: true
    },
    chartSimple: 'draw',
    chartBass: 'draw',
    layoutPads: 'draw',
    dark (value) {
      this.$vuetify.theme.dark = value === true
    }
  },
  created () {
    document.addEventListener('fullscreenchange', this.fullChanged)
    window.addEventListener('visibilitychange', this.onVisibility)
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.fullChanged)
    window.removeEventListener('visibilitychange', this.onVisibility)
  },
  methods: {
    activate,
    initMidi,
    onVisibility () {
      this.visible = document.visibilityState === 'visible'
    },
    format () {
      if (this.formatRoman) {
        return ({ data: { name } }) => formatRoman(name)
      } else {
        return ({ data: { name } }) => transposeFormatTransposed(name, this.rootNote)
      }
    },
    draw () {
      const dic = initialize(this.progressionType.map)

      if (this.progressionType.joints) {
        joinAllNodes(dic, this.progressionType.joints)
      }

      if (!this.chartBass) {
        removeBass(dic)
      }

      const mergingCandidates = groupByNameAlt(toList(dic))
      const mergingGroups = this.layoutPads ? mergingCandidates : toBeGrouped(mergingCandidates)
      floodDepth(dic)
      mergeGroups(dic, mergingGroups)

      if (this.chartSimple) {
        filter(dic, ({ data: { group } }) => group <= 1)
      }

      mapExtra(dic, groups)

      const list = toList(dic)
      list.forEach(object => { object.extra.romanChord = romanNumeral(object.data.name) })
      this.graphProps = { sanGraph: toSankey(list), pads: this.layoutPads }
    },
    async play ({ node, alt, inversion }, release = false) {
      const romanChord = alt ? { ...node.extra.romanChord, chordType: alt } : node.extra.romanChord
      const intervals = invert(parseChord(romanChord, this.rootNote, this.rootOctave), inversion)
      const midi = intervalsToMidi(intervals)

      if (!release) {
        this.piano = midi
      }

      if (this.midiOutput) {
        playMidi(getMidiPlay(this.midiOutput), midi, this.channels, release)
      } else {
        playMidi(pianoPlay, midi, singleChannel(this.channels), release)
      }
    },
    full () {
      if (!document.fullscreenElement) {
        this.$refs.full.$el.requestFullscreen()
        this.isFull = true
        this.showMenu = false
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          this.isFull = false
        }
      }
    },
    fullChanged () {
      if (!document.fullscreenElement) {
        this.isFull = false
      }
    }
  }
}
</script>
