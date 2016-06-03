(function (ramda) {
  'use strict';

  const isValidNumber = function (x) {
    return typeof x === 'number' && !isNaN(x);
  };

  const isObject = function (x) {
    return typeof x === 'object';
  };

  const warn = function (s) {
    console.warn(s);
  };

  const __proto__ = {
    type: 'circle',
    cx: 0,
    cy: 0,
    r: 1,
    attrs: {
      fill: 'black'
    }
  };

  /**
  * check if an item can be render to a svg circle element
  * @param {Object} obj - the item to be checked
  * @return {Boolean} - `true` if obj is a circleLike; `false` otherwise
  */
  const isCircleLike = function (obj) {
    const checkItems = ['cx', 'cy', 'r'];
    const predicates = ramda.map(ramda.propSatisfies(isValidNumber), checkItems);
    return ramda.allPass(predicates)(obj);
  };

  /**
  * curried function for creating a circle
  * @param {Object} attrs - non-basic attributes for a circle
  * @param {Number} r - radius in pixel
  * @param {Number} cx - x value of the center
  * @param {Number} cy - y value of the center
  * @return {CircleLike} a circle-like structure
  */
  const createWithProto = ramda.curry(function (proto, attrs, r, cx, cy) {
    if (!isCircleLike({ r, cx, cy })) {
      warn('circle.createWithProto:' + ' Invalid parameters for creating a circle!' + ` r = ${ r }, cx = ${ cx }, cy=${ cy }`);
    }

    if (!isObject(attrs)) {
      warn('circle.createWithProto: Invalid attributes for your circle!');
    }

    return {
      type: 'circle',
      cx: isValidNumber(cx) ? cx : isValidNumber(proto.cx) ? proto.cx : __proto__.cx,
      cy: isValidNumber(cy) ? cy : isValidNumber(proto.cy) ? proto.cy : __proto__.cy,
      r: isValidNumber(r) ? r : isValidNumber(proto.r) ? proto.r : __proto__.r,
      attrs: !isObject(attrs) ? proto.attrs : ramda.merge(proto.attrs, attrs)
    };
  });

  const create = createWithProto(__proto__);

  const createDefault = () => __proto__;

  const isCircle = ramda.allPass([isCircleLike, ramda.propEq('type', 'circle')]);
  const isNotCircle = ramda.complement(isCircle);

  const warnNotCircle = function (type) {
    warn(`Render.circle: expects to accept a Circle but got ${ type }`);
  };

  function portCircle (circle) {
    if (isNotCircle(circle)) {
      warnNotCircle(circle.type);
    } else {
      const baseAttrs = ramda.omit(['type', 'attrs'], circle);

      const attrs = ramda.merge(circle.attrs, baseAttrs);
      return {
        tag: 'circle',
        attrs,
        children: []
      };
    }
  }

  const fallbackWithMsg = ramda.curry(function (validator, msg, ...args) {
    if (!validator(args[0])) {
      warn(msg);
    }
    return ramda.find(validator)(args);
  });

  const __proto__$1 = {
    type: 'line',
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    attrs: {
      stroke: 'black'
    }
  };

  const isLineLike = function (obj) {
    const checkItems = ['x1', 'x2', 'y1', 'y2'];
    const predicates = ramda.map(ramda.propSatisfies(isValidNumber), checkItems);
    return ramda.allPass(predicates)(obj);
  };

  const createWithProto$1 = ramda.curry(function (proto, attrs, x1, y1, x2, y2) {
    const msg = ramda.curry(function (type, key, value) {
      return 'line.createWithProto: ' + `expects ${ key } to be ${ type }, ` + `but got ${ key } = ${ value }`;
    });
    const posMsg = msg('number');
    const fallbackPos = fallbackWithMsg(isValidNumber);

    const _x1 = fallbackPos(posMsg('x1', x1), x1, proto.x1, __proto__$1.x1);
    const _y1 = fallbackPos(posMsg('y1', y1), y1, proto.y1, __proto__$1.y1);
    const _x2 = fallbackPos(posMsg('x2', x2), x2, proto.x2, __proto__$1.x2);
    const _y2 = fallbackPos(posMsg('y2', y2), y2, proto.y2, __proto__$1.y2);
    const _attrs = ramda.merge(proto.attrs, attrs);

    return {
      type: 'line',
      x1: _x1,
      y1: _y1,
      x2: _x2,
      y2: _y2,
      attrs: _attrs
    };
  });

  const create$1 = createWithProto$1(__proto__$1);
  const createDefault$1 = () => __proto__$1;

  const getLength = function (line) {
    if (!isLineLike(line)) {
      warn(`line.getLength: cannot calculate length of non-LineLike ${ line }`);
      return NaN;
    }
    return Math.sqrt(Math.pow(line.x1 - line.x2, 2) + Math.pow(line.y1 - line.y2, 2));
  };

  const isLine = ramda.allPass([isLineLike, ramda.propEq('type', 'line')]);
  const isNotLine = ramda.complement(isLine);

  const warnNotLine = function (obj) {
    warn(`Render.line: can't render a non-line object ${ obj }`);
  };

  function portLine (line) {
    if (isNotLine(line)) {
      warnNotLine(line);
    } else {
      const baseAttrs = ramda.omit(['type', 'attrs'], line);
      return {
        tag: 'line',
        attrs: ramda.merge(line.attrs, baseAttrs),
        children: []
      };
    }
  }

  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  function createElement(node) {
    const { tag, attrs, children } = node;
    // create element
    let elm = document.createElementNS(SVG_NAMESPACE, tag);

    // copy attributes
    const attrList = ramda.toPairs(attrs);
    const setAttr = function (kv) {
      const key = kv[0];
      const value = kv[1];
      elm.setAttribute(key, value);
    };
    ramda.forEach(setAttr, attrList);

    // append children
    const append = function (child) {
      elm.appendChild(createElement(child));
    };
    ramda.forEach(append, children);

    return elm;
  }

  const warnTypeError = function (fnName) {
    const msg = `typeError: circle.${ fnName } works only on circle-like objects.`;
    warn(msg);
  };

  const warnInvalidNum = ramda.curry(function (fnName, id, value) {
    const msg = `typeError: circle.${ fnName } expects param ${ id } to be non-NaN number but got ${ value }.`;
    warn(msg);
  });

  const isInvalidNumber = ramda.complement(isValidNumber);

  /**
  * Copy a circle and move the copy to given position.
  * If the passed in object is not a `CircleLike`, it will return the original object.
  * @param {CircleLike} circle - A circle-like object
  * @param {Number} cx - the new center x postion
  * @param {Number} cy - the new center y position
  * @return {CircleLike | *} a new circle or the original object
  */
  const moveTo = ramda.curry(function (circle, cx, cy) {
    if (!isCircleLike(circle)) {
      warnTypeError('moveTo');
      return circle;
    }
    if (isInvalidNumber(cx)) {
      warnInvalidNum('moveTo', 'cx', cx);
      return circle;
    }
    if (isInvalidNumber(cy)) {
      warnInvalidNum('moveTo', 'cy', cy);
      return circle;
    }

    return createWithProto(circle, {}, circle.r, cx, cy);
  });

  const moveBy = ramda.curry(function (circle, dx, dy) {
    if (!isCircleLike(circle)) {
      warnTypeError('moveTo');
      return circle;
    }
    if (isInvalidNumber(dx)) {
      warnInvalidNum('moveBy', 'dx', dx);
      return circle;
    }
    if (isInvalidNumber(dy)) {
      warnInvalidNum('moveTo', 'dy', dy);
      return circle;
    }

    return createWithProto(circle, {}, circle.r, dx + circle.cx, dy + circle.cy);
  });

  const resize = ramda.curry(function (circle, r) {
    if (!isCircleLike(circle)) {
      warnTypeError('resize');
      return circle;
    }
    if (isInvalidNumber(r)) {
      warnInvalidNum('resize', 'r', r);
    }

    return createWithProto(circle, {}, r, circle.cx, circle.cy);
  });

  const warnNotLineLike = function (fnName, id, item) {
    warn(`line.${ fnName }: expect a LineLike but got ${ id }:${ item }.`);
  };
  const warnInvalidNum$1 = function (fnName, id, item) {
    warn(`line.${ fnName }: expect a non-NaN number but got ${ id }: ${ item }.`);
  };

  const moveStartTo = ramda.curry(function (line, x1, y1) {
    if (!isLineLike(line)) {
      warnNotLineLike('moveStartTo', 'line', line);
      return line;
    } else if (!isValidNumber(x1)) {
      warnInvalidNum$1('moveStartTo', 'x1', x1);
      return line;
    } else if (!isValidNumber(y1)) {
      warnInvalidNum$1('moveStartTo', 'y1', y1);
    }
    return createWithProto$1(line, {}, x1, y1, line.x2, line.y2);
  });

  const moveEndTo = ramda.curry(function (line, x2, y2) {
    if (!isLineLike(line)) {
      warnNotLineLike('moveEndTo', 'line', line);
      return line;
    } else if (!isValidNumber(x2)) {
      warnInvalidNum$1('moveEndTo', 'x2', x2);
      return line;
    } else if (!isValidNumber(y2)) {
      warnInvalidNum$1('moveEndTo', 'y2', y2);
    }
    return createWithProto$1(line, {}, line.x1, line.y1, x2, y2);
  });

  const moveStartBy = ramda.curry(function (line, dx, dy) {
    if (!isLineLike(line)) {
      warnNotLineLike('moveStartBy', 'line', line);
      return line;
    } else if (!isValidNumber(dx)) {
      warnInvalidNum$1('moveStartBy', 'x1', dx);
      return line;
    } else if (!isValidNumber(dy)) {
      warnInvalidNum$1('moveStartBy', 'y1', dy);
    }
    return moveStartTo(line, line.x1 + dx, line.y1 + dy);
  });

  const moveEndBy = ramda.curry(function (line, dx, dy) {
    if (!isLineLike(line)) {
      warnNotLineLike('moveEndBy', 'line', line);
      return line;
    } else if (!isValidNumber(dx)) {
      warnInvalidNum$1('moveEndBy', 'x2', dx);
      return line;
    } else if (!isValidNumber(dy)) {
      warnInvalidNum$1('moveEndBy', 'y2', dy);
    }
    return moveEndTo(line, line.x2 + dx, line.y2 + dy);
  });

  const rotate = ramda.curry(function (line, deg) {
    if (!isLineLike(line)) {
      warnNotLineLike('rotate', 'line', line);
      return line;
    } else if (!isValidNumber(deg)) {
      warnInvalidNum$1('rotate', 'deg', deg);
      return line;
    }
    const deltaAngle = deg / 180 * Math.PI;
    const l = getLength(line);
    const orginalAngle = Math.atan((line.x2 - line.x1) / (line.y2 - line.y1));
    const newAngle = orginalAngle + deltaAngle;
    const newX = l * Math.sin(newAngle) + line.x1;
    const newY = l * Math.cos(newAngle) + line.y1;

    return moveEndTo(line, newX, newY);
  });

  var query = function query(s) {
    return document.querySelector(s);
  };
  var append = ramda.curry(function (root, child) {
    root.appendChild(child);
  });

  var drawCircles = function drawCircles() {
    var root = query('#circles');
    var render = ramda.compose(createElement, portCircle);
    var mount = append(root);

    var proto = {
      attrs: {
        stroke: 'red',
        fill: 'azure'
      }
    };

    var getCircle = createWithProto(proto, {});
    var getBig = getCircle(100);
    var getSmall = getCircle(50);

    var big = getBig(0, 0);
    var small = getSmall(30, 50);

    mount(render(big));
    mount(render(small));
    mount(render(moveTo(big, 200, 200)));
    mount(render(moveBy(resize(small, 70), 300, 300)));
  };

  var drawLines = function drawLines(params) {
    var root = query('#lines');
    var render = ramda.compose(createElement, portLine);
    var mount = append(root);
    var draw = ramda.compose(mount, render);

    var proto = {
      attrs: {
        stroke: 'green'
      }
    };

    var getLineFromLeftTop = createWithProto$1(proto, ramda.__, 0, 0, ramda.__, ramda.__);
    var shortLineFromLeftTop = getLineFromLeftTop({}, 100, 100);
    var longerLine = moveEndBy(shortLineFromLeftTop, 300, -50);
    var notFromLeftTop = moveStartTo(longerLine, 200, 300);
    var rotatedLine = rotate(notFromLeftTop, -90);

    ramda.forEach(draw)([shortLineFromLeftTop, longerLine, notFromLeftTop, rotatedLine]);
  };

  var main = function main() {
    drawCircles();
    drawLines();
  };

  main();

}(R));