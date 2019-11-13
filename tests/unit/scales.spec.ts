import { entries } from '@tonaljs/scale-dictionary'
import { chordType } from '@tonaljs/chord-dictionary'
import { pcset } from '@tonaljs/pcset'

describe('a', () => {
  it('b', () => {
    const k = entries().filter(({ intervals }) => intervals.length === 7)

    const names = k.map((entry) => {
      const [c, d, e, f, g] = entry.intervals
      const notes = [c, e, g]
      const chroma = pcset(notes).chroma
      const x = chordType(chroma)

      return {
        name: entry.name,
        chord: x.name,
        aliases: x.aliases,
        chroma: entry.chroma,
        num: parseInt(entry.chroma, 2)
      }
    })

    console.log(names.sort((a, b) => a.num - b.num))
  })
})
