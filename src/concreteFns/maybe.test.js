import { Nothing, Some } from '../types/Maybe'
import { maybe, maybePass, maybeType, maybeVal } from './maybe'

describe('maybe', () => {
  test('switch on condition', () => {
    let f = maybe(x => x.startsWith('test'))
    expect(f('test me')).toEqualTyped(Some.of('test me'))
    expect(f('best me')).toEqualTyped(Nothing)
  })
})

describe('maybeType', () => {
  test.each([
    ['I am a string', String],
    [1, Number],
    [true, Boolean],
    [Error('I am a bug'), Error],
    [{}, Object],
    [new Date(), Date],
    [Some.of(10), Some],
  ])('test for type of value like %s', (x, type) => {
    expect(x |> maybeType(type)).toEqualTyped(Some.of(x))
  })

  test.each([
    ['I am a string', Object],
    [1, Array],
    [true, String],
    [Error('I am a bug'), Date],
    [{}, Boolean],
    [new Date(), null],
    [Some.of(10), Nothing],
  ])('test wrong type of a value like %s', (x, type) => {
    expect(x |> maybeType(type)).toBe(Nothing)
  })
})

describe('maybePass', () => {
  test('switch on Error type', () => {
    expect('value' |> maybePass).toEqualTyped(Some.of('value'))
    expect(Error('OMG') |> maybePass).toEqualTyped(Nothing)
  })
})

describe('maybeVal', () => {
  test.each([
    1,
    true,
    {},
    [1, 2],
    new Date,
    'test',
  ])(
    'test for value like %s',
    x => {
      expect(maybeVal(x)).toEqualTyped(Some.of(x))
    }
  )

  test.each([
    null,
    undefined,
  ])(
    'test for non-value like %s',
    x => {
      expect(maybeVal(x)).toEqualTyped(Nothing)
    }
  )
})
