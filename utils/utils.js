const utils = {
	format_date:(time,format='-') =>{
		const date = new Date(time);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}${format}${month}${format}${day}`;
	},
	_get:(object, path, defaultValue) =>{
	    var result = object == null ? undefined : baseGet(object, path);
		return result === undefined ? defaultValue : result;
	}
}
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}
function castPath(value, object) {
  if (Array.isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(value.toString());
}

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
//reIsDeepProp 用来匹配属性名里包含路径属性  例如什么. [] \这种
/**
 * Checks if `value` is a property name and not a property path.
 * 检查value是一个属性名，不是属性路径
 * @private
 * @param {*} value The value to check. 被检查的值
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
const isSymbol = val => typeof val === 'symbol';
function isKey(value, object) {
  if (Array.isArray(value)) { // 数组，直接返回false
    return false;
  }
  var type = typeof value; // 对应的集中类型直接返回true，看到没，没有字符串，没有字符串。如果你考虑到
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
function stringToPath(string){
	var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
}
/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}
// function isSymbol(value) {
//   return typeof value == 'symbol' ||
//     (isObjectLike(value) && baseGetTag(value) == symbolTag);
// }
// function isObjectLike(value) {
//   return value != null && typeof value == 'object';
// }
export default utils
