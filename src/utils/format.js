import { romanNumeral } from '@tonaljs/roman-numeral'

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

export function formatTransposed (name, chordType) {
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
    format.push({
      text: replaceType(chordType),
      secondary: true
    })
  }

  return format
}
