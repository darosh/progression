import { transpose, chord } from '@tonaljs/chord'
import { interval, coordToInterval, encode, note, transpose as transposeNote } from '@tonaljs/tonal'
import { simplify } from '@tonaljs/note'
import { names, substract, add } from '@tonaljs/interval'

const intervalNames = names()

export function parseChord ({ romanChord }, baseNote) {
  const chordInterval = coordToInterval(encode(romanChord)).name
  const { type, bass, acc } = parseBass(romanChord.chordType)
  const chordName = transpose(baseNote + normalizeChordType(type), chordInterval)
  const chordData = chord(chordName)
  const chordIntervals = chordData.intervals.map(interval => add(chordInterval, interval))

  if (bass) {
    const bassInterval = getBassInterval(bass, acc)
    const bassIntervalData = interval(bassInterval)
    const firstIntervalData = interval(chordIntervals[0])

    const adjustedBassInterval = (bassIntervalData.semitones >= firstIntervalData.semitones)
      ? substract(bassInterval, '8P')
      : bassInterval

    chordIntervals.unshift(adjustedBassInterval)
  }

  const trans = interval => transposeNote(`${baseNote}3`, interval)
  const intervals = chordIntervals.map(trans)
  const notes = intervals.map(simplify)
  const midi = intervals.map(n => note(n).midi)

  return { midi, notes }
}

export function parseBass (chordType) {
  const [type, bass] = chordType.split('/')
  let acc
  let parsedBass

  if (bass && (bass[0] === 'b' || bass[0] === '#')) {
    acc = bass[0] === 'b' ? '-2m' : '2m'
    parsedBass = bass.slice(1)
  }

  if (bass) {
    parsedBass = parseInt(parsedBass || bass)
  }

  return { type, bass: parsedBass, acc }
}

function normalizeChordType (type) {
  return type
    .replace('M9', 'maj9')
    .replace('2', 'add2')
    .replace(/^b9$/, '7b9')
}

export function getBassInterval (bass, acc) {
  const bassInterval = intervalNames[bass - 1]

  if (acc) {
    return add(bassInterval, acc)
  }

  return bassInterval
}
