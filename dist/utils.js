'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.sortObject = sortObject;
exports.createHash = createHash;
exports.stringifyObject = stringifyObject;
exports.extendedToString = extendedToString;
exports.createClassName = createClassName;
exports.createMarkup = createMarkup;
exports.isEmpty = isEmpty;
exports.isPseudo = isPseudo;
exports.isMediaQuery = isMediaQuery;
exports.seperateStyles = seperateStyles;

var _CSSPropertyOperations = require('react-dom/lib/CSSPropertyOperations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sortObject(obj) {
  return (0, _keys2.default)(obj).sort().reduce(function (acc, key) {
    var val = obj[key];
    if (val || val === 0) acc[key] = val;
    return acc;
  }, {});
}

function createHash(str) {
  var i = str.length;
  if (i === 0) return 0;

  var hash = 5381;
  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }return hash >>> 0;
}

function stringifyObject(obj) {
  var keys = (0, _keys2.default)(obj);
  var str = '';

  for (var i = 0, len = keys.length; i < len; i++) {
    str += keys[i] + obj[keys[i]];
  }

  return str;
}

var SYMBOL_SET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function extendedToString(num, base) {
  var conversion = '';

  if (base > SYMBOL_SET.length || base <= 1 || !(0, _isInteger2.default)(base)) throw new Error(base + ' should be an integer between 1 and ' + SYMBOL_SET.length);

  while (num >= 1) {
    conversion = SYMBOL_SET[num - base * Math.floor(num / base)] + conversion;
    num = Math.floor(num / base);
  }

  return base < 11 ? parseInt(conversion) : conversion;
}

function createClassName(obj) {
  var hash = extendedToString(createHash(stringifyObject(obj)), 62);
  return hash ? '_' + hash : undefined;
}

function createMarkup(obj) {
  return (0, _CSSPropertyOperations.createMarkupForStyles)(obj);
}

function isEmpty(obj) {
  return !(0, _keys2.default)(obj).length;
}

function isPseudo(_ref) {
  var style = _ref.style,
      rule = _ref.rule;

  return rule.charAt(0) === ':' && (typeof style === 'undefined' ? 'undefined' : (0, _typeof3.default)(style)) === 'object';
}

function isMediaQuery(_ref2) {
  var style = _ref2.style,
      rule = _ref2.rule;

  return rule.charAt(0) === '@' && (typeof style === 'undefined' ? 'undefined' : (0, _typeof3.default)(style)) === 'object';
}

function handle(type, acc, _ref3) {
  var style = _ref3.style,
      rule = _ref3.rule;
  var pseudos = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var hash = createClassName(sortObject(style));
  var rules = pseudos.length ? [[].concat(rule, style, pseudos)] : rule;

  acc[type] = acc[type].concat(rules);
  acc.style[rule] = hash;
  return acc;
}

function seperateStyles(styles) {
  return (0, _keys2.default)(styles).reduce(function (acc, rule) {
    var content = {
      style: styles[rule],
      rule: rule
    };

    if (isPseudo(content)) {
      return handle('pseudos', acc, content);
    }

    if (isMediaQuery(content)) {
      var _seperateStyles = seperateStyles(content.style),
          style = _seperateStyles.style,
          pseudos = _seperateStyles.pseudos;

      return handle('mediaQueries', acc, { rule: rule, style: style }, pseudos);
    }

    acc.style[rule] = content.style;
    return acc;
  }, {
    style: {},
    pseudos: [],
    mediaQueries: []
  });
}
