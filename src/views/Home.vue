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
            v-model="dark"
            class="ml-3"
            rounded>
            <v-btn text>
              Dark
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="midi"
            class="ml-3"
            rounded>
            <v-btn text disabled>
              MIDI
            </v-btn>
          </v-btn-toggle>
          <keyboard
            :notes="piano"
            :start="36"
            :length="61"
            no-gutters
            class="ml-3" />
        </v-row>
        <v-row
          no-gutters
          justify="center">
          <v-card
            style="border-radius: 24px;"
            elevation="1">
            <sankey
              v-if="!!graph"
              :graph="graph"
              class="d-block"
              :dark="$vuetify.theme.dark"
              :format="format()"
              @enter="activate($event, true)"
              @leave="activate($event, false)"
              @clicked="play"
              @clicked-alt="playAlt" />
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
import Sankey from '../components/Sankey'
import Keyboard from '../components/Keyboard'

import major from '../data/progression-major'
import minor from '../data/progression-minor'
import { removeSlashes, toSankey, toBeGrouped, mergeGroups, groupByNameAlt, normalize, activate } from '../utils/graph'
import { shapes } from '@/data/shapes'
import { romanNumeral } from '@tonaljs/roman-numeral'
import { transpose, chord } from '@tonaljs/chord'
import { coordToInterval, encode, note, transpose as transposeNote } from '@tonaljs/tonal'
import { formatRoman, formatTransposed } from '@/utils/format'
import { play } from '@/utils/play'

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
    piano: []
  }),
  watch: {
    type: {
      handler: 'draw',
      immediate: true
    },
    dark (value) {
      this.$vuetify.theme.dark = value === 0
    }
  },
  methods: {
    activate,
    format () {
      if (this.roman === 0) {
        return formatRoman
      } else {
        return name => {
          const r = romanNumeral(name)
          const n = transpose(this.notes[this.note] + ['', '#', 'b'][this.acc], coordToInterval(encode(r)).name)

          return formatTransposed(n, r.chordType)
        }
      }
    },
    draw () {
      const list = normalize(this.type ? minor : major, shapes)
      removeSlashes(list)
      const bgr = toBeGrouped(groupByNameAlt(list))
      mergeGroups(bgr, list)
      list.forEach(object => { object.romanChord = romanNumeral(object.name) })

      this.graph = toSankey(list)
    },
    async play (object) {
      const chordInterval = coordToInterval(encode(object.romanChord)).name
      const acc = ['', '#', 'b'][this.acc]
      const baseNote = this.notes[this.note]
      const chordName = transpose(baseNote + acc + object.romanChord.chordType.replace('M9', 'maj9').replace('2', 'add2').replace(/^b9$/, '7b9'), chordInterval)
      const chordData = chord(chordName)
      const trans = interval => transposeNote(transposeNote(`${baseNote}${acc}3`, chordInterval), interval)
      const intervals = chordData.intervals.map(trans)
      const frequencies = intervals.map(n => note(n).freq)
      this.piano = intervals.map(n => note(n).midi)
      play(frequencies)
    },
    playAlt ({ node, alt }) {
      const romanChord = { ...node.romanChord, chordType: alt }

      this.play({ romanChord })
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
