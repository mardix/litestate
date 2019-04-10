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
