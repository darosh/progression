export function sync (global, name) {
  return {
    [name]: {
      get () {
        return global[name]
      },
      set (value) {
        global[name] = value
      }
    }
  }
}

export function syncAll (global) {
  return Object.keys(global).reduce((acc, key) => ({ ...acc, ...sync(global, key) }), {})
}
