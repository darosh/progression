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

export function play (midiOutput, notes, channels, release = false) {
  const mix = mixChannels(notes, channels)

  mix.forEach(([channel, velocities]) => {
    velocities.forEach(([velocity, ns]) => {
      const n = ns.map(([note]) => note)
      playChannel(midiOutput, n, channel, velocity, release)
    })
  })
}

function playChannel (midiOutput, notes, channel, velocity, release = false) {
  if (release) {
    unregister(notes, channel)
    const releasedNotes = releasing(notes, channel)

    if (releasedNotes.length) {
      midiOutput.stopNote(releasedNotes, channel)
    }
  } else {
    const toStop = stopping(notes, channel)

    if (toStop.length) {
      midiOutput.stopNote(toStop, channel)
    }

    midiOutput.playNote(notes, channel, { velocity, rawVelocity: true })
    register(notes)
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
  return channels.reduce((acc, { bass, mid, voice, octave, channel, velocity }) => {
    const t = n => n + octave * 12

    if (bass) {
      acc.push({ note: t(notes[0]), channel, velocity })
    }

    if (voice) {
      acc.push({ note: t(notes[notes.length - 1]), channel, velocity })
    }

    if (mid) {
      for (let i = 1; i < (notes.length - 1); i++) {
        acc.push({ note: t(notes[i]), channel, velocity })
      }
    }

    return acc
  }, [])
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
