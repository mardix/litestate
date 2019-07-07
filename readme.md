
![npm (tag)](https://img.shields.io/npm/v/restatedjs/latest.svg?style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/mardix/restated/master.svg?style=flat-square) [![gzip bundle size](http://img.badgesize.io/https://unpkg.com/restatedjs@latest/dist/restated.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/restatedjs) ![NPM](https://img.shields.io/npm/l/restatedjs.svg?style=flat-square)
---

# reStated

An ambitiously tiny, gizp ~900b, flux-like progressive state management library inpired by Redux and Vuex.

---

## Features

-   [x] Flux pattern
-   [x] Immutable state
-   [x] Action Mutators
-   [x] Computed state
-   [x] Subscription

Inspired by Redux and Vuex, **reStated** removes the boilerplate to keep your state simple, intuitive and immutable. 

It follows the flux pattern and let you change your state only via Action Mutators. 

**reStated** is framework agnostic, and can work with React, Vuejs etc.

**reStated** allows you to mutate your state in place without the need for reducers like Redux or actions and mutations like Vuex. 


**reStated** allows you to write *computed state*, which are functions that select part of your state, to return a new value that will be set in your state.

**reStated** also provides a subscription method to watch the state

---

## Installation

The best way to import **reStated** is via ESM JavaScript, where we specify the type as module, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag.

```html
<script type="module">
  import reStated from '//unpkg.com/restatedjs';
  
  ...
</script>
```

Or by installing in your project

```
npm install restatedjs
```

```js
import reStated from 'restatedjs';
```

---

### Create the store

#### **`reStated({state:{}, ...function ActionMutators})`**

```html

<script type="module">

import reStated from '//unpkg.com/restatedjs';

const store = reStated({
  state:{
    firstName: '',
    lastName: '',
    count: 0,

    /** Computed state: function that returns a new value to the state **/
    fullName(state) { 
      return `${state.firstName} ${state.lastName}`
    },
  },

  /** Action Mutators: functions to update the state **/

  setFirstName(state, firstName) {
    state.firstName = firstName;
  },
  setLastName(state, lastName) {
    state.lastName = lastName;
  },

  // Async example
  async makeAjaxCall(state, url) {
    state.pending = true; // The state will be mutated
    state.data = await fetch(url);
    state.pending = false; // The state will be mutated
  },

  // Other action mutators
  inc(state) => state.count++,
  dec(state) => state.count--,
});
</script>
```

---

### State

State are the values that can be initially set, or set via an action mutator.

Initial state can be set during initialization of the store, in the `state` property.

The `state` property is an object that may contains: String, Number, Array, Plain Object, Boolean, Null, Undefined. 

If the value of a state property is a function it will be converted into a computed state (read more below)



```js
const store = reStated({
  state: {
    name: 'reStated',
    version: '1.x.x',
    firstName: '',
    lastName: '',
    count: 0,
  }
})

```

#### Usage

You can access the full state with the method `reStated.getState()` or by using any state properties.

```js
// get full state object
const myFullState = store.getState();

// or individual property

const name = store.name;
const version = store.version;

```

---

### Actions Mutators

Action mutators are functions that can mutate the state in place. They accept the current `state` as the first argument and can return any values.

Action mutators are set during initialization of the store. 

```js

const store = reStated({
  setFirstName(state, firstName) {
    state.firstName = firstName;
  },
  setLastName(state, lastName) {
    state.lastName = lastName;
  },

  // Async example
  async makeAjaxCall(state, url) {
    state.pending = true; // The state will be mutated
    state.data = await fetch(url);
    state.pending = false; // The state will be mutated
  },

  // Other action mutators
  inc(state) => state.count++,
  dec(state) => state.count--,
})

```

#### Usage

Run an action mutator by using the function name

```js
store.setFirstName('Mardix');
store.setLastName('M.');

store.inc(); // will increment the count
store.dec(); // will decrement the count

```

---

### Computed State

Computed State are function that select part of the state to create new properties.
They are function defined along with the initial state.
The selected value will be assigned to the function's name

```js

const store = reStated({
  state:{
    firstName: '',
    lastName: '',
    count: 0,

    /** Computed state: function that returns a new value to the state **/
    fullName(state) { 
      return `${state.firstName} ${state.lastName}`
    },
  },
  ...
});
```

A new property `fullName` will be assigned to the state and will contain the returned value.

#### Usage

The same way you would access the initial state, computed states are accessed the same way, by calling the property.

```js

  const fullName = store.fullName;

```

---

### Subscribe to changes

You can subscribe to changes in the state. Each time the state is updated it will run a function that you set.

`reStated.subscription(listener:function)`

```js
const sub = store.subscribe(state => {
  console.log(`I'm updated ${state.count}`);
});
```

#### Unsubscribe to changes

To unsubscribe

```js
const unsub = store.subscribe(state => {
  console.log(`I'm updated ${state.count}`);
});

// This will unsubscribe
unsub();
```


---

### API

`reStated()`

`reStated.getState()`

`reStated.subscribe()`

---

LICENSE: MIT

(c) 2019 Mardix
