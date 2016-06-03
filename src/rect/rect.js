import { curry, mergeWithKey, merge, allPass, compose, complement, prop, map } from 'ramda'
import { Either } from 'ramda-fantasy'
import { isValidNumber, isObject } from '../utils/validators'
import { buildErrorInfo } from '../utils/log'

const RECT = 'rect'

const baseAttrs = [ 'x', 'y', 'width', 'height' ]
const __proto__ = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

const typeErr = buildErrorInfo(function (fn, pn, pv) {
  return Either.Left(`Type error: rect.${fn} can not handle param '${pn}':${pv}`)
})
const isInvalidNum = complement(isValidNumber)

const isRectLike = allPass(map(compose(isValidNumber, prop), baseAttrs))

const createWithProto = curry(function (proto, attrs, x, y, height, width) {
  const err = typeErr('createWithProto')
  if (isRectLike(proto)) {
    return err('proto', proto)
  } else if (!isObject(attrs)) {
    return err('attrs', attrs)
  } else if (isInvalidNum(x)) {
    return err('x', x)
  } else if (isInvalidNum(y)) {
    return err('y', y)
  } else if (isInvalidNum(height)) {
    return err('height', height)
  } else if (isInvalidNum(width)) {
    return err('width', width)
  }

  return Either.Right(
    mergeWithKey((key, left, right) => key === 'attrs' ? merge(left, right) : right),
    proto,
    { attrs, x, y, width, height, type: RECT })
})

const create = createWithProto(__proto__)

const createDefault = create({}, 0, 0, 0, 0)

export {
  createWithProto,
  createDefault,
  create,
  isRectLike
}

