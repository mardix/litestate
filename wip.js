/**
 * reStated is a simple state manager.
 *
 * Only mutators can update the state
 *
 * Features:
 * - state management
 * - mutators
 * - selectors
 * - subscription
 *
 * @param {object} mutators
 *
 * // Simple Usage
 * const store = reStated({
 *  increment: (state) => { state.count+1; },
 *  decrement: (state) => { state.count-1; },
 *  setName: (state, firstName) => { state.firstName = firstName; }
 * })
 *
 * // Reserved keys
 * any object key with '$' prefix is reserved and not be
 * part of mutators.
 * ie:
 *  - $initState: {object} set the initial state
 *  - $selectors: {object}
 *
 * const store = reStated({
 *  $initState: {
 *    count: 0
 *  },
 *  $selectors: {
 *      fullCount: (state) => state.count
 *  },
 *  increment: (state) => { state.count+1; },
 *  decrement: (state) => { state.count-1; },
 *  setName: (state, firstName) => { state.firstName = firstName; }
 * })
 *
 * // Run action
 * => store.increment();
 *
 * //:: Subscription - Can subscribe to reStated object to get
 * => const s = store.subscribe(() => ...)
 * //:: To unsubscribe, invoke the value as a function
 * => s();
 *
 * //:: Selectors are not mutable, must return value
 * //:: Only action mutators are mutable
 *
 */

export default function reStated(mutators = {}) {
  let subscribers = [];
  let actions = {};
  let state = mutators.$initState || {};
  let selectors = mutators.$selectors || {};
  for (const k in mutators) {
    // reserved keys start with '$'
    if (k.startsWith('$')) continue;
    actions[k] = (...args) => {
      mutators[k].call(this, state, ...args);
      for (const s in selectors) {
        state[s] = selectors[s]({ ...state });
      }
      subscribers.forEach(subscriber => subscriber({ ...state }));
    };
  }
  return {
    ...actions,
    getState: () => state,
    subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers.splice(subscribers.indexOf(listener), 1);
    },
  };
}

const blacklist = ['sort', 'reverse', 'splice', 'pop', 'shift', 'push'];
const objectOnChange = (object, onChange) => {
  let blocked = false;
  const handler = {
    get(target, property, receiver) {
      try {
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target, property, descriptor) {
      const result = Reflect.defineProperty(target, property, descriptor);
      if (!blocked) {
        onChange();
      }
      return result;
    },
    apply(target, thisArg, argsList) {
      if (blacklist.includes(target.name)) {
        blocked = true;
        const result = Reflect.apply(target, thisArg, argsList);
        onChange();
        blocked = false;
        return result;
      }
    },
  };
  return new Proxy(object, handler);
};


function memoizeSelector(state, key, fn) {
  let prevState = null;
  let prevValue = undefined;
  let value = undefined;
  console.log('Set SELECTOR', key, fn)
  return () => {
    console.log('RUN SELECTOR', key, fn, prevState, state, value)
    if (
      !prevState ||
      JSON.stringify(prevState) !== JSON.stringify({ ...state })
    ) {
      prevState = { ...state };
      value = fn(prevState);
    }
    if (prevValue !== value) {
      prevValue = value;
      state[key] = value;
    }
  };
}

function reStatedX(mutators = {}) {
  const subscribers = [];

  const initState = Object.keys(mutators)
    .filter(v => typeof mutators[v] !== 'function')
    .filter(v => !v.startsWith('$'))
    .reduce((pV, cV) => ({ ...pV, [cV]: mutators[cV] }), {});

    console.log('I S', initState)

  const actions = Object.keys(mutators)
    .filter(v => typeof mutators[v] === 'function')
    .reduce(
      (pV, cV) => ({
        ...pV,
        [cV]: (...args) => mutators[cV].call(this, state, ...args),
      }),
      {}
    );

    let state = objectOnChange(initState, () => {
        console.log('ON OBJECT CHANGE')
      selectors.forEach(s => s())
      subscribers.forEach(s => s({...state}));
    });

    
  const selectors = Object.keys(mutators.$selectors || {})
    .filter(v => typeof mutators.$selectors[v] === 'function')
    .map(key => memoizeSelector(state, key, mutators.$selectors[key]));


  return {
    ...actions,
    getState: () => ({...state}),
    subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers.splice(subscribers.indexOf(listener), 1);
    },
  };
}

a = {
    count: 0,
    $selectors: {
        totalCount: (state) => `Total count is now ${state.count}`
    },
    incCount(state) {
        state.count++;
    },
    decCount(state) {
        state.count--;
    }
}

store = reStatedX(a);