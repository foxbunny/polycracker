import { Some } from '../types/Maybe'
import { createType, isPrimitive, isType, notNull, typeOf } from './type'

describe('createType', () => {
  let proto = {}

  test('create a type from proto', () => {
    let x = createType(proto, 'myType')
    expect(x.type).toBe('myType')
    expect(proto.isPrototypeOf(x)).toBe(true)
    expect(Object.getPrototypeOf(x)).toBe(proto)
  })

  test('type factory', () => {
    let x = createType(proto, 'myType')
    let y = x.of('value')
    expect(y.value).toBe('value')
    expect(y.type).toBe('myType')
    expect(x.isPrototypeOf(y))
    expect(Object.getPrototypeOf(y)).toBe(x)
  })

  test('compat methods', () => {
    let x = createType(proto, 'myType')
    let y = x.of('value')
    expect(y.toString()).toBe('myType(value)')
    expect(y.valueOf()).toBe('value')
  })
})

describe('typeOf', () => {
  class Foo {}

  test.each([
    [1, Number],
    ['str', String],
    [null, null],
    [undefined, undefined],
    [true, Boolean],
    [{}, Object],
    [new Foo, Foo],
    [new Date, Date],
    [Some.of(12), Some],
    [() => {}, Function],
  ])(
    'type of %s',
    (x, type) => {
      expect(typeOf(x)).toBe(type)
    },
  )
})

describe('isType', () => {
  test.each([
    [null, null],
    [undefined, undefined],
    [1, Number],
    ['str', String],
    [false, Boolean],
    [new Date(), Date],
    [[], Array],
    [Symbol('foo'), Symbol],
    [BigInt(10), BigInt],
    [() => {}, Function],
  ])(
    'primitive %s is type %s',
    (x, type) => {
      expect(isType(type)(x)).toBe(true)
    },
  )

  test.each([
    [Some.of(12), Some],
  ])(
    'object %s if of type %s',
    (x, type) => {
      expect(isType(type)(x)).toBe(true)
    },
  )
})

describe('isPrimitive', () => {
  class Foo {}

  test.each([
    null,
    undefined,
    1,
    'str',
    false,
  ])(
    '%s is primitive',
    (x) => {
      expect(isPrimitive(x)).toBe(true)
    },
  )

  test.each([
    new Foo,
    new Date,
    { foo: 'bar' },
    [1, 2],
    Some.of(12),
  ])(
    '%s is not primitive',
    x => {
      expect(isPrimitive(x)).toBe(false)
    },
  )
})

describe('notNull', () => {
  test.each([
    1,
    true,
    false,
    0,
    {},
    { foo: 'bar' },
    [],
    NaN,
  ])(
    'test non-null values',
    x => {
      expect(notNull(x)).toBe(true)
    },
  )

  test('test null values', () => {
    expect(notNull(null)).toBe(false)
    expect(notNull(undefined)).toBe(false)
  })
})

