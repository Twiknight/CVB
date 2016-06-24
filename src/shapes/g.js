import { curry, map, assoc, is, reduce, append } from 'ramda'
import { toLeft, toRight, bnd, isLeft, fmap } from '../internals/either'
import { VNode } from '../internals/vnode'
import { typeErrorMsg } from '../internals/msgs'
import { isNumber } from '../internals/validators'
import { Shape } from './shape'

class G extends Shape {
  constructor (attrs, children) {
    super(attrs)
    this.children = children
  }
  moveBy (x, y) {
    const $children = map((_) => _.moveBy(x, y))(this.children)
    return new G(this.attrs, $children)
  }
  setAttr (name, value) {
    const $attrs = assoc(name, value, this.attrs)
    return new G($attrs, this.children)
  }
  port () {
    const $children = map(x => x.port())(this.children)
    return new VNode('g', this.attrs, $children)
  }
}

const create = curry(function (attrs, children) {
  const msg = typeErrorMsg('G.create')
  if (!is(Object, attrs)) {
    return toLeft(msg(attrs, 'Object'))
  } else {
    const $children = reduce(function (acc, x) {
      if (isLeft(acc)) {
        return acc
      } else if (isLeft(x)) {
        return x
      } else {
        return bnd(function (_) {
          if (!is(Shape, _)) {
            return toLeft(msg(_, 'Shape'))
          } else {
            return fmap(append(_))(acc)
          }
        })(x)
      }
    })(toRight([]), children)

    return fmap(x => new G(attrs, x))($children)
  }
})

const moveBy = curry(function (x, y, g) {
  const msg = typeErrorMsg('G.moveBy')
  if (!isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (!isNumber(y)) {
    return toLeft(msg(y, 'Number'))
  } else {
    return bnd(function (_) {
      if (!is(G, _)) {
        return toLeft(msg(_, 'G'))
      } else {
        return toRight(_.moveBy(x, y))
      }
    })(g)
  }
})

const set = curry(function (name, value, g) {
  const msg = typeErrorMsg('G.set')
  if (!is(String, name)) {
    return toLeft(msg(name, 'String'))
  } else {
    return bnd(function (_) {
      if (!is(G, _)) {
        return toLeft(msg(_, 'G'))
      } else {
        return toRight(_.setAttr(name, value))
      }
    })(g)
  }
})

const port = function (g) {
  const msg = typeErrorMsg('G.port')
  return bnd(function (_) {
    if (!is(G, _)) {
      return toLeft(msg(_, 'G'))
    } else {
      return toRight(_.port())
    }
  })(g)
}

export {
  create,
  moveBy,
  set,
  port
}
