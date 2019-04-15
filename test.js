const assert = require('assert');
const reStated = require('./wip.js')

describe('Initializing', function() {
  const store = reStated({});
  it('Should have method: getState', () => {
    assert.equal(store.getState() === {}, true)
  })
})