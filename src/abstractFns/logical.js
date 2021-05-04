import { createAbstractFn } from '../concreteFns/abstract'
import { Any } from '../constants/Any'

let and = createAbstractFn()
and.def(Any, (x, y) => x && y)
and.def(Function, (f, g) => x => f(x) && g(x))

let or = createAbstractFn()
or.def(Any, (x, y) => x || y)
or.def(Function, (f, g) => x => f(x) || g(x))

let not = createAbstractFn(true)
not.def(Any, x => !x)
not.def(Function, f => (...args) => !f(...args))

export {
  and,
  or,
  not,
}
