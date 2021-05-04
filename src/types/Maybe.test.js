import {ap, flatMap, map} from '../abstractFns/functional'
import { id } from '../concreteFns/core'
import { Maybe, Nothing, Some } from './Maybe'

describe('Some', () => {
  test('create', () => {
    let s = Some.of(12)
    expect(s.value).toBe(12)
    expect(s).toBeOfType(Some, Maybe)
  })
})

describe('Nothing', () => {
  test('create', () => {
    expect(Maybe.isPrototypeOf(Nothing)).toBe(true)
  })
})
