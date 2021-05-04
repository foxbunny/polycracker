import { iterable } from '../abstractFns/iterable'
import { every, some } from '../abstractFns/sequence'
import { isType, Type } from '../concreteFns/type'
import { Iterable } from './Iterable'

describe('Iterable', () => {
  test('create', () => {
    let i = Iterable.of([1, 2, 3][Symbol.iterator]())
    expect(Array.from(i.value)).toEqual([1, 2, 3])
    expect(i).toBeOfType(Iterable, Type)
  })
})
