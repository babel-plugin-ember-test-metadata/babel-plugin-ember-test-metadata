import { module, test } from 'qunit';

module('Unit | Utils | test one');

test('should return proper things', function testGetDots(assert) {
  assert.expect(1);

  assert.equal('true', 'true', 'pass');
});
