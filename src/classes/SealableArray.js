export default class SealableArray {
  constructor(a) {
    this.sealed = false
    this.items = a
  }

  push(x) {
    if (this.sealed) return
    this.items.push(x)
  }

  seal() {
    this.sealed = true
  }

  [Symbol.iterator] () {
    return this.items[Symbol.iterator]()
  }
}

