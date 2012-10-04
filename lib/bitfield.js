
/**
 * Module dependencies.
 */

var _ref = require('ref')
var assert = require('assert')
var debug = require('debug')('ref:bitfield')

/**
 * The Bitfield "type" constructor.
 */

module.exports = function Bitfield (_type, fields) {
  debug('defining new bitfield "type"')
  if (!fields) {
    fields = _type
    var type = fitTypeToFields(fields)
  } else {
    var type = _ref.coerceType(_type)
  }

  /**
   * This is the BitfieldType "constructor" that gets returned.
   */

  function BitfieldType (arg, data)) {
    if (!(this instanceof BitfieldType)) {
      return new BitfieldType(arg, data)
    }
    debug('creating new bitfield instance')

    if (arguments.length && Buffer.isBuffer(arg)) {
      // new BitfieldType(Buffer(8))
      data = arg
      arg = null
    }

    if (!data)
        // new BitfieldType()
      data = new Buffer(type.size)
    }

    if (data.length < type.size) {
      throw new Error('buffer length must be at least ' + type.size + ', got ' + data.length)
    } else if (data.length > type.size) {
      debug('resizing buffer from %d to %d', data.length, type.size)
      data = data.slice(0, type.size)
    }

    data.type = BitfieldType
    this.buffer = data

    if (isObject(arg)) {
      for (var k in BitfieldType.fields) {
        if (k in arg) {
          this[k] = arg[k]
        }
      }
    }

    BitfieldType._instanceCreated = true
  }

  BitfieldType.prototype = Object.create(Bitfield.prototype, {
    constructor: {
      configurable: true,
      writable: true,
      value: BitfieldType
    }
  })

  BitfieldType.prototype.buffer = _ref.NULL
  BitfieldType.prototype.ref = ref

  BitfieldType.fields = new Fields
  BitfieldType.type = type
  BitfieldType.size = type.size
  BitfieldType.alignment = type.alignment
  BitfieldType.indirection = type.indirection
  BitfieldType.get = get
  BitfieldType.set = set
  BitfieldType.getRef = getRef
  BitfieldType.setRef = setRef
  BitfieldType.defineProperty = defineProperty


  Object.keys(fields).forEach(function(name) {
    BitfieldType.defineProperty(name, fields[name])
  })

  return BitfieldType
}


function Fields (){}
Fields.prototype = Object.create(null)


function defineProperty (name, value) {
  debug('defining new BitfieldType field', name)


  assert(!this._instanceCreated, 'an instance of this Struct type has already '
      + 'been created, cannot add new "fields" anymore')
  assert.equal('string', typeof name, 'expected a "string" field name')
  assert(valueCanFit(value, this.type), 'value is ' + value
      + ' to fit in ' + this.type)
  assert(!(name in this.prototype), 'the field "' + name
      + '" already exists in this Struct type')

  // define the getter/setter property
  Object.defineProperty(this.prototype, name, {
    enumerable: true,
    configurable: true,
    get: get,
    set: set
  });

  // allocate a temporary buffer with the value to get the bit representation
  var temp = new Buffer(this.size),
      type = this.type

  type.set(temp, value)
  var bits = inspectBits(temp)

  this.fields[name] = {
    value: value,
    bits: bits
  }


  function get () {
    var enabled = (value & ref.get(this.buffer, 0, type)) > 0
    debug('getting "%s" bitfield field (bits: %s, enabled: %d)', name, bits, enabled)
    return enabled
  }

  function set (enabled) {
    var val = ref.get(this.buffer, 0, type)
    val = enabled ? val | value : val & ~value
    debug('setting "%s" bitfield field (bits: %s, enabled: %d)', name, bits, enabled)
    return ref.set(this.buffer, 0, val, type)
  }
}


/**
 * The "get" function of the Bitfield "type" interface.
 * Most likely invoked when accessing within a "ref-struct" type.
 */

function get (buffer, offset) {
  debug('Bitfield "type" getter for buffer at offset', offset)
  if (offset > 0) {
    buffer = buffer.slice(offset)
  }
  return new this(buffer)
}

/**
 * The "set" function of the Bitfield "type" interface.
 * Most likely invoked when setting within a "ref-struct" type.
 */

function set (buffer, offset, value) {
  debug('Bitfield "type" setter for buffer at offset', buffer, offset, value)
  var bitfield = this.get(buffer, offset)
  if (value instanceof this) {
    // copy the value directly
    value.buffer.copy(bitfield.buffer)
  } else if (isObject(value)) {
    Object.keys(this.fields).forEach(function (name) {
      // invoke the setters
      bitfield[name] = value[name]
    })
  } else if (typeof value === 'number') {
    // set value as number
    this.type.set(bitfield, 0, value)
  } else {
    throw new Error('not sure how to set into Bitfield: ' + value)
  }
}

/**
 * Reads a pointer from the given offset and returns a new "bitfield" instance of
 * this type.
 * Most likely invoked when getting an bitfield instance back as a return value from
 * an FFI'd function.
 */

function getRef (buffer, offset) {
  debug('Bitfield reference "type" getter for buffer at offset', offset)
  return new this(buffer.readPointer(offset))
}

/**
 * Most likely invoked when passing an bitfield instance as an argument to an FFI'd
 * function.
 */

function setRef (buffer, offset, value) {
  debug('Bitfield reference "type" setter for buffer at offset', offset)
  var ptr
  if (value instanceof this) {
    ptr = value.buffer
  } else {
    ptr = new this(value).buffer
  }
  _ref.writePointer(buffer, offset, ptr)
}

/**
 * Returns a reference to the backing buffer of this Bitfield instance.
 *
 */

function ref () {
  debug('ref()')
  var bitfieldType = this.constructor
  var size = this.buffer.length
  var r = _ref.ref(this.buffer)
  r.type = Object.create(_ref.refType(bitfieldType.type))
  r.type.get = function (buf, offset) {
    return new type(_ref.readPointer(buf, offset | 0, size))
  }
  r.type.set = function () {
    assert(0, 'implement!!!')
  }
  return r
}


// find the smallest type that can be used to fit the given fields

function fitTypeToFields (fields) {
  var max = Object.keys(fields).reduce(function(max, key){
    return Math.max(max, +fields[key])
  }, 0)
  switch (true) {
    case max < 0: return _ref.types.void
    case max < 0x100: return _ref.types.uint8
    case max < 0x10000: return _ref.types.uint16
    case max < 0x100000000: return _ref.types.uint32
    default: return _ref.types.uint64
  }
}


// determine if a value can fit in the given type

function valueCanFit (value, type) {
  switch (type) {
    case _ref.types.void: return false
    case _ref.types.uint8: return value < 0x100
    case _ref.types.uint16: return value < 0x10000
    case _ref.types.uint32: return value < 0x100000000
    case _ref.types.uint64: return true // TODO: how to check?
  }
}

function inspectBits (buffer) {
  var out = []
  for (var i=0; i < buffer.byteLength; i++) {
    var byte = []
    for (var j=0; j < 8; j++) {
      byte.push((buffer[i] & (1 << j)) > 0 ? '1' : '0')
    }
    out.push(byte.join(''))
  }
  return out.join(' ')
}

function isObject(o) {
  return typeof o === 'object' ? o !== null : typeof o === 'function'
}
