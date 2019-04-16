# reStated

An ambitiously small state management library that follows the Flux pattern.

Inspired by Redux and Vuex, **reStated** removes the boilerplate
and keep it simply flat. 

Unlike Redux, you don't need to return a new immutable object. 
You can mutate the state in place.

Unlike Vuex, you don't need to have actions and mutations. 
You can only mutate the state via your actions mutators which are 
just function that pass as the first argument the current state to be mutated.

Also via *selectors* **reStated** allows to you select part of the state to create new properties in the state.

And of course you can *subscribe* to the changes in the store.


---

## Features:
- **Flux pattern**: only one way data flow
- **mutators**: update the state in place
- **selectors**: select properties of the state to create new properties
- **subscription**: subscribe to changes in the store

---

## Usage

### Install

#### Module from unpkg
You can import in as a module from the UNPKG site:

```
  // type=module is important here
  <script type="module"> 

    import reStated from '//unpkg.com/restated-lib?module';
    
    //... rest of the code below

  </script>
```

#### Install npm package

Or the good old npm install

```
  npm install --save restated-lib
```


### Create the store

```
import reStated from 'restated-lib';
// import reStated from '//unpkg.com/restated-lib?module';

const store = reStated({
  // Initial state
  firstName: '',
  lastName: '',
  count: 0,

  // Selectors
  $selectors: {
    fullName(state) => `${state.firstName} ${state.lastName}`
  },

  // Action mutators. 
  // The only place to mutate the state
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
  
})

```

### Run actions mutators

Action mutators are functions that can mutate the state in place.

Action mutators can also be chained.

```
  store.setFirstName('Mardix');
  store.setLastName('M.')

  store.inc(); // will increment the count
  store.dec(); // will decrement the count

  // chainable
  store
    .inc()
    .makeAjaxCall()
    .dec();
  
```

### Restrieve the state

`reStated.$getStore()` returns the state

```
  const myFullName = store.$getStore().fullName;
  const firstName = store.$getStore().firstName;
  console.log('Total count', store.$getStore().count);

```

### Subscribe to changes

`reStated.$subscription(listener:function)` lets you listens to changes in the store

```

  const sub = store.$subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

```

### Unsubscribe to changes


```

  const sub = store.$subscribe(state => {
    console.log(`I'm updated ${state.count}`)
  });

  // This will unsubscribe
  sub();

```

### Selectors

Selectors are propeties that select part of the state to create new properties. 
They are under `$selectors` as function. 
They selected value will be assigned to the function's name

```
{
  
  // Initial state
  firstName: '',
  lastName: '',

  // Selectors
  $selectors: {
    fullName(state) => `${state.firstName} ${state.lastName}`
  },
  ...
}
```

A new propety `fullName` will be assigned to the stated and will contain the 
returned value.

---

## Misc

### Reserved keys

Any object key started with `$` will be ignored. Don't prefix your object keys with `$`

---

LICENSE: MIT

(c) 2019 Mardix
