# @maklja90/rxjs-observable-spy

A simple little library that helps testing RxJS observables.

[![npm version](https://img.shields.io/npm/v/@maklja90/rxjs-observable-spy.svg?style=flat-square)](https://www.npmjs.org/package/@maklja90/rxjs-observable-spy)
[![release](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/maklja/rxjs-observable-spy/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/maklja/rxjs-observable-spy/branch/master/graph/badge.svg?token=0N9BOURO5J&flag=observable-spy)](https://codecov.io/gh/maklja/rxjs-observable-spy)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Installation

```console
yarn add -D @maklja90/rxjs-observable-spy
```

or

```console
npm install -D @maklja90/rxjs-observable-spy
```

<br/>

## What problem this library is trying to solve?

This library was created to replace Marble that was hard to use and ultimately understand, especially for the new developers that joined a project that already has many marbles tests.
We noticed that in most cases when testing observables we are just testing an outcome and order of the received values and not how many frames were between each value.<br/>
This library allows you to investigate what was received from observables by using a spy wrapper. It also allows you to easily create reusable verification steps for validating output from observables that can be shared between different tests.

<br/>

# Usage

## Typescript

This library is fully covered with types and most of the methods can accept generics in order to
define what values will be received or what error is expected to be thrown.
Library contains source maps, so it is possible to debug a library from tests.

## Browsers

Library transpile to ES5 and should work in all browsers that support that version of javascript.

## Basic use cases

Simplest way to use a spy is to import the helper `subscribeSpyTo` function.

```js
import { subscribeSpyTo } from '@maklja90/rxjs-observable-spy';
// if you use CommonJS
// const { subscribeSpyTo } = require('@maklja90/rxjs-observable-spy');
// other RxJS imports...

it('should immediately subscribe and spy on Observable', () => {
  const expectedCities = ['San Francisco', 'Berlin', 'London'];
  const cityObservable = of(...expectedCities);

  // the function will return an instance of SubscribedSpy
  // and the “under a hood” function will automatically
  // subscribe to the provided observable.
  const observableSpy = subscribeSpyTo(cityObservable);

  expect(observableSpy.getValues()).to.be.deep.equal(expectedCities);
  expect(observableSpy.getValuesLength()).to.be.equal(3);
  expect(observableSpy.receivedComplete()).to.be.true;
  expect(observableSpy.receivedError()).to.be.false;
  expect(observableSpy.getError()).to.be.null;

  // you can manually unsubscribe if you need to
  observableSpy.unsubscribe();
});
```

In most cases observables will be async and you will want to wait for a complete event to be received from the observable. For that you have the option to use async/await or use a callback function.

```js
it('should async/await complete event', async () => {
  const expectedCities = ['San Francisco', 'Berlin', 'London'];
  const cityObservable = of(...expectedCities);

  const observableSpy = subscribeSpyTo(cityObservable);

  // onComplete method will return an array of all values
  // received from the next event
  const receivedCityValues = await observableSpy.onComplete();

  expect(receivedCityValues).to.be.deep.equal(expectedCities);
  expect(observableSpy.receivedComplete()).to.be.true;
});
```

or by using a callback

```js
it('should check values when onComplete callback is invoked', (done) => {
  const expectedCities = ['San Francisco', 'Berlin', 'London'];
  const cityObservable = of(...expectedCities);
  const observableSpy = subscribeSpyTo(cityObservable);

  observableSpy
    .onComplete()
    .then((receivedCityValues) => {
      expect(receivedCityValues).to.be.deep.equal(expectedCities);
      expect(observableSpy.receivedComplete()).to.be.true;
      done();
    })
    .catch((e) => done(e));
});
```

Sometimes errors happen and we need to handle them, so it would be a good idea to test them also.

```ts
it('should catch an error from observable', async () => {
  const errorObservable = throwError(
    () => new Error('Unexpected error'),
  );

  const observableSpy = subscribeSpyTo(errorObservable);

  // onError method will return an error received from the error event
  // if we are using a typescript we can set expected type of error
  const receivedError = await observableSpy.onError<Error>();

  expect(receivedError).to.be.instanceOf(Error);
  expect(receivedError.message).to.be.equal('Unexpected error');
});
```

<br/>

## Advance use cases

For some complicated tests you will need to manually create an instance of Observable spy.

```ts
import { ObservableSpy } from '@maklja90/rxjs-observable-spy';
// other RxJS imports...

it('should spy on Observable', async () => {
  const expectedCities = ['San Francisco', 'Berlin', 'London'];
  const cityObservable = of(...expectedCities);

  // observable spy is immutable, so there is no way of
  // using same instance observable spy for different observables
  const observableSpy = new ObservableSpy<string>(cityObservable);

  // we need to "tell" spy to subscribe to observable
  // it will return an observable subscription if we need it in the tests
  // const subscription = observableSpy.subscribe();
  observableSpy.subscribe();

  // we can use the subscription to unsubscribe
  // subscription.unsubscribe();
  // or we can use observableSpy to do the same
  // observableSpy.unsubscribe();

  const receivedCityValues = await observableSpy.onComplete();

  expect(receivedCityValues).to.be.deep.equal(expectedCities);
  expect(observableSpy.getValuesLength()).to.be.equal(3);
  expect(observableSpy.receivedComplete()).to.be.true;
  expect(observableSpy.receivedError()).to.be.false;
  expect(observableSpy.getError()).to.be.null;
});
```

### ObservableSpy listeners

Instance of ObservableSpy has support for registering event listeners in order to track next, error or complete events that are coming from observable.

```ts
import {
  ObservableSpy,
  NextListener,
} from '@maklja90/rxjs-observable-spy';

const targetValues = [1, 3, 5, 7];
const observableSpy = new ObservableSpy(
  interval(1_000).pipe(filter((val) => val % 2 === 1)),
  {
    // tell spy to use TestScheduler from 'rxjs/testing'
    // to "speed up" interval
    useTestScheduler: true,
  },
);

before(function (done) {
  const nextListener: NextListener<number> = (val, index) => {
    // after we receive 4 numbers from interval
    if (index > 2) {
      // unsubscribe spy and begin with tests
      observableSpy.unsubscribe();
      done();
    }
  };

  // register listener on next event
  observableSpy.addNextListener(nextListener);
  // to unregister a listener use
  // observableSpy.removeNextListener(awaitNValuesListener);

  observableSpy.subscribe();
});

it('will receive first n interval numbers in expected sequence', function () {
  expect(observableSpy.getValues()).to.be.deep.equal(targetValues);
});
```

### Verify observables using verification steps

With a project that has a couple of hundred tests we will probably want to share some commonly used assertions between different tests. In that case we can use verification steps to “describe” what are expected values from tested observables.

```ts
import {
  verifyObservable,
  VerificationStep,
} from '@maklja90/rxjs-observable-spy';

const allNumbersVerificationStep: VerificationStep<number> = {
  next(val) {
    if (isNaN(val)) {
      throw new Error(`Value ${val} is not a number`);
    }

    // false value indicates that this verification step is not done
    // when we return true, the next verification step will be able to proceed
    // also if we omit a return value it is considered that the verification step is done
    return false;
  },
  error(e) {
    throw e;
  },
  complete() {
    // we received complete event from observable, so this verification step is finished
  },
};

it('will verify that all observable values are numbers', async function () {
  const numbersObservable = from([1, 2, 3, 4]);
  const receivedValues = await verifyObservable(numbersObservable, [
    // register a single verification step that will check
    // if all incoming values are numbers
    allNumbersVerificationStep,
  ]);

  expect(receivedValues).to.be.deep.equal([1, 2, 3, 4]);
});

it('will fail with error if any value is not a number', async function () {
  const numbersObservable = from<any>([1, 2, 'three', 4]);

  try {
    await verifyObservable<any>(numbersObservable, [
      allNumbersVerificationStep,
    ]);
  } catch (e) {
    const error = e as Error;
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.be.equal('Value three is not a number');
  }
});
```

Library has built-in verification steps that can be used in your tests. Purpose of these verification steps is to make it easy to create extensions for Observables that can be used in different testing frameworks.

```ts
import {
  verifyObservable,
  createNextStep,
  createCompleteStep,
} from '@maklja90/rxjs-observable-spy';
// other RxJS imports...

it('should receive values in proper order', async function () {
  const strings$ = of('Tom', 'Tina', 'Ana');

  const values = await verifyObservable(strings$, [
    createNextStep('next', 'Tom'),
    createNextStep('next', 'Tina'),
    createNextStep('next', 'Ana'),
    createCompleteStep('complete'),
  ]);
  expect(values).to.deep.equals(['Tom', 'Tina', 'Ana']);
});
```

## License

MIT

