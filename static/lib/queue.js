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
        if (!this.head)
            return undefined;
        const ret = this.head.value;
        switch (this.size) {
            case 0:
                return undefined;
            case 1:
                this.size = 0;
                this.head = null;
                this.tail = null;
                return ret;
            default:
                if (this.head.next) {
                    this.size -= 1;
                    this.head.next.prev = null;
                    this.head = this.head.next;
                    return ret;
                }
                return undefined;
        }
    }
    peek() {
        var _a;
        return ((_a = this.head) === null || _a === void 0 ? void 0 : _a.value) || undefined;
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