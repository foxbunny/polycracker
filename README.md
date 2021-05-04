# PolyCracker

Another JavaScript library for functional programming. The name of the library
is a pun on the phrase "Poly wants a cracker?", which was first used in salt
cracker commercial in the late 19th century. It named that way because this was
the first time its author manged to crack ad-hoc polymorphism in JavaScript in a
satisfactory way.

**NB:** In this README, we'll refer to the library as just 'poly' for brevity.

## In this README

<!-- vim-markdown-toc GFM -->

* [Why it's so cool](#why-its-so-cool)
* [Introduction to ad-hoc polymorphism](#introduction-to-ad-hoc-polymorphism)
  * [Curried functions](#curried-functions)
  * [Benefits of polymorphism](#benefits-of-polymorphism)
* [Monads](#monads)

<!-- vim-markdown-toc -->

## Why it's so cool

This library is designed to support ad-hoc polymorphism similar
to [type classes](https://en.wikipedia.org/wiki/Type_class) in languages that
has them (e.g., Haskell). This is achieved by the so-called 'abstract functions'
which can be overloaded at will based on the type of the argument (in some
languages this is called
[multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch)).

Many of the functions in this library are abstract, and we are thus able to
define new behavior for each of them in our application code. We can even
redefine the behavior of the existing definitions. This gives us a powerful tool
to create solutions that are loosely coupled and, thus easy to modify.

## Introduction to ad-hoc polymorphism

Let's define a type, TimeRange, which represents a range of time between start
and end. We can use classes to define types, and that works fine with poly.
However, "types" in this context are not really classes, so you don't have to
use them.

```javascript
import { Type, createType } from 'polycracker'

let TimeRange = createType(Type, 'TimeRange')
```

There we go, that's our type. Every type defined using `createType` as a base
type (prototype) and a name. The name is optional, but it is useful for
debugging, so it is recommended to set it. Poly offers a `Type` object which can
be used as a base type if you don't have your own base type.

**NOTE:** A custom base type is useful if we want to group multiple Types
together so that they can be type-checked as a group. We won't go into that
right now.

Objects of the newly created type can be created using the `of()` function on
the type:

```javascript
let t = TimeRange.of([new Date(0), new Date()])
```

Anything you pass to the `of()` function becomes the value of the object. This
value is accessed through the `value` property.

```javascript
t.value // => [new Date(0), new Date()]
```

We use types to identify the kind of value we are working with. This is used to
define or redefine behaviors of various abstract functions.

As an exercise, lets define the behavior of `includes` abstract function to test
whether some `Date` object falls into the range.

```javascript
import { includes } from 'polycracker'

includes.define(TimeRange, (x, t) => 
  x.value[0] <= t && x.value[1] >= t
)
```

In this example, we have defined the behavior of the `includes()` for the
`TimeRange` type such that it receives a `Date` object, and tests whether the
specified object is between the start and end time.

We can now use the includes to test this:

```javascript
let t1 = TimeRange.of([new Date(2021, 2, 20), new Date(2021, 4, 20)])

t1 |> includes(new Date(2021, 3, 20))  // => true
t1 |> includes(new Date(2021, 1, 20))  // => false
```

**NB:** The pipeline operator (`|>`) is a EcmaScript proposal. If you want to
use it (and poly works fantastically with it), you need the
[babel-plugin-proposal-pipeline-operator](https://babeljs.io/docs/en/babel-plugin-proposal-pipeline-operator)
plugin.

### Curried functions

Let's see the above example once more without the pipeline operator so that we
can get an intuition for how functions in poly work:

```javascript
includes(new Date(2021, 3, 20))(t1)  // => true
includes(new Date(2021, 1, 20))(t1)  // => false
```

Most functions in poly are curried. This means that they do not take all of
their arguments at once, but instead take arguments in groups. In fact, they
take arguments in two groups. The first group of arguments are called
'parameters', and the second group is normally a single argument, which we call
the 'subject'. Parameters supply additional information for the function to
perform a task, and the subject is the value on which the task is performed.
When the parameters are passed to the function, another function is returned
which takes the subject and performs the task. The last example can be rewritten
like this to make this clearer:

```javascript
let includesMar20 = includes(new Date(2021, 3, 20))
includesMar20(t1)  // => true
```

At first glance, it may feel awkward to do multiple separate calls when we 
could simply write a function that could be written to take them both in one 
go. This has to do with the general style of writing code that leaves off 
the subject to construct pipelines through which the subject is later pushed 
through. Something like this:

```javascript
import { maybe, map, match, opt, Some, Nothing } = 'polycracker'

let setProp = (prop, value) => node => {
  node[prop] = value
  return node
}

let setHTMl = html => node => { 
  node.innerHTML = html
  return node
}

let renderPage = (id, content) => document.createElement(div)
  |> setProp('id', id)
  |> setProp('className', id)
  |> setHTML('<div>' + content + '</div>')
  
let renderHome = () => renderPage('home', 'Home')
let renderAbout = () => renderPage('about', 'About')
let render404 = () => renderPage('missing', '404: not found')

let replaceContent = node => replacement => {
  node.innerHTML = ''
  node.appendChild(replacement)
  return node
}

let maybeNonEmpty = maybe(x => x !== '')

maybeNonEmpty(window.location.hash)
  |> match(
       opt(Some.of('home'),  renderHome),
       opt(Some.of('about'), renderAbout),
       opt(Nothing,          render404)
     ))
  |> replaceContent(document.body)
```

By using currying, we are able to achieve a concise writing style which 
focuses on what matters in our program.

### Benefits of polymorphism

What do we gain by using polymorphism?

In short, we gain the ability to use the same functions across different types
(including JavaScript classes). Since types are decoupled from the functions, in
a way, we make types interchangeable. In a function that uses the
`includes()` function, we are able to accept any type for which the behavior
of `includes()` is defined. This makes the code (arguably) easier and safer to
modify.

We'll see more examples of this later.

## Monads

It would be a shame to have a functional programming library without some
monads. Poly ships with a few monads. They achieve their goal using the same
mechanism as we've seen in the introduction: by using two abstract
functions `map()` and `flatMap()`.

Let's take a look at a few examples using the built-in `Maybe` monad.

The `Maybe` monad is used to express a nullable value. We say `Maybe` monad, but
it's really two types, `Some` and `Nothing`, which represent presence of, and
absence of value, respectively. Both of these type have defined behavior for
the `map()` and `flatMap()` functions, but the behaviors differ slightly. For
the `Some` type, `map()` and `flatMap()` will perform the specified operation on
the value, while the operations are simply ignored for
`Nothing`. Let's see this in action:

```javascript
import { maybeType, map } from 'polycracker'

let maybeDate = maybeType(Date)
let formatDate = d => d 
  |> maybeDate 
  |> map(d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)
  
formatDate(new Date(2021, 2, 1)) // => Some.of('2021-3-1')
formatDate(123) // => Nothing
```

The `maybeType()` function takes a constructor or a prototype, and returns a
function that will return `Some` for any value that matches the specified type,
or `Nothing` for values that do not. In our case, we match objects that are
of `Date` type.

In the `formatDate()` function, we map over the `Some`'s value to format the
date contained therein, while ignoring the `Nothing` value. When we map over a
monad, we get a monad of the same type (`Some` or `Nothing`), so the end result
is a `Some` whose value is the formatted date, or a `Nothing` (which has no
value).

Notice how we did not have to worry whether the input to the `map()` is a
`Something` or a `Nothing`? This is what polymorphism is all about.

The `formatDate()` function returns a `Maybe` monad, but we eventually want a
string. To get that string, we have a few options.

The first option is to use `map()`. Let's say we want to insert the string into
a DOM node, but we only want to do that if we have a valid formatted string:

```javascript
formatDate(new Date(2021, 2, 1)) 
  |> map(s => document.querySelector('.date').innerText = s)
```

What if we want to supply a default? We can either use a `flatMap` in that case,
or we can use pattern matching. Let's see the `flatMap` option first:

```javascript
formatDate(new Date(2021, 2, 1))
  |> flatMap(s => document.querySelector('.date').innerText = s || 'no date')
```

When using `flatMap()`, the argument to the callback will always be
`undefined` for the `Nothing` monad.

Pattern matching lets us define behaviors separately for each type:

```javascript
import { match } from 'polycracker'

formatDate(new Date(2021, 2, 1)) |> match(
  opt(Some, s => document.querySelector('.date').innerText = s),
  opt(Nothing, () => document.querySelector('.date').innerText = 'no date')
)
```
