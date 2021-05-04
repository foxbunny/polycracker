import {id} from './core'

let PRIMITIVE_TYPES = new Map([
  [null, true],
  [undefined, true],
  [Number, true],
  [String, true],
  [Boolean, true],
  [BigInt, true],
  [Symbol, true],
  [Function, true],
])

let Type = Object.freeze({})

// -> Type
let createBaseType = () => Object.freeze(Object.create(Type))

const create = (t, f) => x => Object.freeze(Object.create(t, {
  value: {
    value: f(x),
    writable: false,
  },
}))

// (Type, String) -> Type
let createType = (proto, type, constructor = id) => {
  let t = Object.create(proto, {
    type: {
      value: type,
      writable: false,
    },
  })
  t.of = create(t, constructor)
  t.toString = function () {
    return `${type}(${this.value})`
  }
  t.valueOf = function () {
    return this.value
  }
  return Object.freeze(t)
}

// T -> Type
let typeOf = x => {
  // First handle some special values that don't have a real "type"
  if (x === null) return null
  if (x === undefined) return undefined

  if (Type.isPrototypeOf(x)) {
    return Object.getPrototypeOf(x)
  }

  return x.constructor
}

// Type -> T -> Boolean
let isType = type => x => typeOf(x) === type

// T -> Boolean
let isPrimitive = x => PRIMITIVE_TYPES.get(typeOf(x)) || false

// T -> Boolean
let notNull = x => x != null

export {
  Type,
  createBaseType,
  createType,
  typeOf,
  isType,
  isPrimitive,
  notNull,
}
