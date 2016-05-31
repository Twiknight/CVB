const isValidNumber = function (x) {
  return typeof x === 'number' && !isNaN(x)
}

const isObject = function (x) {
  return typeof x === 'object'
}

export {
  isValidNumber,
  isObject
}
