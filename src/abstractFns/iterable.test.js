import { Type } from '../concreteFns/type'
import { Iterable } from '../types/Iterable'
import { cycle, iterable } from './iterable'

describe('iterable', () => {
  test('create', () => {
    let i = iterable([1, 2, 3])
    expect(Array.from(i.value)).toEqual([1, 2, 3])
    expect(i).toBeOfType(Iterable, Type)
  })

  test('create from non-iterable object', () => {
    let i = iterable(1)
    expect(Array.from(i.value)).toEqual([1])
  })
})

describe('cycle', () => {
  test('Iterable', () => {
    let i = iterable([1, 2, 3])
    let x = i |> cycle
    let r1 = Array.from(x.value)
    let r2 = Array.from(x.value)
    let r3 = Array.from(x.value)
    expect(r1).toEqual([1, 2, 3])
    expect(r1).toEqual(r2)
    expect(r2).toEqual(r3)
  })
})
