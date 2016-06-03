import {
  allPass,
  propEq,
  complement,
  merge,
  omit } from 'ramda'

import { isCircleLike } from '../circle/circle'
import { warn } from '../utils/log'

const isCircle = allPass([ isCircleLike, propEq('type', 'circle') ])
const isNotCircle = complement(isCircle)

const warnNotCircle = function (type) {
  warn(`Render.circle: expects to accept a Circle but got ${type}`)
}

export default function (circle) {
  if (isNotCircle(circle)) {
    warnNotCircle(circle.type)
  } else {
    const baseAttrs = omit(['type', 'attrs'], circle)

    const attrs = merge(circle.attrs, baseAttrs)
    return {
      tag: 'circle',
      attrs,
      children: []
    }
  }
}
