import { uncurry } from '../concreteFns/core'
import { isType, Type } from '../concreteFns/type'
import { Iterable } from '../types/Iterable'
import { eq, order } from './comparative'
import { iterable } from './iterable'
import {
  append,
  appendTo,
  empty,
  endsWith,
  every,
  filter,
  first,
  includedIn,
  includes,
  last,
  len, repeat,
  slice,
  some,
  sort,
  startsWith,
  tail,
  zip,
} from './sequence'

describe('first', () => {
  test('String', () => {
    expect('test me' |> first).toBe('t')
    expect('me test' |> first).toBe('m')
  })

  test('Array', () => {
    expect(['test', 'me'] |> first).toBe('test')
    expect(['me', 'test'] |> first).toBe('me')
  })
})

describe('last', () => {
  test('String', () => {
    expect('test me' |> last).toBe('e')
    expect('me test' |> last).toBe('t')
  })

  test('Array', () => {
    expect(['test', 'me'] |> last).toBe('me')
    expect(['me', 'test'] |> last).toBe('test')
  })
})

describe('slice', () => {
  test('String', () => {
    expect('test me' |> slice(2)).toBe('st me')
    expect('me test' |> slice(2)).toBe(' test')
  })

  test('Array', () => {
    expect(['test', 'me'] |> slice(1)).toEqual(['me'])
    expect(['me', 'test'] |> slice(1)).toEqual(['test'])
  })
})

describe('tail', () => {
  test('String', () => {
    expect('test me' |> tail).toBe('est me')
    expect('me test' |> tail).toBe('e test')
  })

  test('Array', () => {
    expect(['test', 'me'] |> tail).toEqual(['me'])
    expect(['me', 'test'] |> tail).toEqual(['test'])
  })
})

describe('startswith', () => {
  test('String', () => {
    expect('test me' |> startsWith('test')).toBe(true)
    expect('me test' |> startsWith('test')).toBe(false)
  })

  test('Array', () => {
    expect(['test', 'me'] |> startsWith('test')).toBe(true)
    expect(['me', 'test'] |> startsWith('test')).toBe(false)
  })
})

describe('endsWith', () => {
  test('String', () => {
    expect('test me' |> endsWith('me')).toBe(true)
    expect('me test' |> endsWith('me')).toBe(false)
  })

  test('Array', () => {
    expect(['test', 'me'] |> endsWith('me')).toBe(true)
    expect(['me', 'test'] |> endsWith('me')).toBe(false)
  })
})

describe('includes', () => {
  test('String', () => {
    expect('test me' |> includes('test')).toBe(true)
    expect('best me' |> includes('test')).toBe(false)
  })

  test('Array', () => {
    expect(['test', 'me'] |> includes('test')).toBe(true)
    expect(['best', 'me'] |> includes('test')).toBe(false)
  })

  test('Set', () => {
    expect(new Set(['test', 'me']) |> includes('test')).toBe(true)
    expect(new Set(['best', 'me']) |> includes('test')).toBe(false)
  })

  test('Map', () => {
    expect(new Map([['test', 1], ['me', 2]]) |> includes('test')).toBe(true)
    expect(new Map([['best', 1], ['me', 2]]) |> includes('test')).toBe(false)
  })

  test('Object', () => {
    expect({ test: 1, me: 2 } |> includes('test')).toBe(true)
    expect({ best: 1, me: 2 } |> includes('test')).toBe(false)
  })
})

describe('includedIn', () => {
  test('String', () => {
    expect('test' |> includedIn('test me')).toBe(true)
    expect('test' |> includedIn('best me')).toBe(false)
  })

  test('Array', () => {
    expect('test' |> includedIn(['test', 'me'])).toBe(true)
    expect('test' |> includedIn(['best', 'me'])).toBe(false)
  })

  test('Set', () => {
    expect('test' |> includedIn(new Set(['test', 'me']))).toBe(true)
    expect('test' |> includedIn(new Set(['best', 'me']))).toBe(false)
  })

  test('Map', () => {
    expect('test' |> includedIn(new Map([['test', 1], ['me', 2]]))).toBe(true)
    expect('test' |> includedIn(new Map([['best', 1], ['me', 2]]))).toBe(false)
  })

  test('Object', () => {
    expect('test' |> includedIn({ test: 1, me: 2 })).toBe(true)
    expect('test' |> includedIn({ best: 1, me: 2 })).toBe(false)
  })
})

