import {
  curry,
  propSatisfies,
  allPass,
  map,
  find,
  merge
} from 'ramda'

import { isValidNumber } from '../utils/validators'
import { warn } from '../utils/log.js'

const fallbackWithMsg = curry(function (validator, msg, ...args) {
  if (!validator(args[0])) {
    warn(msg)
  }
  return find(validator)(args)
})

const __proto__ = {
  type: 'line',
  x1: 0,
  x2: 0,
  x3: 0,
  x4: 0,
  attrs: {
    stroke: 'black'
  }
}

const isLineLike = function (obj) {
  const checkItems = ['x1', 'x2', 'y1', 'y2']
  const predicates = map(propSatisfies(isValidNumber), checkItems)
  return allPass(predicates)(obj)
}


const createWithProto = curry(function (proto, attrs, x1, y1, x2, y2) {
  const msg = curry(function (type, key, value) {
    return 'line.createWithProto: ' +
      `expects ${key} to be ${type}, ` +
      `but got ${key} = ${value}`
  })
  const posMsg = msg('number')
  const fallbackPos = fallbackWithMsg(isValidNumber)

  const _x1 = fallbackPos(posMsg('x1', x1), x1, proto.x1, __proto__.x1)
  const _y1 = fallbackPos(posMsg('y1', y1), y1, proto.y1, __proto__.y1)
  const _x2 = fallbackPos(posMsg('x2', x2), x2, proto.x2, __proto__.x2)
  const _y2 = fallbackPos(posMsg('y2', y2), y2, proto.y2, __proto__.y2)
  const _attrs = merge(proto.attrs, attrs)

  return {
    type: 'line',
    x1: _x1,
    y1: _y1,
    x2: _x2,
    y2: _y2,
    attrs: _attrs
  }
})

const create = createWithProto(__proto__)
const createDefault = () => __proto__

const getLength = function (line) {
  if (!isLineLike(line)) {
    warn(`line.getLength: cannot calculate length of non-LineLike ${line}`)
    return NaN
  }
  return Math.sqrt(Math.pow(line.x1 - line.x2, 2) + Math.pow(line.y1 - line.y2, 2))
}

export {
  createWithProto,
  create,
  createDefault,
  isLineLike,
  getLength
}
