import { queryStringify } from "./utils.js";
import { ApiBaseUrl } from "./const.js";
export default class HttpTransport {
    constructor(url = ApiBaseUrl, prefix) {
        this.METHODS = Object.freeze({
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE',
        });
        this.get = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.GET }), options.timeout, options.withCredentials);
        this.put = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.PUT }), options.timeout, options.withCredentials);
        this.post = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.POST }), options.timeout, options.withCredentials);
        this.delete = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.DELETE }), options.timeout, options.withCredentials);
        this.prefix = prefix;
        this.ApiBaseUrl = url;
    }
    request(url, options, timeout = 3000, withCredentials = true) {
        const { headers, data, method } = options;
        const sendURL = (method === this.METHODS.GET && data) ? `${url}?${queryStringify(data)}` : url;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = timeout;
            xhr.withCredentials = withCredentials;
            xhr.open(method, this.ApiBaseUrl + this.prefix + sendURL);
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
            }
            else if (data instanceof FormData) {
                xhr.send(data);
            }
            else {
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
//# sourceMappingURL=http-transport.js.map