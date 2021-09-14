import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | with-hooks-test', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.ok(
      getTestMetadata(this).filePath.includes('tests/unit/with-hooks-assert-includes-test.js')
    );
  });
});
