import { zip, apply, is, reduce } from 'ramda'
import { toLeft, toRight, isLeft, fmap } from './either'

const safeExec = function (f, fn, ...args) {
  return function (...argv) {
    if (args.length !== argv.length) {
      return toLeft('typechecker: param length does not match.')
    }

    const testResult = reduce(function (acc, [ t, v ]) {
      if (isLeft(acc)) {
        return acc
      } else if (!is(Function, t)) {
        return toLeft(`typechecker: ${t} is not a valid constructor`)
      } else if (is(t, v)) {
        return acc
      } else {
        return toLeft(`${fn}: ${v} does not match type ${t.name}`)
      }
    })(toRight(''), zip(args, argv))

    return fmap(() => apply(f, argv))(testResult)
  }
}

export {
  safeExec
}
