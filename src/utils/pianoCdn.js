export function pianoCdn (piano, Tone) {
  const type = Tone.ToneAudioBuffer.supportsType('ogg') ? 'ogg' : 'mp3'

  piano._pedal.samples = cdn('pedals', type)

  piano._pedal._internalLoad = () => new Promise(resolve => {
    piano._pedal._buffers = new Tone.ToneAudioBuffers({
      down1: `pedalD1.${type}`,
      down2: `pedalD2.${type}`,
      up1: `pedalU1.${type}`,
      up2: `pedalU2.${type}`
    }, resolve, piano._pedal.samples)
  })

  piano._keybed.samples = cdn('release', type)
  toType(piano._keybed._urls, type)

  piano._harmonics.samples = cdn('harmonics', type)
  toType(piano._harmonics._urls, type)

  for (const string of piano._strings._strings) {
    string.samples = cdn(`velocity${velocity(string)}`, type)
    toType(string._urls, type)
  }

  return piano
}

function toType (urls, type) {
  Object.keys(urls)
    .forEach(key => {
      urls[key] = encodeURIComponent(
        urls[key]
          .replace('[mp3|ogg]', type)
          .replace('s', '#')
      )
    })
}

function cdn (pkg, type) {
  return `https://unpkg.com/@audio-samples/piano-${type === 'mp3' ? 'mp3-' : ''}${pkg}@1.0.3/audio/`
}

function velocity (string) {
  return Object.values(string._urls)[0].matchAll(/v(\d+)/).next().value[1]
}
