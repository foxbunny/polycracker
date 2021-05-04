import { padl, zeroPad } from './string'

describe('padl', () => {
  test('pad a number', () => {
    expect(12 |> padl(2, '0')).toBe('12')
    expect(12 |> padl(6, '0')).toBe('000012')
    expect(12 |> padl(1, '0')).toBe('12')
  })
})

describe('zeroPad', () => {
  test('pad a number', () => {
    expect(12 |> zeroPad(2)).toBe('12')
    expect(12 |> zeroPad(6)).toBe('000012')
    expect(12 |> zeroPad(1)).toBe('12')
  })
})
