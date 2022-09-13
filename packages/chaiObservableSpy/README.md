# @maklja90/chaijs-rxjs-observable-spy

ChaiJS extension for testing RxJS observables

[![npm version](https://img.shields.io/npm/v/@maklja90/rxjs-observable-spy.svg?style=flat-square)](https://www.npmjs.org/package/@maklja90/rxjs-observable-spy)
[![release](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Installation

```console
yarn add -D @maklja90/chaijs-rxjs-observable-spy
```

or

```console
npm install -D @maklja90/chaijs-rxjs-observable-spy
```

<br/>

## What problem this library is trying to solve?

To read more about the problem this library solves visit the following [link](https://www.npmjs.com/package/@maklja90/rxjs-observable-spy).
<br/>
This library extends the ChaiJS language with support for testing RxJS observables.

# Usage

## Typescript

This library is fully covered with types and most of the methods can accept generics in order to
define what values will be received or what error is expected to be thrown.
This library also packs types that extend the ChaiJS language chain.

## Setup ChaiJS plugin

Before using the library features it is required to register a plugin with a ChaiJS.

```js
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '@maklja90/chaijs-rxjs-observable-spy';

chai.use(createChaiObservableSpyPlugin());
```

## Language use cases

Library offers an `emit` or `observableSpy` keywords to indicate that the value that is tested is observable and to access the rest of language chains.
<br />
<br />

### next, nextCount, nextMatches and nextMatchesUntil keywords

Keyword `next` indicates the next value that will be received from observable, note that order here matters. Keyword `next` is doing deep equals of received value and expected value.

```js
it('should receive strings in expected order with the complete event', async () => {
  const string$ = of('Tom', 'Tina', 'Ana');

  // verify complete will return Promise that will resolve with
  // received values from observable
  const values = await expect(string$)
    // alternative to 'emit' is to use word 'observableSpy'
    .emit.next('Tom')
    .next('Tina')
    .next('Ana')
    // start a verification and
    // expect to observable ends with complete event
    // alternative is to call complete and then verify
    .verifyComplete();

  expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
});
```

Keyword `nextCount` should be used to count values without actually checking their value.

```ts
it('should receive proper values count', async () => {
  const string$ = of('Tom', 'Ana');

  // expect to receive 2 values and then complete the event
  const values = await expect(string$).emit.nextCount(2).verifyComplete();
  expect(values).to.deep.equals(['Tom', 'Ana']);
});
```

Keyword `nextMatches` should be used to create a validation condition for value that will yield
a true or false value depending if the value is valid or not. This keyword is useful if you are using a third party assertion library or custom made assertion functions.

```ts
it('should next value match a condition', async () => {
  const numbers$ = of(2, 2, 3);

  // assert that verifies a value
  // if false is returned the assertion inside a library will throw an error
  const customAssertation = (val: number): boolean => val > 1;

  const values = await expect(numbers$)
    .emit.nextMatches(customAssertation)
    .nextMatches(customAssertation)
    .nextMatches(customAssertation)
    .verifyComplete();

  expect(values).to.deep.equals([2, 2, 3]);
});
```

Keyword `nextMatchesUntil` is similar to the `nextMatches` keyword, the difference is only that this keyword has an additional condition that determines when the current verification step is over.

```ts
it('should next value match a condition until', async () => {
  const sourceNumbers = [2, 2, 3];
  const numbers$ = from(sourceNumbers);

  // assert that verifies a value
  // if false is returned the assertion inside a library will throw an error
  const conditionMatch = (val: number): boolean => val > 1;

  const values = await expect(numbers$)
    .emit.nextMatchesUntil<number>(
      conditionMatch,
      // condition that indicates if the current verification step is over
      (_, index) => index < sourceNumbers.length - 1,
    )
    .verifyComplete();

  expect(values).to.deep.equals([2, 2, 3]);
});
```

### consumeNext and consumeNextUntil keywords

Keyword `consumeNext` can be used to just "consume" a value and if required to do required operations on received values.

```ts
it('should consume next value', async () => {
  const numbers$ = of(2, 2, 3);

  // if you are using typescript you can specify generic types '<number>'
  const values = await expect(numbers$)
    .emit.consumeNext<number>((val) =>
      expect(val).to.be.a('number').and.to.be.equal(2),
    )
    .consumeNext<number>((val) =>
      expect(val).to.be.a('number').and.to.be.equal(2),
    )
    .consumeNext<number>((val) =>
      expect(val).to.be.a('number').and.to.be.equal(3),
    )
    .verifyComplete();

  expect(values).to.deep.equals([2, 2, 3]);
});
```

Similar to the keyword `consumeNext` the keyword `consumeNextUntil` will verify values until callback does not return falsy value.

```ts
it('should consume next value until satisfies condition', async () => {
  const sourceValues = [2, 2, 3];
  const numbers$ = from(sourceValues);

  const values = await expect(numbers$)
    .emit.consumeNextUntil<number>((val, index) => {
      expect(val).to.be.a('number').and.to.be.equal(sourceValues[index]);
      // if true is returned the verification step is still not over,
      // otherwise the next verification step will start with execution
      return index < 2;
    })
    .verifyComplete();

  expect(values).to.deep.equals([2, 2, 3]);
});
```

### skipCount keyword

Keyword `skipCount` can be used to skip N next values.

```ts
it('should skip values', async () => {
  const string$ = of('Tom', 'Ana', 'John');

  const values = await expect(string$)
    .emit.skipCount(2) // skip next 2 values
    .next('John')
    .verifyComplete();

  expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
});
```

### error, errorType and errorMessage keywords

Keywords `error`, `errorType` and `errorMessage` should be used when handling errors from observables.
Note that here we are using only the keyword `verify` to indicate that verification should start, but that complete event is not expected to be received from the tested observable.

```ts
it('should catch an error from observable', async () => {
  const error$ = throwError(() => new Error('Upss'));

  await expect(error$).emit.error(Error, 'Upss').verify();
  await expect(error$).emit.errorType(Error).verify();
  await expect(error$).emit.errorMessage('Upss').verify();
});
```

### verify, complete, verifyComplete and awaitComplete keywords

Keyword `verify` is always used after keywords `error`, `errorType`, `errorMessage` or `complete` and its purpose is to subscribe observable spy to the tested observable and start testing received values or errors.
<br />
Keyword `verifyComplete` is used as a shortcut of two keywords `complete` and `verify` and indicates that the observable should end up with a complete event and that verification of the observable should start.
<br />
Keyword `awaitComplete` will just wait for a complete event from the observable and ignore all next values received from it.
Useful when it is required to just verify that an observable ends with a completed event without bothering about the values that are sent from it.

## Forgot to call verify keyword

In case we forgot to call the `verify` keyword the tests will look like they are passing. The reason for this is simple: without a call to the `verify` the observable spy does not subscribe to the tested observable and in that case there is nothing received from the observable and so nothing to test.
<br />
Library has a safe guard that will throw an error if some language chain ends without proper `verify` keyword end.

```ts
it('verify is not call at the end', async () => {
  const string$ = from(['Tom', 'Ana']);

  // there is no call to verify or verifyComplete
  // because of this spy will not be subscribed
  // to tested string$ observable, as result the error will be thrown
  // AssertionError: You need to invoke verify, verifyComplete or awaitComplete in order to subscribe to observable
  expect(string$).emit.next('Tom').next('Tina').next('Ana');
});
```

Under a hood the library awaits 2 seconds to test call verify keyword, if in that time window the verify method is not called the error is thrown. It is possible to configure time on the plugin, also it is possible to to disable this behavior if required.

```ts
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '@maklja90/chaijs-rxjs-observable-spy';

chai.use(
  // pass configuration to the plugin
  createChaiObservableSpyPlugin({
    forgottenSubscriptionError: true,
    forgottenSubscriptionTimeout: 2_000, // ms
  }),
);
```

## ChaiJS should assertion type

This library also extends ChaiJS's assertion style of writing tests.

```ts
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '@maklja90/chaijs-rxjs-observable-spy';
// other RxJS imports

chai.should();

chai.use(createChaiObservableSpyPlugin());

it('should receive all values in proper order', async () => {
  const string$ = from(['Tom', 'Tina', 'Ana']);

  const values = await string$.should.emit
    .next('Tom')
    .next('Tina')
    .next('Ana')
    .verifyComplete<string>();

  values.should.be.deep.equals(['Tom', 'Tina', 'Ana']);
});
```

## License

MIT

