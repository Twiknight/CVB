import { map, addIndex } from 'ramda'
import { createElement, mount } from '../src/dom/dom.js'
import * as TEXT from '../src/shapes/text.js'
import * as POLYLINE from '../src/shapes/polyline.js'
import * as G from '../src/shapes/g.js'

const mapWithIndex = addIndex(map)

const title = function (x, y, t) {
  return TEXT.create({ 'font-size': '2em' }, x, y, t)
}

const axis = function (ux, uy, xtags) {
  const xAxis = POLYLINE.create({'stroke': 'black'}, [[0, 0], [8 * ux, 0]])
  const xComments = mapWithIndex(function (_, idx) {
    return TEXT.create({'text-anchor': 'middle'},
      (idx + 1) * ux, 20, _)
  })(xtags)
  const yAxis = POLYLINE.create({'stroke': 'black'}, [[0, 0], [0, -40 * uy]])
  const yComment = TEXT.create({'text-anchor': 'end'}, -0.1 * ux, -30 * uy, '30℃')
  const auxiliary = POLYLINE.create({
    'stroke': 'red',
    'stroke-dasharray': '5 2'
  }, [[0, -30 * uy], [8 * ux, -30 * uy]])
  const axis = G.create({}, [xAxis, yAxis, auxiliary, yComment, ...xComments])
  return axis
}

const graph = function (ux, uy, dataSet) {
  const dataLine = POLYLINE.create(
    {
      'stroke': 'black',
      'fill': 'none'
    },
    mapWithIndex(function (t, idx) {
      return [ idx * ux, -t * uy ]
    })(dataSet))
  const dataComments = mapWithIndex(function (_, idx) {
    return TEXT.create(
      {'text-anchor': 'middle'},
      (idx + 1) * ux,
      -_ * uy + 20,
      `${_}℃`)
  })(dataSet)
  return G.create({}, [POLYLINE.moveBy(ux, 0, dataLine), ...dataComments])
}

const drawTemperature = function (temps) {
  const ux = 80
  const uy = 8
  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const root = document.querySelector('#polyline')

  const $title = TEXT.port(title(175, 50, 'Highest Temperature This Week'))
  const $axis = G.port(G.moveBy(ux, 50 * uy)(axis(ux, uy, week)))
  const $data = G.port(G.moveBy(ux, 50 * uy)(graph(ux, uy, temps)))

  mount(root, createElement($title))
  mount(root, createElement($axis))
  mount(root, createElement($data))
}

const highestTemps = [27, 33, 36, 34, 26, 23, 24]
drawTemperature(highestTemps)
