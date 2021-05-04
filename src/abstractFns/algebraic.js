import { createAbstractFn } from '../concreteFns/abstract'
import { match, opt } from '../concreteFns/patternMatching'
import { not } from './logical'
import { filter, includedIn } from './sequence'

// T -> T -> T
let add = createAbstractFn()
add.def(Number, (x, y) => x + y)
add.def(String, (x, y) => x + y)
add.def(Array, (x, y) => [...x, ...y])
add.def(Set, (x, y) => new Set([...x, ...y]))
add.def(Map, (x, y) => new Map([...x, ...y]))
add.def(Object, (x, y) => Object.assign({}, x, y))

// T -> T -> T
let sub = createAbstractFn()
sub.def(Number, (x, y) => x - y)
sub.def(String, (x, y) => x.replace(y, ''))
sub.def(Array, (x, y) => x |> filter(not(includedIn(y))))
sub.def(Set, (x, y) => x |> filter(not(includedIn(y))))
sub.def(Map, (x, y) => {
  let z = new Map()
  for (let [k, v] of x) {
    if (y.get(k) === v) continue
    z.set(k, v)
  }
  return z
})
sub.def(Object, (x, y) => {
  let z = {}
  for (let k in x) {
    if (!x.hasOwnProperty(k)) continue
    let v = x[k]
    if (v === y[k]) continue
    z[k] = x[k]
  }
  return z
})

// T -> T -> T
let mult = createAbstractFn()
mult.def(Number, (x, y) => x * y)
mult.def(String, (x, y) => {
  let lcs = ''
  let m = x.length
  let n = y.length
  let p = Array.from(new Array(m), () => new Array(n))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let c = x[i]
      let d = y[j]

      if (c !== d) continue

      p[i][j] = c

      if (i > 0 && j > 0 && x[i - 1] === y[j - 1]) {
        let cs = p[i][j] = p[i - 1][j - 1] + c
        if (cs.length > lcs.length) {
          lcs = cs
        }
      }
    }
  }

  return lcs
})
mult.def(Array, (x, y) => y |> match(
  opt(Number, () => {
    let out = []
    for (let i = 0; i < y; i++) out.push(...x)
    return out
  }),
  opt(Array, () => x |> filter(includedIn(y))),
))
mult.def(Set, (x, y) => x |> filter(includedIn(y)))
mult.def(Map, (x, y) => x |> filter(includedIn(y)))
mult.def(Object, (x, y) => x |> filter(includedIn(y)))

// T -> T -> T
let complement = (x, y) => {
  let xc = x |> filter(not(includedIn(y)))
  let yc = y |> filter(not(includedIn(x)))
  return xc |> add(yc)
}

// T -> T -> T
let div = createAbstractFn()
div.def(Number, (x, y) => x / y)
div.def(String, (x, y) => x |> sub(x |> mult(y)))
div.def(Array, complement)
div.def(Set, complement)
div.def(Map, complement)
div.def(Object, complement)

export {
  add,
  sub,
  mult,
  div,
}
