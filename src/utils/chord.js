import { transpose, chord } from '@tonaljs/chord'
import { interval, coordToInterval, encode, note, transpose as transposeNote } from '@tonaljs/tonal'
import { simplify } from '@tonaljs/note'
import { names, substract, add } from '@tonaljs/interval'
import { toMidi, midiToNoteName } from '@tonaljs/midi'

const intervalNames = names()

export function parseChord (romanChord, note, octave) {
  const chordInterval = coordToInterval(encode(romanChord)).name
  const { type, bass, acc } = parseBass(romanChord.chordType)
  const chordName = transpose(note + normalizeChordType(type), chordInterval)
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

  const trans = interval => transposeNote(`${note}${octave}`, interval)

  return chordIntervals.map(trans)
}

export function intervalsToNotes (intervals) {
  return intervals.map(simplify)
}

export function intervalsToMidi (intervals) {
  return intervals.map(n => note(n).midi)
}

export function parseBass (chordType) {
  const [type, bass] = chordType.split('/')
  let acc
  let parsedBass

  if (bass && (bass[0] === 'b' || bass[0] === '#')) {
    acc = bass[0] === 'b' ? '-1A' : '1A'
    parsedBass = bass.slice(1)
  }

  if (bass) {
    parsedBass = parseInt(parsedBass || bass)
  }

  return { type, bass: parsedBass, acc }
}

function normalizeChordType (type) {
  return type
    .replace('sus', 'sus4')
    .replace('b9', '7b9')
    .replace('b13', '9b13')
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

let lastMidis = null

export function invert (intervals, inversion) {
  debugger
  const midis = intervals.map(toMidi)

  if (!inversion) {
    lastMidis = midis
    return intervals
  }

  if ((inversion === 'A') && lastMidis) {
    automatic(midis, lastMidis)
  } else if (inversion !== 'A') {
    invertMidi(midis, inversion)
  }

  lastMidis = midis

  return midis.map(midiToNoteName)
}

function invertMidi (midis, inversion) {
  const sign = Math.sign(inversion)

  while (inversion !== 0) {
    inversion -= sign

    if (sign > 0) {
      let first = midis.shift()
      const last = midis[midis.length - 1]
      while (first <= last) { first += 12 }
      midis.push(first)
    } else {
      let first = midis.pop()
      const last = midis[0]
      while (first >= last) { first -= 12 }
      midis.unshift(first)
    }
  }

  return midis
}

function automatic (midis, lastMidis) {
  const lastMax = Math.max(...lastMidis)
  const currentMax = Math.max(...midis)
  const dist = lastMax - currentMax

  if (dist === 0) {
    return
  }

  invertMidi(midis, Math.sign(dist))
}
