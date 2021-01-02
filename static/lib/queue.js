export default class Queue {
    constructor() {
        this.size = 0;
        this.head = null;
        this.tail = null;
    }
    // Ставит элемент в очередь.
    // Возвращает новый размер очереди.
    enqueue(value) {
        const node = { value, next: null, prev: null };
        if (!this.tail) {
            this.head = node;
            this.tail = node;
            this.size = 1;
        }
        else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
            this.size += 1;
        }
        return this.size;
    }
    dequeue() {
        // size == 0
        if (!this.head)
            return undefined;
        const ret = this.head.value;
        // size == 1
        if (!this.head.next) {
            this.size = 0;
            this.head = null;
            this.tail = null;
            return ret;
        }
        // size == 1
        this.size -= 1;
        this.head.next.prev = null;
        this.head = this.head.next;
        return ret;
    }
    peek() {
        var _a;
        return (_a = this.head) === null || _a === void 0 ? void 0 : _a.value;
    }
    isEmpty() {
        return this.size === 0;
    }
    *values() {
        let current = this.head;
        while (current) {
            yield current.value;
            current = current.next;
        }
    }
}
//# sourceMappingURL=queue.js.map