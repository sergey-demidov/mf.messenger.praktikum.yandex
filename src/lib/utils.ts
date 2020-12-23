/* eslint-disable no-restricted-syntax */
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
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
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

export const CONST = Object.freeze({
  undefined: 'undefined',
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
});
