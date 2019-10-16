import { pianoCdn } from './pianoCdn'

let piano
let initialized

export const playStatus = { loading: false }

async function initialize () {
  playStatus.loading = true

  const Tone = await import('tone')
  window.Tone = Tone
  const Piano = (await import('@tonejs/piano')).default
  piano = new Piano({ velocities: 3, release: false, pedal: false })
  piano.toDestination()
  pianoCdn(piano, Tone)
  await piano.load()

  playStatus.loading = false
}

async function ready () {
  initialized = initialized || initialize()
  await initialized
}

export const pianoPlay = {
  async start (notes, channel, velocity) {
    await ready()

    keyDown(notes, '+0', velocity / 127)
  },
  async stop (notes, channel) {
    await ready()

    keyUp(notes, '+0.00833333333') // 1 / 120 seconds
  }
}

function keyDown (notes, time, velocity) {
  for (const note of notes) {
    piano.keyDown(note, time, velocity)
  }
}

function keyUp (notes, time) {
  for (const note of notes) {
    piano.keyUp(note, time)
  }
}
