import { withValue, id, acc, uncurry, mapAcc, cond, val, meth, get, getFrom } from './core'

describe('id', () => {
  test.each([
    1,
    'str',
    null,
    false,
    new Date,
    [1, 2, 3],
    { foo: 'bar' },
  ])(
    'identity of %s',
    (x) => {
      expect(id(x)).toBe(x)
    },
  )
})

describe('byValue', () => {
  test('make function apply to value property', () => {
    let x = { value: 12 }
    let f = withValue(x => x * 2)
    expect(f(x)).toEqual(24)
  })
})

describe('acc', () => {
  test('crete an accumulator function', () => {
    let f = acc('', (x, y) => x + y)
    expect(f(1)).toBe('1')
    expect(f(2)).toBe('12')
    expect(f(3)).toBe('123')
    expect(f(4)).toBe('1234')
  })

  test('additional arguments', () => {
    let f = acc('', (x, y, i, o) => x + (o[i + 1] || ''))
    let x = 'shifted'
    let y
    let i = 0
    for (let c of x) {
      y = f(c, i++, x)
    }
    expect(y).toBe('hifted')
  })
})

describe('accMap', () => {
  test('create an accumulating mapper', () => {
    let f = mapAcc(32, (x, y) => [Math.floor(x / y), x % y])
    expect(f(12)).toBe(2)
    expect(f(6)).toBe(1)
    expect(f(2)).toBe(1)
  })
})

describe('uncurry', () => {
  test('uncurry a function', () => {
    let sub = y => x => x - y
    expect(4 |> sub(2)).toBe(2)
    expect(uncurry(sub)(4, 2)).toBe(2)
  })

  test('uncurry with variadic', () => {
    let surround = (prefix, suffix) => x => `${prefix}${x}${suffix}`
    expect('test' |> surround('(', ')')).toBe('(test)')
    expect(uncurry(surround)('test', '(', ')')).toBe('(test)')
  })
})

describe('cond', () => {
  test('Any', () => {
    let f = cond(id, x => x + ' is truthy', x => x + ' is falsy')
    expect(true |> f).toBe('true is truthy')
    expect(false |> f).toBe('false is falsy')
    expect(1 |> f).toBe('1 is truthy')
    expect(0 |> f).toBe('0 is falsy')
  })
})

describe('val', () => {
  test('always returns a specified value', () => {
    let valTest = val('test')
    expect(valTest()).toBe('test')
    expect(valTest()).toBe('test')
  })
})

describe('meth', () => {
  test('call a method', () => {
    let x = { foo () { return 'foo return value' }, bar (x) { return x + 1 } }
    expect(x |> meth('foo')).toBe('foo return value')
    expect(x |> meth('bar', 1)).toBe(2)
  })
})

describe('get', () => {
  test('get a property value', () => {
    let x = { foo: 1, bar: 2}
    expect(x |> get('foo')).toBe(1)
    expect(x |> get('bar')).toBe(2)
  })
})

describe('getFrom', () => {
  test('get a property from some object', () => {
    let x = { foo: 1, bar: 2}
    expect('foo' |> getFrom(x)).toBe(1)
    expect('bar' |> getFrom(x)).toBe(2)
  })
})
