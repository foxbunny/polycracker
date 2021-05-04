import {ap, flatMap, map} from '../abstractFns/functional'
import { id } from '../concreteFns/core'
import { Either, Left, Right } from './Either'

describe('Left', () => {
  test('create left', () => {
    let l = Left.of(12)
    expect(l.value).toBe(12)
    expect(l).toBeOfType(Left, Either)
  })
})

describe('Right', () => {
  test('create right', () => {
    let r = Right.of(12)
    expect(r.value).toBe(12)
    expect(r).toBeOfType(Right, Either)
  })
})
