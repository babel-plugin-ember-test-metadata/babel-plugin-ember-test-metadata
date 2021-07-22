import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

const SELECTORS = Object.freeze({
  MOCK_SELECTOR: '[data-test-nav-bar-browse]',
});

module('Acceptance | browse acceptance test', function (hooks) {
  setupApplicationTest(hooks);
  setupTwo(hooks);
  setupThree(hooks);

  const appVersion = '0.0.1';
  this.nextItem = {
    bookmark: {},
    title: 'foo',
  };

  some.otherThing(function () {
    noop();
  });

  test.only('it renders browse page', async function (assert) {
    await visit(BROWSE_URL);
    assert.dom(SELECTORS.MOCK_SELECTOR).exists();
  });
});
