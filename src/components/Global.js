import Vue from 'vue'
import frozen from '../data/frozen'
import { formatNumber } from '../utils/format'

const { major, minor, majorDegrees, minorDegrees, blues8, blues12 } = frozen

const defaultChannels = Object.freeze([
  {
    bass: true,
    mid: true,
    voice: true,
    octave: 0,
    channel: 1,
    velocity: 64,
    pick: 0
  },
  {
    bass: true,
    mid: false,
    voice: false,
    octave: -1,
    channel: 2,
    velocity: 32,
    pick: 0
  }
])

const data = {
  // Progression
  progressionType: major,

  // Root
  rootOctave: 4,
  rootPitch: 'C',
  rootAccidental: null,

  // Chord
  inversion: 0,

  // Chart
  formatRoman: false,
  layoutPads: null,
  chartBass: true,
  chartSimple: null,

  // View
  dark: null,

  // MIDI
  volume: 64,
  midiOutput: null,
  channels: defaultChannels.map(o => ({ ...o })),

  // Constants
  defaultChannels,
  octaves: Object.freeze([1, 2, 3, 4, 5, 6]),
  inversions: Object.freeze([-3, -2, -1, 0, 1, 2, 3, 'A'].map(value => ({ value, text: formatNumber(value) }))),
  pitches: Object.freeze('C C# D D# E F F# G G# A A# B'.split(' ')),
  progressionTypes: Object.freeze([
    { name: 'Major', value: major },
    { name: 'Minor', value: minor }
    // { name: 'Circular', value: circular }
  ]),
  progressionTypesMore: Object.freeze([
    { name: 'Major circular', value: majorDegrees },
    { name: 'Minor circular', value: minorDegrees },
    { name: '8 blues', value: blues8 },
    { name: '12 blues', value: blues12 }
  ]),
  accidentals: Object.freeze([
    { name: '♮', value: null },
    { name: '♯', value: '#' },
    { name: '♭', value: 'b' }
  ])
}

new Vue({ data }) // eslint-disable-line no-new

export default data
