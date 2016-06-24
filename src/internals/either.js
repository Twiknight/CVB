import { isNil, curry, is } from 'ramda'
import { isFunction } from './validators.js'
import { typeErrorMsg } from './msgs'

class Left {
  constructor (x) {
    this.__value = x
  }
  map (f) {
    return this
  }
  join (f) {
    return this
  }
  bnd (f) {
    return this
  }
}

// a -> Bool
const isLeft = is(Left)

const toLeft = x => new Left(x)

class Right {
  constructor (x) {
    this.__value = x
  }
  map (f) {
    return new Right(f(this.__value))
  }
  join (f) {
    return this.__value.map(f)
  }
  bnd (f) {
    return f(this.__value)
  }
}

// a -> Bool
const isRight = is(Right)

// a -> Right a
const toRight = x => new Right(x)

// (a -> b) -> M a -> M b
const fmap = curry(function (f, x) {
  if (!isFunction(f)) {
    return new Left(`Either.map: ${f} is not a function!`)
  } else if (isNil(x) || isNil(x.map)) {
    return new Left(`Either.map: can not call 'map' of ${x}.`)
  } else {
    return x.map(f)
  }
})

// (a -> b) -> M (M a) -> M b
const join = curry(function (f, x) {
  if (!isFunction(f)) {
    return new Left(`Either.join: ${f} is not a function!`)
  } else if (isNil(x) || isNil(x.join)) {
    return new Left(`Either.join: can not call 'join' of ${x}.`)
  } else {
    return x.join(f)
  }
})

const bnd = curry(function (f, m) {
  if (!is(Function, f)) {
    return toLeft(typeErrorMsg('Either.bnd', f, 'Function'))
  } else if (isNil(m) || !is(Function, m.bnd)) {
    return toLeft(`Either.bnd: can not call bnd of ${m}`)
  } else {
    return m.bnd(f)
  }
})

const isEither = _ => isLeft(_) || isRight(_)

export {
  Left,
  Right,
  isLeft,
  isRight,
  isEither,
  toLeft,
  toRight,
  fmap,
  join,
  bnd
}
