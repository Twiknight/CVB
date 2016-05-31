import {
  curry,
  complement
} from 'ramda'

import { isCircleLike, createWithProto } from './circle'
import { warn } from '../utils/log'
import { isValidNumber } from '../utils/validators'

const warnTypeError = function (fnName) {
  const msg = `typeError: circle.${fnName} works only on circle-like objects.`
  warn(msg)
}

const warnInvalidNum = curry(function (fnName, id, value) {
  const msg =
    `typeError: circle.${fnName} expects param ${id} to be non-NaN number but got ${value}.`
  warn(msg)
})

const isInvalidNumber = complement(isValidNumber)

/**
* Copy a circle and move the copy to given position.
* If the passed in object is not a `CircleLike`, it will return the original object.
* @param {CircleLike} circle - A circle-like object
* @param {Number} cx - the new center x postion
* @param {Number} cy - the new center y position
* @return {CircleLike | *} a new circle or the original object
*/
const moveTo = curry(function (circle, cx, cy) {
  if (!isCircleLike(circle)) {
    warnTypeError('moveTo')
    return circle
  }
  if (isInvalidNumber(cx)) {
    warnInvalidNum('moveTo', 'cx', cx)
    return circle
  }
  if (isInvalidNumber(cy)) {
    warnInvalidNum('moveTo', 'cy', cy)
    return circle
  }

  return createWithProto(circle, {}, circle.r, cx, cy)
})

const moveBy = curry(function (circle, dx, dy) {
  if (!isCircleLike(circle)) {
    warnTypeError('moveTo')
    return circle
  }
  if (isInvalidNumber(dx)) {
    warnInvalidNum('moveBy', 'dx', dx)
    return circle
  }
  if (isInvalidNumber(dy)) {
    warnInvalidNum('moveTo', 'dy', dy)
    return circle
  }

  return createWithProto(circle, {}, circle.r, dx + circle.cx, dy + circle.cy)
})

const resize = curry(function (circle, r) {
  if (!isCircleLike(circle)) {
    warnTypeError('resize')
    return circle
  }
  if (isInvalidNumber(r)) {
    warnInvalidNum('resize', 'r', r)
  }

  return createWithProto(circle, {}, r, circle.cx, circle.cy)
})

export {
  moveTo,
  moveBy,
  resize
}
