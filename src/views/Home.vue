<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        class="pa-5">
        <v-row
          no-gutters
          class="mb-5"
          align="center"
          justify="center">
          <span class="title mr-5">Progression</span>
          <v-btn-toggle
            v-model="type"
            mandatory
            rounded>
            <v-btn text>
              Major
            </v-btn>
            <v-btn text>
              Minor
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="acc"
            class="ml-3"
            mandatory
            rounded>
            <v-btn text>
              <span class="sign">♮</span>
            </v-btn>
            <v-btn text>
              <span class="sign">♯</span>
            </v-btn>
            <v-btn text>
              <span class="sign">♭</span>
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="note"
            class="ml-3"
            mandatory
            rounded>
            <v-btn
              v-for="key in notes"
              :key="key"
              text
              v-text="key" />
          </v-btn-toggle>
          <v-btn-toggle
            v-model="roman"
            class="ml-3"
            rounded>
            <v-btn text>
              Roman
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="simple"
            class="ml-3"
            rounded>
            <v-btn text>
              Simple
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="dark"
            class="ml-3"
            rounded>
            <v-btn text>
              Dark
            </v-btn>
          </v-btn-toggle>
          <v-menu bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                large
                rounded
                text
                class="ml-3"
                v-on="on"
                @click="initMidi">
                MIDI
              </v-btn>
            </template>
            <v-card
              v-if="midiStatus.loading"
              class="pa-3">
              <v-progress-circular
                indeterminate
                :size="48-3"
                :width="6"
                color="rgb(0, 255, 68)"
                class="mr-2" />
              <i>Loading MIDI outputs...</i>
            </v-card>
            <v-list v-else>
              <v-list-item @click="midiOutput = null">
                None
              </v-list-item>
              <v-divider />
              <v-list-item
                v-for="(output, key) in midiStatus.outputs"
                :key="key"
                @click="midiOutput = output">
                {{ output.name }}
              </v-list-item>
            </v-list>
          </v-menu>
          <div style="position: relative;">
            <keyboard
              :style="{visibility: playStatus.loading ? 'hidden' : null}"
              :notes="piano"
              :start="36"
              :length="61"
              no-gutters
              class="ml-3 d-block" />
            <div
              v-if="playStatus.loading"
              style="position: absolute; top: 0px; left: 0; opacity: 0.87">
              <v-progress-circular
                indeterminate
                :size="48-3"
                :width="6"
                color="rgb(0, 255, 68)"
                class="ml-3 mr-2" />
              <i>Loading sounds...</i>
            </div>
          </div>
        </v-row>
        <v-row
          no-gutters
          justify="center">
          <v-card
            ref="chart"
            style="border-radius: 24px; overflow-x: auto;"
            elevation="1">
            <sankey
              v-if="!!graph"
              :graph="graph"
              class="d-block"
              :width="width"
              :height="height"
              :dark="$vuetify.theme.dark"
              :format="format()"
              @enter="activate($event, true)"
              @leave="activate($event, false)"
              @attack="play"
              @release="play($event, true)" />
            <div
              style="position: absolute; bottom: 0; right: 0;"
              class="pa-2">
              <v-btn
                icon
                large
                @click="full">
                <v-icon v-text="`mdi-fullscreen`" />
              </v-btn>
            </div>
          </v-card>
        </v-row>
        <v-row
          no-gutters
          justify="center"
          align="center"
          class="pt-3"
          style="opacity: 0.6">
          <span style="font-size: 24px;">𝄆</span>
          <span class="mx-3">
            Made in Brno, 2019, <a href="https://github.com/darosh/progression">GitHub</a>
          </span>
          <span style="font-size: 24px">𝄇</span>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
/* eslint-disable no-unused-vars */

import { romanNumeral } from '@tonaljs/roman-numeral'

import Sankey from '../components/Sankey'
import Keyboard from '../components/Keyboard'

import { major, minor, blues8, blues12 } from '../data'
import { groups } from '../data/groups'

import { removeSlashes, toSankey, toBeGrouped, mergeGroups, groupByNameAlt, normalize, activate } from '../utils/graph'
import { formatRoman, transposeFormatTransposed } from '../utils/format'
import { parseChord } from '../utils/chord'
import { initMidi, midiStatus } from '../utils/midi'
import { play, playStatus } from '../utils/play'

export default {
  components: { Sankey, Keyboard },
  data: () => ({
    type: 0,
    dark: null,
    acc: 0,
    roman: null,
    midi: null,
    graph: null,
    notes: 'CDEFGAB'.split(''),
    note: 0,
    piano: [],
    playStatus,
    midiStatus,
    midiOutput: null,
    simple: null,
    isFull: false
  }),
  computed: {
    baseNote () {
      return this.notes[this.note] + ['', '#', 'b'][this.acc]
    },
    width () {
      return this.isFull ? this.$vuetify.breakpoint.width : 1200
    },
    height () {
      return this.isFull ? this.$vuetify.breakpoint.height : 720
    }
  },
  watch: {
    type: {
      handler: 'draw',
      immediate: true
    },
    simple: 'draw',
    dark (value) {
      this.$vuetify.theme.dark = value === 0
    }
  },
  methods: {
    activate,
    initMidi,
    format () {
      if (this.roman === 0) {
        return formatRoman
      } else {
        return name => transposeFormatTransposed(name, this.baseNote)
      }
    },
    draw () {
      // const list = normalize(blues8, groups)
      // const list = normalize(blues12, groups)
      const list = normalize(this.type ? minor : major, groups, false)
      // removeSlashes(list)
      const bgr = toBeGrouped(groupByNameAlt(list))
      mergeGroups(bgr, list)

      if (this.simple === 0) {
        list.filter(({ group }) => group > 1).forEach(obj => { obj.removed = true })
      }

      this.graph = toSankey(list)
      this.graph.nodes.forEach(object => { object.romanChord = romanNumeral(object.name) })
    },
    async play (object, release = false) {
      if (object.node) {
        object = {
          romanChord: { ...object.node.romanChord, chordType: object.alt }
        }
      }

      const { midi, notes } = parseChord(object, this.baseNote)

      this.piano = midi

      if (this.midiOutput) {
        if (release) {
          this.midiOutput.stopNote(this.piano)
        } else {
          this.midiOutput.playNote(this.piano)
        }
      } else {
        play(notes, release)
      }
    },
    full () {
      if (!document.fullscreenElement) {
        this.$refs.chart.$el.requestFullscreen()
        this.isFull = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          this.isFull = false
        }
      }
    }
  }
}
</script>
<style>
.sign {
  font-size: 22px;
}

html {
  overflow-y: auto !important;
  user-select: none;
}
</style>
