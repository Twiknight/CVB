import {
  __,
  curry,
  assoc,
  prop,
  map,
  filter,
  complement,
  append as $append,
  prepend as $prepend
} from 'ramda'
import { moveBy as movePoint, point, isPoint } from '../data/point'
import { chain, fmap, areEqual } from '../utils/either-functor'

const moveBy = curry(function (polyline, dx, dy) {
  return fmap(function (pl) {
    const newPoints = map(movePoint(__, dx, dy))(pl.points)
    return assoc('points', newPoints, pl)
  })(polyline)
})

const moveTo = curry(function (polyline, x, y) {
  const points = chain(prop('points'))(polyline)
  if (points.length > 0) {
    const sx = chain(prop('x'))(points[0])
    const sy = chain(prop('y'))(points[0])
    const dx = x - sx
    const dy = y - sy
    return moveBy(polyline, dx, dy)
  } else {
    return polyline
  }
})

const append = curry(function (polyline, x, y) {
  const p = point(x, y)
  if (isPoint(p)) {
    return fmap((pl) => assoc('points', $append(p, pl.points), pl))
  } else {
    return p
  }
})

const prepend = curry(function (polyline, x, y) {
  const p = point(x, y)
  if (isPoint(p)) {
    return fmap((pl) => assoc('points', $prepend(p, pl.points), pl))
  } else {
    return p
  }
})

const remove = curry(function (polyline, x, y) {
  const p = point(x, y)
  const shouldKeep = complement(areEqual(p))
  return fmap(function (pl) {
    return assoc('points', filter(shouldKeep, pl.points), pl)
  })
})

export {
  moveBy,
  moveTo,
  append,
  prepend,
  remove
}
