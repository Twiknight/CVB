import { __, curry, compose, forEach, prop, addIndex, map } from 'ramda'

import { fmap, chain } from '../src/utils/either-functor.js'
import portCircle from '../src/renders/circle.js'
import portLine from '../src/renders/line'
import portRect from '../src/renders/rect'
import portPolyLine from '../src/renders/polyline'
import portText from '../src/renders/text'
import createElement from '../src/platform/dom'
import * as CIRCLE from '../src/circle/index.js'
import * as LINE from '../src/line/index.js'
import * as RECT from '../src/rect/index.js'
import * as POLYLINE from '../src/polyline/index.js'
import * as TEXT from '../src/text/index.js'
import { log } from '../src/utils/log'
import { point } from '../src/data/point'

const query = (s) => document.querySelector(s)
const append = curry(function (root, child) {
  root.appendChild(child)
})

const drawCircles = function () {
  const root = query('#circles')
  const render = compose(createElement, portCircle)
  const mount = append(root)

  const proto = {
    stroke: 'red',
    fill: 'azure'
  }

  const getCircle = CIRCLE.create(proto)
  const getBig = getCircle(100)
  const getSmall = getCircle(50)

  const big = getBig(0, 0)
  const small = getSmall(30, 50)

  mount(render(big))
  mount(render(small))
  mount(render(CIRCLE.moveTo(big, 200, 200)))
  mount(render(CIRCLE.moveBy(CIRCLE.resize(small, 70), 300, 300)))
}

const drawLines = function (params) {
  const root = query('#lines')
  const render = compose(createElement, portLine)
  const mount = append(root)
  const draw = compose(mount, render)

  const proto = {
    stroke: 'green'
  }

  const getLineFromLeftTop = LINE.create(proto, 0, 0)
  const shortLineFromLeftTop = getLineFromLeftTop(100, 100)
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

const drawRects = function () {
  const root = query('#rects')
  const render = compose(fmap(createElement), log, portRect)
  const mount = append(root)
  const draw = compose(mount, prop('__value'), render)

  const proto = {
    fill: 'cyan'
  }

  const createRectLT = RECT.create(proto, 0, 0)
  const smallRect = createRectLT(50, 50)
  const lagerRect = compose(RECT.moveBy(__, 60, 30), RECT.resize(__, 100, 100))(smallRect)

  draw(smallRect)
  draw(lagerRect)
}

const drawPolyline = function () {
  const root = query('#polyline')
  const renderPolyline = compose(fmap(createElement), log, portPolyLine)
  const renderText = compose(fmap(createElement), log, portText)
  const mount = append(root)
  const draw = compose(chain(mount))

  const mapWithIdx = addIndex(map)
  const $x = 100

  const data = [17.5, 18.6, 14.7, 22.9, 24, 23.8, 30.1]
  const toPoints = mapWithIdx((v, idx) => point(idx * $x, v * -10))
  const toTexts = mapWithIdx((v, idx) => TEXT.create({'text-anchor': 'middle'},
                    `${v}pts`,
                    idx * $x,
                    v * -10))

  const title = TEXT.create({
    'font-size': '2em'
  }, 'stephen curry points per game', 0, 0)

  const axisStyle = { stroke: 'black' }
  const axisX = POLYLINE.create(axisStyle, [point(-20, 0), point($x * 8, 0)])
  const axisY = POLYLINE.create(axisStyle, [ point(0, 20), point(0, -200) ])
  const years = mapWithIdx((v, idx) =>
      TEXT.create({'text-anchor': 'middle'},
        `${idx + 2009}-${idx + 2010}`
        , idx * $x,
        0))(data)

  const polyline = POLYLINE.create({
    stroke: 'green',
    fill: 'none'
  }, toPoints(data))
  const texts = toTexts(data)

  draw(renderPolyline(POLYLINE.moveBy(polyline, $x * 2, 400)))
  map(compose(draw, renderText, TEXT.moveBy(__, $x * 2, 375)), texts)
  map(compose(draw, renderText, TEXT.moveBy(__, $x * 2, 350)))(years)
  draw(renderText(TEXT.moveBy(title, 200, 30)))
  draw(renderPolyline(POLYLINE.moveBy(axisX, $x, 300)))
  draw(renderPolyline(POLYLINE.moveBy(axisY, $x, 300)))
}

const main = function () {
  drawCircles()
  drawLines()
  drawRects()
  drawPolyline()
}

main()
