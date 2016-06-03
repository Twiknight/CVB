import { __, curry, compose, forEach } from 'ramda'
import portCircle from '../src/renders/circle.js'
import portLine from '../src/renders/line'
import createElement from '../src/platform/dom'
import { createWithProto, moveTo, resize, moveBy } from '../src/circle/index.js'
import * as LINE from '../src/line/index.js'

const query = (s) => document.querySelector(s)
const append = curry(function (root, child) {
  root.appendChild(child)
})

const drawCircles = function () {
  const root = query('#circles')
  const render = compose(createElement, portCircle)
  const mount = append(root)

  const proto = {
    attrs: {
      stroke: 'red',
      fill: 'azure'
    }
  }

  const getCircle = createWithProto(proto, {})
  const getBig = getCircle(100)
  const getSmall = getCircle(50)

  const big = getBig(0, 0)
  const small = getSmall(30, 50)


  mount(render(big))
  mount(render(small))
  mount(render(moveTo(big, 200, 200)))
  mount(render(moveBy(resize(small, 70), 300, 300)))
}

const drawLines = function (params) {
  const root = query('#lines')
  const render = compose(createElement, portLine)
  const mount = append(root)
  const draw = compose(mount, render)

  const proto = {
    attrs: {
      stroke: 'green'
    }
  }

  const getLineFromLeftTop = LINE.createWithProto(proto, __, 0, 0, __, __)
  const shortLineFromLeftTop = getLineFromLeftTop({}, 100, 100)
  const longerLine = LINE.moveEndBy(shortLineFromLeftTop, 300, -50)
  const notFromLeftTop = LINE.moveStartTo(longerLine, 200, 300)
  const rotatedLine = LINE.rotate(notFromLeftTop, -90)

  forEach(draw)([
    shortLineFromLeftTop,
    longerLine,
    notFromLeftTop,
    rotatedLine
  ])
}

const main = function () {
  drawCircles()
  drawLines()
}

main()
