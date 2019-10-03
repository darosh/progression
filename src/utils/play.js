import { SampleLibrary } from '../utils/samples'

let current
let initialized
const store = {}

export const playStatus = { loading: false }

async function initialize () {
  playStatus.loading = true

  const Tone = await import('tone')
  window.Tone = Tone

  SampleLibrary.setExt('.mp3')

  const samples = SampleLibrary.load({
    instruments: ['piano'],
    baseUrl: 'samples/'
  }, Tone)

  await Tone.ToneAudioBuffer.loaded()
  playStatus.loading = false

  const vol = new Tone.Volume(-32)

  for (const property in samples) {
    if (samples.hasOwnProperty(property)) {
      samples[property].release = 0.5
      samples[property].chain(vol, Tone.Destination)
    }
  }

  current = samples['piano']
}

async function ready () {
  initialized = initialized || initialize()
  await initialized
}

export async function play (notes, release = false) {
  await ready()

  if (release) {
    register(notes, -1)
    const releasedNotes = notes.filter(note => !store[note])

    if (releasedNotes.length) {
      // console.log('[OFF]', releasedNotes.toString())
      current.triggerRelease(releasedNotes)
    }
  } else {
    current.triggerAttack(notes)
    // console.log('[ON]', notes.toString())
    register(notes, 1)
  }
}

function register (notes, value) {
  for (const note of notes) {
    store[note] = store[note] || 0
    store[note] += value
  }
}
