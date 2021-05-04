// T -> T
let id = x => x

// (f(T) -> U) -> O.value(T) -> U
let withValue = f => x => f(x.value)

// (T, (T, U, Any...) -> V) -> (U, Any...) -> V
let acc = (acc, f) => (x, ...args) => acc = f(acc, x, ...args)

// (T, (T, U, Any...) -> [T, V]) -> (U, ...Any) -> V
let mapAcc = (acc, f) => (x, ...args) => ([x, acc] = f(acc, x, ...args), x)

// (T... -> U -> S) -> ((U, T...) -> S)
let uncurry = f => (x, ...args) => f(...args)(x)

// (T -> Boolean, T -> U, T -> U) -> T -> U
let cond = (f, g, h) => x => f(x) ? g(x) : h(x)

export {
  id,
  withValue,
  acc,
  mapAcc,
  uncurry,
  cond,
}
