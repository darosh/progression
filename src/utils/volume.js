export function velocityToVolume (volume) {
  // Based on MMA GM MIDI specification https://www.kvraudio.com/forum/viewtopic.php?t=310725
  return Math.round(40 * Math.log10(volume / 127)) || 0
}
