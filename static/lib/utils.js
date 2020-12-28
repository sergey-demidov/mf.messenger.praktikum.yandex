/* eslint-disable no-restricted-syntax */
export const CONST = Object.freeze({
    undefined: 'undefined',
    string: 'string',
    object: 'object',
    none: 'none',
    auto: 'auto',
    visible: 'visible',
    hidden: 'hidden',
    block: 'block',
    update: 'update',
    div: 'div',
    click: 'click',
    flex: 'flex',
    disabled: 'disabled',
    class: 'class',
    error: 'error',
    warn: 'warn',
    info: 'info',
    hashchange: 'hashchange',
    function: 'function',
});
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
export function stringHash(source) {
    let hash = 0;
    let chr;
    for (let i = 0; i < source.length; i += 1) {
        chr = source.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = ((hash << 5) - hash) + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
//# sourceMappingURL=utils.js.map