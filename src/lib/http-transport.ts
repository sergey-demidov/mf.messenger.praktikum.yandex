import { queryStringify, PlainObject } from './utils';

type DataType = Record<string, string | number | Array<string> | Array<number> | boolean> | FormData;

export type HttpRequestOptions = {
  method?: string;
  data?: DataType;
  headers?: Record<string, string>;
  timeout?: number;
}

export default class HttpTransport {
  METHODS = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  });

  get = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.GET,
  }, options.timeout)

  put = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.PUT,
  }, options.timeout);

  post = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.POST,
  }, options.timeout);

  delete = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.DELETE,
  }, options.timeout);

  request(url: string, options: HttpRequestOptions, timeout = 3000): Promise<XMLHttpRequest> {
    const { headers, data, method } = options;

    const sendURL = (method === this.METHODS.GET) ? `${url}?${queryStringify(data as PlainObject)}` : url;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = timeout;
      xhr.open(method as string, sendURL);
      if (!headers || Object.keys(headers).length === 0) {
        xhr.setRequestHeader('Content-Type', 'text/plain');
      } else {
        Object.keys(headers).forEach((header) => {
          xhr.setRequestHeader(header, headers[header]);
        });
      }

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === this.METHODS.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
