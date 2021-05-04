import { Left, Right } from '../types/Either'
import { Nothing, Some } from '../types/Maybe'
import { either, eitherPass, eitherType, eitherVal } from './either'

describe('either', () => {
  test('switch on condition', () => {
    let f = either(x => x.startsWith('test'))
    expect(f('test me')).toEqualTyped(Right.of('test me'))
    expect(f('best me')).toEqualTyped(Left.of('best me'))
  })
})

describe('eitherType', () => {
  test.each([
    ['I am a string', String],
    [1, Number],
    [true, Boolean],
    [Error('I am a bug'), Error],
    [{}, Object],
    [new Date(), Date],
    [Some.of(10), Some],
  ])(
    'test for type of value like %s', (x, type) => {
      expect(x |> eitherType(type)).toEqualTyped(Right.of(x))
    }
  )

  test.each([
    ['I am a string', Object],
    [1, Array],
    [true, String],
    [Error('I am a bug'), Date],
    [{}, Boolean],
    [new Date(), null],
    [Some.of(10), Nothing],
  ])(
    'test wrong type of value like %s',
    (x, type) => {
      expect(x |> eitherType(type)).toEqualTyped(Left.of(x))
    }
  )
})

describe('eitherPass', () => {
  test('switch on Error type', () => {
    expect('value' |> eitherPass).toEqualTyped(Right.of('value'))
    expect(Error('OMG') |> eitherPass).toEqualTyped(Left.of(Error('OMG')))
  })
})

describe('eitherVal', () => {
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
      expect(eitherVal(x)).toEqualTyped(Right.of(x))
    }
  )

  test.each([
    null,
    undefined
  ])(
    'test for non-value like %s',
    x => {
      expect(eitherVal(x)).toEqualTyped(Left.of(x))
    }
  )
})
