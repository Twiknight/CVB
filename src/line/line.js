import {
  __,
  curry,
  propSatisfies,
  allPass,
  map,
  merge
} from 'ramda'

import { isValidNumber, isObject } from '../utils/validators'
import { warn } from '../utils/log.js'

const fallback = curry((fn, value, defaultValue) => fn(value) ? value : defaultValue)

const isLineLike = function (obj) {
  const checkItems = ['x1', 'x2', 'y1', 'y2']
  const predicates = map(propSatisfies(isValidNumber), checkItems)
  return allPass(predicates)(obj)
}

const create = curry(function (attrs, x1, y1, x2, y2) {
  const fallbackNumberToZero = fallback(isValidNumber, __, 0)
  const _attrs = fallback(isObject, attrs, {})

  return merge({ attrs: _attrs, type: 'line' }, map(fallbackNumberToZero, { x1, y1, x2, y2 }))
})

const getLength = function (line) {
  if (!isLineLike(line)) {
    warn(`line.getLength: cannot calculate length of non-LineLike ${line}`)
    return NaN
  }
  return Math.sqrt(Math.pow(line.x1 - line.x2, 2) + Math.pow(line.y1 - line.y2, 2))
}

export {
  create,
  isLineLike,
  getLength
}