describe('filter', () => {
  test('String', () => {
    let x = 'little teapot'
    let isVoewel = jest.fn(c => 'aeiou'.includes(c))
    expect(x |> filter(isVoewel)).toBe('ieeao')
    expect(isVoewel.mock.calls).toEqual([
      ['l', 0, x],
      ['i', 1, x],
      ['t', 2, x],
      ['t', 3, x],
      ['l', 4, x],
      ['e', 5, x],
      [' ', 6, x],
      ['t', 7, x],
      ['e', 8, x],
      ['a', 9, x],
      ['p', 10, x],
      ['o', 11, x],
      ['t', 12, x],
    ])
  })

  test('Array', () => {
    let x = [1, 2, 3, 4]
    let isOdd = jest.fn(x => x % 2)
    expect(x |> filter(isOdd)).toEqual([1, 3])
    expect(isOdd.mock.calls).toEqual([
      [1, 0, x],
      [2, 1, x],
      [3, 2, x],
      [4, 3, x],
    ])
  })

  test('Set', () => {
    let x = new Set([1, 2, 3, 4])
    let isOdd = jest.fn(x => x % 2)
    expect(x |> filter(isOdd)).toEqual(new Set([1, 3]))
    expect(isOdd.mock.calls).toEqual([
      [1, 0, x],
      [2, 1, x],
      [3, 2, x],
      [4, 3, x],
    ])
  })

  test('Map', () => {
    let x = new Map([['a', 1], ['b', 2], ['c', 3]])
    let isOdd = jest.fn((_, x) => x % 2)
    expect(x |> filter(isOdd)).toEqual(new Map([['a', 1], ['c', 3]]))
    expect(isOdd.mock.calls).toEqual([
      ['a', 1, x],
      ['b', 2, x],
      ['c', 3, x],
    ])
  })

  test('Object', () => {
    let x = { a: 1, b: 2, c: 3 }
    let isOdd = jest.fn((_, x) => x % 2)
    expect(x |> filter(isOdd)).toEqual({ a: 1, c: 3 })
    expect(isOdd.mock.calls).toEqual([
      ['a', 1, x],
      ['b', 2, x],
      ['c', 3, x],
    ])
  })

  test('Iterable', () => {
    let i = iterable([1, 2, 3])
    const x = i |> filter(x => x % 2)
    expect(Array.from(x.value)).toEqual([1, 3])
  })
})

describe('len', () => {
  test('String', () => {
    expect('abc' |> len).toBe(3)
    expect('' |> len).toBe(0)
  })

  test('Array', () => {
    expect([1, 2, 3] |> len).toBe(3)
    expect([] |> len).toBe(0)
  })

  test('Set', () => {
    expect(new Set([1, 2, 3]) |> len).toBe(3)
    expect(new Set([]) |> len).toBe(0)
  })

  test('Map', () => {
    expect(new Map([['a', 1], ['b', 2], ['c', 3]]) |> len).toBe(3)
    expect(new Map([]) |> len).toBe(0)
  })

  test('Object', () => {
    expect({ a: 1, b: 2, c: 3 } |> len).toBe(3)
    expect({} |> len).toBe(0)
  })
})

describe('empty', () => {
  test('String', () => {
    expect('abc' |> empty).toBe(false)
    expect('' |> empty).toBe(true)
  })

  test('Array', () => {
    expect([1, 2, 3] |> empty).toBe(false)
    expect([] |> empty).toBe(true)
  })

  test('Set', () => {
    expect(new Set([1, 2, 3]) |> empty).toBe(false)
    expect(new Set([]) |> empty).toBe(true)
  })

  test('Map', () => {
    expect(new Map([['a', 1], ['b', 2], ['c', 3]]) |> empty).toBe(false)
    expect(new Map([]) |> empty).toBe(true)
  })

  test('Object', () => {
    expect({ a: 1, b: 2, c: 3 } |> empty).toBe(false)
    expect({} |> empty).toBe(true)
  })
})

describe('every', () => {
  test('String', () => {
    let f = every(x => x |> eq(x.toLowerCase()))
    expect('abc' |> f).toBe(true)
    expect('Abc' |> f).toBe(false)
  })

  test('Array', () => {
    let f = every(x => x % 2 |> eq(0))
    expect([2, 4, 6] |> f).toBe(true)
    expect([2, 3, 4] |> f).toBe(false)
  })

  test('Set', () => {
    let f = every(x => x % 2 |> eq(0))
    expect(new Set([2, 4, 6]) |> f).toBe(true)
    expect(new Set([2, 3, 4]) |> f).toBe(false)
  })

  test('Map', () => {
    let f = every(([_, x]) => x % 2 |> eq(0))
    expect(new Map([['a', 2], ['b', 4], ['c', 6]]) |> f).toBe(true)
    expect(new Map([['a', 2], ['b', 3], ['c', 4]]) |> f).toBe(false)
  })

  test('Object', () => {
    let f = every(([_, x]) => x % 2 |> eq(0))
    expect({ a: 2, b: 4, c: 6 } |> f).toBe(true)
    expect({ a: 2, b: 3, c: 4 } |> f).toBe(false)
  })

  test('Iterable', () => {
    let f = every(isType(Number))
    expect(iterable([1, 2, 3]) |> f).toBe(true)
    expect(iterable([1, 2, '3']) |> f).toBe(false)
  })
})

