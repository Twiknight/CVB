import { isNil, curry } from 'ramda'

class Left {
  constructor (x) {
    this.__value = x
  }
  static of (x) {
    return new Left(x)
  }
  map (f) {
    return this
  }
}

class Right {
  constructor (x) {
    this.__value = x
  }
  static of (x) {
    return new Right(x)
  }
  map (f) {
    return new Right(f(this.___value))
  }
}

const isLeft = x => x instanceof Left

const isRight = x => x instanceof Right

const Either = {
  left: Left.of,
  right: Right.of,
  isLeft,
  isRight,
  map: curry(function (f, x) {
    if (typeof f !== 'function') {
      return Left.of(`Either.map: ${f} is not a function`)
    } else if (isNil(x) || isNil(x.map)) {
      return Left.of(`Either.map: can not call 'map' of ${x}`)
    } else {
      return x.map(f)
    }
  })
}

export default Either


