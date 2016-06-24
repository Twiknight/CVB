import { type, is } from 'ramda'

const isFunction = x => type(x) === 'Function'

const isObject = x => type(x) === 'Object'

const isNumber = x => is(Number, x) && !isNaN(x)

export {
  isFunction,
  isObject,
  isNumber
}
