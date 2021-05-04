import { Left, Right } from '../types/Either'
import { Maybe, Nothing, Some } from '../types/Maybe'
import { add } from './algebraic'
import { ap, flatMap, map } from './functional'
import { acc, id } from '../concreteFns/core'
import { collectInto, iterable } from './iterable'

describe('map', () => {
  test('String', () => {
    let x = 'abcd'
    expect(x |> map(x => x.charCodeAt()))
      .toBe('979899100')
  })

  test('Array', () => {
    let x = [1, 2, 3]
    expect(x |> map(x => x + 1)).toEqual([2, 3, 4])
  })

  test('Set', () => {
    let x = new Set([1, 2, 3])
    expect(x |> map(x => x + 1)).toEqual(new Set([2, 3, 4]))
  })

  test('Map', () => {
    let x = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    expect(x |> map(([k, v]) => [k, v + 1])).toEqual(new Map([
      ['a', 2],
      ['b', 3],
      ['c', 4],
    ]))
  })

  test('Object', () => {
    let x = { a: 1, b: 2, c: 3 }
    expect(x |> map(([k, v]) => [v, k])).toEqual({
      1: 'a',
      2: 'b',
      3: 'c',
    })
  })

  test('Iterable', () => {
    let i = iterable([1, 2, 3])
    const x = i |> map(x => x + 1)
    expect(Array.from(x.value)).toEqual([2, 3, 4])
  })

  test('Some', () => {
    let s = Some.of(12)
    let x = s |> map(x => x + 1)
    expect(x.value).toBe(13)
    expect(s).toBeOfType(Some, Maybe)
  })

  test('Nothing', () => {
    let x = Nothing |> map(x => x + 1)
    expect(x).toBe(Nothing)
  })

  test('Left', () => {
    let l = Left.of(12)
    let x = l |> map(x => x / 2)
    expect(x).toEqualTyped(Left.of(12))
  })

  test('Right', () => {
    let r = Right.of(12)
    let x = r |> map(x => x / 3)
    expect(x).toEqualTyped(Right.of(4))
  })
})

describe('flatMap', () => {
  test('String', () => {
    let x = 'abcd'
    expect(x |> flatMap(
      acc([], (x, y) => (x.push(y.charCodeAt()), x)),
    ))
      .toEqual([97, 98, 99, 100])
  })

  test('Array', () => {
    let x = [1, 2, 3, 4]
    expect(x |> flatMap(acc(0, (x, y) => x + y))).toBe(10)
  })

  test('Set', () => {
    let x = new Set([1, 2, 3, 4])
    expect(x |> flatMap(acc(0, (x, y) => x + y))).toBe(10)
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2], ['c', 3]])
    expect(x |> flatMap(acc([], (x, y) => x.concat(y))))
      .toEqual(['a', 1, 'b', 2, 'c', 3])
  })

  test('Object', () => {
    let x = { a: 1, b: 2, c: 3 }
    expect(x |> flatMap(acc('', (x, [k, v]) => x + k + '-' + v)))
      .toBe('a-1b-2c-3')
  })

  test('Iterable', () => {
    let i = iterable([1, 2, 3])
    expect(i |> flatMap(acc(0, (x, y) => x |> add(y))))
      .toEqual(6)

    i = iterable([1, 2, 3])
    expect(i |> flatMap(collectInto([])))
      .toEqual([1, 2, 3])
  })

  test('Some', () => {
    let s = Some.of(12)
    let x = s |> flatMap(x => x - 2)
    expect(x).toBe(10)
    expect(s.value).toBe(s |> flatMap(id))
  })

  test('Nothing', () => {
    expect(Nothing |> flatMap(x => x - 2)).toBe(null)
    expect(Nothing.value).toBe(Nothing |> flatMap(id))
  })

  test('Left', () => {
    let l = Left.of(12)
    expect(l |> flatMap(x => x / 2)).toBe(12)
    expect(l |> flatMap(id)).toBe(12)
  })

  test('Right', () => {
    let r = Right.of(12)
    expect(r |> flatMap(x => x / 3)).toBe(4)
    expect(r |> flatMap(id)).toBe(12)
  })
})

describe('ap', () => {
  test('Array', () => {
    let x = [x => x + 2, x => x * 2]
    expect(x |> ap(1)).toEqual([3, 2])
  })

  test('Set', () => {
    let x = new Set([x => x + 2, x => x * 2])
    expect(x |> ap(1)).toEqual(new Set([3, 2]))
  })

  test('Map', () => {
    let x = new Map([
      ['plus2', x => x + 2],
      ['double', x => x * 2],
    ])
    expect(x |> ap(1)).toEqual(new Map([
      ['plus2', 3],
      ['double', 2],
    ]))
  })

  test('Object', () => {
    let x = { plus2: x => x + 2, double: x => x * 2 }
    expect(x |> ap(1)).toEqual({ plus2: 3, double: 2 })
  })

  test('Some', () => {
    let s = Some.of((x) => `hello, ${x}`)
    let x = s |> ap('world')
    expect(x).toEqualTyped(Some.of('hello, world'))
  })

  test('Nothing', () => {
    let x = Nothing |> ap('world')
    expect(x).toBe(Nothing)
  })

  test('Left', () => {
    let f = x => `hello, ${x}`
    let l = Left.of(f)
    let x = l |> ap('world')
    expect(x).toEqualTyped(Left.of(f))
  })

  test('Right', () => {
    let f = x => `hello, ${x}`
    let r = Right.of(f)
    let x = r |> ap('world')
    expect(x).toEqualTyped(Right.of('hello, world'))
  })
})
