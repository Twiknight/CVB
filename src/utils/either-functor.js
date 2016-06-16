import { curry, isNil, assoc, equals } from 'ramda'

const isLeft = function (x) {
  if (isNil(x)) {
    return false
  } else if (x.type === 'either-left') {
    return true
  } else {
    return false
  }
}

const isRight = function (x) {
  if (isNil(x)) {
    return false
  } else if (x.type === 'either-right') {
    return true
  } else {
    return false
  }
}

const left = function (value) {
  const lp = { type: 'either-left' }
  const l = Object.create(lp)
  return assoc('__value', value, l)
}

const right = function (value) {
  const rp = { type: 'either-right' }
  const r = Object.create(rp)
  return assoc('__value', value, r)
}

const either = curry(function (fl, fr) {
  return function (value) {
    if (fl(value)) {
      return left(value)
    } else if (fr) {
      return right(value)
    } else {
      const msg = `either: the passed in param ${value} seems to fit neither condition`
      return left(msg)
    }
  }
})

const fmap = function (f) {
  return function (x) {
    if (isLeft(x)) {
      return x
    } else if (isRight(x)) {
      return right(f(x.__value))
    } else {
      const msg = `fmap only works on either type, but got ${x}`
      return left(msg)
    }
  }
}

const chain = function (f) {
  return function (x) {
    return f(x.__value)
  }
}

const areEqual = curry(function (e1, e2) {
  return equals(e1, e2)
})

export {
  either,
  isRight,
  isLeft,
  fmap,
  chain,
  areEqual
}
