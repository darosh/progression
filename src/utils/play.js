import { SampleLibrary } from '../utils/samples'
import Register from './register'
import bindMethods from 'bind-methods'

let current
let initialized

const { register, unregister, stopping, releasing } = bindMethods(new Register())

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
    unregister(notes)
    const releasedNotes = releasing(notes)

    if (releasedNotes.length) {
      // console.log('[OFF]', releasedNotes.toString())
      current.triggerRelease(releasedNotes)
    }
  } else {
    const toStop = stopping(notes)

    if (toStop.length) {
      current.triggerRelease(toStop)
    }

    current.triggerAttack(notes)
    // console.log('[ON]', notes.toString())
    register(notes)
  }
}
