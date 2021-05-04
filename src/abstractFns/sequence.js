import { createAbstractFn } from '../concreteFns/abstract'
import { uncurry } from '../concreteFns/core'
import { match, opt } from '../concreteFns/patternMatching'
import { Any } from '../constants/Any'
import { Iterable } from '../types/Iterable'
import { add } from './algebraic'
import { eq } from './comparative'
import { iterable } from './iterable'

// C(T) -> T
let first = createAbstractFn(true)
first.def(String, x => x[0])
first.def(Array, x => x[0])

// C(T) -> T
let last = createAbstractFn(true)
last.def(String, x => x[x.length - 1])
last.def(Array, x => x[x.length - 1])

// C(T) -> Number -> C(T)
let slice = createAbstractFn()
slice.def(String, (x, i) => x.slice(i))
slice.def(Array, (x, i) => x.slice(i))

// C(T) -> C(T)
let tail = createAbstractFn(true)
tail.def(String, x => x.slice(1))
tail.def(Array, x => x.slice(1))

// C(T) -> T -> Boolean
let startsWith = createAbstractFn()
startsWith.def(String, (x, s) => x.startsWith(s))
startsWith.def(Array, (x, o) => eq(x[0])(o))

// C(T) -> T -> Boolean
let endsWith = createAbstractFn()
endsWith.def(String, (x, s) => x.endsWith(s))
endsWith.def(Array, (x, o) => eq(x[x.length - 1])(o))

// C(T) -> T -> Boolean
let includes = createAbstractFn()
includes.def(String, (x, y) => x.includes(y))
includes.def(Array, (x, y) => x.includes(y))
includes.def(Set, (x, y) => x.has(y))
includes.def(Map, (x, y) => x.has(y))
includes.def(Object, (x, y) => Object.prototype.hasOwnProperty.call(x, y))

// T -> C(T) -> Boolean
let includedIn = createAbstractFn()
includedIn.def(Any, (x, y) => y |> match(
  opt(String, () => y.includes(x)),
  opt(Array, () => y.includes(x)),
  opt(Set, () => y.has(x)),
  opt(Map, () => y.has(x)),
  opt(Object, () => Object.prototype.hasOwnProperty.call(y, x)),
))

// C(T) -> (f(T) -> Boolean) -> C(T)
let filter = createAbstractFn()
filter.def(String, (x, f) => {
  let s = ''
  let i = 0
  for (let c of x) {
    if (f(c, i++, x)) s += c
  }
  return s
})
filter.def(Array, (x, f) => x.filter(f))
filter.def(Set, (x, f) => {
  let s = new Set()
  let i = 0
  for (let o of x) {
    if (f(o, i++, x)) s.add(o)
  }
  return s
})
filter.def(Map, (x, f) => {
  let m = new Map()
  for (let [k, v] of x) {
    if (f(k, v, x)) m.set(k, v)
  }
  return m
})
filter.def(Object, (x, f) => {
  let o = {}
  for (let k in x) {
    if (x.hasOwnProperty(k)) {
      let v = x[k]
      if (f(k, v, x)) o[k] = v
    }
  }
  return o
})
filter.def(Iterable, (x, f) => Iterable.of({
  [Symbol.iterator] () {
    return this
  },
  next () {
    let v = x.value.next()
    while (!v.done && !f(v.value)) {
      v = x.value.next()
    }
    return v
  },
}))

// C(T) -> Number
let len = createAbstractFn(true)
len.def(String, x => x.length)
len.def(Array, x => x.length)
len.def(Set, x => x.size)
len.def(Map, x => x.size)
len.def(Object, x => {
  let l = 0
  for (let k in x) {
    if (x.hasOwnProperty(k)) l++
  }
  return l
})

