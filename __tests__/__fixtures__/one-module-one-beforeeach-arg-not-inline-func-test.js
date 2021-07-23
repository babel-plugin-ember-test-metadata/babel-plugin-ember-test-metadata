import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { beforeEachSetup } from 'before-each-setup';

const SELECTORS = Object.freeze({
  MOCK_SELECTOR: '[data-test-nav-bar-browse]',
});

module('Acceptance | browse acceptance test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(beforeEachSetup);

  test('it renders browse page', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
