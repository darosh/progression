import * as items from './index'

Object.values(items).forEach(pro => {
  Object.freeze(pro)
  Object.values(pro.map).forEach(item => Object.freeze(item))
})

export default items
