import { queryStringify } from './utils.js';
class HTTPTransport {
    constructor() {
        this.METHODS = {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE',
        };
        this.get = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.GET }), options.timeout);
        this.put = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.PUT }), options.timeout);
        this.post = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.POST }), options.timeout);
        this.delete = (url, options = {}) => this.request(url, Object.assign(Object.assign({}, options), { method: this.METHODS.DELETE }), options.timeout);
    }
    request(url, options = { headers: {}, data: {}, method: METHODS.GET }, timeout = 5000) {
        const { headers, data, method } = options;
        const sendURL = (method === METHODS.GET) ? `${url}?${queryStringify(data)}` : url;
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = timeout;
            xhr.open(method, sendURL);
            if (!headers || Object.keys(headers).length === 0) {
                xhr.setRequestHeader('Content-Type', 'text/plain');
            }
            else {
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
            if (method === METHODS.GET || !data) {
                xhr.send();
            }
            else {
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
//# sourceMappingURL=HTTPTransport.js.map