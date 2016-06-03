import { curry } from 'ramda'
import {
  createWithProto,
  isLineLike,
  getLength
} from './line'
import { warn } from '../utils/log.js'
import { isValidNumber } from '../utils/validators.js'

const warnNotLineLike = function (fnName, id, item) {
  warn(`line.${fnName}: expect a LineLike but got ${id}:${item}.`)
}
const warnInvalidNum = function (fnName, id, item) {
  warn(`line.${fnName}: expect a non-NaN number but got ${id}: ${item}.`)
}

const moveStartTo = curry(function (line, x1, y1) {
  if (!isLineLike(line)) {
    warnNotLineLike('moveStartTo', 'line', line)
    return line
  } else if (!isValidNumber(x1)) {
    warnInvalidNum('moveStartTo', 'x1', x1)
    return line
  } else if (!isValidNumber(y1)) {
    warnInvalidNum('moveStartTo', 'y1', y1)
  }
  return createWithProto(line, {}, x1, y1, line.x2, line.y2)
})

const moveEndTo = curry(function (line, x2, y2) {
  if (!isLineLike(line)) {
    warnNotLineLike('moveEndTo', 'line', line)
    return line
  } else if (!isValidNumber(x2)) {
    warnInvalidNum('moveEndTo', 'x2', x2)
    return line
  } else if (!isValidNumber(y2)) {
    warnInvalidNum('moveEndTo', 'y2', y2)
  }
  return createWithProto(line, {}, line.x1, line.y1, x2, y2)
})

const moveStartBy = curry(function (line, dx, dy) {
  if (!isLineLike(line)) {
    warnNotLineLike('moveStartBy', 'line', line)
    return line
  } else if (!isValidNumber(dx)) {
    warnInvalidNum('moveStartBy', 'x1', dx)
    return line
  } else if (!isValidNumber(dy)) {
    warnInvalidNum('moveStartBy', 'y1', dy)
  }
  return moveStartTo(line, line.x1 + dx, line.y1 + dy)
})

const moveEndBy = curry(function (line, dx, dy) {
  if (!isLineLike(line)) {
    warnNotLineLike('moveEndBy', 'line', line)
    return line
  } else if (!isValidNumber(dx)) {
    warnInvalidNum('moveEndBy', 'x2', dx)
    return line
  } else if (!isValidNumber(dy)) {
    warnInvalidNum('moveEndBy', 'y2', dy)
  }
  return moveEndTo(line, line.x2 + dx, line.y2 + dy)
})

const rotate = curry(function (line, deg) {
  if (!isLineLike(line)) {
    warnNotLineLike('rotate', 'line', line)
    return line
  } else if (!isValidNumber(deg)) {
    warnInvalidNum('rotate', 'deg', deg)
    return line
  }
  const deltaAngle = deg / 180 * Math.PI
  const l = getLength(line)
  const orginalAngle = Math.atan((line.x2 - line.x1) / (line.y2 - line.y1))
  const newAngle = orginalAngle + deltaAngle
  const newX = l * Math.sin(newAngle) + line.x1
  const newY = l * Math.cos(newAngle) + line.y1

  return moveEndTo(line, newX, newY)
})

const reverse = function (line) {
  if (!isLineLike(line)) {
    warnNotLineLike('reverse', 'line', line)
    return line
  }
  return createWithProto(line, {}, line.x2, line.y2, line.x1, line.y1)
}

export {
  moveStartTo,
  moveEndTo,
  moveStartBy,
  moveEndBy,
  rotate,
  reverse
}
