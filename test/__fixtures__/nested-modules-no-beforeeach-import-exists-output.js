import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, visit, getTestMetadata } from '@ember/test-helpers';
const SELECTORS = Object.freeze({
  MOCK_SELECTOR: '[data-test-nav-bar-browse]',
});
module('Acceptance | browse acceptance test', function (hooks) {
  setupApplicationTest(hooks);
  some.otherThing(function () {
    noop();
  });
  hooks.beforeEach(function () {
    let testMetadata = getTestMetadata(this);
    testMetadata.filePath =
      'test/__fixtures__/nested-modules-no-beforeeach-import-exists-code.js';
  });
  module('nested module', () => {
    test('a test', () => {});
    module('nested module', () => {
      test('a test', () => {});
    });
  });
  test('it renders browse page', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
