import { createBaseType, createType } from '../concreteFns/type'

let Maybe = createBaseType()
let Some = createType(Maybe, 'Some')
let Nothing = createType(Maybe, 'Nothing')
let NothingSingleton = Nothing.of(null)

export {
  Maybe,
  Some,
  NothingSingleton as Nothing
}
