import {
  curry,
  isNil,
  propSatisfies,
  isArrayLike,
  all,
  allPass,
  complement
} from 'ramda'
import { isObject } from '../utils/validators'
import { unSafeShape } from '../utils/object-handlers'
import { isPoint } from '../data/point'

const POLYLINE = 'polyline'

const isPolyline = allPass([
  complement(isNil),
  propSatisfies(x => x === POLYLINE, 'type')
])

const unsafePolyline = unSafeShape(isPolyline)

const create = curry(function (attrs, points) {
  if (!isObject(attrs)) {
    return unsafePolyline(`polyline.create:
      attrs: ${attrs} is not a valid object.`)
  } else if (!allPass([isArrayLike, all(isPoint)])) {
    return unsafePolyline(`polyline.create:
      ${points} is not a valid point array`)
  }

  return unsafePolyline({
    type: POLYLINE,
    points,
    attrs
  })
})

export {
  create
}
