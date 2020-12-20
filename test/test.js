import Litestate from '../src/index.js';

test('Litestate is a function', () => {
  expect(Litestate).toBeInstanceOf(Function);
});

test('Litestate() store returns an object', () => {
  const store = Litestate();
  expect(store).toBeInstanceOf(Object);
});

test('store.$subscribe is a function', () => {
  const store = Litestate();
  expect(store.$subscribe).toBeInstanceOf(Function);
});

test('store.$state is a function', () => {
  const store = Litestate();
  expect(store.$state).toBeInstanceOf(Function);
});

test('store.$state() returns an object', () => {
  const store = Litestate();
  expect(store.$state()).toBeInstanceOf(Object);
});

test('store contains initial state', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
    },
  });
  expect(store.$state().name).toBe('Litestate');
  expect(store.version).toBe('x.x.x');
});

test('store set selector', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
      selectorName: state => `${state.name}-${state.version}`,
    },
  });
  expect(store.selectorName).toBe('Litestate-x.x.x');
});

test('Test array count and add elements', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
      comments: [],
      commentsCount: state => state.comments.length,
    },
    addComments(state, comments) {
      state.comments = state.comments.concat(comments);
    },
  });
  store.addComments([{}, {}, {}]);
  expect(store.commentsCount).toBe(3);
  store.addComments({});
  expect(store.commentsCount).toBe(4);
});

test('store action is an action function', () => {
  const store = Litestate({
    action(state) {},
  });
  expect(store.action).toBeInstanceOf(Function);
});

test('store run action, mutate state', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
      selectorName: state => `${state.name}-${state.version}`,
    },
    changeVersion: state => (state.version = '1.0.1'),
  });
  expect(store.$state().selectorName).toBe('Litestate-x.x.x');
  store.changeVersion();

  expect(() => {
    store.state.name = 'Jones';
  }).toThrow();

  expect(store.$state().selectorName).toBe('Litestate-1.0.1');
  expect(store.selectorName).toBe('Litestate-1.0.1');
  expect(store.name).toBe('Litestate');
});

test('State get nested value', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
      k: {
        v: {
          k: {
            v: 1,
          },
        },
      },
    },
  });

  expect(store.k.v.k.v).toBe(1);
});

test('State mutate nested value', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
      k: {
        v: {
          k: {
            v: 1,
          },
        },
      },
    },
  });
  expect(() => {
    store.k.v.k.v = 2;
  }).toThrow();
});

test('State set nested value', () => {
  const store = Litestate({
    state: {
      name: 'Litestate',
      version: 'x.x.x',
    },
    set(state, value) {
      state.k1 = value;
    },
  });
  store.set(2);
  expect(store.k1).toBe(2);
});

test('action returns a value', () => {
  const store = Litestate({
    action(state) {
      return 1;
    },
    action2(state) {
      return 2;
    },
    action3(state) {
      return 3;
    },
  });
  expect(store.action()).toBe(1);
  expect(store.action2()).toBe(2);
  expect(store.action3()).toBe(3);
});

test('action call other actions', () => {
  const store = Litestate({
    state: {
      initCount: 0,
    },
    incInitCount(state) {
      state.initCount++;
    },
    innerAction(state) {
      this.incInitCount();
    },
  });
  store.incInitCount();
  expect(store.initCount).toBe(1);
  store.innerAction();
  expect(store.initCount).toBe(2);
  store.innerAction();
  expect(store.initCount).toBe(3);
});
