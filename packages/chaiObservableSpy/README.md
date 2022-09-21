# @maklja90/chaijs-rxjs-observable-spy

ChaiJS extension for testing RxJS observables

[![npm version](https://img.shields.io/npm/v/@maklja90/chaijs-rxjs-observable-spy.svg?style=flat-square)](https://www.npmjs.org/package/@maklja90/rxjs-observable-spy)
[![release](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/maklja/rxjs-observable-spy/branch/master/graph/badge.svg?token=0N9BOURO5J&flag=chaijs-observable-spy)](https://codecov.io/gh/maklja/rxjs-observable-spy)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
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
Library contains source maps, so it is possible to debug a library from tests.

## Browsers

Library transpile to ES5 and should work in all browsers that support that version of javascript.

## Setup ChaiJS plugin

Before using the library features it is required to register a plugin with a ChaiJS.

```js
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '@maklja90/chaijs-rxjs-observable-spy';

chai.use(createChaiObservableSpyPlugin());
```

Using CommonJS:

```js
const chai = require('chai');
const {
  createChaiObservableSpyPlugin,
} = require('@maklja90/chaijs-rxjs-observable-spy');
```

If you are using the **mocha** test framework with NodeJS, you could use the `register` function to set up a plugin before tests start execution.

```console
mocha --require @maklja90/chaijs-rxjs-observable-spy/register ./src/**/*.spec.js
```

## Language use cases

Library offers an `emit`, `observableSpy` or `oSpy` keywords to indicate that the value that is tested is observable and to access the rest of language chains.
<br />
`observableSpy`, or short `oSpy`, is a function that can receive a name of the tested observable. This name will be printed out in the error messages that occur in tests and this can be helpful when debugging tests. Alternatively if this is not important to you you can use property `emit` instead.

```ts
it('should allow observableSpy to accept name argument', async () => {
  const strings$ = of('Tom', 'Tina', 'Ana');

  // will fail with an error that has observable name in the message
  // [next(stringsObservable)] - expected next value: John, actual value Tina
  await expect(strings$)
    // short name is oSpy
    .observableSpy('stringsObservable')
    .next('Tom')
    .next('John') // expected values is 'John', but value 'Tina' is received
    .next('Ana')
    .verifyComplete();
});
```

<br />

### next, nextCount, nextMatches and nextMatchesUntil keywords

Keyword `next` indicates the next value that will be received from observable, note that order here matters. Keyword `next` is doing deep equals of received value and expected value.

```js
it('should receive ordered strings with the complete event', async () => {
  const strings$ = of('Tom', 'Tina', 'Ana');

  // verifyComplete will return Promise that will resolve with
  // received values from observable
  const values = await expect(strings$)
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

Keyword `nextCount` should be used to count values without actually checking their value. **Note** that this keyword expects to receive an complete event and because of that we are using `verify` instead of `verifyComplete` keyword.

```ts
it('should receive proper values count', async () => {
  const strings$ = of('Tom', 'Ana');

  // expect to receive 2 values and then the complete event
  const values = await expect(strings$).emit.nextCount(2).verify();
  expect(values).to.deep.equals(['Tom', 'Ana']);
});
```

Keyword `nextMatches` should be used to create a validation condition for value that will yield
a true or false, depending if the value is valid or not. This keyword is useful if you are using a third party assertion library or custom made assertion functions.

```ts
it('should next value match a condition', async () => {
  const numbers$ = of(2, 2, 3);

  // assert that verifies a value
  // if false is returned the assertion inside a library will throw an error
  const customAssertion = (val: number): boolean => val > 1;

  const values = await expect(numbers$)
    .emit.nextMatches(customAssertion)
    .nextMatches(customAssertion)
    .nextMatches(customAssertion)
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
      // when a false is returned, the library will proceed
      // with the next verification step.
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
      expect(val)
        .to.be.a('number')
        .and.to.be.equal(sourceValues[index]);
      // if true is returned the verification step is still not over,
      // otherwise the next verification step will start with execution
      return index < sourceValues.length - 1;
    })
    .verifyComplete();

  expect(values).to.deep.equals([2, 2, 3]);
});
```

### skipCount and skipUntil keyword

Keyword `skipCount` can be used to skip N next values.

```ts
it('should skip values', async () => {
  const strings$ = of('Tom', 'Ana', 'John');

  const values = await expect(strings$)
    .emit.skipCount(2) // skip next 2 values
    .next('John')
    .verifyComplete();

  expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
});
```

Keyword `skipUntil` can be used to skip N next values by some condition.

```ts
it('should skip values until condition', async () => {
  const strings$ = of('Tom', 'Ana', 'John');

  const values = await expect(strings$)
    .emit.skipUntil((_, index) => index < 1) // skip while index < 1
    .next('John')
    .verifyComplete();

  expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
});
```

### awaitSingle keyword

Should be used when a single result is expected from the tested observable.

```ts
it('should receive a single next value and complete', async () => {
  const string$ = of('John');

  // result will be a single value instead of array of values
  const singleString = await expect(
    string$,
  ).emit.awaitSingle<string>();
  expect(singleString).to.be.equal('John');
});
```

### error, errorType and errorMessage keywords

Keywords `error`, `errorType` and `errorMessage` should be used when handling errors from observables.
Note that here we are using only the keyword `verify` to indicate that verification should start, but that complete event is not expected to be received from the tested observable.

```ts
it('should catch an error from observable', async () => {
  const error$ = throwError(() => new Error('Unexpected error'));

  await expect(error$).emit.error(Error, 'Unexpected error').verify();
  await expect(error$).emit.errorType(Error).verify();
  await expect(error$).emit.errorMessage('Unexpected error').verify();
});
```

### observable keyword

Check if the tested object is an instance of observable.

```ts
it('should not throw an error when instance of Observable', function () {
  expect(of(1, 2, 3)).to.be.an.observable();
});
```

### virtualTime keyword

Setup a flag for the library to use TestScheduler from 'rxjs/testing'.
This is useful when we want to use virtual time instead of real time.
Useful when using interval, delay...

```ts
it('should use virtual time and receive values in proper order', async function () {
  const interval$ = interval(1_000).pipe(
    filter((val) => val % 2 === 1),
    take(2),
  );

  const values = await expect(interval$)
    .emit.virtualTime.next(1)
    .next(3)
    .verifyComplete();
  expect(values).to.deep.equals([1, 3]);
});
```

### verify, complete, verifyComplete and awaitComplete keywords

Keyword `verify` is always used after keywords `error`, `errorType`, `errorMessage` or `complete` and its purpose is to subscribe observable spy to the tested observable and start testing received values or errors.
<br />
Keyword `verifyComplete` is used as a shortcut of two keywords `complete` and `verify` and indicates that the observable should end up with a complete event and that verification of the observable should start.
<br />
Keyword `awaitComplete` will just wait for a complete event from the observable and ignore all next values received from it.
Useful when it is required to just verify that an observable ends with a completed event without bothering about the values that are sent from it.

```ts
it('should just await complete event and ignore next values', async () => {
  const strings$ = of('Tom', 'Ana', 'John');

  // 'then' keyword has no functionality,
  // it is there just for readability :)
  const values = await expect(strings$).emit.then.awaitComplete();
  expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
});
```

`awaitComplete` can receive an callback to process next values.

```ts
it('should just await complete event and assert next values', async () => {
  const sourceValues = ['Tom', 'Ana', 'John'];
  const strings$ = from(sourceValues);

  const values = await expect(strings$).emit.then.awaitComplete(
    (val, index) => expect(val).to.be.equal(sourceValues[index]),
  );
  expect(values).to.deep.equals(['Tom', 'Ana', 'John']);
});
```

## Forgot to call verify keyword

In case we forgot to call the `verify` keyword the tests will look like they are passing. The reason for this is simple: without a call to the `verify` the observable spy does not subscribe to the tested observable and in that case no values are received and so there is nothing to test.
<br />
Library has a safe guard that will throw an error if some language chain ends without proper `verify` keyword.

```ts
it('verify is not call at the end', async () => {
  const strings$ = from(['Tom', 'Ana']);

  // there is no call to verify or verifyComplete
  // because of this spy will not be subscribed
  // to tested strings$ observable, as result the error will be thrown
  // [observableSpyGuard]: found not subscribed observable in test
  await expect(strings$).emit.next('Tom').next('Tina').next('Ana');
});
```

Under a hood the library awaits 2 seconds for a test to call verify keyword, if in that time window the verify method is not called the error is thrown. It is possible to configure timeout when creating the plugin, also it is possible to to disable this behavior if required.

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

This library also extends ChaiJS's should assertion style of writing tests.

```ts
import chai from 'chai';
import { createChaiObservableSpyPlugin } from '@maklja90/chaijs-rxjs-observable-spy';
// other RxJS imports

chai.should();

chai.use(createChaiObservableSpyPlugin());

it('should receive values in proper order with complete event', async () => {
  const strings$ = from(['Tom', 'Tina', 'Ana']);

  const values = await strings$.should.emit
    .next('Tom')
    .next('Tina')
    .next('Ana')
    .verifyComplete<string>();

  values.should.be.deep.equals(['Tom', 'Tina', 'Ana']);
});
```

## License

MIT

