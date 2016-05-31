import { allPass, propEq, complement, merge } from 'ramda'

import { isCircleLike } from '../../circle/circle'
import { warn } from '../../utils/log'
import create from './create-element'

const isCircle = allPass([ isCircleLike, propEq('type', 'circle') ])
const isNotCircle = complement(isCircle)

const warnNotCircle = function (type) {
  warn(`Render.circle: expects to accept a Circle but got ${type}`)
}

export default function (circle) {
  if (isNotCircle(circle)) {
    warnNotCircle(circle.type)
  } else {
    const baseAttrs = {
      cx: circle.cx,
      cy: circle.cy,
      r: circle.r
    }

    const attrs = merge(circle.attrs, baseAttrs)
    return create('circle', attrs, [])
  }
}
