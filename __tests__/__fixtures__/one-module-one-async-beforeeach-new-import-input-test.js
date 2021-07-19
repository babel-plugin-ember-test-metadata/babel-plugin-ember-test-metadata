import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

const SELECTORS = Object.freeze({
  MOCK_SELECTOR: '[data-test-nav-bar-browse]',
});

module('Acceptance | browse acceptance test', function (hooks) {
  setupApplicationTest(hooks);

  some.otherThing(function () {
    noop();
  });

  hooks.beforeEach(async function () {
    const myConst = 0;
    await noop();
    // do some things here
  });

  test('it renders browse page', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
