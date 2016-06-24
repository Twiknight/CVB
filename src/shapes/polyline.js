import { curry, map, append as _append, filter, reduce, assoc, is, join } from 'ramda'
import { VNode } from '../internals/vnode'
import { typeErrorMsg } from '../internals/msgs'
import { isNumber } from '../internals/validators'
import { toLeft, toRight, bnd, isEither } from '../internals/either'
import { Shape } from './shape'

class Polyline extends Shape {
  constructor (attrs, points) {
    super(attrs)
    this.$points = points
    this.children = []
  }
  get points () {
    return this.$points
  }
  moveBy (dx, dy) {
    const movePoint = curry((_x, _y, [ x, y ]) => [ x + _x, y + _y ])
    return new Polyline(this.attrs, map(movePoint(dx, dy))(this.points))
  }
  moveTo (x, y) {
    if (this.points.length < 1) {
      return this
    } else {
      const p = this.points[0]
      const dx = x - p[0]
      const dy = y - p[0]
      return this.moveBy(dx, dy)
    }
  }
  append (x, y) {
    return new Polyline(this.attrs, _append([x, y], this.points))
  }
  remove (x, y) {
    const shouldNotRemove = ([ a, b ]) => !(a === x && b === y)
    return new Polyline(this.attrs, filter(shouldNotRemove)(this.points))
  }
  setAttr (name, value) {
    if (name === 'points') {
      return new Polyline(this.attrs, value)
    } else {
      const $attrs = assoc(name, value, this.attrs)
      return new Polyline($attrs, this.points)
    }
  }
  port () {
    const $pStrs = map(x => `${x[0]},${x[1]}`)(this.points)
    const $points = join(' ', $pStrs)
    const $attrs = assoc('points', $points, this.attrs)
    return new VNode('polyline', $attrs, [])
  }
}

const isPoints = function (points) {
  if (!is(Array, points)) {
    return false
  } else {
    return reduce(function (acc, p) {
      if (!acc) {
        return false
      } else if (!is(Array, p)) {
        return false
      } else if (p.length < 2) {
        return false
      } else if (!isNumber(p[0]) || !isNumber(p[1])) {
        return false
      } else {
        return true
      }
    })(true, points)
  }
}

// Object -> [[Number]] -> Polyline
const create = curry(function (attrs, points) {
  const msg = typeErrorMsg('Polyline.create')
  if (!is(Object, attrs)) {
    return toLeft(msg(attrs, 'Object'))
  } else if (!isPoints(points)) {
    return toLeft(msg(points, 'Points'))
  } else {
    return toRight(new Polyline(attrs, points))
  }
})

const moveTo = curry(function (x, y, p) {
  const msg = typeErrorMsg('Polyline.moveTo')
  if (!isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (!isNumber(y)) {
    return toLeft(msg(y, 'Number'))
  } else if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (is(Polyline, _)) {
        return toRight(_.moveTo(x, y))
      } else {
        return toLeft(msg(p, 'Polyline'))
      }
    })(p)
  }
})

const moveBy = curry(function (dx, dy, p) {
  const msg = typeErrorMsg('Polyline.moveBy')
  if (!isNumber(dx)) {
    return toLeft(msg(dx, 'Number'))
  } else if (!isNumber(dy)) {
    return toLeft(msg(dy, 'Number'))
  } else if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (is(Polyline, _)) {
        return toRight(_.moveBy(dx, dy))
      } else {
        return toLeft(msg(p, 'Polyline'))
      }
    })(p)
  }
})

const append = curry(function (x, y, p) {
  const msg = typeErrorMsg('Polyline.append')
  if (isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (isNumber(y)) {
    return toLeft(msg(y, 'Number'))
  } else if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (is(Polyline, _)) {
        return toRight(_.append(x, y))
      } else {
        return toLeft(msg(p, 'Polyline'))
      }
    })(p)
  }
})

const remove = curry(function (x, y, p) {
  const msg = typeErrorMsg('Polyline.remove')
  if (isNumber(x)) {
    return toLeft(msg(x, 'Number'))
  } else if (isNumber(y)) {
    return toLeft(msg(y, 'Number'))
  } else if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (is(Polyline, _)) {
        return toRight(_.remove(x, y))
      } else {
        return toLeft(msg(p, 'Polyline'))
      }
    })(p)
  }
})

const set = function (name, value, p) {
  const msg = typeErrorMsg('Polyline.set')
  if (!is(String, name)) {
    return toLeft(msg(name, 'String'))
  } else if (name === 'points' && !isPoints(value)) {
    return toLeft(msg(value, 'Points'))
  } else if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (is(Polyline, _)) {
        return toRight(_.setAttr(name, value))
      } else {
        return toLeft(msg(p, 'Polyline'))
      }
    })(p)
  }
}

const port = function (p) {
  const msg = typeErrorMsg('Polyline.port')
  if (!isEither(p)) {
    return toLeft(msg(p, 'Right(Polyline)'))
  } else {
    return bnd(function (_) {
      if (!is(Polyline, _)) {
        return toLeft(msg(_, 'Polyline'))
      } else {
        return toRight(_.port())
      }
    })(p)
  }
}

export {
  create,
  moveTo,
  moveBy,
  append,
  remove,
  set,
  port
}
