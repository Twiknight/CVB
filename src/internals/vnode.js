class VNode {
  constructor (tag, attrs, children) {
    this.tag = tag
    this.attrs = attrs
    this.children = children
  }
}

class VText {
  constructor (t) {
    this.__text = t
  }
  get content () {
    return this.__text
  }
}

export {
  VNode,
  VText
}
