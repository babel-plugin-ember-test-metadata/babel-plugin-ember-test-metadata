import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | without-hooks-test', function () {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(getTestMetadata(this).filePath, 'tests/unit/embroider-without-hooks-test.js');
  });
});
