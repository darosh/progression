import WebMidi from 'webmidi'

export const midiStatus = {
  loading: false,
  fail: false,
  outputs: null,
  initialized: false
}

const store = {}

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
    register(notes, -1)
    const releasedNotes = notes.filter(note => !store[note])

    if (releasedNotes.length) {
      midiOutput.stopNote(releasedNotes)
    }
  } else {
    midiOutput.playNote(notes)
    register(notes, 1)
  }
}

function register (notes, value) {
  for (const note of notes) {
    store[note] = store[note] || 0
    store[note] += value
  }
}
