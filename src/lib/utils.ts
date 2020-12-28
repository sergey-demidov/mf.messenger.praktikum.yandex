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

export type PlainObject<T = unknown> = {
  [k in string]: T;
};

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

export function getKey(key: string, parentKey?: string):string {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export function getParams(data: PlainObject | [], parentKey?: string): [string, string][] {
  const result: [string, string][] = [];

  Object.entries(data).forEach((entry) => {
    const [key, value] = entry;
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  });

  return result;
}

export function queryStringify(data: PlainObject): string {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }

  return getParams(data).map((arr) => arr.join('=')).join('&');
}

export function isEqual(lhs: PlainObject, rhs: PlainObject): boolean {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }
  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      return isEqual(value as PlainObject, rightValue as PlainObject);
    }
    if (value !== rightValue) {
      return false;
    }
  }
  return true;
}
export function isJsonString(str: unknown): boolean {
  if (typeof str !== CONST.string) return false;
  try {
    JSON.parse(str as string);
  } catch (e) {
    return false;
  }
  return true;
}

export function hash8(): string {
  return Math.random().toString(36).substr(2, 8);
}

export function hash16(): string {
  return Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8);
}

export function formDataToObject(formData: FormData): Record<string, unknown> {
  return Array.from(formData.entries()).reduce((memo, pair) => ({
    ...memo,
    [pair[0]]: pair[1],
  }), {});
}

export function stringHash(source: string): number {
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