// C(T) -> C(T)
let reverse = createAbstractFn(true)
reverse.def(String, x => {
  let y = ''
  for (let c of x) {
    y = c + y
  }
  return y
})
reverse.def(Array, x => {
  let y = Array.from(x)
  y.reverse()
  return y
})
reverse.def(Set, x => {
  let y = Array.from(x)
  y.reverse()
  return new Set(y)
})
reverse.def(Map, x => {
  let y = Array.from(x)
  y.reverse()
  return new Map(y)
})

// C(T) -> Boolean
let empty = createAbstractFn(true)
empty.def(String, x => !x)
empty.def(Array, x => !x.length)
empty.def(Set, x => !x.size)
empty.def(Map, x => !x.size)
empty.def(Object, x => {
  for (let k in x) {
    if (x.hasOwnProperty(k)) return false
  }
  return true
})

// ((T, T) -> Number) -> C(T) -> C(T)
let sort = createAbstractFn()
sort.def(String, (x, f) => {
  let y = Array.from(x)
  y.sort(f)
  return y.join('')
})
sort.def(Array, (x, f) => {
  let y = Array.from(x)
  y.sort(f)
  return y
})

// C(T) -> C(T) -> Iterable([T, T])
let zip = createAbstractFn()
zip.def(String, (x, y) => x |> iterable |> zip(iterable(y)))
zip.def(Array, (x, y) => x |> iterable |> zip(iterable(y)))
zip.def(Iterable, (x, y) => Iterable.of({
  [Symbol.iterator] () {
    return this
  },
  next () {
    const v1 = x.value.next()
    const v2 = y.value.next()

    if (v1.done || v2.done) {
      return { done: true }
    }

    return { done: false, value: [v1.value, v2.value] }
  },
}))

let everyOfIterable = (x, f) => {
  for (let c of x) {
    if (!f(c)) return false
  }
  return true
}

// (f(T) -> Boolean) -> C(T) -> Boolean
let every = createAbstractFn()
every.def(String, everyOfIterable)
every.def(Array, everyOfIterable)
every.def(Set, everyOfIterable)
every.def(Map, everyOfIterable)
every.def(Object, (x, f) => {
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    if (!f([k, x[k]])) return false
  }
  return true
})
every.def(Iterable, (x, f) => {
  for (let y of x.value) {
    if (!f(y)) return false
  }
  return true
})

let someOfIterable = (x, f) => {
  for (let c of x) {
    if (f(c)) return true
  }
  return false
}

// (T -> Boolean) -> C(T) -> Boolean
let some = createAbstractFn()
some.def(String, someOfIterable)
some.def(Array, someOfIterable)
some.def(Set, someOfIterable)
some.def(Map, someOfIterable)
some.def(Object, (x, f) => {
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    if (f([k, x[k]])) return true
  }
  return false
})
some.def(Iterable, (x, f) => {
  for (let y of x.value) {
    if (f(y)) return true
  }
  return false
})

// T -> U -> T
let append = createAbstractFn()
append.def(String, uncurry(add))
append.def(Array, (x, y) => [...x, y])
append.def(Set, (x, y) => new Set([...x, y]))
append.def(Map, (x, y) => new Map([...x, y]))
append.def(Object, (x, [k, v]) => ({...x, [k]: v}))

// U -> T -> T
let appendTo = createAbstractFn()
appendTo.def(Any, (x, y) => y |> match(
  opt(String, () => y |> add(x)),
  opt(Array, () => [...y, x]),
  opt(Set, () => new Set([...y, x])),
  opt(Map, () => new Map([...y, x])),
  opt(Object, () => ({...y, [x[0]]: x[1]}))
))

// T -> Number -> T
let repeat = createAbstractFn()
repeat.def(String, (x, y) => x.repeat(y))
repeat.def(Array, (x, y) => {
  let z = []
  for (let i = 0; i < y; i++) z.push(...x)
  return z
})

export {
  first,
  last,
  slice,
  tail,
  startsWith,
  endsWith,
  includes,
  includedIn,
  filter,
  len,
  reverse,
  empty,
  zip,
  every,
  some,
  sort,
  append,
  appendTo,
  repeat,
}
