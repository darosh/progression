export default function () {
  return {
    store: {},
    add (notes, value, channel) {
      for (const note of notes) {
        this.store[channel] = this.store[channel] || {}
        this.store[channel][note] = this.store[channel][note] || 0
        this.store[channel][note] += value
      }
    },
    register (notes, channel = 0) {
      this.add(notes, 1, channel)
    },
    unregister (notes, channel = 0) {
      this.add(notes, -1, channel)
    },
    stopping (notes, channel = 0) {
      return notes.filter(node => this.store[channel] && this.store[channel][node])
    },
    releasing (notes, channel = 0) {
      return notes.filter(note => !this.store[channel] || !this.store[channel][note])
    }
  }
}
