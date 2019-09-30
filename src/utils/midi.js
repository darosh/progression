import WebMidi from 'webmidi'

export const midiStatus = {
  loading: false,
  fail: false,
  outputs: null,
  initialized: false
}

export function enable () {
  return new Promise((resolve, reject) => {
    WebMidi.enable(function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
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
    midiStatus.fail = true
    console.error(err)
  }
}
