import { add } from '../abstractFns/algebraic'
import { repeat } from '../abstractFns/sequence'

let padl = (n, s) => x => {
  x = '' + x
  if (x.length >= n) {
    return x
  }
  let p = s |> repeat(n) |> add(x)
  return p.slice(p.length - n)
}

let zeroPad = (n = 2) => padl(n, '0')

export {
  padl,
  zeroPad,
}
