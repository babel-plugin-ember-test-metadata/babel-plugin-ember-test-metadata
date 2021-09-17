import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | with-hooks-test', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(
      getTestMetadata(this).filePath,
      'build-scenario-prefix/gggtests/unit/with-hooks-test.js'
    );
  });
});
