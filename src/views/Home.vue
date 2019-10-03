<template>
  <v-app>
    <v-navigation-drawer
      v-model="showMenu"
      app
      width="380"
      :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
      <v-list class="py-2">
        <v-list-item class="pt-5 pb-5 ma-0">
          <v-flex />
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
        </v-list-item>
        <v-divider />
        <v-list-item class="py-5">
          <v-flex />
          <v-btn-toggle
            v-model="note"
            rounded
            mandatory>
            <v-btn
              v-for="key in notes"
              :key="key"
              text
              v-text="key" />
          </v-btn-toggle>
        </v-list-item>
        <v-list-item class="pb-5">
          <v-spacer />
          <v-btn-toggle
            v-model="acc"
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
        </v-list-item>
        <v-divider />
        <v-list-item class="py-5">
          <v-flex />
          <v-btn-toggle
            v-model="roman"
            rounded>
            <v-btn text>
              Roman
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
        <v-divider />
        <v-list-item class="py-5">
          <v-flex />
          <v-btn-toggle
            v-model="simple"
            rounded>
            <v-btn text>
              Simple
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
        <v-divider />
        <v-list-item class="py-5">
          <v-flex />
          <v-btn-toggle
            v-model="dark"
            rounded>
            <v-btn text>
              Dark
            </v-btn>
          </v-btn-toggle>
        </v-list-item>
        <v-divider />
        <v-list-item class="py-5">
          <v-flex />
          <v-menu bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                text
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
                <v-list-item-title>
                  None
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon v-if="midiOutput === null">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider v-if="midiStatus.outputs && midiStatus.outputs.length" />
              <v-list-item
                v-for="(output, key) in midiStatus.outputs"
                :key="key"
                @click="midiOutput = output">
                <v-list-item-title>
                  {{ output.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon v-if="midiOutput === output">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-divider />
      </v-list>
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
        class="pa-5">
        <v-row
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
          <v-row style="position: relative;">
            <v-spacer />
            <v-flex />
            <keyboard
              :style="{visibility: playStatus.loading ? 'hidden' : null}"
              :notes="piano"
              :start="36"
              :length="61"
              no-gutters
              class="ml-3 d-block" />
            <div
              v-if="playStatus.loading"
              style="position: absolute; top: 0px; right: 0; opacity: 0.87">
              <v-progress-circular
                indeterminate
                :size="48-3"
                :width="6"
                color="rgb(0, 255, 68)"
                class="ml-3 mr-2" />
              <i>Loading sounds...</i>
            </div>
          </v-row>
        </v-row>

        <v-row
          v-if="false"
          no-gutters
          class="mb-5"
          align="center">
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
                <v-list-item-title>
                  None
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon v-if="midiOutput === null">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-divider />
              <v-list-item
                v-for="(output, key) in midiStatus.outputs"
                :key="key"
                @click="midiOutput = output">
                <v-list-item-title>
                  {{ output.name }}
                </v-list-item-title>
                <v-list-item-action>
                  <v-icon v-if="midiOutput === output">
                    mdi-check
                  </v-icon>
                </v-list-item-action>
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
            :color="$vuetify.theme.dark && isFull ? 'grey darken-4' : null"
            style="border-radius: 24px;"
            elevation="1">
            <div style="overflow-x: auto;">
              <sankey
                v-if="!!graph"
                :graph="graph"
                :margin="margin"
                class="d-block"
                :width="width"
                :height="height"
                :dark="$vuetify.theme.dark"
                :format="format()"
                :node-size="nodeWidth"
                @enter="activate($event, true)"
                @leave="activate($event, false)"
                @attack="play"
                @release="play($event, true)" />
            </div>
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
import { initMidi, midiStatus, play as playMidi } from '../utils/midi'
import { play, playStatus } from '../utils/play'

export default {
  components: { Sankey, Keyboard },
  data: () => ({
    showMenu: true,
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
    type: {
      handler: 'draw',
      immediate: true
    },
    simple: 'draw',
    dark (value) {
      this.$vuetify.theme.dark = value === 0
    }
  },
  created () {
    document.addEventListener('fullscreenchange', this.fullChanged)
  },
  beforeDestroy () {
    document.removeEventListener('fullscreenchange', this.fullChanged)
  },
  methods: {
    activate,
    initMidi,
    format () {
      // return ({ id }) => ([{ text: id }])

      if (this.roman === 0) {
        return ({ name }) => formatRoman(name)
      } else {
        return ({ name }) => transposeFormatTransposed(name, this.baseNote)
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
      const romanChord = object.romanChord || { ...object.node.romanChord, chordType: object.alt }
      // const id = [object.id || object.node.id, romanChord.roman, romanChord.chordType || '*', this.baseNote].join('_')
      const { midi, notes } = parseChord(romanChord, this.baseNote)

      if (!release) {
        this.piano = midi
      }

      if (this.midiOutput) {
        playMidi(this.midiOutput, midi, release)
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
    },
    fullChanged () {
      if (!document.fullscreenElement) {
        this.isFull = false
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
