import global from './Global'
import { syncAll } from '../utils/sync'

export default {
  computed: {
    ...syncAll(global),
    rootNote () {
      return `${this.rootPitch}${this.rootAccidental || ''}`
    },
    rootNoteOctave () {
      return `${this.rootNote}${this.rootOctave}`
    }
  }
}
