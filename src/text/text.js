import {
  curry,
  isNil,
  split,
  addIndex,
  map
} from 'ramda'
import {
  isObject,
  isValidNumber
} from '../utils/validators'
import {
  unSafeShape
} from '../utils/object-handlers'
import {
  chain
} from '../utils/either-functor'

const TSPAN = 'tspan'
const TEXT = 'text'

const unsafeTextspan = unSafeShape(x => !isNil(x) && x.type === TSPAN)
const unsafeText = unSafeShape(x => !isNil(x) && x.type === TEXT)

const tspan = curry(function (attrs, content) {
  if (!isObject(attrs)) {
    return unsafeTextspan(`text.tspan: 
      attrs: ${attrs} is not a valid object`)
  } else if (typeof content !== 'string') {
    return unsafeTextspan(`text.tspan: 
      content: ${content} is not a valid string`)
  } else {
    return unsafeTextspan({
      type: TSPAN,
      attrs,
      textContent: content
    })
  }
})

const create = curry(function (attrs, content, x, y) {
  if (!isObject(attrs)) {
    return unsafeTextspan(`text.create: 
      attrs: ${attrs} is not a valid object`)
  } else if (!isValidNumber(x)) {
    return unsafeTextspan(`text.create: 
      x: ${x} is not a valid number`)
  } else if (!isValidNumber(y)) {
    return unsafeTextspan(`text.create: 
      y: ${y} is not a valid number`)
  } else if (typeof content !== 'string') {
    return unsafeTextspan(`text.create: 
      content: ${content} is not a valid string`)
  } else {
    const lines = split('\n', content)
    const spans = addIndex(map)((v, idx) => tspan({ dy: `${1.2 * idx}em`, x: x }, v))(lines)
    return unsafeText({
      type: TEXT,
      attrs: attrs,
      textContent: '',
      x,
      y,
      children: map(chain(x => x))(spans)
    })
  }
})

export {
  create
}
