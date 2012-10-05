var assert = require('assert')
  , ref = require('ref')
  , Bitfield = require('../')
  , binding = require('bindings')({ module_root: __dirname, bindings: 'binding' })

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

  describe('keys pressed example', function () {

    var Keys = Bitfield({
      up:      (1 << 0),
      right:   (1 << 1),
      down:    (1 << 2),
      left:    (1 << 3),
      button1: (1 << 4),
      button2: (1 << 5)
    })

    it('should work getting "up"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 0)
      assert.equal(true, keys.up)
      binding.keyReleased(keys.buffer, 1 << 0)
      assert.equal(false, keys.up)
    })

    it('should work setting "up"', function () {
      var keys = new Keys
      keys.up = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 0))
      keys.up = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 0))
    })

    it('should work getting "right"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 1)
      assert.equal(true, keys.right)
      binding.keyReleased(keys.buffer, 1 << 1)
      assert.equal(false, keys.right)
    })

    it('should work setting "right"', function () {
      var keys = new Keys
      keys.right = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 1))
      keys.right = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 1))
    })

    it('should work getting "down"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 2)
      assert.equal(true, keys.down)
      binding.keyReleased(keys.buffer, 1 << 2)
      assert.equal(false, keys.down)
    })

    it('should work setting "down"', function () {
      var keys = new Keys
      keys.down = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 2))
      keys.down = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 2))
    })

    it('should work getting "left"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 3)
      assert.equal(true, keys.left)
      binding.keyReleased(keys.buffer, 1 << 3)
      assert.equal(false, keys.left)
    })

    it('should work setting "left"', function () {
      var keys = new Keys
      keys.left = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 3))
      keys.left = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 3))
    })

    it('should work getting "button1"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 4)
      assert.equal(true, keys.button1)
      binding.keyReleased(keys.buffer, 1 << 4)
      assert.equal(false, keys.button1)
    })

    it('should work setting "button1"', function () {
      var keys = new Keys
      keys.button1 = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 4))
      keys.button1 = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 4))
    })

    it('should work getting "button2"', function () {
      var keys = new Keys
      binding.keyPressed(keys.buffer, 1 << 5)
      assert.equal(true, keys.button2)
      binding.keyReleased(keys.buffer, 1 << 5)
      assert.equal(false, keys.button2)
    })

    it('should work setting "button2"', function () {
      var keys = new Keys
      keys.button2 = true
      assert.equal(true, binding.isPressed(keys.buffer, 1 << 5))
      keys.button2 = false
      assert.equal(false, binding.isPressed(keys.buffer, 1 << 5))
    })

  })
})
