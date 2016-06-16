import { curry, isNil } from 'ramda'
import { unSafeShape } from '../utils/object-handlers'
import { isValidNumber } from '../utils/validators'
import { chain } from '../utils/either-functor'

const unSafePoint = unSafeShape((x) => true)

const TYPE_POINT = 'point'

const point = curry(function (x, y) {
  const err = (n) => `poit: ${'x'} should be a number!`
  if (!isValidNumber(x)) {
    return unSafePoint(err(x))
  } else if (!isValidNumber(y)) {
    return unSafePoint(err(y))
  } else {
    return unSafePoint({ x, y, type: TYPE_POINT })
  }
})

const moveBy = curry(function (pt, x, y) {
  return chain((p) => point(x + p.x, y + p.y))(pt)
})

const isPoint = function (x) {
  return chain(p => !isNil(p) && p.type === TYPE_POINT)(x)
}

export {
  point,
  moveBy,
  isPoint
}
