var assert = require('assert')
  , ref = require('ref')
  , BitfieldType = require('../')

describe('Bitfield', function () {

  afterEach(gc)

  it('should be a function', function () {
    assert.equal('function', typeof BitfieldType)
  })

  describe('fields', function () {
    var Fields = BitfieldType({
      ''     : 0,
      'a'    : 1,
      'b'    : 2,
      'a+b'  : 3,
      'c'    : 4,
      'a+c'  : 5,
      'b+c'  : 6,
      'a+b+c': 7
    });
  })

  describe('.ref()', function () {
  })
})
