/**
 * compose function
 * @param  {...Function} fns 
 */
function compose(...fns) {
    return function (...args) {
        let ret = null
        fns.reverse().forEach(function (fn, i) {
            i == 0 ? (ret = fn(...args)) : (ret = fn(ret))
        });
        return ret;
    }
}

/**
 * curried
 * @param {Function} fn 
 */
function curry(fn, ...args) {
    return function (...innerArgs) {
        return fn(...args, ...innerArgs);
    };
}

/**
 * foreach Array, ArrayLike or Object
 * @param {Array/Object} object 
 * @param {Function} callback 
 */
function each(object, callback) {
    var name, i = 0, length = object.length;
    if (length == undefined) {
        for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
                break;
            }
        }
    } else {
        for (var value = object[0]; i < length && callback.call(value, value, i) !== false; value = object[++i]) { }
    }
    return object;
}

/**
 * map Array, ArrayLike or Object
 * @param {Array/Object} object 
 * @param {Function} callback 
 */
function map(object, callback) {
    var value, key, ret = [],
        i = 0,
        length = object.length,
        isArray = length !== undefined && typeof length === "number" && ((length > 0 && object[0] && object[length - 1]) || length === 0 || isArray(object));

    // Go through the array, translating each of the items to their
    if (isArray) {
        for (; i < length; i++) {
            value = callback(object[i], i);
            if (value != null) {
                ret[ret.length] = value;
            }
        }
        // Go through every key on the object,
    } else {
        for (key in object) {
            value = callback(object[key], key);

            if (value != null) {
                ret[ret.length] = value;
            }
        }
    }
    // Flatten any nested arrays
    return ret.concat.apply([], ret);
}

function filter(object, callback) {
    var ret = [], i = 0, length = object.length;
    for (; i < length; i++) {
        if (!!callback(object[i], i))
            ret.push(object[i]);
    }
    return ret;
}


function entries(object) {
    if (isArray(object)) {
        return object.entries();
    } else if (isObject(object)) {
        return Object.entries(object);
    } else {
        return null;
    }
}

function keys(object) {
    if (isArray(object)) {
        return object.keys();
    } else if (isObject(object)) {
        return Object.keys(object);
    } else {
        return null;
    }
}

function values(object) {
    if (isArray(object)) {
        return object.values();
    } else if (isObject(object)) {
        return Object.values(object);
    } else {
        return null;
    }
}

function repeat(n, object) {
    // if(isString(object)) return object.repeat(n);
    return new Array(n).fill(object);
}

function toArray(object) {
    if (!object.length) return object;
    return Array.from(object);
}

function isSpace(value) {
    return /^[\s\n\t]+$/.test(value);
}

function isAlphaNum(value) {
    return isAlpha(value) || isNumber(value);
}

function isNumber(value) {
    return typeof value == 'number';
}

function isAlpha(value) {
    return /^[a-zA-Z]+$/.test(value);
}

function isArray(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}

function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}

function isString(value) {
    return typeof value == 'string';
}

function type(obj) {
    if (obj == null) {
        return String(obj);
    }
    return typeof obj == 'object' || typeof obj == 'function' ?
        Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() || 'object' : typeof obj;
}