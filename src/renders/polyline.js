import { map, join, merge } from 'ramda'
import { chain, fmap } from '../utils/either-functor'

const toString = p => `${p.x},${p.y}`

const port = fmap(function (pl) {
  const points = join(' ')(map(chain(toString), pl.points))

  return {
    tag: pl.type,
    attrs: merge(pl.attrs, { points }),
    children: []
  }
})

export default port
