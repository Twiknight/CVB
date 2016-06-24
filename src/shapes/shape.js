import { assocPath } from 'ramda'

class Shape {
  constructor (attrs) {
    this.attrs = attrs
  }
  moveBy (x, y) {
    return this
  }
  setAttr (name, value) {
    return assocPath(['attrs', name], value, this)
  }
}

export {
  Shape
}
