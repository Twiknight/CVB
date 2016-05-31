import {
  curry,
  allPass,
  propSatisfies,
  map,
  merge
} from 'ramda'
import { isValidNumber, isObject } from '../utils/validators'
import { warn } from '../utils/log'

const __proto__ = {
  type: 'circle',
  cx: 0,
  cy: 0,
  r: 1,
  attrs: {
    fill: 'black'
  }
}

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
* @param {Object} attrs - non-basic attributes for a circle
* @param {Number} r - radius in pixel
* @param {Number} cx - x value of the center
* @param {Number} cy - y value of the center
* @return {CircleLike} a circle-like structure
*/
const createWithProto = curry(function (proto, attrs, r, cx, cy) {
  if (!isCircleLike({ r, cx, cy })) {
    warn('circle.createWithProto:' +
      ' Invalid parameters for creating a circle!' +
      ` r = ${r}, cx = ${cx}, cy=${cy}`)
  }

  if (!isObject(attrs)) {
    warn('circle.createWithProto: Invalid attributes for your circle!')
  }

  return {
    type: 'circle',
    cx: isValidNumber(cx) ? cx : isValidNumber(proto.cx) ? proto.cx : __proto__.cx,
    cy: isValidNumber(cy) ? cy : isValidNumber(proto.cy) ? proto.cy : __proto__.cy,
    r: isValidNumber(r) ? r : isValidNumber(proto.r) ? proto.r : __proto__.r,
    attrs: !isObject(attrs) ? proto.attrs : merge(proto.attrs, attrs)
  }
})

const create = createWithProto(__proto__)

const createDefault = () => __proto__

export {
  create,
  createWithProto,
  createDefault,
  isCircleLike
}
