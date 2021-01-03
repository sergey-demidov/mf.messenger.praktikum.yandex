import { PlainObject, queryStringify } from './utils';
import { ApiBaseUrl } from './const';

export type HttpDataType = Record<string, string | number | Array<string> | Array<number> | boolean > | FormData;

export type HttpRequestOptions = {
  method?: string;
  data?: HttpDataType;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

export default class HttpTransport {
  METHODS = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  });

  ApiBaseUrl: string;

  prefix: string;

  constructor(url = ApiBaseUrl, prefix: string) {
    this.prefix = prefix;
    this.ApiBaseUrl = url;
  }

  get = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.GET,
  }, options.timeout, options.withCredentials)

  put = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.PUT,
  }, options.timeout, options.withCredentials);

  post = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.POST,
  }, options.timeout, options.withCredentials);

  delete = (url: string, options: HttpRequestOptions = {}): Promise<XMLHttpRequest> => this.request(url, {
    ...options,
    method: this.METHODS.DELETE,
  }, options.timeout, options.withCredentials);

  request(url: string, options: HttpRequestOptions, timeout = 3000, withCredentials = true): Promise<XMLHttpRequest> {
    const { headers, data, method } = options;

    const sendURL = (method === this.METHODS.GET && data) ? `${url}?${queryStringify(data as PlainObject)}` : url;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = timeout;
      xhr.withCredentials = withCredentials;
      xhr.open(method as string, this.ApiBaseUrl + this.prefix + sendURL);
      if (headers && Object.keys(headers).length > 0) {
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
