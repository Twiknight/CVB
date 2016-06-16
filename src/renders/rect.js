import { merge } from 'ramda'
import { fmap } from '../utils/either-functor'

export default function (rect) {
  return fmap((rect) => {
    return {
      tag: rect.type,
      attrs: merge(rect.attrs, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }),
      children: []
    }
  })(rect)
}
