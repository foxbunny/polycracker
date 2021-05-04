import * as fpjs from './index'

describe('polycracker', () => {
  test('has the right exports', () => {
    expect(Object.keys(fpjs)).toMatchSnapshot()
  })
})
