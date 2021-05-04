import { Left, Right } from '../types/Either'
import { not } from '../abstractFns/logical'
import { cond } from './core'
import { isType } from './type'

// (f(T) -> Boolean) -> T -> Either(T)
let either = f => cond(f, Right.of, Left.of)

// Any -> T -> Either(T)
let eitherType = type => type |> isType |> either

// (T|Error) -> Either(T|Error)
let eitherPass = isType(Error) |> not |> either

// (T|Void) -> Either(T|Void)
let eitherVal = either(x => x != null)

export {
  either,
  eitherType,
  eitherPass,
  eitherVal,
}
