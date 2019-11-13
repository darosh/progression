import WebMidi from 'webmidi'
import Register from './register'
import bindMethods from 'bind-methods'
import { groupBy } from 'rambdax'

export const midiStatus = {
  loading: false,
  fail: false,
  outputs: null,
  initialized: false
}

const { register, unregister, stopping, releasing } = bindMethods(new Register())

export function getMidiPlay (midiOutput) {
  return {
    start (notes, channel, velocity) {
      midiOutput.playNote(notes, channel, { velocity, rawVelocity: true })
    },
    stop (releasedNotes, channel) {
      midiOutput.stopNote(releasedNotes, channel)
    }
  }
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
    midiStatus.loading = false
    midiStatus.fail = true
    // console.error(err)
  }
}

export function play ({ start, stop }, notes, channels, release = false) {
  const mix = mixChannels(notes, channels)

  mix.forEach(([channel, velocities]) => {
    velocities.forEach(([velocity, ns]) => {
      const n = ns.map(([note]) => note)
      playChannel({ start, stop }, n, channel, velocity, release)
    })
  })
}

function playChannel ({ start, stop }, notes, channel, velocity, release = false) {
  if (release) {
    unregister(notes, channel)
    const releasedNotes = releasing(notes, channel)

    if (releasedNotes.length) {
      stop(releasedNotes, channel)
    }
  } else {
    const toStop = stopping(notes, channel)

    if (toStop.length) {
      stop(toStop, channel)
    }

    start(notes, channel, velocity)
    register(notes, channel)
  }
}

function mixChannels (notes, channels) {
  const array = getChannelNotesVolumes(notes, channels)
  const channelGroups = numericEntries(groupByChannel(array))

  return channelGroups.map(
    ([channel, array]) => ([
      channel,
      numericEntries(groupByVelocity(numericEntries(groupByNote(array))
        .map(([note, array]) => ([note, filterLoudest(array)]))))
    ]))
}

export function getChannelNotesVolumes (notes, channels) {
  return channels.reduce((acc, { bass, mid, voice, octave, channel, velocity, pick }) => {
    const t = n => n + octave * 12
    const arr = []

    if (bass) {
      arr.push({ note: t(notes[0]), channel, velocity })
    }

    if (mid) {
      for (let i = 1; i < (notes.length - 1); i++) {
        arr.push({ note: t(notes[i]), channel, velocity })
      }
    }

    if (voice) {
      arr.push({ note: t(notes[notes.length - 1]), channel, velocity })
    }

    acc.push(...pickNotes(arr, pick))

    return acc
  }, [])
}

function pickNotes (arr, pick) {
  if (pick === 0) {
    return arr
  } else if (pick < 0) {
    return arr.slice(0, Math.min(Math.abs(pick), arr.length))
  } else {
    return arr.slice(arr.length - Math.min(pick, arr.length))
  }
}

function groupByChannel (array) {
  return groupBy(({ channel }) => channel)(array)
}

function groupByNote (array) {
  return groupBy(({ note }) => note)(array)
}

function groupByVelocity (array) {
  return groupBy(([note, { velocity }]) => velocity)(array)
}

function numericEntries (o) {
  return Object.entries(o).map(([key, value]) => [parseInt(key), value])
}

function filterLoudest (array) {
  if (array.length === 1) {
    return array[0]
  }

  const max = Math.max(...array.map(({ velocity }) => velocity))

  return array.find(({ velocity }) => velocity === max)
}

export function singleChannel (channels) {
  return channels.map(c => ({ ...c, channel: 1 }))
}
