
![npm (tag)](https://img.shields.io/npm/v/litestate/latest.svg?style=flat-square) ![Travis (.org) branch](https://img.shields.io/travis/mardix/litestate/master.svg?style=flat-square) [![gzip bundle size](http://img.badgesize.io/https://unpkg.com/litestate@latest/dist/litestate.esm.js?compression=gzip&style=flat-square)](https://unpkg.com/litestate) ![NPM](https://img.shields.io/npm/l/litestate.svg?style=flat-square)
---

# Litestate

An ambitiously tiny, gizp ~800b, flux-like progressive state management library inpired by Redux and Vuex.

---

## Features

-   [x] Flux pattern
-   [x] Immutable state
-   [x] Action Mutators
-   [x] Computed state
-   [x] Subscription

Inspired by Redux and Vuex, **Litestate** removes the boilerplate to keep your state simple, intuitive and immutable. 

It follows the flux pattern and let you change your state only via Action Mutators. 

**Litestate** is framework agnostic, and can work with React, Vuejs etc.

**Litestate** allows you to mutate your state in place without the need for reducers like Redux or actions and mutations like Vuex. 


**Litestate** allows you to write *computed state*, which are functions that select part of your state, to return a new value that will be set in your state.

**Litestate** also provides a subscription method to watch the state

---

## Installation

The best way to import **Litestate** is via ESM JavaScript, where we specify the type as module, and we import it from **unpkg.com** 

Make sure `type="module"` exists in the script tag.

```html
<script type="module">
  import Litestate from '//unpkg.com/litestate';
  
  ...
</script>
```

Or by installing in your project

```
npm install litestate
```

```js
import Litestate from 'litestate';
```

---

### Create the store

#### **`Litestate({state:{}, ...function ActionMutators})`**

```html

<script type="module">

import Litestate from '//unpkg.com/litestate';

const store = Litestate({
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
const store = Litestate({
  state: {
    name: 'Litestate',
    version: '1.x.x',
    firstName: '',
    lastName: '',
    count: 0,
  }
})

```

#### Usage

You can access the full state with the method `Litestate.$state()` or by using any state properties.

```js
// get full state object
const myFullState = store.$state();

// or individual property

const name = store.name;
const version = store.version;

```

---

### Actions Mutators

Action mutators are functions that can mutate the state in place. They accept the current `state` as the first argument and can return any values.

Action mutators are set during initialization of the store. 

[v.0.12] Action mutators can also call other actions by using `this`.

```js

const store = Litestate({
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
  
  // This action will call other actions
  async callMe(state) {
    this.inc();
    await this.makeAjaxCall();
  }
})

```


#### Usage

Run an action mutator by using the function name

```js
store.setFirstName('Mardix');
store.setLastName('M.');

store.inc(); // will increment the count
store.dec(); // will decrement the count

store.callMe(); // will call other actions
```

---

### Computed State

Computed State are function that select part of the state to create new properties.
They are function defined along with the initial state.
The selected value will be assigned to the function's name

```js

const store = Litestate({
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

`Litestate.$subscribe(listener:function)`

```js
const unsub = store.$subscribe(state => {
  console.log(`I'm updated ${state.count}`);
});
```

#### Unsubscribe to changes

To unsubscribe

```js
const unsub = store.$subscribe(state => {
  console.log(`I'm updated ${state.count}`);
});

// This will unsubscribe
unsub();
```


---

### API

`Litestate()` : Initialize the state management

`Litestate.$state()` : returns the state

`Litestate.$subscribe(listener:function)` : subscribe a function to the changes 

---

LICENSE: MIT

(c) 2019 Mardix
