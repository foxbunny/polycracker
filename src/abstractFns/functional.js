import { createAbstractFn } from '../concreteFns/abstract'
import { id } from '../concreteFns/core'
import { Left, Right } from '../types/Either'
import { Iterable } from '../types/Iterable'
import { Nothing as NothingSingleton, Some } from '../types/Maybe'

let Nothing = Object.getPrototypeOf(NothingSingleton)

// (f(T) -> U) -> M(T) -> M(U)
let map = createAbstractFn()
map.def(String, (x, f) => {
  let y = ''
  let i = 0
  for (let c of x) {
    y += f(c, i++, x)
  }
  return y
})
map.def(Array, (x, f) => x.map(f))
map.def(Set, (x, f) => {
  let y = new Set()
  let i = 0
  for (let o of x) {
    y.add(f(o, i++, x))
  }
  return y
})
map.def(Map, (x, f) => {
  let y = new Map()
  for (let pair of x) {
    let [k, v] = f(pair, x)
    y.set(k, v)
  }
  return y
})
map.def(Object, (x, f) => {
  let y = {}
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    let v = x[k]
    let [l, w] = f([k, v], x)
    y[l] = w
  }
  return y
})
map.def(Iterable, (x, f) => Iterable.of({
  [Symbol.iterator] () {
    return this
  },
  next () {
    let v = x.value.next()
    if (v.done) return v
    return { value: f(v.value), done: false }
  },
}))
map.def(Some, (x, f) => Some.of(f(x.value)))
map.def(Nothing, () => NothingSingleton)
map.def(Left, id)
map.def(Right, (x, f) => Right.of(f(x.value)))

let flattenIndexedIterable = (x, f) => {
  let y
  let i = 0
  for (let c of x) y = f(c, i++, x)
  return y
}

// (f(T) -> U) -> F(T) -> U
let flatMap = createAbstractFn()
flatMap.def(String, flattenIndexedIterable)
flatMap.def(Array, flattenIndexedIterable)
flatMap.def(Set, flattenIndexedIterable)
flatMap.def(Map, (x, f) => {
  let y
  for (let pair of x) {
    y = f(pair, x)
  }
  return y
})
flatMap.def(Object, (x, f) => {
  let y
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    y = f([k, x[k]], x)
  }
  return y
})
flatMap.def(Iterable, (x, f) => Array.from(x.value) |> flatMap(f))
flatMap.def(Some, (x, f) => f(x.value))
flatMap.def(Nothing, () => null)
flatMap.def(Left, x => x.value)
flatMap.def(Right, (x, f) => f(x.value))

let applyToIterable = (x, o) => x |> map(f => f(o))

// T -> A(f(T) -> U) -> A(U)
let ap = createAbstractFn()
ap.def(Array, applyToIterable)
ap.def(Set, applyToIterable)
ap.def(Map, (x, o) => {
  let y = new Map()
  for (let [k, f] of x) {
    y.set(k, f(o))
  }
  return y
})
ap.def(Object, (x, o) => {
  let y = {}
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    y[k] = x[k](o)
  }
  return y
})
ap.def(Some, (x, o) => Some.of(x.value(o)))
ap.def(Nothing, (x, o) => NothingSingleton)
ap.def(Left, id)
ap.def(Right, (x, o) => Right.of(x.value(o)))

export {
  map,
  flatMap,
  ap,
}