describe('Some', () => {
  test('String', () => {
    let f = some(x => x |> eq(x.toLowerCase()))
    expect('Abc' |> f).toBe(true)
    expect('ABC' |> f).toBe(false)
  })

  test('Array', () => {
    let f = some(x => x % 2 |> eq(0))
    expect([1, 2, 3] |> f).toBe(true)
    expect([1, 3, 5] |> f).toBe(false)
  })

  test('Set', () => {
    let f = some(x => x % 2 |> eq(0))
    expect(new Set([1, 2, 3]) |> f).toBe(true)
    expect(new Set([1, 3, 5]) |> f).toBe(false)
  })

  test('Map', () => {
    let f = some(([_, x]) => x % 2 |> eq(0))
    expect(new Map([['a', 1], ['b', 2], ['c', 3]]) |> f).toBe(true)
    expect(new Map([['a', 1], ['b', 3], ['c', 5]]) |> f).toBe(false)
  })

  test('Object', () => {
    let f = some(([_, x]) => x % 2 |> eq(0))
    expect({ a: 1, b: 2, c: 3 } |> f).toBe(true)
    expect({ a: 1, b: 3, c: 5 } |> f).toBe(false)
  })

  test('Iterable', () => {
    let f = some(isType(Number))
    expect(iterable(['1', '2', 3]) |> f).toBe(true)
    expect(iterable(['1', '2', '3']) |> f).toBe(false)
  })
})

describe('sort', () => {
  test('String', () => {
    expect('zta' |> sort(uncurry(order))).toEqual('atz')
  })

  test('Array', () => {
    expect([3, 2, 1] |> sort(uncurry(order))).toEqual([1, 2, 3])
  })
})

describe('append', () => {
  test('String', () => {
    let x = 'test'
    expect(x |> append('')).toBe(x)
    expect(x |> append(' me')).toBe('test me')
  })

  test('Array', () => {
    expect([1, 2] |> append(3)).toEqual([1, 2, 3])
  })

  test('Set', () => {
    expect(new Set([1, 2]) |> append(3)).toEqual(new Set([1, 2, 3]))
    expect(new Set([1, 2]) |> append(2)).toEqual(new Set([1, 2]))
  })

  test('Map', () => {
    expect(new Map([['a', 1]]) |> append(['b', 2]))
      .toEqual(new Map([['a', 1], ['b', 2]]))
  })

  test('Object', () => {
    expect({ a: 1 } |> append(['b', 2])).toEqual({ a: 1, b: 2 })
  })
})

describe('appendTo', () => {
  test('String', () => {
    let x = ' me'
    expect(x |> appendTo('')).toBe(x)
    expect(x |> appendTo('test')).toBe('test me')
  })

  test('Array', () => {
    let x = 1
    expect(x |> appendTo([])).toEqual([1])
    expect(x |> appendTo([1, 2])).toEqual([1, 2, 1])
  })

  test('Set', () => {
    let x = 1
    expect(x |> appendTo(new Set())).toEqual(new Set([1]))
    expect(x |> appendTo(new Set([1, 2]))).toEqual(new Set([1, 2]))
  })

  test('Map', () => {
    let x = ['a', 1]
    expect(x |> appendTo(new Map())).toEqual(new Map([['a', 1]]))
    expect(x |> appendTo(new Map([['b', 2]])))
      .toEqual(new Map([['b', 2], ['a', 1]]))
  })
})

describe('zip', () => {
  test('String', () => {
    let x = 'abc'
    let y = 'def'
    let i = x |> zip(y)
    expect(i).toBeOfType(Iterable, Type)
    expect(Array.from(i.value)).toEqual([['a', 'd'], ['b', 'e'], ['c', 'f']])
  })

  test('Array', () => {
    let x = [1, 2, 3]
    let y = ['a', 'b', 'c']
    let i = x |> zip(y)
    expect(i).toBeOfType(Iterable, Type)
    expect(Array.from(i.value)).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
  })

  test('Iterable', () => {
    let i = iterable([1, 2, 3])
    let i2 = iterable(['a', 'b', 'c'])
    const x = i |> zip(i2)
    expect(Array.from(x.value)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  })
})

describe('repeat', () => {
  test('String', () => {
    expect('' |> repeat(2)).toBe('')
    expect('test' |> repeat(2)).toBe('testtest')
  })

  test('Array', () => {
    expect([] |> repeat(2)).toEqual([])
    expect([1, 2] |> repeat(2)).toEqual([1, 2, 1, 2])
  })
})
