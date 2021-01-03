/* eslint-disable no-restricted-syntax */
import { CONST } from "./const.js";
export function isPlainObject(value) {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isArrayOrObject(value) {
    return isPlainObject(value) || isArray(value);
}
export function getKey(key, parentKey) {
    return parentKey ? `${parentKey}[${key}]` : key;
}
export function getParams(data, parentKey) {
    const result = [];
    Object.entries(data).forEach((entry) => {
        const [key, value] = entry;
        if (isArrayOrObject(value)) {
            result.push(...getParams(value, getKey(key, parentKey)));
        }
        else {
            result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
        }
    });
    return result;
}
export function queryStringify(data) {
    if (!isPlainObject(data)) {
        throw new Error('input must be an object');
    }
    return getParams(data).map((arr) => arr.join('=')).join('&');
}
export function isEqual(lhs, rhs) {
    if (Object.keys(lhs).length !== Object.keys(rhs).length) {
        return false;
    }
    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = rhs[key];
        if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            return isEqual(value, rightValue);
        }
        if (value !== rightValue) {
            return false;
        }
    }
    return true;
}
export function isJsonString(str) {
    if (typeof str !== CONST.string)
        return false;
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
export function hash8() {
    return Math.random().toString(36).substr(2, 8);
}
export function hash16() {
    return Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8);
}
export function formDataToObject(formData) {
    return Array.from(formData.entries()).reduce((memo, pair) => (Object.assign(Object.assign({}, memo), { [pair[0]]: pair[1] })), {});
}
export function cloneDeep(obj) {
    function isIterable(item) {
        return (item && typeof item === 'object');
    }
    function clone(source, target) {
        if (isIterable(source)) {
            Object.keys(source).forEach((key) => {
                if (Object.hasOwnProperty.call(source, key)) {
                    if (isIterable(source[key])) {
                        const a = Array.isArray(source[key]) ? [] : {};
                        Object.assign(target, { [key]: a });
                        clone(source[key], target[key]);
                    }
                    else {
                        Object.assign(target, { [key]: source[key] });
                    }
                }
            });
        }
        else {
            // eslint-disable-next-line no-param-reassign
            target = source;
        }
        return target;
    }
    return clone(obj, (Array.isArray(obj) ? [] : {}));
}
export function createWindowListeners() {
    window.ondragstart = () => {
        const trash = document.getElementsByClassName('s-trash')[0];
        setTimeout(() => {
            trash.innerText = 'delete';
            trash.parentElement.classList.add('mpy_trash__red');
        }, 250);
        trash.parentElement.classList.add('mpy_trash');
    };
    window.ondragend = () => {
        const trash = document.getElementsByClassName('s-trash')[0];
        trash.parentElement.classList.remove('mpy_trash');
        setTimeout(() => {
            trash.innerText = 'group_add';
            trash.parentElement.classList.remove('mpy_trash__red');
        }, 250);
    };
    // TODO: enable on deploy
    // window.onbeforeunload = () => false;
}
//# sourceMappingURL=utils.js.map