import { __, curry, split, map, addIndex, is, assoc, isNil, dissoc, merge } from 'ramda'
import { toLeft, toRight, bnd } from '../internals/either'
import { typeErrorMsg } from '../internals/msgs'
import { VNode, VText } from '../internals/vnode'
import { isNumber } from '../internals/validators'
import { Shape } from './shape'

const LINEHEIGHT = 1.2

class Span {
  constructor (attrs, text) {
    this.attrs = attrs
    this.children = [text]
  }
  port () {
    const $children = map(_ => new VText(_))(this.children)
    return new VNode('tspan', this.attrs, $children)
  }
}

class Text extends Shape {
  constructor (attrs, x, y, text) {
    super(attrs)

    const texts = split('\n', text)
    this.x = x
    this.y = y
    this.children = addIndex(map)(function (t, idx) {
      return new Span({
        x: x,
        dy: `${LINEHEIGHT * idx}em`
      }, t)
    })(texts)
    this.$content = text
  }
  get content () {
    return this.$content || ''
  }
  moveTo (x, y) {
    return new Text(this.attrs, x, y, this.$content)
  }
  moveBy (dx, dy) {
    return new Text(
      this.attrs,
      this.x + dx,
      this.y + dy,
      this.$content)
  }
  setAttr (name, value) {
    if (name === 'x') {
      return new Text(this.attrs, value, this.y, this.$content)
    } else if (name === 'y') {
      return new Text(this.attrs, this.x, value, this.$content)
    } else if (isNil(value)) {
      return new Text(dissoc(name, this.attrs),
                    this.x,
                    this.y,
                    this.content)
    } else {
      return new Text(assoc(name, value, this.attrs),
                  this.x,
                  this.y,
                  this.content)
    }
  }
  port () {
    const $attrs = merge(this.attrs, { x: this.x, y: this.y })
    const $children = map(x => x.port())(this.children)

    return new VNode('text', $attrs, $children)
  }
}

// Object -> Number -> Number -> String -> Either (String Text)
const create = curry(function (attrs, x, y, text) {
  const msg = typeErrorMsg('Text.unit')
  if (!is(Object, attrs)) {
    return toLeft(msg(attrs, 'Object'))
  } else if (!isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (!isNumber(x)) {
    return toLeft(msg(y, 'Number'))
  } else if (!is(String, text)) {
    return toLeft(msg(text, 'String'))
  } else {
    return toRight(new Text(attrs, x, y, text))
  }
})

// Either (String Text) -> Number -> Number -> Either (String Text)
const moveTo = curry(function (x, y, t) {
  const msg = typeErrorMsg('Text.moveTo')
  if (!isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (!isNumber(y)) {
    return toLeft(msg(x, 'Number'))
  } else {
    return bnd(function (text) {
      if (!is(Text, text)) {
        return toLeft(msg(text, 'Text'))
      } else {
        return toRight(t.moveTo(x, y))
      }
    })(t)
  }
})

// Either(String Text) -> Number -> Number -> Either
const moveBy = curry(function (x, y, t) {
  const msg = typeErrorMsg('Text.moveBy')
  if (!isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (!isNumber(y)) {
    return toLeft(msg(x, 'Number'))
  } else {
    return bnd(function (text) {
      if (!is(Text, text)) {
        return toLeft(msg(text, 'Text'))
      } else {
        return toRight(t.moveTo(text.x + x, text.y + y))
      }
    })(t)
  }
})

const set = curry(function (name, value, text) {
  const msg = typeErrorMsg('Text.set')
  if (!is(String, name)) {
    return toLeft(msg(name, 'String'))
  } else {
    return bnd(function (t) {
      if (!is(Text, t)) {
        return toLeft(msg(text, 'Text'))
      } else {
        return toRight(t.setAttr(name, value))
      }
    })(text)
  }
})

const port = function (text) {
  const msg = typeErrorMsg('Text.port', __, 'Text')
  return bnd(function (_) {
    if (!is(Text, _)) {
      return toLeft(msg(text))
    } else {
      return toRight(_.port())
    }
  })(text)
}

export {
  create,
  moveTo,
  moveBy,
  set,
  port
}
