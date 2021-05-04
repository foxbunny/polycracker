import {eq, gt, gte, lt, lte, order, similarTo, weight} from './comparative'
import {Any} from '../constants/Any'

describe('weight', () => {
  test.each([
    ['', ''],
    ['abc', 'abc'],
    [[], 0],
    [[1, 2, 3], 3],
    [new Set(), 0],
    [new Set([1, 2]), 2],
    [new Map(), 0],
    [new Map([['a', 1], ['b', 2]]), 2],
    [{}, 0],
    [{a: 1, b: 2, c: 3}, 3],
    [new Date(Date.UTC(2021, 1, 1)), 1612137600000],
    [Error('OMG!'), 'OMG!']
  ])(
    'weight of %s is %s',
    (x, w) => {
      expect(weight(x)).toBe(w)
    }
  )
})

describe('lt', () => {
  test.each([
    ['a', 'b', true],
    ['b', 'a', false],
    ['a', 'a', false]
  ])(
    '%s is less than %s',
    (x, y, r) => {
      expect(x |> lt(y)).toBe(r)
    }
  )
})

describe('lte', () => {
  test.each([
    ['a', 'b', true],
    ['b', 'a', false],
    ['a', 'a', true]
  ])(
    '%s is less than %s',
    (x, y, r) => {
      expect(x |> lte(y)).toBe(r)
    }
  )
})

describe('gt', () => {
  test.each([
    ['b', 'a', true],
    ['a', 'b', false],
    ['a', 'a', false]
  ])(
    '%s is less than %s',
    (x, y, r) => {
      expect(x |> gt(y)).toBe(r)
    }
  )
})

describe('gt', () => {
  test.each([
    ['b', 'a', true],
    ['a', 'b', false],
    ['a', 'a', false]
  ])(
    '%s is less than %s',
    (x, y, r) => {
      expect(x |> gt(y)).toBe(r)
    }
  )
})

describe('gte', () => {
  test.each([
    ['b', 'a', true],
    ['a', 'b', false],
    ['a', 'a', true]
  ])(
    '%s is less than %s',
    (x, y, r) => {
      expect(x |> gte(y)).toBe(r)
    }
  )
})

describe('eq', () => {
  test.each([
    [null, null],
    [undefined, undefined],
    [1, 1],
    [0, 0],
    [true, true],
    [false, false],
    ['this', 'this'],
    [new Date(0), new Date(0)],
    [[1, 2, 3], [1, 2, 3]],
    [{ foo: 'bar', bar: 'baz' }, { foo: 'bar', bar: 'baz' }],
    [Error('test'), Error('test')],
  ])(
    '%s equals %s',
    (x, y) => {
      expect(x |> eq(y)).toBe(true)
    }
  )

  test.each([
    [null, undefined],
    [0, 'false'],
    [1, 2],
    ['this', 'that'],
    [{ foo: 'bar' }, { foo: 'bar', bar: 'baz' }],
    [[1, 2, 3], [1, 2]],
    [new Date(), {}],
    [Error('foo'), Error('bar')],
  ])(
    '%s does not equal %s',
    (x, y) => {
      expect(x |> eq(y)).toBe(false)
    }
  )
})

describe('similarTo', () => {
  test.each([
    [1, 1],
    ['aa', 'aa'],
    ['', ''],
    [null, null],
    [null, undefined],
    [{ foo: 'bar', bar: 'baz' }, { foo: 'bar', bar: 'baz' }],
    [{ foo: 'bar' }, { foo: 'bar', bar: 'baz' }],
    [{ foo: { bar: 'baz' } }, { foo: { bar: 'baz', baz: 'bam' } }],
    [{ foo: Any }, { foo: 'bar' }],
    [[1, 2], [1, 2, 3, 4]],
    [{ foo: [] }, { foo: [1, 2, 3] }],
    [Any, 1],
    [Any, 'string'],
    [Any, true],
    [Any, null],
    [Any, { foo: 'bar' }],
    [Any, new Date()],
  ])(
    '%s is similar to %s',
    (y, x) => {
      expect(x |> similarTo(x)).toBe(true)
      expect(x |> similarTo(y)).toBe(true)
    },
  )

  test.each([
    [1, 0],
    [true, false],
    ['', ','],
    [null, '1'],
    [{ foo: 'bar', bar: 'baz' }, { foo: 'bar' }],
    [[1, 2, 3, 4], [1, 2]],
    [[], 'string'],
  ])(
    '%s is not similar to %s',
    (y, x) => {
      expect(x |> similarTo(y)).toBe(false)
    },
  )
})

describe('order', () => {
  test.each([
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
    [[1], [1, 2], -1],
    [[1, 2], [1], 1],
    [[1, 2], [3, 4], 0],
  ])(
    '%s and %s are in order %s',
    (x, y, o) => {
      expect(x |> order(y)).toBe(o)
    }
  )
})
