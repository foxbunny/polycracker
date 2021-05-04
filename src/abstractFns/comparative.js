import {createAbstractFn} from '../concreteFns/abstract'
import {len} from './sequence'
import {Any} from '../constants/Any'

let weight = createAbstractFn(true)
weight.def(Any, x => x)
weight.def(Array, len)
weight.def(Set, len)
weight.def(Map, len)
weight.def(Object, len)
weight.def(Date, x => x.getTime())
weight.def(Error, x => x.message)

let lt = createAbstractFn()
lt.def(Any, (x, y) => weight(x) < weight(y))

let lte = createAbstractFn()
lte.def(Any, (x, y) => weight(x) <= weight(y))

let gt = createAbstractFn()
gt.def(Any, (x, y) => weight(x) > weight(y))

let gte = createAbstractFn()
gte.def(Any, (x, y) => weight(x) >= weight(y))

// T -> U -> Boolean
let eq = createAbstractFn()
eq.def(Any, (x, y) => {
  // If types don't match, it can't be equal
  if (typeof y !== typeof x) return false

  // If they are identical, they must be equal
  if (y === x) return true

  // If they are not objects and were not identical, they can't be equal
  if (typeof y !== 'object') return false

  // If the prototypes mismatch, they are not equal
  if (Object.getPrototypeOf(y) !== Object.getPrototypeOf(x)) return false

  // If all properties match, they are equal
  return Object.keys(y)
    .concat(Object.keys(x))
    .every(k => {
      return eq(y[k])(x[k])
    })
})
eq.def(Error, (x, y) => x.message === y.message)

// T -> U -> Boolean
let similarTo = createAbstractFn()
similarTo.def(Any, (x, y) => {
  if (y === Any) return true
  if (y == null) return x == null
  if (typeof x !== typeof y) return false
  if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false
  if (typeof y !== 'object') return y === x
  return Object.keys(y).every(k => similarTo(y[k])(x[k]))
})

// T -> U -> Boolean
let order = createAbstractFn()
order.def(Any, (x, y) => {
  if (x |> lt(y)) return -1
  if (x |> gt(y)) return 1
  return 0
})

export {
  weight,
  lt,
  lte,
  gt,
  gte,
  eq,
  similarTo,
  order,
}
