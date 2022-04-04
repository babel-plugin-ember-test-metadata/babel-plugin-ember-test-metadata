import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | with-packages-test', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(getTestMetadata(this).filePath, 'packages/extended/tests/unit/with-packages-test.js');
  });
});
