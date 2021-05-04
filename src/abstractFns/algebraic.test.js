import { add, div, mult, sub } from './algebraic'

describe('add', () => {
  test('Number', () => {
    let x = 1
    expect(x |> add(0)).toBe(x)
    expect(x |> add(2)).toBe(3)
  })

  test('String', () => {
    let x = 'test '
    expect(x |> add('')).toBe(x)
    expect(x |> add('me')).toBe('test me')
  })

  test('Array', () => {
    let x = [1, 2]
    expect(x |> add([])).toEqual(x)
    expect(x |> add([3, 4])).toEqual([1, 2, 3, 4])
  })

  test('Set', () => {
    let x = new Set([1, 2])
    expect(x |> add(new Set([]))).toEqual(x)
    expect(x |> add(new Set([2, 3]))).toEqual(new Set([1, 2, 3]))
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2]])
    expect(x |> add(new Map())).toEqual(x)
    expect(x |> add(new Map([['b', 3], ['c', 4]]))).toEqual(new Map([
      ['a', 1],
      ['b', 3],
      ['c', 4],
    ]))
  })

  test('Object', () => {
    let x = { a: 1, b: 2 }
    expect(x |> add({})).toEqual(x)
    expect(x |> add({ b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 })
  })
})

describe('sub', () => {
  test('Number', () => {
    let x = 1
    expect(x |> sub(0)).toBe(x)
    expect(x |> sub(1)).toBe(0)
  })

  test('String', () => {
    let x = 'test me'
    expect(x |> sub('')).toBe(x)
    expect(x |> sub('me')).toBe('test ')
  })

  test('Array', () => {
    let x = [1, 2, 3, 2]
    expect(x |> sub([])).toEqual(x)
    expect(x |> sub([2])).toEqual([1, 3])
  })

  test('Set', () => {
    let x = new Set([1, 2, 3])
    expect(x |> sub(new Set())).toEqual(x)
    expect(x |> sub(new Set([2]))).toEqual(new Set([1, 3]))
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2], ['c', 3]])
    expect(x |> sub(new Map())).toEqual(x)
    expect(x |> sub(new Map([['b', 10]]))).toEqual(x)
    expect(x |> sub(new Map([['b', 2]]))).toEqual(new Map([
      ['a', 1],
      ['c', 3],
    ]))
  })

  test('Object', () => {
    let x = { a: 1, b: 2, c: 3 }
    expect(x |> sub({})).toEqual(x)
    expect(x |> sub({ b: 10 })).toEqual(x)
    expect(x |> sub({ b: 2 })).toEqual({ a: 1, c: 3 })
  })
})

describe('mult', () => {
  test('Number', () => {
    let x = 2
    expect(x |> mult(1)).toBe(x)
    expect(x |> mult(2)).toBe(4)
  })

  test('String', () => {
    let x = 'test'
    expect(x |> mult('')).toBe('')
    expect(x |> mult('stem')).toBe('te')
    expect(x |> mult('best')).toBe('est')
  })

  test('Array', () => {
    let x = [1, 2, 3, 6, 3]
    expect(x |> mult([])).toEqual([])
    expect(x |> mult([4, 3, 2])).toEqual([2, 3, 3])
  })

  test('Set', () => {
    let x = new Set([1, 2, 3])
    expect(x |> mult(new Set())).toEqual(new Set())
    expect(x |> mult(new Set([2, 3, 4]))).toEqual(new Set([2, 3]))
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2], ['c', 3]])
    expect(x |> mult(new Map())).toEqual(new Map())
    expect(x |> mult(new Map([['b', 2], ['c', 3], ['c', 4]])))
      .toEqual(new Map([['b', 2], ['c', 3]]))
  })

  test('Object', () => {
    let x = { a: 1, b: 2, c: 3 }
    expect(x |> mult({})).toEqual({})
    expect(x |> mult({ b: 2, c: 3, d: 4 })).toEqual({ b: 2, c: 3 })
  })
})

describe('div', () => {
  test('Number', () => {
    let x = 4
    expect(x |> div(1)).toBe(x)
    expect(x |> div(2)).toBe(2)
    expect(x |> div(0)).toBe(Infinity)
  })

  test('String', () => {
    let x = 'test'
    expect(x |> div('test')).toBe('')
    expect(x |> div('best')).toBe('t')
  })

  test('Array', () => {
    let x = [1, 2, 3]
    expect(x |> div([])).toEqual(x)
    expect(x |> div([2, 3, 4])).toEqual([1, 4])
  })

  test('Set', () => {
    let x = new Set([1, 2, 3])
    expect(x |> div(new Set())).toEqual(x)
    expect(x |> div(new Set([2, 3, 4]))).toEqual(new Set([1, 4]))
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2]])
    expect(x |> div(new Map())).toEqual(x)
    expect(x |> div(new Map([['b', 2], ['c', 3]])))
      .toEqual(new Map([['a', 1], ['c', 3]]))
  })

  test('Object', () => {
    let x = {a: 1, b: 2}
    expect(x |> div({})).toEqual(x)
    expect(x |> div({b: 2, c: 3})).toEqual({a: 1, c: 3})
  })
})
