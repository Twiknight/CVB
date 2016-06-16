import { fmap } from '../utils/either-functor'
import { merge, map } from 'ramda'

export default function (text) {
  return fmap(function (t) {
    return {
      tag: t.type,
      attrs: merge(t.attrs, {
        x: t.x,
        y: t.y
      }),
      children: map(function (span) {
        return {
          tag: span.type,
          attrs: span.attrs,
          children: [span.textContent]
        }
      })(t.children || [])
    }
  })(text)
}
