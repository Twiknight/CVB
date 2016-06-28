(function (ramda) {
  'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers.slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  babelHelpers;

  var isFunction = function isFunction(x) {
    return ramda.type(x) === 'Function';
  };

  var isNumber = function isNumber(x) {
    return ramda.is(Number, x) && !isNaN(x);
  };

  var typeErrorMsg = ramda.curry(function (fn, value, type) {
    return fn + ': ' + value + ' is not ' + type + '.';
  });

  var Left = function () {
    function Left(x) {
      babelHelpers.classCallCheck(this, Left);

      this.__value = x;
    }

    babelHelpers.createClass(Left, [{
      key: 'map',
      value: function map(f) {
        return this;
      }
    }, {
      key: 'join',
      value: function join(f) {
        return this;
      }
    }, {
      key: 'bnd',
      value: function bnd(f) {
        return this;
      }
    }]);
    return Left;
  }();

  // a -> Bool


  var isLeft = ramda.is(Left);

  var toLeft = function toLeft(x) {
    return new Left(x);
  };

  var Right = function () {
    function Right(x) {
      babelHelpers.classCallCheck(this, Right);

      this.__value = x;
    }

    babelHelpers.createClass(Right, [{
      key: 'map',
      value: function map(f) {
        return new Right(f(this.__value));
      }
    }, {
      key: 'join',
      value: function join(f) {
        return this.__value.map(f);
      }
    }, {
      key: 'bnd',
      value: function bnd(f) {
        return f(this.__value);
      }
    }]);
    return Right;
  }();

  // a -> Bool


  var isRight = ramda.is(Right);

  // a -> Right a
  var toRight = function toRight(x) {
    return new Right(x);
  };

  // (a -> b) -> M a -> M b
  var fmap = ramda.curry(function (f, x) {
    if (!isFunction(f)) {
      return new Left('Either.map: ' + f + ' is not a function!');
    } else if (ramda.isNil(x) || ramda.isNil(x.map)) {
      return new Left('Either.map: can not call \'map\' of ' + x + '.');
    } else {
      return x.map(f);
    }
  });

  // (a -> b) -> M (M a) -> M b
  var join$1 = ramda.curry(function (f, x) {
    if (!isFunction(f)) {
      return new Left('Either.join: ' + f + ' is not a function!');
    } else if (ramda.isNil(x) || ramda.isNil(x.join)) {
      return new Left('Either.join: can not call \'join\' of ' + x + '.');
    } else {
      return x.join(f);
    }
  });

  var bnd = ramda.curry(function (f, m) {
    if (!ramda.is(Function, f)) {
      return toLeft(typeErrorMsg('Either.bnd', f, 'Function'));
    } else if (ramda.isNil(m) || !ramda.is(Function, m.bnd)) {
      return toLeft('Either.bnd: can not call bnd of ' + m);
    } else {
      return m.bnd(f);
    }
  });

  var isEither = function isEither(_) {
    return isLeft(_) || isRight(_);
  };

  var VNode = function VNode(tag, attrs, children) {
    babelHelpers.classCallCheck(this, VNode);

    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  };

  var VText = function () {
    function VText(t) {
      babelHelpers.classCallCheck(this, VText);

      this.__text = t;
    }

    babelHelpers.createClass(VText, [{
      key: "content",
      get: function get() {
        return this.__text;
      }
    }]);
    return VText;
  }();

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var log = function log(x) {
    console.log(x);
    return x;
  };

  var $elm = function $elm(_) {
    return document.createElementNS(SVG_NS, _);
  };
  var $text = function $text(_) {
    return document.createTextNode(_.content);
  };

  var $create = function create(x) {
    if (ramda.is(VText, x)) {
      return $text(x);
    } else {
      var _ret = function () {
        var tag = x.tag;
        var attrs = x.attrs;
        var children = x.children;
        var elm = $elm(tag);

        ramda.forEach(function (_ref) {
          var _ref2 = babelHelpers.slicedToArray(_ref, 2);

          var n = _ref2[0];
          var v = _ref2[1];

          if (/^on[\w]+/.test(n) && ramda.is(Function, v)) {
            elm.addEventListener(ramda.slice(2, n.length), v);
          } else {
            elm.setAttribute(n, v);
          }
        })(ramda.toPairs(attrs));

        ramda.forEach(function (c) {
          elm.appendChild(create(c));
        })(children);

        return {
          v: elm
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
    }
  };

  var createElement = bnd(function (_) {
    var msg = typeErrorMsg('dom.createElement');
    if (!ramda.is(VNode, _)) {
      return toLeft(msg(_, 'VNode'));
    } else {
      return toRight($create(_));
    }
  });

  var mount = ramda.curry(function (root, elm) {
    if (isLeft(elm)) {
      return log(elm);
    } else {
      return fmap(function (elm) {
        root.appendChild(elm);
        return root;
      })(elm);
    }
  });

  var Shape = function () {
    function Shape(attrs) {
      babelHelpers.classCallCheck(this, Shape);

      this.attrs = attrs;
    }

    babelHelpers.createClass(Shape, [{
      key: 'moveBy',
      value: function moveBy(x, y) {
        return this;
      }
    }, {
      key: 'setAttr',
      value: function setAttr(name, value) {
        return ramda.assocPath(['attrs', name], value, this);
      }
    }]);
    return Shape;
  }();

  var LINEHEIGHT = 1.2;

  var Span = function () {
    function Span(attrs, text) {
      babelHelpers.classCallCheck(this, Span);

      this.attrs = attrs;
      this.children = [text];
    }

    babelHelpers.createClass(Span, [{
      key: 'port',
      value: function port() {
        var $children = ramda.map(function (_) {
          return new VText(_);
        })(this.children);
        return new VNode('tspan', this.attrs, $children);
      }
    }]);
    return Span;
  }();

  var Text = function (_Shape) {
    babelHelpers.inherits(Text, _Shape);

    function Text(attrs, x, y, text) {
      babelHelpers.classCallCheck(this, Text);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Text).call(this, attrs));

      var texts = ramda.split('\n', text);
      _this.x = x;
      _this.y = y;
      _this.children = ramda.addIndex(ramda.map)(function (t, idx) {
        return new Span({
          x: x,
          dy: LINEHEIGHT * idx + 'em'
        }, t);
      })(texts);
      _this.$content = text;
      return _this;
    }

    babelHelpers.createClass(Text, [{
      key: 'moveTo',
      value: function moveTo(x, y) {
        return new Text(this.attrs, x, y, this.$content);
      }
    }, {
      key: 'moveBy',
      value: function moveBy(dx, dy) {
        return new Text(this.attrs, this.x + dx, this.y + dy, this.$content);
      }
    }, {
      key: 'setAttr',
      value: function setAttr(name, value) {
        if (name === 'x') {
          return new Text(this.attrs, value, this.y, this.$content);
        } else if (name === 'y') {
          return new Text(this.attrs, this.x, value, this.$content);
        } else if (ramda.isNil(value)) {
          return new Text(ramda.dissoc(name, this.attrs), this.x, this.y, this.content);
        } else {
          return new Text(ramda.assoc(name, value, this.attrs), this.x, this.y, this.content);
        }
      }
    }, {
      key: 'port',
      value: function port() {
        var $attrs = ramda.merge(this.attrs, { x: this.x, y: this.y });
        var $children = ramda.map(function (x) {
          return x.port();
        })(this.children);

        return new VNode('text', $attrs, $children);
      }
    }, {
      key: 'content',
      get: function get() {
        return this.$content || '';
      }
    }]);
    return Text;
  }(Shape);

  // Object -> Number -> Number -> String -> Either (String Text)


  var create = ramda.curry(function (attrs, x, y, text) {
    var msg = typeErrorMsg('Text.unit');
    if (!ramda.is(Object, attrs)) {
      return toLeft(msg(attrs, 'Object'));
    } else if (!isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (!isNumber(x)) {
      return toLeft(msg(y, 'Number'));
    } else if (!ramda.is(String, text)) {
      return toLeft(msg(text, 'String'));
    } else {
      return toRight(new Text(attrs, x, y, text));
    }
  });

  // Either (String Text) -> Number -> Number -> Either (String Text)
  var moveTo = ramda.curry(function (t, x, y) {
    var msg = typeErrorMsg('Text.moveTo');
    if (!isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (!isNumber(y)) {
      return toLeft(msg(x, 'Number'));
    } else {
      return bnd(function (text) {
        if (!ramda.is(Text, text)) {
          return toLeft(msg(text, 'Text'));
        } else {
          return toRight(t.moveTo(x, y));
        }
      })(t);
    }
  });

  // Either(String Text) -> Number -> Number -> Either
  var moveBy = ramda.curry(function (t, x, y) {
    var msg = typeErrorMsg('Text.moveBy');
    if (!isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (!isNumber(y)) {
      return toLeft(msg(x, 'Number'));
    } else {
      return bnd(function (text) {
        if (!ramda.is(Text, text)) {
          return toLeft(msg(text, 'Text'));
        } else {
          return toRight(t.moveTo(text.x + x, text.y + y));
        }
      })(t);
    }
  });

  var set = ramda.curry(function (name, value, text) {
    var msg = typeErrorMsg('Text.set');
    if (!ramda.is(String, name)) {
      return toLeft(msg(name, 'String'));
    } else {
      return bnd(function (t) {
        if (!ramda.is(Text, t)) {
          return toLeft(msg(text, 'Text'));
        } else {
          return toRight(t.setAttr(name, value));
        }
      })(text);
    }
  });

  var port = function port(text) {
    var msg = typeErrorMsg('Text.port', ramda.__, 'Text');
    return bnd(function (_) {
      if (!ramda.is(Text, _)) {
        return toLeft(msg(text));
      } else {
        return toRight(_.port());
      }
    })(text);
  };

  var Polyline = function (_Shape) {
    babelHelpers.inherits(Polyline, _Shape);

    function Polyline(attrs, points) {
      babelHelpers.classCallCheck(this, Polyline);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Polyline).call(this, attrs));

      _this.$points = points;
      _this.children = [];
      return _this;
    }

    babelHelpers.createClass(Polyline, [{
      key: 'moveBy',
      value: function moveBy(dx, dy) {
        var movePoint = ramda.curry(function (_x, _y, _ref) {
          var _ref2 = babelHelpers.slicedToArray(_ref, 2);

          var x = _ref2[0];
          var y = _ref2[1];
          return [x + _x, y + _y];
        });
        return new Polyline(this.attrs, ramda.map(movePoint(dx, dy))(this.points));
      }
    }, {
      key: 'moveTo',
      value: function moveTo(x, y) {
        if (this.points.length < 1) {
          return this;
        } else {
          var p = this.points[0];
          var dx = x - p[0];
          var dy = y - p[0];
          return this.moveBy(dx, dy);
        }
      }
    }, {
      key: 'append',
      value: function append(x, y) {
        return new Polyline(this.attrs, ramda.append([x, y], this.points));
      }
    }, {
      key: 'remove',
      value: function remove(x, y) {
        var shouldNotRemove = function shouldNotRemove(_ref3) {
          var _ref4 = babelHelpers.slicedToArray(_ref3, 2);

          var a = _ref4[0];
          var b = _ref4[1];
          return !(a === x && b === y);
        };
        return new Polyline(this.attrs, ramda.filter(shouldNotRemove)(this.points));
      }
    }, {
      key: 'setAttr',
      value: function setAttr(name, value) {
        if (name === 'points') {
          return new Polyline(this.attrs, value);
        } else {
          var $attrs = ramda.assoc(name, value, this.attrs);
          return new Polyline($attrs, this.points);
        }
      }
    }, {
      key: 'port',
      value: function port() {
        var $pStrs = ramda.map(function (x) {
          return x[0] + ',' + x[1];
        })(this.points);
        var $points = ramda.join(' ', $pStrs);
        var $attrs = ramda.assoc('points', $points, this.attrs);
        return new VNode('polyline', $attrs, []);
      }
    }, {
      key: 'points',
      get: function get() {
        return this.$points;
      }
    }]);
    return Polyline;
  }(Shape);

  var isPoints = function isPoints(points) {
    if (!ramda.is(Array, points)) {
      return false;
    } else {
      return ramda.reduce(function (acc, p) {
        if (!acc) {
          return false;
        } else if (!ramda.is(Array, p)) {
          return false;
        } else if (p.length < 2) {
          return false;
        } else if (!isNumber(p[0]) || !isNumber(p[1])) {
          return false;
        } else {
          return true;
        }
      })(true, points);
    }
  };

  // Object -> [[Number]] -> Polyline
  var create$1 = ramda.curry(function (attrs, points) {
    var msg = typeErrorMsg('Polyline.create');
    if (!ramda.is(Object, attrs)) {
      return toLeft(msg(attrs, 'Object'));
    } else if (!isPoints(points)) {
      return toLeft(msg(points, 'Points'));
    } else {
      return toRight(new Polyline(attrs, points));
    }
  });

  var moveTo$1 = ramda.curry(function (x, y, p) {
    var msg = typeErrorMsg('Polyline.moveTo');
    if (!isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (!isNumber(y)) {
      return toLeft(msg(y, 'Number'));
    } else if (!isEither(p)) {
      return toLeft(msg(p, 'Right(Polyline)'));
    } else {
      return bnd(function (_) {
        if (ramda.is(Polyline, _)) {
          return toRight(_.moveTo(x, y));
        } else {
          return toLeft(msg(p, 'Polyline'));
        }
      })(p);
    }
  });

  var moveBy$1 = ramda.curry(function (dx, dy, p) {
    var msg = typeErrorMsg('Polyline.moveBy');
    if (!isNumber(dx)) {
      return toLeft(msg(dx, 'Number'));
    } else if (!isNumber(dy)) {
      return toLeft(msg(dy, 'Number'));
    } else if (!isEither(p)) {
      return toLeft(msg(p, 'Right(Polyline)'));
    } else {
      return bnd(function (_) {
        if (ramda.is(Polyline, _)) {
          return toRight(_.moveBy(dx, dy));
        } else {
          return toLeft(msg(p, 'Polyline'));
        }
      })(p);
    }
  });

  var append$1 = ramda.curry(function (x, y, p) {
    var msg = typeErrorMsg('Polyline.append');
    if (isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (isNumber(y)) {
      return toLeft(msg(y, 'Number'));
    } else if (!isEither(p)) {
      return toLeft(msg(p, 'Right(Polyline)'));
    } else {
      return bnd(function (_) {
        if (ramda.is(Polyline, _)) {
          return toRight(_.append(x, y));
        } else {
          return toLeft(msg(p, 'Polyline'));
        }
      })(p);
    }
  });

  var remove = ramda.curry(function (x, y, p) {
    var msg = typeErrorMsg('Polyline.remove');
    if (isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (isNumber(y)) {
      return toLeft(msg(y, 'Number'));
    } else if (!isEither(p)) {
      return toLeft(msg(p, 'Right(Polyline)'));
    } else {
      return bnd(function (_) {
        if (ramda.is(Polyline, _)) {
          return toRight(_.remove(x, y));
        } else {
          return toLeft(msg(p, 'Polyline'));
        }
      })(p);
    }
  });

  var G = function (_Shape) {
    babelHelpers.inherits(G, _Shape);

    function G(attrs, children) {
      babelHelpers.classCallCheck(this, G);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(G).call(this, attrs));

      _this.children = children;
      return _this;
    }

    babelHelpers.createClass(G, [{
      key: 'moveBy',
      value: function moveBy(x, y) {
        var $children = ramda.map(function (_) {
          return _.moveBy(x, y);
        })(this.children);
        return new G(this.attrs, $children);
      }
    }, {
      key: 'setAttr',
      value: function setAttr(name, value) {
        var $attrs = ramda.assoc(name, value, this.attrs);
        return new G($attrs, this.children);
      }
    }, {
      key: 'port',
      value: function port() {
        var $children = ramda.map(function (x) {
          return x.port();
        })(this.children);
        return new VNode('g', this.attrs, $children);
      }
    }]);
    return G;
  }(Shape);

  var create$2 = ramda.curry(function (attrs, children) {
    var msg = typeErrorMsg('G.create');
    if (!ramda.is(Object, attrs)) {
      return toLeft(msg(attrs, 'Object'));
    } else {
      var $children = ramda.reduce(function (acc, x) {
        if (isLeft(acc)) {
          return acc;
        } else if (isLeft(x)) {
          return x;
        } else {
          return bnd(function (_) {
            if (!ramda.is(Shape, _)) {
              return toLeft(msg(_, 'Shape'));
            } else {
              return fmap(ramda.append(_))(acc);
            }
          })(x);
        }
      })(toRight([]), children);

      return fmap(function (x) {
        return new G(attrs, x);
      })($children);
    }
  });

  var moveBy$2 = ramda.curry(function (x, y, g) {
    var msg = typeErrorMsg('G.moveBy');
    if (!isNumber(x)) {
      return toLeft(msg(x, 'Number'));
    } else if (!isNumber(y)) {
      return toLeft(msg(y, 'Number'));
    } else {
      return bnd(function (_) {
        if (!ramda.is(G, _)) {
          return toLeft(msg(_, 'G'));
        } else {
          return toRight(_.moveBy(x, y));
        }
      })(g);
    }
  });

  var set$2 = ramda.curry(function (name, value, g) {
    var msg = typeErrorMsg('G.set');
    if (!ramda.is(String, name)) {
      return toLeft(msg(name, 'String'));
    } else {
      return bnd(function (_) {
        if (!ramda.is(G, _)) {
          return toLeft(msg(_, 'G'));
        } else {
          return toRight(_.setAttr(name, value));
        }
      })(g);
    }
  });

  var port$2 = function port(g) {
    var msg = typeErrorMsg('G.port');
    return bnd(function (_) {
      if (!ramda.is(G, _)) {
        return toLeft(msg(_, 'G'));
      } else {
        return toRight(_.port());
      }
    })(g);
  };

  var mapWithIndex = ramda.addIndex(ramda.map);

  var title = function title(x, y, t) {
    return create({ 'font-size': '2em' }, x, y, t);
  };

  var axis = function axis(ux, uy, xtags) {
    var xAxis = create$1({ 'stroke': 'black' }, [[0, 0], [8 * ux, 0]]);
    var xComments = mapWithIndex(function (_, idx) {
      return create({ 'text-anchor': 'middle' }, (idx + 1) * ux, 20, _);
    })(xtags);
    var yAxis = create$1({ 'stroke': 'black' }, [[0, 0], [0, -40 * uy]]);
    var yComment = create({ 'text-anchor': 'end' }, -0.1 * ux, -30 * uy, '30℃');
    var auxiliary = create$1({
      'stroke': 'red',
      'stroke-dasharray': '5 2'
    }, [[0, -30 * uy], [8 * ux, -30 * uy]]);
    var axis = create$2({}, [xAxis, yAxis, auxiliary, yComment].concat(babelHelpers.toConsumableArray(xComments)));
    return axis;
  };

  var graph = function graph(ux, uy, dataSet) {
    var dataLine = create$1({
      'stroke': 'black',
      'fill': 'none'
    }, mapWithIndex(function (t, idx) {
      return [idx * ux, -t * uy];
    })(dataSet));
    var dataComments = mapWithIndex(function (_, idx) {
      return create({ 'text-anchor': 'middle' }, (idx + 1) * ux, -_ * uy + 20, _ + '℃');
    })(dataSet);
    return create$2({}, [moveBy$1(ux, 0, dataLine)].concat(babelHelpers.toConsumableArray(dataComments)));
  };

  var drawTemperature = function drawTemperature(temps) {
    var ux = 80;
    var uy = 8;
    var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var root = document.querySelector('#polyline');

    var $title = port(title(175, 50, 'Highest Temperature This Week'));
    var $axis = port$2(moveBy$2(ux, 50 * uy)(axis(ux, uy, week)));
    var $data = port$2(moveBy$2(ux, 50 * uy)(graph(ux, uy, temps)));

    mount(root, createElement($title));
    mount(root, createElement($axis));
    mount(root, createElement($data));
  };

  var highestTemps = [27, 33, 36, 34, 26, 23, 24];
  drawTemperature(highestTemps);

}(R));