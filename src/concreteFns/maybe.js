import { not } from '../abstractFns/logical'
import { Nothing, Some } from '../types/Maybe'
import { cond } from './core'
import { isType } from './type'

// (f(T) -> Boolean) -> T -> Maybe(T)
let maybe = f => cond(f, Some.of, () => Nothing)

// Any -> T -> Maybe(T)
let maybeType = type => type |> isType |> maybe

// (T|Error) -> Maybe(T)
let maybePass = isType(Error) |> not |> maybe

// (T|Void) -> Maybe(T)
let maybeVal = maybe(x => x != null)

export {
  maybe,
  maybeType,
  maybeVal,
  maybePass,
}
