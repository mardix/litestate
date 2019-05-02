/**
 * Compare two state
 * @param {object} s1
 * @param {object} s2
 * @returns {boolean}
 */
const compState = (s1, s2) => JSON.stringify(s1) === JSON.stringify(s2);

const proxyTarget = '___target___';
const isPrimitive = value => value === null || !['function', 'object'].includes(typeof value);

/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isFn = (obj, key) => obj && typeof obj[key] === 'function';

/**
 * selectorMemoizer a Proxy selector
 * @param {string} key
 * @param {function} fn
 * @return {function onChangeProxy}
 * ie: myMem = selectorMemoizer(k, (state) => return value)
 * myMem(state)
 */
export const selectorMemoizer = (key, fn) => {
  let prevState = null;
  let prevValue = undefined;
  let value = undefined;
  return state => {
    const exportedState = state.___target___ ? { ...state.___target___ } : { ...state };
    if (!prevState || !compState(prevState, exportedState)) {
      prevState = exportedState;
      value = fn(prevState);
    }
    if (prevValue !== value) {
      prevValue = value;
      state[key] = value;
    }
  };
};

/**
 * objectOnChange
 * Observe an object change, and run onChange()
 * @param {*} object
 * @param {*} onChange
 */
export const objectOnChange = (object, onChange) => {
  let inApply = false;
  let changed = false;
  const propCache = new WeakMap();

  const handleChange = () => {
    if (!inApply) onChange();
    else if (!changed) changed = true;
  };

  const getOwnPropertyDescriptor = (target, property) => {
    let props = propCache.get(target);
    if (props) return props;

    props = new Map();
    propCache.set(target, props);

    let prop = props.get(property);
    if (!prop) {
      prop = Reflect.getOwnPropertyDescriptor(target, property);
      props.set(property, prop);
    }
    return prop;
  };

  const handler = {
    get(target, property, receiver) {
      if (property === proxyTarget) return target;
      const value = Reflect.get(target, property, receiver);
      if (isPrimitive(value) || property === 'constructor') return value;

      const descriptor = getOwnPropertyDescriptor(target, property);
      if (descriptor && !descriptor.configurable) {
        if (descriptor.set && !descriptor.get) return undefined;
        if (descriptor.writable === false) return value;
      }
      return new Proxy(value, handler);
    },

    set(target, property, value, receiver) {
      if (value && value[proxyTarget] !== undefined) value = value[proxyTarget];
      const previous = Reflect.get(target, property, receiver);
      const result = Reflect.set(target, property, value);
      if (previous !== value) handleChange();
      return result;
    },

    defineProperty(target, property, descriptor) {
      const result = Reflect.defineProperty(target, property, descriptor);
      handleChange();
      return result;
    },

    deleteProperty(target, property) {
      const result = Reflect.deleteProperty(target, property);
      handleChange();
      return result;
    },

    apply(target, thisArg, argumentsList) {
      if (!inApply) {
        inApply = true;
        const result = Reflect.apply(target, thisArg, argumentsList);
        if (changed) onChange();
        inApply = changed = false;
        return result;
      }
      return Reflect.apply(target, thisArg, argumentsList);
    },
  };

  const proxy = new Proxy(object, handler);

  return proxy;
};
