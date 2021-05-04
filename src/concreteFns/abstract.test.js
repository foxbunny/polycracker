import { createAbstractFn } from './abstract'
import { id } from './core'
import {Any} from '../constants/Any'

describe('createAbstractFn', () => {
  test('create an abstract fn', () => {
    let first = createAbstractFn()
    first.def(Array, (x, f) => f(x[0]))
    first.def(String, (x, f) => f(x[0]))
    first.def(Object, (x, f) => f(Object.entries(x)[0][1]))

    expect([1, 2, 3] |> first(id)).toBe(1)
    expect('123' |> first(id)).toBe('1')
    expect({foo: 'bar'} |> first(id)).toBe('bar')
    expect(() => 1 |> first(id)).toThrow(Error(`No implementation found for type ${Number}`))
  })

  test('create an unary abstract fn', () => {
    let first = createAbstractFn(true)
    first.def(Array, (x) => x[0])
    first.def(String, (x) => x[0])
    first.def(Object, (x) => Object.entries(x)[0][1])

    expect([1, 2, 3] |> first).toBe(1)
    expect('123' |> first).toBe('1')
    expect({foo: 'bar'} |> first).toBe('bar')
    expect(() => 1 |> first).toThrow(Error(`No implementation found for type ${Number}`))
  })

  test('Any fallback', () => {
    let first = createAbstractFn(true)
    first.def(Any, () => 0)
    first.def(Array, (x) => x[0])

    expect([1, 2, 3] |> first).toBe(1)
    expect(new Date() |> first).toBe(0)
    expect(1 |> first).toBe(0)
  })
})
