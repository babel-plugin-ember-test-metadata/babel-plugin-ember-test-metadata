import { module, test } from 'qunit';

module('Unit | foo', function () {
  some.otherThing(function () {
    noop();
  });

  test('foo', async function (assert) {
    assert.equal('bar', 'bar');
  });
});
