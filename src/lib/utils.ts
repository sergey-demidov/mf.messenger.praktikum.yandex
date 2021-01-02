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
  userDataChange: 'userDataChange',
  validate: 'validate',
  chatChange: 'chatChange',
  pass: 'pass',
  validateFinished: 'validateFinished',
  true: 'true',
  false: 'false',
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

type iterable = {
  [key in string | number]: unknown;
};

export function cloneDeep(obj: unknown): unknown {
  function isIterable(item: unknown): boolean {
    return (item && typeof item === 'object') as boolean;
  }

  function clone(source: iterable, target: iterable) {
    if (isIterable(source)) {
      Object.keys(source).forEach((key) => {
        if (Object.hasOwnProperty.call(source, key)) {
          if (isIterable(source[key])) {
            const a = Array.isArray(source[key]) ? [] : {};
            Object.assign(target, { [key]: a });
            clone(source[key] as iterable, target[key] as iterable);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      target = source;
    }
    return target;
  }
  return clone(obj as iterable, (Array.isArray(obj) ? [] : {}) as iterable);
}

export function createWindowListeners(): void {
  window.ondragstart = () => {
    const trash = <HTMLElement>document.getElementsByClassName('s-trash')[0];
    setTimeout(() => {
      trash.innerText = 'delete';
      (trash.parentElement as HTMLElement).classList.add('mpy_trash__red');
    }, 250);
    (trash.parentElement as HTMLElement).classList.add('mpy_trash');
  };

  window.ondragend = () => {
    const trash = <HTMLElement>document.getElementsByClassName('s-trash')[0];
    (trash.parentElement as HTMLElement).classList.remove('mpy_trash');
    setTimeout(() => {
      trash.innerText = 'group_add';
      (trash.parentElement as HTMLElement).classList.remove('mpy_trash__red');
    }, 250);
  };

  // TODO: enable on deploy
  // window.onbeforeunload = () => false;
}
