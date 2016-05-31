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

  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  function createElement(tag, attrs = {}, children = []) {
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
      elm.appendChild(child);
    };
    ramda.forEach(append, children);
    return elm;
  }

  const isCircle = ramda.allPass([isCircleLike, ramda.propEq('type', 'circle')]);
  const isNotCircle = ramda.complement(isCircle);

  const warnNotCircle = function (type) {
    warn(`Render.circle: expects to accept a Circle but got ${ type }`);
  };

  function render (circle) {
    if (isNotCircle(circle)) {
      warnNotCircle(circle.type);
    } else {
      const baseAttrs = {
        cx: circle.cx,
        cy: circle.cy,
        r: circle.r
      };

      const attrs = ramda.merge(circle.attrs, baseAttrs);
      return createElement('circle', attrs, []);
    }
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

  var main = function main() {
    var root = document.querySelector('#field');

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
    var small = getSmall(0, 0);

    root.appendChild(render(big));
    root.appendChild(render(small));
    root.appendChild(render(moveTo(big, 200, 200)));
    root.appendChild(render(moveTo(resize(small, 70), 300, 300)));
  };

  main();

}(R));