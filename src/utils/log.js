import { curry } from 'ramda'
import { isLeft } from './either-functor'

const warn = function (s) {
  console.warn(s)
}

const error = function (s) {
  console.error(s)
}

const buildErrorInfo = curry((tmplFn, FnName, paramName, paramValue) => {
  return tmplFn(FnName, paramName, paramValue)
})

const log = function (unsafeShape) {
  if (isLeft(unsafeShape)) {
    console.log(unsafeShape.__value)
  }
  return unsafeShape
}

export {
  log,
  warn,
  error,
  buildErrorInfo
}
