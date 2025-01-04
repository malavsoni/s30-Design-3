export class LinkedList {
  key: number;
  value: number;
  next: LinkedList | null;
  prev: LinkedList | null;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class LRUCache {
  map: Map<number, LinkedList>;
  head: LinkedList;
  tail: LinkedList;
  capacity: number;
  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new LinkedList(-1, -1);
    this.tail = new LinkedList(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    let node = this.map.get(key)!;
    this.removeNode(node);
    this.insertNode(node);
    return node.value;
  }

  put(key: number, value: number): void {
    if (!this.map.has(key)) {
      if (this.map.size == this.capacity) {
        this.map.delete(this.tail.prev!.key);
        this.removeNode(this.tail.prev!);
      }
      let node = new LinkedList(key, value);
      this.map.set(key, node);
      this.insertNode(node);
    } else {
      let node = this.map.get(key)!;
      this.map.set(key, node);
      this.removeNode(node);
      this.insertNode(node);
      node.value = value;
    }
  }

  // Remove from tail
  removeNode(current: LinkedList) {
    current.prev!.next = current.next;
    current.prev!.next!.prev = current.prev;
    current.prev = null;
    current.next = null;
  }

  // Insert at head
  insertNode(current: LinkedList) {
    current.next = this.head.next;
    current.prev = this.head;
    this.head.next = current;
    current.next!.prev = current;
  }
}

describe("LRU Cache", () => {
  it("Happy Path", () => {
    let cache = new LRUCache(2);
    expect(cache.map.size).toStrictEqual(0);
    cache.put(1, 0);
    expect(cache.map.size).toStrictEqual(1);
    cache.put(2, 2);
    expect(cache.map.size).toStrictEqual(2);
    cache.put(3, 3);
    expect(cache.map.size).toStrictEqual(2);
    expect(cache.get(1)).toStrictEqual(-1);
  });
});
