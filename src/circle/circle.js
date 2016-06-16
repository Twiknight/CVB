import {
  curry,
  allPass,
  propSatisfies,
  map
} from 'ramda'
import { isValidNumber, isObject } from '../utils/validators'
import { warn } from '../utils/log'

/**
* check if an item can be render to a svg circle element
* @param {Object} obj - the item to be checked
* @return {Boolean} - `true` if obj is a circleLike; `false` otherwise
*/
const isCircleLike = function (obj) {
  const checkItems = ['cx', 'cy', 'r']
  const predicates = map(propSatisfies(isValidNumber), checkItems)
  return allPass(predicates)(obj)
}

/**
* curried function for creating a circle
* @param {Number} r - radius in pixel
* @param {Number} cx - x value of the center
* @param {Number} cy - y value of the center
* @return {CircleLike} a circle-like structure
*/
const create = curry(function (attrs, r, cx, cy) {
  if (!isObject(attrs)) {
    warn('circle.createWithProto: Invalid attributes for your circle!')
  }

  return {
    type: 'circle',
    cx: isValidNumber(cx) ? cx : 0,
    cy: isValidNumber(cy) ? cy : 0,
    r: isValidNumber(r) ? r : 0,
    attrs: isObject(attrs) ? attrs : {}
  }
})

export {
  create,
  isCircleLike
}
