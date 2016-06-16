(function (ramda) {
  'use strict';

  const isLeft = function (x) {
    if (ramda.isNil(x)) {
      return false;
    } else if (x.type === 'either-left') {
      return true;
    } else {
      return false;
    }
  };

  const isRight = function (x) {
    if (ramda.isNil(x)) {
      return false;
    } else if (x.type === 'either-right') {
      return true;
    } else {
      return false;
    }
  };

  const left = function (value) {
    const lp = { type: 'either-left' };
    const l = Object.create(lp);
    return ramda.assoc('__value', value, l);
  };

  const right = function (value) {
    const rp = { type: 'either-right' };
    const r = Object.create(rp);
    return ramda.assoc('__value', value, r);
  };

  const either = ramda.curry(function (fl, fr) {
    return function (value) {
      if (fl(value)) {
        return left(value);
      } else if (fr) {
        return right(value);
      } else {
        const msg = `either: the passed in param ${ value } seems to fit neither condition`;
        return left(msg);
      }
    };
  });

  const fmap = function (f) {
    return function (x) {
      if (isLeft(x)) {
        return x;
      } else if (isRight(x)) {
        return right(f(x.__value));
      } else {
        const msg = `fmap only works on either type, but got ${ x }`;
        return left(msg);
      }
    };
  };

  const chain = function (f) {
    return function (x) {
      return f(x.__value);
    };
  };

  const areEqual = ramda.curry(function (e1, e2) {
    return ramda.equals(e1, e2);
  });

  const isValidNumber = function (x) {
    return typeof x === 'number' && !isNaN(x);
  };

  const isObject = function (x) {
    return typeof x === 'object';
  };

  const warn = function (s) {
    console.warn(s);
  };

  const buildErrorInfo = ramda.curry((tmplFn, FnName, paramName, paramValue) => {
    return tmplFn(FnName, paramName, paramValue);
  });

  const log = function (unsafeShape) {
    if (isLeft(unsafeShape)) {
      console.log(unsafeShape.__value);
    }
    return unsafeShape;
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
  * @param {Number} r - radius in pixel
  * @param {Number} cx - x value of the center
  * @param {Number} cy - y value of the center
  * @return {CircleLike} a circle-like structure
  */
  const create = ramda.curry(function (attrs, r, cx, cy) {
    if (!isObject(attrs)) {
      warn('circle.createWithProto: Invalid attributes for your circle!');
    }

    return {
      type: 'circle',
      cx: isValidNumber(cx) ? cx : 0,
      cy: isValidNumber(cy) ? cy : 0,
      r: isValidNumber(r) ? r : 0,
      attrs: isObject(attrs) ? attrs : {}
    };
  });

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

  const fallback = ramda.curry((fn, value, defaultValue) => fn(value) ? value : defaultValue);

  const isLineLike = function (obj) {
    const checkItems = ['x1', 'x2', 'y1', 'y2'];
    const predicates = ramda.map(ramda.propSatisfies(isValidNumber), checkItems);
    return ramda.allPass(predicates)(obj);
  };

  const create$1 = ramda.curry(function (attrs, x1, y1, x2, y2) {
    const fallbackNumberToZero = fallback(isValidNumber, ramda.__, 0);
    const _attrs = fallback(isObject, attrs, {});

    return ramda.merge({ attrs: _attrs, type: 'line' }, ramda.map(fallbackNumberToZero, { x1, y1, x2, y2 }));
  });

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

  function portRect (rect) {
    return fmap(rect => {
      return {
        tag: rect.type,
        attrs: ramda.merge(rect.attrs, {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }),
        children: []
      };
    })(rect);
  }

  const toString = p => `${ p.x },${ p.y }`;

  const port = fmap(function (pl) {
    const points = ramda.join(' ')(ramda.map(chain(toString), pl.points));

    return {
      tag: pl.type,
      attrs: ramda.merge(pl.attrs, { points }),
      children: []
    };
  });

  function portText (text) {
    return fmap(function (t) {
      return {
        tag: t.type,
        attrs: ramda.merge(t.attrs, {
          x: t.x,
          y: t.y
        }),
        children: ramda.map(function (span) {
          return {
            tag: span.type,
            attrs: span.attrs,
            children: [span.textContent]
          };
        })(t.children || [])
      };
    })(text);
  }

  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  function createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

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

    return create(circle.attrs, circle.r, cx, cy);
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

    return create(circle.attrs, circle.r, dx + circle.cx, dy + circle.cy);
  });

  const resize = ramda.curry(function (circle, r) {
    if (!isCircleLike(circle)) {
      warnTypeError('resize');
      return circle;
    }
    if (isInvalidNumber(r)) {
      warnInvalidNum('resize', 'r', r);
    }

    return create(circle.attrs, r, circle.cx, circle.cy);
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
    return create$1(line.attrs, x1, y1, line.x2, line.y2);
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
    return create$1(line.attrs, line.x1, line.y1, x2, y2);
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

  const unSafeShape = either(x => typeof x === 'string');

  const RECT = 'rect';

  const typeErr = ramda.curry(function (fn, pn, pv) {
    return `Type error: rect.${ fn } can not handle param '${ pn }':${ pv }`;
  });
  const isInvalidNum = ramda.complement(isValidNumber);

  const unSafeRect = unSafeShape(x => !ramda.isNil(x) && x.type === RECT);

  const create$2 = ramda.curry(function (attrs, x, y, height, width) {
    const err = typeErr('createWithProto');
    if (!isObject(attrs)) {
      return unSafeRect(err('attrs', attrs));
    } else if (isInvalidNum(x)) {
      return unSafeRect(err('x', x));
    } else if (isInvalidNum(y)) {
      return unSafeRect(err('y', y));
    } else if (isInvalidNum(height)) {
      return unSafeRect(err('height', height));
    } else if (isInvalidNum(width)) {
      return unSafeRect(err('width', width));
    }

    return unSafeRect({ attrs, x, y, width, height, type: RECT });
  });

  const typeErr$1 = buildErrorInfo(function (fn, pn, pv) {
    return `Type error: rect.${ fn } can not handle param '${ pn }':${ pv }`;
  });

  const moveTo$1 = ramda.curry(function (rect, x, y) {
    const err = typeErr$1('moveTo');
    const f = function (r) {
      if (!isValidNumber(x)) {
        return err('x', x);
      } else if (!isValidNumber(y)) {
        return err('y', y);
      }
      return ramda.merge(r, { x, y });
    };

    return fmap(f)(rect);
  });

  const moveBy$1 = ramda.curry(function (rect, x, y) {
    const err = typeErr$1('moveBy');
    const f = function (r) {
      if (!isValidNumber(x)) {
        return err('x', x);
      } else if (!isValidNumber(y)) {
        return err('y', y);
      }
      return ramda.mergeWith(ramda.add, r, { x, y });
    };
    return fmap(f)(rect);
  });

  const resize$1 = ramda.curry(function (rect, height, width) {
    const err = typeErr$1('resize');
    const f = function (r) {
      if (!isValidNumber(height)) {
        return err('height', height);
      } else if (!isValidNumber(width)) {
        return err('width', width);
      }
      return ramda.merge(r, { height, width });
    };
    return fmap(f)(rect);
  });

  const unSafePoint = unSafeShape(x => true);

  const TYPE_POINT = 'point';

  const point = ramda.curry(function (x, y) {
    const err = n => `poit: ${ 'x' } should be a number!`;
    if (!isValidNumber(x)) {
      return unSafePoint(err(x));
    } else if (!isValidNumber(y)) {
      return unSafePoint(err(y));
    } else {
      return unSafePoint({ x, y, type: TYPE_POINT });
    }
  });

  const moveBy$3 = ramda.curry(function (pt, x, y) {
    return chain(p => point(x + p.x, y + p.y))(pt);
  });

  const isPoint = function (x) {
    return chain(p => !ramda.isNil(p) && p.type === TYPE_POINT)(x);
  };

  const moveBy$2 = ramda.curry(function (polyline, dx, dy) {
    return fmap(function (pl) {
      const newPoints = ramda.map(moveBy$3(ramda.__, dx, dy))(pl.points);
      return ramda.assoc('points', newPoints, pl);
    })(polyline);
  });

  const moveTo$2 = ramda.curry(function (polyline, x, y) {
    const points = chain(ramda.prop('points'))(polyline);
    if (points.length > 0) {
      const sx = chain(ramda.prop('x'))(points[0]);
      const sy = chain(ramda.prop('y'))(points[0]);
      const dx = x - sx;
      const dy = y - sy;
      return moveBy$2(polyline, dx, dy);
    } else {
      return polyline;
    }
  });

  const append$2 = ramda.curry(function (polyline, x, y) {
    const p = point(x, y);
    if (isPoint(p)) {
      return fmap(pl => ramda.assoc('points', ramda.append(p, pl.points), pl));
    } else {
      return p;
    }
  });

  const prepend$1 = ramda.curry(function (polyline, x, y) {
    const p = point(x, y);
    if (isPoint(p)) {
      return fmap(pl => ramda.assoc('points', ramda.prepend(p, pl.points), pl));
    } else {
      return p;
    }
  });

  const remove = ramda.curry(function (polyline, x, y) {
    const p = point(x, y);
    const shouldKeep = ramda.complement(areEqual(p));
    return fmap(function (pl) {
      return ramda.assoc('points', ramda.filter(shouldKeep, pl.points), pl);
    });
  });

  const POLYLINE = 'polyline';

  const isPolyline = ramda.allPass([ramda.complement(ramda.isNil), ramda.propSatisfies(x => x === POLYLINE, 'type')]);

  const unsafePolyline = unSafeShape(isPolyline);

  const create$3 = ramda.curry(function (attrs, points) {
    if (!isObject(attrs)) {
      return unsafePolyline(`polyline.create:
      attrs: ${ attrs } is not a valid object.`);
    } else if (!ramda.allPass([ramda.isArrayLike, ramda.all(isPoint)])) {
      return unsafePolyline(`polyline.create:
      ${ points } is not a valid point array`);
    }

    return unsafePolyline({
      type: POLYLINE,
      points,
      attrs
    });
  });

  const TSPAN = 'tspan';
  const TEXT = 'text';

  const unsafeTextspan = unSafeShape(x => !ramda.isNil(x) && x.type === TSPAN);
  const unsafeText = unSafeShape(x => !ramda.isNil(x) && x.type === TEXT);

  const tspan = ramda.curry(function (attrs, content) {
    if (!isObject(attrs)) {
      return unsafeTextspan(`text.tspan: 
      attrs: ${ attrs } is not a valid object`);
    } else if (typeof content !== 'string') {
      return unsafeTextspan(`text.tspan: 
      content: ${ content } is not a valid string`);
    } else {
      return unsafeTextspan({
        type: TSPAN,
        attrs,
        textContent: content
      });
    }
  });

  const create$4 = ramda.curry(function (attrs, content, x, y) {
    if (!isObject(attrs)) {
      return unsafeTextspan(`text.create: 
      attrs: ${ attrs } is not a valid object`);
    } else if (!isValidNumber(x)) {
      return unsafeTextspan(`text.create: 
      x: ${ x } is not a valid number`);
    } else if (!isValidNumber(y)) {
      return unsafeTextspan(`text.create: 
      y: ${ y } is not a valid number`);
    } else if (typeof content !== 'string') {
      return unsafeTextspan(`text.create: 
      content: ${ content } is not a valid string`);
    } else {
      const lines = ramda.split('\n', content);
      const spans = ramda.addIndex(ramda.map)((v, idx) => tspan({ dy: `${ 1.2 * idx }em`, x: x }, v))(lines);
      return unsafeText({
        type: TEXT,
        attrs: attrs,
        textContent: '',
        x,
        y,
        children: ramda.map(chain(x => x))(spans)
      });
    }
  });

  const _getText = function (t) {
    if (t.children && t.children.length > 0) {
      return ramda.join('\n')(ramda.map(ramda.prop('textContent'), t.children));
    } else {
      return t.textContent;
    }
  };

  const getText = chain(_getText);

  const moveTo$3 = ramda.curry(function (text, x, y) {
    return chain(t => create$4(t.attrs, _getText(t), x, y))(text);
  });

  const moveBy$4 = ramda.curry(function (text, dx, dy) {
    return chain(t => create$4(t.attrs, _getText(t), t.x + dx, t.y + dy))(text);
  });

  var query = function query(s) {
    return document.querySelector(s);
  };
  var append$1 = ramda.curry(function (root, child) {
    root.appendChild(child);
  });

  var drawCircles = function drawCircles() {
    var root = query('#circles');
    var render = ramda.compose(createElement, portCircle);
    var mount = append$1(root);

    var proto = {
      stroke: 'red',
      fill: 'azure'
    };

    var getCircle = create(proto);
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
    var mount = append$1(root);
    var draw = ramda.compose(mount, render);

    var proto = {
      stroke: 'green'
    };

    var getLineFromLeftTop = create$1(proto, 0, 0);
    var shortLineFromLeftTop = getLineFromLeftTop(100, 100);
    var longerLine = moveEndBy(shortLineFromLeftTop, 300, -50);
    var notFromLeftTop = moveStartTo(longerLine, 200, 300);
    var rotatedLine = rotate(notFromLeftTop, -90);

    ramda.forEach(draw)([shortLineFromLeftTop, longerLine, notFromLeftTop, rotatedLine]);
  };

  var drawRects = function drawRects() {
    var root = query('#rects');
    var render = ramda.compose(fmap(createElement), log, portRect);
    var mount = append$1(root);
    var draw = ramda.compose(mount, ramda.prop('__value'), render);

    var proto = {
      fill: 'cyan'
    };

    var createRectLT = create$2(proto, 0, 0);
    var smallRect = createRectLT(50, 50);
    var lagerRect = ramda.compose(moveBy$1(ramda.__, 60, 30), resize$1(ramda.__, 100, 100))(smallRect);

    draw(smallRect);
    draw(lagerRect);
  };

  var drawPolyline = function drawPolyline() {
    var root = query('#polyline');
    var renderPolyline = ramda.compose(fmap(createElement), log, port);
    var renderText = ramda.compose(fmap(createElement), log, portText);
    var mount = append$1(root);
    var draw = ramda.compose(chain(mount));

    var mapWithIdx = ramda.addIndex(ramda.map);
    var $x = 100;

    var data = [17.5, 18.6, 14.7, 22.9, 24, 23.8, 30.1];
    var toPoints = mapWithIdx(function (v, idx) {
      return point(idx * $x, v * -10);
    });
    var toTexts = mapWithIdx(function (v, idx) {
      return create$4({ 'text-anchor': 'middle' }, v + 'pts', idx * $x, v * -10);
    });

    var title = create$4({
      'font-size': '2em'
    }, 'stephen curry points per game', 0, 0);

    var axisStyle = { stroke: 'black' };
    var axisX = create$3(axisStyle, [point(-20, 0), point($x * 8, 0)]);
    var axisY = create$3(axisStyle, [point(0, 20), point(0, -200)]);
    var years = mapWithIdx(function (v, idx) {
      return create$4({ 'text-anchor': 'middle' }, idx + 2009 + '-' + (idx + 2010), idx * $x, 0);
    })(data);

    var polyline = create$3({
      stroke: 'green',
      fill: 'none'
    }, toPoints(data));
    var texts = toTexts(data);

    draw(renderPolyline(moveBy$2(polyline, $x * 2, 400)));
    ramda.map(ramda.compose(draw, renderText, moveBy$4(ramda.__, $x * 2, 375)), texts);
    ramda.map(ramda.compose(draw, renderText, moveBy$4(ramda.__, $x * 2, 350)))(years);
    draw(renderText(moveBy$4(title, 200, 30)));
    draw(renderPolyline(moveBy$2(axisX, $x, 300)));
    draw(renderPolyline(moveBy$2(axisY, $x, 300)));
  };

  var main = function main() {
    drawCircles();
    drawLines();
    drawRects();
    drawPolyline();
  };

  main();

}(R));