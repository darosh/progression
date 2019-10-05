import WebMidi from 'webmidi'
import Register from './register'
import bindMethods from 'bind-methods'

export const midiStatus = {
  loading: false,
  fail: false,
  outputs: null,
  initialized: false
}

const { register, unregister, stopping, releasing } = bindMethods(new Register())

export function enable () {
  return new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    }, true)
  })
}

export async function initMidi () {
  if (midiStatus.initialized) {
    return
  }

  midiStatus.initialized = true

  try {
    midiStatus.loading = true
    await enable()
    midiStatus.outputs = WebMidi.outputs
    midiStatus.loading = false
  } catch (err) {
    midiStatus.loading = false
    midiStatus.fail = true
    // console.error(err)
  }
}

export function play (midiOutput, notes, release) {
  if (release) {
    unregister(notes)
    const releasedNotes = releasing(notes)

    if (releasedNotes.length) {
      midiOutput.stopNote(releasedNotes)
    }
  } else {
    const toStop = stopping(notes)

    if (toStop.length) {
      midiOutput.stopNote(toStop)
    }

    midiOutput.playNote(notes)
    register(notes)
  }
}
