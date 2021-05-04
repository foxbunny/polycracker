import { createBaseType, createType } from '../concreteFns/type'

let Either = createBaseType()
let Left = createType(Either, 'Left')
let Right = createType(Either, 'Right')

export {
  Either,
  Left,
  Right,
}
