import {
  allPass,
  propEq,
  complement,
  omit,
  merge
} from 'ramda'
import { isLineLike } from '../line/line'
import { warn } from '../utils/log'

const isLine = allPass([ isLineLike, propEq('type', 'line') ])
const isNotLine = complement(isLine)

const warnNotLine = function (obj) {
  warn(`Render.line: can't render a non-line object ${obj}`)
}

export default function (line) {
  if (isNotLine(line)) {
    warnNotLine(line)
  } else {
    const baseAttrs = omit(['type', 'attrs'], line)
    return {
      tag: 'line',
      attrs: merge(line.attrs, baseAttrs),
      children: []
    }
  }
}
