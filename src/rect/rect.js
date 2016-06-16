import { curry, allPass, complement, propSatisfies, map, isNil } from 'ramda'
import { isValidNumber, isObject } from '../utils/validators'
import { unSafeShape } from '../utils/object-handlers'

const RECT = 'rect'

const baseAttrs = [ 'x', 'y', 'width', 'height' ]

const typeErr = curry(function (fn, pn, pv) {
  return `Type error: rect.${fn} can not handle param '${pn}':${pv}`
})
const isInvalidNum = complement(isValidNumber)

const isRectLike = function (rect) {
  const predicates = map(propSatisfies(isValidNumber), baseAttrs)
  return allPass(predicates)(rect)
}

const unSafeRect = unSafeShape((x) => !isNil(x) && x.type === RECT)

const create = curry(function (attrs, x, y, height, width) {
  const err = typeErr('createWithProto')
  if (!isObject(attrs)) {
    return unSafeRect(err('attrs', attrs))
  } else if (isInvalidNum(x)) {
    return unSafeRect(err('x', x))
  } else if (isInvalidNum(y)) {
    return unSafeRect(err('y', y))
  } else if (isInvalidNum(height)) {
    return unSafeRect(err('height', height))
  } else if (isInvalidNum(width)) {
    return unSafeRect(err('width', width))
  }

  return unSafeRect(
    { attrs, x, y, width, height, type: RECT })
})

// const createDefault = create({}, 0, 0, 0, 0)
const createDefault = null

export {
  createDefault,
  create,
  isRectLike,
  unSafeRect
}

