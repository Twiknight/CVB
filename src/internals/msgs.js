import { curry } from 'ramda'

const typeErrorMsg = curry(function (fn, value, type) {
  return `${fn}: ${value} is not ${type}.`
})

export {
  typeErrorMsg
}
