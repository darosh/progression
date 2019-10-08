import Vue from 'vue'
import { major, minor } from '../data' // , circular
import { formatNumber } from '../utils/format'

const defaultChannels = Object.freeze([
  {
    bass: true,
    mid: true,
    voice: true,
    octave: 0,
    channel: 1,
    velocity: 64
  },
  {
    bass: true,
    mid: false,
    voice: false,
    octave: -1,
    channel: 2,
    velocity: 64
  }
])

const data = {
  // Progression
  progressionType: major,

  // Root
  rootOctave: 3,
  rootPitch: 'C',
  rootAccidental: null,

  // Chord
  inversion: 0,

  // Chart
  formatRoman: true,
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
  octaves: Object.freeze([3, 4, 5]),
  inversions: Object.freeze([-3, -2, -1, 0, 1, 2, 3].map(value => ({ value, text: formatNumber(value) }))),
  pitches: Object.freeze('CDEFGAB'.split('')),
  progressionTypes: Object.freeze([
    { name: 'Major', value: major },
    { name: 'Minor', value: minor }
    // { name: 'Circular', value: circular }
  ]),
  accidentals: Object.freeze([
    { name: '♮', value: null },
    { name: '♯', value: '#' },
    { name: '♭', value: 'b' }
  ])
}

new Vue({ data }) // eslint-disable-line no-new

export default data
