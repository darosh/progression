import { romanNumeral } from '@tonaljs/roman-numeral'
import { transpose } from '@tonaljs/chord'
import { coordToInterval, encode, transpose as transposeNote } from '@tonaljs/tonal'
import { getBassInterval, parseBass } from './chord'

function replaceSigns (acc) {
  return acc.replace(/#/g, '♯').replace(/b/g, '♭')
}

function replaceType (acc) {
  return replaceSigns(acc).replace(/-/g, '−')
}

export function formatRoman (name) {
  const { roman, acc, chordType } = romanNumeral(name)

  const format = []

  if (acc) {
    format.push({
      text: replaceSigns(acc),
      pre: true
    })
  }

  format.push({
    text: roman,
    primary: true
  })

  if (chordType) {
    format.push({
      text: replaceType(chordType),
      secondary: true
    })
  }

  return format
}

export function formatTransposed (name, chordType, baseNote) {
  const parts = name.split('')

  const format = []

  format.push({
    text: parts[0],
    primary: true
  })

  if (parts[1]) {
    format.push({
      text: replaceSigns(parts[1]),
      post: true
    })
  }

  if (chordType) {
    const { type, bass, acc } = parseBass(chordType)

    let bassText = null

    if (bass) {
      const bassInterval = getBassInterval(bass, acc)
      bassText = `/${transposeNote(baseNote, bassInterval)}`
    }

    format.push({
      text: replaceType(type) + (bassText || ''),
      secondary: true
    })
  }

  return format
}

export function transposeFormatTransposed (name, baseNote) {
  const r = romanNumeral(name)
  const n = transpose(baseNote, coordToInterval(encode(r)).name)

  return formatTransposed(n, r.chordType, baseNote)
}
