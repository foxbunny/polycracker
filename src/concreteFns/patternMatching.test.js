import { Any } from '../constants/Any'
import { Nothing, Some } from '../types/Maybe'
import { match, opt } from './patternMatching'

describe('match', () => {
  test('basic equality matching', () => {
    'test'
      |> match(
      opt('test', x => x + ' matches'),
      opt(Any, () => 'no match'),
    )
      |> (x => expect(x).toBe('test matches'))
  })

  test('catch-all', () => {
    'not test'
      |> match(
        opt('test', x => x + ' matches'),
        opt(Any, () => 'no match'),
      )
      |> (x => expect(x).toBe('no match'))
  })

  test('object pattern matching', () => {
    ({ data: [1, 2] })
      |> match(
        opt({ data: [] }, x => x.data),
        opt(Any, () => 'error'),
       )
      |> (x => expect(x).toEqual([1, 2]))
  })

  test.each([
    [1, 'number'],
    ['str', 'string'],
    [true, 'boolean'],
    [[1, 2], 'array'],
    [new Set([1, 2]), 'set'],
    [new Map([['a', 1]]), 'map'],
    [{ a: 1 }, 'object'],
    [Error('OMG'), 'error'],
    [new Date(), 'date'],
    [new Event('click'), 'something else'],
  ])(
    'match basic type of object like %s',
    (x, type) => {
      let whatType = match(
        opt(Number, () => 'number'),
        opt(String, () => 'string'),
        opt(Boolean, () => 'boolean'),
        opt(Array, () => 'array'),
        opt(Map, () => 'map'),
        opt(Set, () => 'set'),
        opt(Date, () => 'date'),
        opt(Object, () => 'object'),
        opt(Error, () => 'error'),
        opt(Date, () => 'date'),
        opt(Any, () => 'something else'),
      )

      expect(x |> whatType).toBe(type)
    },
  )

  test('typed pattern matching', () => {
    let whenData = match(
      opt(Some.of({ data: [] }), x => x.data[0]),
      opt(Some.of({ data: Any }), x => x.data),
      opt(Some, x => x + ' no data'),
      opt(Nothing, () => 'error'),
    )

    expect(
      Some.of({ data: [1, 2] })
        |> whenData,
    ).toBe(1)

    expect(
      Some.of({ data: 'test' })
        |> whenData,
    ).toBe('test')

    expect(
      Some.of('what')
        |> whenData,
    ).toBe('what no data')

    expect(
      Nothing
        |> whenData,
    ).toBe('error')
  })
})
