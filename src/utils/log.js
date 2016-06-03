import { curry } from 'ramda'

const warn = function (s) {
  console.warn(s)
}

const error = function (s) {
  console.error(s)
}

const buildErrorInfo = curry((tmplFn, FnName, paramName, paramValue) => {
  return tmplFn(FnName, paramName, paramValue)
})

export {
  warn,
  error,
  buildErrorInfo
}
