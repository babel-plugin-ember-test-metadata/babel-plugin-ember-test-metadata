import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | without-hooks-test', function () {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.ok(
      getTestMetadata(this).filePath.includes('tests/unit/without-hooks-assert-includes-test.js')
    );
  });
});
