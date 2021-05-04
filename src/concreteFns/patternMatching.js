import { similarTo } from '../abstractFns/comparative'
import { and, or } from '../abstractFns/logical'
import { Any } from '../constants/Any'
import { withValue } from './core'
import { isType, Type } from './type'

const opt = (pattern, f) => {
  if (pattern === Any) {
    return { matches: () => true, call: f }
  }

  if (Type.isPrototypeOf(pattern)) {
    if (pattern.hasOwnProperty('value')) {
      return {
        matches: (
          isType(Object.getPrototypeOf(pattern))
            |> and(withValue(similarTo(pattern.value)))
        ),
        call: withValue(f),
      }
    }

    return { matches: isType(pattern), call: withValue(f) }
  }

  return { matches: isType(pattern) |> or(similarTo(pattern)), call: f }
}

// [Any, f(T) -> U][] -> T -> U
let match = (...patterns) => {
  return x => {
    for (let { matches, call } of patterns) {
      if (matches(x)) return call(x)
    }

    throw Error(`No match for ${x} in ${patterns}`)
  }
}

export {
  match,
  opt,
}
