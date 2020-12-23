export interface ListNode<T> {
  value: T
  next: ListNode<T> | null
  prev: ListNode<T> | null
}

export default class Queue<T> {
  size: number;

  head: ListNode<T> | null;

  tail : ListNode<T> | null;

  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  // Ставит элемент в очередь.
  // Возвращает новый размер очереди.
  enqueue(value: T): number {
    const node: ListNode<T> = { value, next: null, prev: null };
    if (!this.tail) {
      this.head = node;
      this.tail = node;
      this.size = 1;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
      this.size += 1;
    }
    return this.size;
  }

  dequeue(): T | undefined {
    if (!this.head) return undefined;
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

  peek(): T | null {
    return this.head?.value || null;
  }

  isEmpty():boolean {
    return this.size === 0;
  }

  * values(): Generator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
