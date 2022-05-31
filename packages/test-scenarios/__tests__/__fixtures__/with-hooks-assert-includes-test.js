import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | with-hooks-test', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(getTestMetadata(this).filePath, 'lib/fake-addon/tests/unit/with-hooks-assert-includes-test.js');
  });
});
