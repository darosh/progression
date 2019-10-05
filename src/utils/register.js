export default function () {
  return {
    store: {},
    register (notes, value = 1) {
      for (const note of notes) {
        this.store[note] = this.store[note] || 0
        this.store[note] += value
      }
    },
    unregister (notes) {
      this.register(notes, -1)
    },
    stopping (notes) {
      return notes.filter(node => this.store[node])
    },
    releasing (notes) {
      return notes.filter(note => !this.store[note])
    }
  }
}
