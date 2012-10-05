var assert = require('assert')
  , ref = require('ref')
  , Bitfield = require('../')



function toObject(bitfield){
  var out = {}
  for (var k in bitfield.constructor.fields)
    out[k] = bitfield[k]
  return out
}

describe('Bitfield', function () {

  afterEach(gc)

  it('should be a function', function () {
    assert.equal('function', typeof Bitfield)
  })

  describe('fields', function () {
    var Fields = Bitfield({
      ___: 0,
      $__: 1,
      _$_: 2,
      __$: 4,
      $_$: 5,
      _$$: 6,
      $$$: 7
    })
  })

  describe('.ref()', function () {
  })
})
