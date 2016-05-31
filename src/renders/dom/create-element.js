import { forEach, toPairs } from 'ramda'
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

export default function createElement (tag, attrs = {}, children = []) {
  // create element
  let elm = document.createElementNS(SVG_NAMESPACE, tag)

  // copy attributes
  const attrList = toPairs(attrs)
  const setAttr = function (kv) {
    const key = kv[0]
    const value = kv[1]
    elm.setAttribute(key, value)
  }
  forEach(setAttr, attrList)

  // append children
  const append = function (child) {
    elm.appendChild(child)
  }
  forEach(append, children)
  return elm
}
