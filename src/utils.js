export const proxyTarget = '#';
const compareObj = (s1, s2) => JSON.stringify(s1) === JSON.stringify(s2);
const isPrimitive = value => value === null || !['function', 'object'].includes(typeof value);

/**
 * Returns the object keys
 * @param {*} obj
 * @returns {array}
 */
export const keys = obj => Object.keys(obj);

/**
 * isFn isFunction
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
export const isFn = (obj, key) => obj && typeof obj[key] === 'function';

/**
 * computeState a Proxy selector
 * @param {string} key
 * @param {function} fn
 * @return {function onChangeProxy}
 * ie: myMem = computeState(k, (state) => return value)
 * myMem(state)
 */
export const computeState = (key, fn) => {
  let prevState = null;
  let prevValue = undefined;
  let value = undefined;
  return state => {
    const exportedState = { ...state[proxyTarget] };
    if (!prevState || !compareObj(prevState, exportedState)) {
      prevState = exportedState;
      value = fn(prevState);
    }
    if (prevValue !== value) {
      prevValue = value;
      state[key] = value;
    }
  };
};

function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  var temp = obj.constructor();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) temp[key] = immu(obj[key]);
  }
  return temp;
}

function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  keys(obj).forEach(function(name) {
    const prop = obj[name];
    if (prop !== null && typeof prop === 'object') deepFreeze(prop);
  });
  return Object.freeze(obj);
}

export const immu = obj => deepFreeze(deepCopy(obj));

/**
 * objectOnChange
 * Observe an object change, and run onChange()
 * @param {*} object
 * @param {*} onChange
 * @returns {Proxy}
 */
export const objectOnChange = (object, onChange) => {
  let inApply = false;
  let changed = false;

  const handleChange = () => {
    if (!inApply) onChange();
    else if (!changed) changed = true;
  };

  const handler = {
    get(target, property, receiver) {
      if (property === proxyTarget) return target;
      const value = Reflect.get(target, property, receiver);
      if (isPrimitive(value) || property === 'constructor') return value;
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
