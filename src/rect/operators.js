import { __, curry, merge, mergeWith, add } from 'ramda'
import { Either } from 'ramda-fantasy'

import { buildErrorInfo } from '../utils/log'
import { isValidNumber } from '../utils/validators'

const typeErr = buildErrorInfo(function (fn, pn, pv) {
  return Either.Left(`Type error: rect.${fn} can not handle param '${pn}':${pv}`)
})

const moveTo = curry(function (rect, x, y) {
  const err = typeErr('moveTo')
  if (!Either.isRight(rect) && !Either.isLeft(rect)) {
    return Either.Left(err('rect', rect))
  } else if (!isValidNumber(x)) {
    return Either.Left(err('x', x))
  } else if (!isValidNumber(y)) {
    return Either.Left(err('y', y))
  } else {
    return Either.map(merge(__, {x, y}))
  }
})

const moveBy = curry(function (rect, x, y) {
  const err = typeErr('moveBy')
  if (!Either.isRight(rect) && !Either.isLeft(rect)) {
    return Either.Left(err('rect', rect))
  } else if (!isValidNumber(x)) {
    return Either.Left(err('x', x))
  } else if (!isValidNumber(y)) {
    return Either.Left(err('y', y))
  } else {
    return Either.map(mergeWith(add, __, {x, y}))
  }
})

const resize = curry(function (rect, height, width) {
  const err = typeErr('moveBy')
  if (!Either.isLeft(rect) && !Either.isRight(rect)) {
    return Either.Left(err('rect', rect))
  } else if (!isValidNumber(height)) {
    return Either.Left(err('height', height))
  } else if (!isValidNumber(width)) {
    return Either.Left(err('width', width))
  } else {
    return Either.map(merge(__, {height, width}))
  }
})

export {
  moveTo,
  moveBy,
  resize
}
