import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { getTestMetadata } from '@ember/test-helpers';
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
      '__tests__/__fixtures__/multiple-module-one-beforeeach-new-import-input-test.js';
    const myConst = 0;
    noop(); // do some things here
  });
  test('it renders browse page', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
module('Acceptance | search acceptance test', function (hooks) {
  setupApplicationTest(hooks);
  some.otherThing(function () {
    noop();
  });
  hooks.beforeEach(function () {
    let testMetadata = getTestMetadata(this);
    testMetadata.filePath =
      '__tests__/__fixtures__/multiple-module-one-beforeeach-new-import-input-test.js';
    const myConst = 0;
    noop(); // do some things here
  });
  test('it renders search', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
