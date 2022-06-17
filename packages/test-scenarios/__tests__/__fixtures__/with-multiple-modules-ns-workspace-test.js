import { module, test } from 'qunit';
import { getTestMetadata } from '@ember/test-helpers';

module('Acceptance | with-multiple-modules-nonstandard-workspace-test', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(getTestMetadata(this).filePath, 'packages/nonstandard-workspaces-app/tests/unit/with-multiple-modules-ns-workspace-test.js');
  });
});

module('Acceptance | with-multiple-modules-test 2', function (hooks) {
  hooks.beforeEach(function () {
    // noop
  });

  test('example', async function (assert) {
    assert.equal(getTestMetadata(this).filePath, 'packages/nonstandard-workspaces-app/tests/unit/with-multiple-modules-ns-workspace-test.js');
  });
});
