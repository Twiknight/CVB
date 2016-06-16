import { curry, merge, mergeWith, add } from 'ramda'

import { buildErrorInfo } from '../utils/log'
import { isValidNumber } from '../utils/validators'
import { fmap } from '../utils/either-functor.js'

const typeErr = buildErrorInfo(function (fn, pn, pv) {
  return `Type error: rect.${fn} can not handle param '${pn}':${pv}`
})

const moveTo = curry(function (rect, x, y) {
  const err = typeErr('moveTo')
  const f = function (r) {
    if (!isValidNumber(x)) {
      return err('x', x)
    } else if (!isValidNumber(y)) {
      return err('y', y)
    }
    return merge(r, { x, y })
  }

  return fmap(f)(rect)
})

const moveBy = curry(function (rect, x, y) {
  const err = typeErr('moveBy')
  const f = function (r) {
    if (!isValidNumber(x)) {
      return err('x', x)
    } else if (!isValidNumber(y)) {
      return err('y', y)
    }
    return mergeWith(add, r, { x, y })
  }
  return fmap(f)(rect)
})

const resize = curry(function (rect, height, width) {
  const err = typeErr('resize')
  const f = function (r) {
    if (!isValidNumber(height)) {
      return err('height', height)
    } else if (!isValidNumber(width)) {
      return err('width', width)
    }
    return merge(r, { height, width })
  }
  return fmap(f)(rect)
})

export {
  moveTo,
  moveBy,
  resize
}
