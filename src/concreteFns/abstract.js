import { typeOf } from './type'
import {Any} from '../constants/Any'

let implementationMap = {
  add(type, f) {
    this.map.set(type, f)
  },
  call(x, ...args) {
    let type = typeOf(x)
    let delegate = this.map.get(type) || this.map.get(Any)
    if (!delegate) throw Error(`No implementation found for type ${type}`)
    return delegate(x, ...args)
  },
}

let createDelegates = () => {
  let impls = Object.create(implementationMap)
  impls.map = new Map()
  return impls
}

// Boolean -> (f(Any...) -> T -> U | f(T) -> U)
let createAbstractFn = (unary = false) => {
  let delegates = createDelegates()

  let abstract = unary
    ? x => delegates.call(x)
    : (...args) => x => delegates.call(x, ...args)

  abstract.def = (type, f) => delegates.add(type, f)

  return abstract
}

export {
  createAbstractFn,
}
