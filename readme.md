
[![gzip bundle size](http://img.badgesize.io/https://unpkg.com/restated-lib@latest/dist/restated.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/restated-lib)

---

# reStated

An ambitiously tiny, gizp ~800b, flux-like library to manage your state.

Inspired by Redux and Vuex, **reStated** removes the boilerplate
and keep it simple and flat.

Unlike Redux, you don't need to return a new immutable object.
You can mutate the state in place, and you definitely don't need to define a reducer. The action mutator is both your action and your reducer "at the same damn time" (Future's song)

Unlike Vuex, you don't need to have actions and mutations. You can only mutate the state via your actions mutators which are just function that pass as first argument the current state to be mutated.

Also via _selectors_ **reStated** allows to you select part of the state to create new properties in the state.

And of course you can _subscribe_ to the changes in the store.

---

## Features:

- **Flux pattern**: only one way data flow
- **mutators**: update the state in place
- **selectors**: select properties of the state to create new properties
- **subscription**: subscribe to changes in the store

---

### Create the store

#### **`reStated(state={}, actionMutators={...functions})`**

```js
<script type="module">

import reStated from '//unpkg.com/restated-lib';

const store = reStated(
  // Initial state and selectors
  {
    firstName: '',
    lastName: '',
    count: 0,

    // Selectors
    fullName(state) => `${state.firstName} ${state.lastName}

  },

  // Action mutators. The only place to mutate the state
  {
    setFirstName(state, firstName) {
      state.firstName = firstName;
    },
    setLastName(state, lastName) {
      state.lastName = lastName;
    },

    // Example on how to update an async state, with multiple status
    async makeAjaxCall(state, url) {
      state.pending = true; // The state will be mutated
      state.data = await fetch(url);
      state.pending = false; // The state will be mutated
    },

    // Other action mutators
    inc(state) => state.count++,
    dec(state) => state.count--,
  }

)
</script>
```

### Run actions mutators

Action mutators are functions that can mutate the state in place.

Action mutators can also be chained.

```js
store.setFirstName('Mardix');
store.setLastName('M.');

store.inc(); // will increment the count
store.dec(); // will decrement the count

// chainable
store
  .inc()
  .makeAjaxCall()
  .dec();
```

### Restrieve the state

`reStated.getState()` returns the state

```js
  const myFullName = store.getState().fullName;
  const firstName = store.getState().firstName;
  console.log('Total count', store.getState().count);

```

### Subscribe to changes

`reStated.subscription(listener:function)` lets you listens to changes in the store

```js

  const sub = store.subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

```

### Unsubscribe to changes

```js
  const unsub = store.subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

  // This will unsubscribe
  unsub();

```

### Selectors

Selectors are function that select part of the state to create new properties.
They are function defined along with the initial state.
The selected value will be assigned to the function's name

```js
{
  // Initial state
  firstName: '',
  lastName: '',

  // Selectors
  fullName(state) => `${state.firstName} ${state.lastName}`
  ...
}
```

A new property `fullName` will be assigned to the state and will contain the returned value.

---

LICENSE: MIT

(c) 2019 Mardix
