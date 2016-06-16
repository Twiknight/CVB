import { curry, map, prop, join } from 'ramda'
import { chain } from '../utils/either-functor'
import { create } from './text'

const _getText = function (t) {
  if (t.children && t.children.length > 0) {
    return join('\n')(map(prop('textContent'), t.children))
  } else {
    return t.textContent
  }
}

const getText = chain(_getText)

const moveTo = curry(function (text, x, y) {
  return chain(t => create(t.attrs, _getText(t), x, y))(text)
})

const moveBy = curry(function (text, dx, dy) {
  return chain(t => create(t.attrs, _getText(t), t.x + dx, t.y + dy))(text)
})

export {
  moveTo,
  moveBy,
  getText
}

