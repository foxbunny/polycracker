import SealableArray from '../classes/SealableArray'
import { createAbstractFn } from '../concreteFns/abstract'
import { acc } from '../concreteFns/core'
import { Any } from '../constants/Any'
import { Iterable } from '../types/Iterable'
import { append } from './sequence'

// () -> Iterator
const emptyIterable = () => [][Symbol.iterator]()

// T -> Iterable
let iterable = createAbstractFn(true)
iterable.def(null, emptyIterable)
iterable.def(undefined, emptyIterable)
iterable.def(Any, x => typeof x[Symbol.iterator] === 'function'
  ? Iterable.of(x[Symbol.iterator]())
  : Iterable.of([x][Symbol.iterator]())
)
iterable.def(Object, x => Iterable.of(Object.entries(x)[Symbol.iterator]()))

// (T, U) -> T
let collect = x => acc(x, (x, y) => x |> append(y))

// T -> (U -> T)
let collectInto = createAbstractFn(true)
collectInto.def(Any, collect)

let cycle = createAbstractFn(true)
cycle.def(Iterable, x => {
  let p = new SealableArray([])
  let doneIteration = false
  let i = x.value

  return Iterable.of({
    [Symbol.iterator] () {
      return this
    },
    next () {
      let v = i.next()
      if (v.done) {
        p.seal()
        i = p[Symbol.iterator]()
        return { done: true }
      }
      p.push(v.value)
      return v
    },
  })
})

export {
  collectInto,
  iterable,
  cycle,
}
