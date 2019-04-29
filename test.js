import reStated from './src/index.js';

test('reStated is a function', () => {
  expect(reStated).toBeInstanceOf(Function);
});

test('reStated() store returns an object', () => {
  const store = reStated();
  expect(store).toBeInstanceOf(Object);
});

test('store.subscribe is a function', () => {
  const store = reStated();
  expect(store.subscribe).toBeInstanceOf(Function);
});

test('store.getState() returns an object', () => {
  const store = reStated();
  expect(store.getState()).toBeInstanceOf(Object);
});

test('store contains initial state', () => {
  const store = reStated({
    name: 'reStated',
    version: 'x.x.x',
  });
  expect(store.getState().name).toBe('reStated');
});

test('store set selector', () => {
  const store = reStated({
    name: 'reStated',
    version: 'x.x.x',
    selectorName: state => `${state.name}-${state.version}`,
  });
  expect(store.getState().selectorName).toBe('reStated-x.x.x');
});

test('store action is an action function', () => {
  const store = reStated(
    {},
    {
      action(state) {},
    }
  );
  expect(store.action).toBeInstanceOf(Function);
});

test('store run action, mutate state', () => {
  const store = reStated(
    {
      name: 'reStated',
      version: 'x.x.x',
      selectorName: state => `${state.name}-${state.version}`,
    },
    {
      changeVersion: state => (state.version = '1.0.0'),
    }
  );
  expect(store.getState().selectorName).toBe('reStated-x.x.x');
  store.changeVersion();
  expect(store.getState().selectorName).toBe('reStated-1.0.0');
});

test('store chain action is an action function', () => {
  const store = reStated(
    {},
    {
      action(state) {},
      action2(state) {},
      action3(state) {},
    }
  );
  expect(store.action().action2().action3).toBeInstanceOf(Function);
});

test('store chain action is an action function returning object of actions', () => {
  const store = reStated(
    {},
    {
      action(state) {},
      action2(state) {},
      action3(state) {},
    }
  );
  expect(
    store
      .action()
      .action2()
      .action3()
  ).toBeInstanceOf(Object);
});
