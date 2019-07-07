// Litestate

import {
  computeState,
  isFn,
  objectOnChange,
  immu,
  keys,
  proxyTarget,
} from './utils.js';

/**
 * Litestate
 * @param {{ }} stagingObject
 * @return {Proxy}
 */
export default function Litestate(stagingObject = {}) {
  /** @type {array} */
  const subscribers = [];

  /** @type {object} initial state with computed functions */
  const initialState = stagingObject.state || {};

  /** @type {object} the initial state without computed functions */
  const initState = keys(initialState)
    .filter(v => !isFn(initialState, v))
    .reduce((pV, cV) => ({ ...pV, [cV]: initialState[cV] }), {});

  /** @type {array} of computed functions that accept the state as arg. Must return value */
  const computedState = keys(initialState)
    .filter(v => isFn(initialState, v))
    .map(k => computeState(k, initialState[k]));

  /** @type {object} object of all mutators function */
  const actions = keys(stagingObject)
    .filter(v => isFn(stagingObject, v))
    .reduce(
      (pV, cV) => ({
        ...pV,
        [cV]: (...args) => stagingObject[cV].call(this, state, ...args),
      }),
      {}
    );

  /** @type {object} cache of the immuatable state */
  let imState = {};

  /** @type {Proxy} Hot state. Contains the data */
  let state = objectOnChange(initState, () => {
    computedState.forEach(cs => cs(state));
    subscribers.forEach(s => s(state[proxyTarget]));
    imState = immu(state[proxyTarget]);
  });

  /** Initialize computedState */
  computedState.forEach(cs => cs(state));
  imState = immu(state[proxyTarget]);

  /** @type {object{function}} object of all actions */
  const base = {
    ...actions,
    getState: () => imState,
    subscribe(listener) {
      subscribers.push(listener);
      return () => subscribers.splice(subscribers.indexOf(listener), 1);
    },
  };

  /**
   * Return a new proxy
   */
  return new Proxy(base, {
    // Returns either actions or state value
    get: (obj, prop) => (prop in obj ? obj[prop] : Reflect.get(imState, prop)),
    // Prevent settings items
    set: (target, prop, value) => false,
  });
}
