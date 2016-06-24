import { curry, is, toPairs, forEach } from 'ramda'
import { bnd, fmap, toRight, isLeft, toLeft } from '../internals/either'
import { VNode, VText } from '../internals/vnode'
import { typeErrorMsg } from '../internals/msgs'

const SVG_NS = 'http://www.w3.org/2000/svg'

const log = function (x) {
  console.log(x)
  return x
}

const $elm = _ => document.createElementNS(SVG_NS, _)
const $text = _ => document.createTextNode(_.content)

const $create = function create (x) {
  if (is(VText, x)) {
    return $text(x)
  } else {
    const tag = x.tag
    const attrs = x.attrs
    const children = x.children
    const elm = $elm(tag)

    forEach(function ([n, v]) {
      elm.setAttribute(n, v)
    })(toPairs(attrs))

    forEach(function (c) {
      elm.appendChild(create(c))
    })(children)

    return elm
  }
}

const createElement = bnd(function (_) {
  const msg = typeErrorMsg('dom.createElement')
  if (!is(VNode, _)) {
    return toLeft(msg(_, 'VNode'))
  } else {
    return toRight($create(_))
  }
})

const mount = curry(function (root, elm) {
  if (isLeft(elm)) {
    return log(elm)
  } else {
    return fmap(function (elm) {
      root.appendChild(elm)
      return root
    })(elm)
  }
})

export {
  createElement,
  mount
}
