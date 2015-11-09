'use strict';

var assert = require('assert');
var Bluebird = require('bluebird');

describe('Bluebird', () => {
  describe('.all()', () => {
    it('値の配列を受け取って値の配列を返す', () => {
      return Bluebird.all([1, 2, 3]).then(values => {
        assert.deepEqual(values, [1, 2, 3]);
      });
    });
    it('Promiseの配列を受け取って値の配列を返す', () => {
      return Bluebird.all([1, 2, 3].map(v => Promise.resolve(v))).then(values => {
        assert.deepEqual(values, [1, 2, 3]);
      });
    });
    it('Promiseと値の配列を受け取って値の配列を返す', () => {
      return Bluebird.all([Bluebird.delay(50, 1), 2, 3]).then(values => {
        assert.deepEqual(values, [1, 2, 3]);
      });
    });
    it('rejectされた値が同時に複数ある場合、rejectの先頭の値をrejectで返す', () => {
      return Bluebird.all([Promise.reject(1), Promise.reject(2), 3]).then(values => {
        assert(false);
      }).catch(value => {
        assert.equal(value, 1);
      });
    });
    it('rejectされた値が複数ある場合、最初にrejectされた値をrejectで返す', () => {
      return Bluebird.all([
        Bluebird.delay(50).return(Promise.reject(1)),
        Bluebird.delay(10).return(Promise.reject(2)),
      ]).then(values => {
        assert(false);
      }).catch(value => {
        assert.equal(value, 2);
      });
    });
    it('rejectされた値があっても他のPromiseはキャンセルされない', () => {
      let result = [];
      let delay = Bluebird.delay(100).then(() => {
        result.push(2);
      });
      let all = Bluebird.all([delay, Promise.reject(1)]).catch(value => {
        assert.equal(value, 1);
        result.push(1);
      });
      return Promise.all([delay, all]).then(() => {
        assert.deepEqual(result, [1, 2]);
      });
    });
  });
});
