import 'babel-polyfill'
import { eq } from '../abstractFns/comparative'
import { typeOf } from '../concreteFns/type'

expect.extend({
  toEqualTyped (x, y) {
    let pass = (
      typeOf(x) === typeOf(y)
      && x.value |> eq(y.value)
    )

    return {
      message: pass
        ? () => `expected ${x} not to equal ${y}`
        : () => `expected ${x} to equal ${y}`,
      pass,
    }
  },

  toBeOfType (received, proto, superProto) {
    let pass = Object.getPrototypeOf(received) === proto
      && proto.isPrototypeOf(received)
      && (superProto ? superProto.isPrototypeOf(received) : true)

    return {
      message: pass
        ? () => `expected ${x} not to be of type ${proto} (${superProto})`
        : () => `expected ${x} to be of type ${proto} (${superProto})`,
      pass,
    }
  },
})
