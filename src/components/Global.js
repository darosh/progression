import Vue from 'vue'
import { major, minor, circular } from '../data'
import { formatNumber } from '../utils/format'

const data = {
  // Progression
  progressionType: major,

  // Root
  rootOctave: 3,
  rootPitch: 'C',
  rootAccidental: '',

  // Chord
  inversion: 0,

  // Chart
  formatRoman: null,
  layoutPads: null,
  chartBass: true,
  chartSimple: null,

  // View
  dark: null,

  // MIDI
  midiOutput: null,

  // Constants
  octaves: Object.freeze([3, 4, 5]),
  inversions: Object.freeze([-3, -2, -1, 0, 1, 2, 3].map(value => ({ value, text: formatNumber(value) }))),
  pitches: Object.freeze('CDEFGAB'.split('')),
  progressionTypes: Object.freeze([
    { name: 'Major', value: major },
    { name: 'Minor', value: minor },
    { name: 'Circular', value: circular }
  ]),
  accidentals: Object.freeze([
    { name: '♮', value: '' },
    { name: '♯', value: '#' },
    { name: '♭', value: 'b' }
  ])
}

new Vue({ data }) // eslint-disable-line no-new

export default data
