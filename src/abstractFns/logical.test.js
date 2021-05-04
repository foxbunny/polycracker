import { id } from '../concreteFns/core'
import { and, cond, not, or } from './logical'

let isPos = x => x > 0
let isEven = x => x % 2 === 0

describe('and', () => {
  test('Any', () => {
    expect(true |> and(true)).toBe(true)
    expect(true |> and(false)).toBe(false)
    expect(false |> and(false)).toBe(false)
    expect(false |> and(true)).toBe(false)
  })

  test('Function', () => {
    let isPosEven = isPos |> and(isEven)

    expect(isPosEven(2)).toBe(true)
    expect(isPosEven(-2)).toBe(false)
  })
})

describe('or', () => {
  test('Any', () => {
    expect(true |> or(true)).toBe(true)
    expect(true |> or(false)).toBe(true)
    expect(false |> or(false)).toBe(false)
    expect(false |> or(true)).toBe(true)
  })

  test('Function', () => {
    let isPosOrEven = isPos |> or(isEven)

    expect(isPosOrEven(2)).toBe(true)
    expect(isPosOrEven(1)).toBe(true)
    expect(isPosOrEven(-2)).toBe(true)
    expect(isPosOrEven(-1)).toBe(false)
  })
})

describe('not', () => {
  test('Any', () => {
    expect(true |> not).toBe(false)
    expect(true |> not |> not).toBe(true)
    expect(false |> not).toBe(true)
  })

  test('Function', () => {
    let isPos = x => x > 0
    let isNonPos = isPos |> not

    expect(isNonPos(-1)).toBe(true)
    expect(isNonPos(0)).toBe(true)
    expect(isNonPos(1)).toBe(false)
  })

  test('Function double negation', () => {
    let isPos = x => x > 0
    let isDefinitelyPos = isPos |> not |> not

    expect(isPos(1)).toBe(isDefinitelyPos(1))
    expect(isPos(0)).toBe(isDefinitelyPos(0))
    expect(isPos(-1)).toBe(isDefinitelyPos(-1))
  })
})

